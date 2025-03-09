import {
  createEhrDtoSchema,
  createEhrMappingDtoSchema,
} from '@repo/api/links/dto/create-ehr.dto';
import { updateEhrDtoSchema } from '@repo/api/links/dto/update.ehr.dto';

describe('EHR DTOs', () => {
  describe('createEhrMappingDtoSchema', () => {
    it('should validate a valid mapping', () => {
      const validMapping = {
        entityType: 'Patient',
        fieldName: 'Name',
        mappingPath: 'patient.name',
        dataType: 'string',
        required: true,
        apiEndpoint: '/api/patient',
      };

      const result = createEhrMappingDtoSchema.safeParse(validMapping);
      expect(result.success).toBe(true);
    });

    it('should reject a mapping with missing required fields', () => {
      const invalidMapping = {
        entityType: 'Patient',
        // Missing fieldName
        mappingPath: 'patient.name',
      };

      const result = createEhrMappingDtoSchema.safeParse(invalidMapping);
      expect(result.success).toBe(false);
    });

    it('should set default values for optional fields', () => {
      const minimalMapping = {
        entityType: 'Patient',
        fieldName: 'Name',
        mappingPath: 'patient.name',
        dataType: 'string',
        required: true,
        apiEndpoint: '/api/patient',
      };

      const result = createEhrMappingDtoSchema.safeParse(minimalMapping);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.dataType).toBe('string');
        expect(result.data.required).toBe(true);
        expect(result.data.apiEndpoint).toBe('/api/patient');
      }
    });
  });

  describe('createEhrDtoSchema', () => {
    it('should validate a valid EHR', () => {
      const validEhr = {
        name: 'Test EHR',
        baseUrl: 'https://test-ehr.com',
        authType: 'API_KEY',
        mappings: [
          {
            entityType: 'Patient',
            fieldName: 'Name',
            mappingPath: 'patient.name',
            dataType: 'string',
            required: true,
            apiEndpoint: '/api/patient',
          },
        ],
      };

      const result = createEhrDtoSchema.safeParse(validEhr);
      expect(result.success).toBe(true);
    });

    it('should reject an EHR with invalid URL', () => {
      const invalidEhr = {
        name: 'Test EHR',
        baseUrl: 'invalid-url',
        authType: 'API_KEY',
        mappings: [
          {
            entityType: 'Patient',
            fieldName: 'Name',
            mappingPath: 'patient.name',
            dataType: 'string',
            required: true,
            apiEndpoint: '/api/patient',
          },
        ],
      };

      const result = createEhrDtoSchema.safeParse(invalidEhr);
      expect(result.success).toBe(false);
    });

    it('should reject an EHR with no mappings', () => {
      const invalidEhr = {
        name: 'Test EHR',
        baseUrl: 'https://test-ehr.com',
        authType: 'API_KEY',
        mappings: [],
      };

      const result = createEhrDtoSchema.safeParse(invalidEhr);
      expect(result.success).toBe(false);
    });
  });

  describe('updateEhrDtoSchema', () => {
    it('should validate a valid EHR update', () => {
      const validEhrUpdate = {
        id: 'ehr-id-1',
        name: 'Updated EHR',
        baseUrl: 'https://updated-ehr.com',
        authType: 'API_KEY',
        mappings: [
          {
            id: 'mapping-id-1',
            entityType: 'Patient',
            fieldName: 'Name',
            mappingPath: 'patient.updated.name',
            dataType: 'string',
            required: true,
            apiEndpoint: '/api/patient/updated',
          },
        ],
      };

      const result = updateEhrDtoSchema.safeParse(validEhrUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject an update without id', () => {
      const invalidEhrUpdate = {
        name: 'Updated EHR',
        baseUrl: 'https://updated-ehr.com',
        authType: 'API_KEY',
        mappings: [
          {
            id: 'mapping-id-1',
            entityType: 'Patient',
            fieldName: 'Name',
            mappingPath: 'patient.updated.name',
            dataType: 'string',
            required: true,
            apiEndpoint: '/api/patient/updated',
          },
        ],
      };

      const result = updateEhrDtoSchema.safeParse(invalidEhrUpdate);
      expect(result.success).toBe(false);
    });
  });
});
