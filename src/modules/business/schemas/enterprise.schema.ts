import { Type } from '@sinclair/typebox';

export const EnterpriseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    name: { type: 'string' },
    address: { type: 'string' },
    phone: { type: 'string' },
  },
};

export const CreateEnterpriseSchema = {
  body: Type.Object({
    name: Type.String(),
    address: Type.String(),
    phone: Type.Optional(Type.String()),
  }),
};
