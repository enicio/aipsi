import { Type } from '@sinclair/typebox';

export const CreateReadingSchema = {
  body: Type.Object({
    deviceId: Type.String(),
    enterpriseId: Type.String(),
    readings: Type.Record(Type.String(), Type.Number()),
    metadata: Type.Optional(Type.Record(Type.String(), Type.Any())),
  }),
};

export const GetReadingsQuerySchema = {
  querystring: Type.Object({
    deviceId: Type.Optional(Type.String()),
    enterpriseId: Type.Optional(Type.String()),
    startDate: Type.Optional(Type.String({ format: 'date-time' })),
    endDate: Type.Optional(Type.String({ format: 'date-time' })),
    limit: Type.Optional(Type.Number({ default: 100 })),
    offset: Type.Optional(Type.Number({ default: 0 })),
  }),
};
