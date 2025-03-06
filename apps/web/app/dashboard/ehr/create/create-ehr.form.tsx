"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createEhrDtoSchema as formSchema } from "@repo/api/links/dto/create-ehr.dto";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

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
import { createEhr } from "@/server/ehr/create-ehr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateEhrForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "Athena",
      baseUrl: "https://api.athenahealth.com",
      authType: "API_KEY",
      mappings: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "mappings",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const response = await createEhr({
      authType: values.authType,
      baseUrl: values.baseUrl,
      name: values.name,
      mappings: values.mappings,
    });

    if (response.statusCode === 201) {
      toast.success(response.message);
      router.push("/dashboard/ehr");
    } else {
      toast.error(response.message);
      form.reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>name</FormLabel>
                  <FormControl>
                    <Input placeholder="EHR Name" {...field} />
                  </FormControl>
                  <FormDescription>This is the name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormDescription>
                    This is the authentication type.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                append({
                  entityType: "",
                  fieldName: "",
                  mappingPath: "",
                  dataType: "string",
                  required: true,
                  apiEndpoint: "",
                })
              }
            >
              Add implementation
            </Button>

            {fields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-4">
                {JSON.stringify(field)}

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`mappings.${index}.entityType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Entity Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Patient" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is the entity type.
                        </FormDescription>
                        <FormMessage
                          className={
                            form.formState.errors.mappings?.[index]?.entityType
                              ? "error"
                              : ""
                          }
                        />
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
                        <FormDescription>
                          This is the field name.
                        </FormDescription>
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
                        <FormDescription>
                          This is the data type.
                        </FormDescription>
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
                        <FormDescription>
                          This is the API endpoint.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`mappings.${index}.required`}
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                        <div className="space-y-0.5">
                          <FormLabel>Required</FormLabel>
                          <FormDescription>
                            This is whether the field is required.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
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
                        <FormDescription>
                          This is the mapping path.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="button" onClick={() => remove(index)}>
                  DELETE
                </Button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
};
