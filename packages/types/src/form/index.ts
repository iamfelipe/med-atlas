import { Form, FormQuestion } from "@prisma/client";

export type FormWithQuestions = Form & {
  questions: FormQuestion[];
};
