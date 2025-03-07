"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateEhrDto,
  CreateEhrMappingDto,
  createEhrDtoSchema as formSchema,
} from "@repo/api/links/dto/create-ehr.dto";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2 } from "lucide-react";

export const defaultMapping: CreateEhrMappingDto = {
  entityType: "patient",
  fieldName: "",
  mappingPath: "",
  dataType: "string",
  required: true,
  apiEndpoint: "/",
  options: "",
};

export const EHRForm = ({
  ehr: defaultValues,
  handleSubmit,
  submitButtonText = "Create",
}: {
  ehr: CreateEhrDto;
  handleSubmit: (values: CreateEhrDto) => Promise<void>;
  submitButtonText?: string;
}) => {
  const form = useForm<CreateEhrDto>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "mappings",
  });

  async function onSubmit(values: CreateEhrDto) {
    await handleSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-end">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="EHR Name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex-1 max-w-sm">
              <FormField
                control={form.control}
                name="baseUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input placeholder="EHR Base URL" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="authType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Auth type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="OAuth2" disabled>
                        OAuth2
                      </SelectItem>
                      <SelectItem value="API_KEY">API_KEY</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="ml-auto">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : submitButtonText}
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-zinc-50 rounded-lg px-8 pt-4 pb-8">
            <div className="divide-y divide-zinc-200">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-1 gap-4 relative items-start py-6"
                >
                  <div className="flex-1 items-start gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                    <div className="">
                      <FormField
                        control={form.control}
                        name={`mappings.${index}.entityType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Entity Type</FormLabel>
                            <FormControl>
                              <Input placeholder="Patient" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name={`mappings.${index}.fieldName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Name</FormLabel>
                            <FormControl>
                              <Input placeholder="p_name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name={`mappings.${index}.dataType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="string">String</SelectItem>
                                <SelectItem value="number">Number</SelectItem>
                                <SelectItem value="date">Date</SelectItem>
                                <SelectItem value="boolean">Boolean</SelectItem>
                                <SelectItem value="dropdown">
                                  Dropdown
                                </SelectItem>
                                <SelectItem value="radio">Radio</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name={`mappings.${index}.apiEndpoint`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>API Endpoint</FormLabel>
                            <FormControl>
                              <Input placeholder="/api/patient" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name={`mappings.${index}.mappingPath`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mapping Path</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="$.patient.p_name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="">
                      <FormField
                        control={form.control}
                        name={`mappings.${index}.required`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel>Required</FormLabel>
                            <div className="flex flex-row rounded-lg border py-2 px-3 shadow-xs items-center justify-between bg-white">
                              <FormDescription>
                                The field is required
                              </FormDescription>

                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="">
                      <FormField
                        control={form.control}
                        name={`mappings.${index}.options`}
                        render={({ field }) => (
                          <FormItem className="flex flex-col gap-2">
                            <FormLabel>Options*</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Option 1, Option 2"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Separate options with a comma
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="">
                      {defaultValues?.mappings?.[index]?.id && (
                        <FormField
                          control={form.control}
                          name={`mappings.${index}.id`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID</FormLabel>
                              <FormControl>
                                <Input placeholder="id" disabled {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-5">
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      size="icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="secondary"
              onClick={() => append(defaultMapping)}
            >
              Add implementation
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
