export * from "./src/ehr";
export * from "./src/form";
export * from "./src/role";

export interface Response<T> {
  message: string;
  statusCode: number;
  data: T;
}
