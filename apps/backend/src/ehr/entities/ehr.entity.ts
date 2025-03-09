import { EHR, EHRMapping } from '@prisma/client';

export interface EHRWithMappings extends EHR {
  mappings: EHRMapping[];
  _count?: {
    users: number;
    forms: number;
  };
}

export * from '@repo/types/src/ehr';
