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

const defaultMapping: CreateEhrMappingDto = {
  entityType: "",
  fieldName: "",
  mappingPath: "",
  dataType: "string",
  required: true,
  apiEndpoint: "",
};

export const EHRForm = ({
  ehr: defaultValues,
  handleSubmit,
}: {
  ehr: CreateEhrDto;
  handleSubmit: (values: CreateEhrDto) => Promise<void>;
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
        <div className="flex flex-col gap-8">
          <div className="flex gap-4 items-start">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="EHR Name" {...field} />
                  </FormControl>
                  <FormDescription>This is the name.</FormDescription>
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
                    <FormDescription>This is the base URL.</FormDescription>
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
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={() => append(defaultMapping)}
          >
            Add implementation
          </Button>
          <div className="flex flex-col gap-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex flex-1 gap-4 bg-zinc-50 pt-12 p-8 rounded-lg relative items-start"
              >
                <div className="absolute top-0 right-0 p-4">
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex-1 items-start gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                  <FormField
                    control={form.control}
                    name={`mappings.${index}.mappingPath`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mapping Path</FormLabel>
                        <FormControl>
                          <Input placeholder="$.patient.p_name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`mappings.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col gap-2">
                        <FormLabel>Required</FormLabel>
                        <div className="flex flex-row rounded-lg border py-2 px-3 shadow-xs items-center justify-between bg-white">
                          <FormDescription>
                            This is whether the field is required.
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
              </div>
            ))}
          </div>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating..." : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
