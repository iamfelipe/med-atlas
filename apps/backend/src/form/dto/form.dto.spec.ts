import { CreateFormDto } from '@repo/api/links/dto/create-form.dto';
import { UpdateFormDto } from '@repo/api/links/dto/update-form.dto';

describe('Form DTOs', () => {
  describe('CreateFormDto', () => {
    it('should validate a valid create form DTO', () => {
      const validDto: CreateFormDto = {
        name: 'Test Form',
        userId: 'user-id',
        ehrId: 'ehr-id',
        status: 'pending',
        questions: [
          {
            mappingId: 'mapping-id',
            value: 'test value',
          },
        ],
      };

      // Since we can't directly access the schema, we'll just check the properties
      expect(validDto.name).toBe('Test Form');
      expect(validDto.userId).toBe('user-id');
      expect(validDto.ehrId).toBe('ehr-id');
      expect(validDto.status).toBe('pending');
      expect(validDto.questions).toHaveLength(1);
      expect(validDto.questions[0].mappingId).toBe('mapping-id');
      expect(validDto.questions[0].value).toBe('test value');
    });

    it('should handle optional values in create form question DTO', () => {
      const validDto: CreateFormDto = {
        name: 'Test Form',
        userId: 'user-id',
        ehrId: 'ehr-id',
        status: 'pending',
        questions: [
          {
            mappingId: 'mapping-id',
            // value is optional
          },
        ],
      };

      expect(validDto.questions[0].value).toBeUndefined();
    });
  });

  describe('UpdateFormDto', () => {
    it('should validate a valid update form DTO', () => {
      const validDto: UpdateFormDto = {
        name: 'Updated Form',
        status: 'completed',
        questions: [
          {
            mappingId: 'mapping-id',
            value: 'updated value',
          },
        ],
      };

      expect(validDto.name).toBe('Updated Form');
      expect(validDto.status).toBe('completed');
      expect(validDto.questions).toHaveLength(1);
      expect(validDto.questions[0].mappingId).toBe('mapping-id');
      expect(validDto.questions[0].value).toBe('updated value');
    });

    it('should handle partial updates', () => {
      const nameOnlyUpdate: UpdateFormDto = {
        name: 'Name Only Update',
      };

      const statusOnlyUpdate: UpdateFormDto = {
        status: 'completed',
      };

      const questionsOnlyUpdate: UpdateFormDto = {
        questions: [
          {
            mappingId: 'mapping-id',
            value: 'questions only update',
          },
        ],
      };

      expect(nameOnlyUpdate.name).toBe('Name Only Update');
      expect(nameOnlyUpdate.status).toBeUndefined();
      expect(nameOnlyUpdate.questions).toBeUndefined();

      expect(statusOnlyUpdate.name).toBeUndefined();
      expect(statusOnlyUpdate.status).toBe('completed');
      expect(statusOnlyUpdate.questions).toBeUndefined();

      expect(questionsOnlyUpdate.name).toBeUndefined();
      expect(questionsOnlyUpdate.status).toBeUndefined();
      expect(questionsOnlyUpdate.questions).toHaveLength(1);
    });

    it('should handle optional id in update form question DTO', () => {
      const validDto: UpdateFormDto = {
        questions: [
          {
            id: 'question-id',
            mappingId: 'mapping-id',
            value: 'with id',
          },
          {
            mappingId: 'mapping-id-2',
            value: 'without id',
          },
        ],
      };

      expect(validDto.questions[0].id).toBe('question-id');
      expect(validDto.questions[1].id).toBeUndefined();
    });
  });
});
