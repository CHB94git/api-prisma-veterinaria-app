import { Veterinary } from '@prisma/client';

export {};


declare global {
  namespace Express {
    export interface Request {
      veterinary: Partial<Veterinary> | null
    }
  }
}
