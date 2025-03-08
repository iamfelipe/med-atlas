import { FormQuestion } from './form-question.entity';
import { Form, FormStatus } from './form.entity';

describe('Form Entity', () => {
  it('should create a form instance', () => {
    const form = new Form();
    form.id = 'test-id';
    form.name = 'Test Form';
    form.status = FormStatus.pending;
    form.userId = 'user-id';
    form.ehrId = 'ehr-id';
    form.createdAt = new Date();
    form.updatedAt = new Date();
    form.questions = [];

    expect(form).toBeDefined();
    expect(form.id).toBe('test-id');
    expect(form.name).toBe('Test Form');
    expect(form.status).toBe(FormStatus.pending);
    expect(form.userId).toBe('user-id');
    expect(form.ehrId).toBe('ehr-id');
    expect(form.createdAt).toBeInstanceOf(Date);
    expect(form.updatedAt).toBeInstanceOf(Date);
    expect(form.questions).toEqual([]);
  });

  it('should create a form with questions', () => {
    const question = new FormQuestion();
    question.id = 'question-id';
    question.formId = 'form-id';
    question.mappingId = 'mapping-id';
    question.value = 'test value';
    question.createdAt = new Date();
    question.updatedAt = new Date();

    const form = new Form();
    form.id = 'form-id';
    form.name = 'Test Form';
    form.status = FormStatus.pending;
    form.userId = 'user-id';
    form.ehrId = 'ehr-id';
    form.createdAt = new Date();
    form.updatedAt = new Date();
    form.questions = [question];

    expect(form).toBeDefined();
    expect(form.questions).toHaveLength(1);
    expect(form.questions[0].id).toBe('question-id');
    expect(form.questions[0].formId).toBe('form-id');
    expect(form.questions[0].mappingId).toBe('mapping-id');
    expect(form.questions[0].value).toBe('test value');
  });

  it('should handle form status enum values', () => {
    expect(FormStatus.pending).toBe('pending');
    expect(FormStatus.completed).toBe('completed');

    const form = new Form();
    form.status = FormStatus.pending;
    expect(form.status).toBe('pending');

    form.status = FormStatus.completed;
    expect(form.status).toBe('completed');
  });
});
