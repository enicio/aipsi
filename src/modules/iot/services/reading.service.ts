import { Reading, type IReading } from '../models/reading.model';

export class ReadingService {
  async createReading(data: Partial<IReading>): Promise<IReading> {
    const reading = new Reading(data);
    return reading.save();
  }

  async getReadings(query: {
    deviceId?: string;
    enterpriseId?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
  }): Promise<IReading[]> {
    const filter: any = {};

    if (query.deviceId) filter.deviceId = query.deviceId;
    if (query.enterpriseId) filter.enterpriseId = query.enterpriseId;
    if (query.startDate || query.endDate) {
      filter.timestamp = {};
      if (query.startDate) filter.timestamp.$gte = query.startDate;
      if (query.endDate) filter.timestamp.$lte = query.endDate;
    }

    return Reading.find(filter)
      .sort({ timestamp: -1 })
      .skip(query.offset || 0)
      .limit(query.limit || 100);
  }

  async getAggregatedReadings(query: {
    deviceId: string;
    startDate: Date;
    endDate: Date;
    interval: 'hour' | 'day' | 'week';
  }) {
    const aggregation = [
      {
        $match: {
          deviceId: query.deviceId,
          timestamp: {
            $gte: query.startDate,
            $lte: query.endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            deviceId: '$deviceId',
            interval: {
              $switch: {
                branches: [
                  {
                    case: { $eq: [query.interval, 'hour'] },
                    then: {
                      $dateToString: {
                        format: '%Y-%m-%d-%H',
                        date: '$timestamp',
                      },
                    },
                  },
                  {
                    case: { $eq: [query.interval, 'day'] },
                    then: {
                      $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
                    },
                  },
                  {
                    case: { $eq: [query.interval, 'week'] },
                    then: {
                      $dateToString: { format: '%Y-%U', date: '$timestamp' },
                    },
                  },
                ],
              },
            },
          },
          readings: { $push: '$readings' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.interval': 1 } },
    ];

    return Reading.aggregate(aggregation);
  }
}
