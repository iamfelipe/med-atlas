import { FormQuestion } from './form-question.entity';

describe('FormQuestion Entity', () => {
  it('should create a form question instance', () => {
    const question = new FormQuestion();
    question.id = 'test-id';
    question.formId = 'form-id';
    question.mappingId = 'mapping-id';
    question.value = 'test value';
    question.createdAt = new Date();
    question.updatedAt = new Date();

    expect(question).toBeDefined();
    expect(question.id).toBe('test-id');
    expect(question.formId).toBe('form-id');
    expect(question.mappingId).toBe('mapping-id');
    expect(question.value).toBe('test value');
    expect(question.createdAt).toBeInstanceOf(Date);
    expect(question.updatedAt).toBeInstanceOf(Date);
  });

  it('should handle optional value property', () => {
    const question = new FormQuestion();
    question.id = 'test-id';
    question.formId = 'form-id';
    question.mappingId = 'mapping-id';

    expect(question).toBeDefined();
    expect(question.value).toBeUndefined();

    question.value = '';
    expect(question.value).toBe('');

    question.value = undefined;
    expect(question.value).toBeUndefined();

    question.value = 'updated value';
    expect(question.value).toBe('updated value');
  });
});
