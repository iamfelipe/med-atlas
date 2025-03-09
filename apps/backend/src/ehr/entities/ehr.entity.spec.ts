import { EHRDataType } from '@prisma/client';
import { EHRWithMappings } from './ehr.entity';

describe('EHR Entity', () => {
  it('should define EHRWithMappings type', () => {
    const mockEHR = {
      id: 'ehr-id-1',
      name: 'Test EHR',
      baseUrl: 'https://test-ehr.com',
      authType: 'API_KEY',
    };

    const mockMapping = {
      id: 'mapping-id-1',
      ehrId: 'ehr-id-1',
      entityType: 'Patient',
      fieldName: 'Name',
      mappingPath: 'patient.name',
      dataType: EHRDataType.string,
      required: true,
      apiEndpoint: '/api/patient',
      options: null,
    };

    const ehrWithMappings: EHRWithMappings = {
      ...mockEHR,
      mappings: [mockMapping],
    };

    expect(ehrWithMappings).toBeDefined();
    expect(ehrWithMappings.id).toEqual('ehr-id-1');
    expect(ehrWithMappings.name).toEqual('Test EHR');
    expect(ehrWithMappings.mappings).toHaveLength(1);
    expect(ehrWithMappings.mappings?.[0].fieldName).toEqual('Name');
  });

  it('should allow EHRWithMappings with undefined mappings', () => {
    const mockEHR = {
      id: 'ehr-id-1',
      name: 'Test EHR',
      baseUrl: 'https://test-ehr.com',
      authType: 'API_KEY',
    };

    const ehrWithMappings: EHRWithMappings = {
      ...mockEHR,
      mappings: undefined,
    };

    expect(ehrWithMappings).toBeDefined();
    expect(ehrWithMappings.id).toEqual('ehr-id-1');
    expect(ehrWithMappings.name).toEqual('Test EHR');
    expect(ehrWithMappings.mappings).toBeUndefined();
  });
});
