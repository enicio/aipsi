import mongoose from 'mongoose';

export interface IReading {
  deviceId: string;
  enterpriseId: string;
  timestamp: Date;
  readings: {
    [key: string]: number;
  };
  metadata?: Record<string, any>;
}

const readingSchema = new mongoose.Schema<IReading>(
  {
    deviceId: {
      type: String,
      required: true,
      index: true,
    },
    enterpriseId: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    readings: {
      type: Map,
      of: Number,
      required: true,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for efficient querying
readingSchema.index({ deviceId: 1, timestamp: -1 });
readingSchema.index({ enterpriseId: 1, timestamp: -1 });

export const Reading = mongoose.model<IReading>('Reading', readingSchema);
