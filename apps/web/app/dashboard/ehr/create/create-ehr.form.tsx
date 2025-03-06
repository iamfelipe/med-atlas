"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createEhrDtoSchema as formSchema } from "@repo/api/links/dto/create-ehr.dto";
import { useForm } from "react-hook-form";
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
import { createEhr } from "@/server/ehr/create-ehr";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const CreateEhrForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "all",
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      baseUrl: "",
      authType: "API_KEY",
      mappings: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>name</FormLabel>
              <FormControl>
                <Input placeholder="EHR Name" {...field} />
              </FormControl>
              <FormDescription>This is the name of the EHR.</FormDescription>
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
              <FormDescription>
                This is the base URL of the EHR.
              </FormDescription>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="OAuth2">OAuth2</SelectItem>
                  <SelectItem value="API_KEY">API_KEY</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                This is the authentication type of the EHR.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating..." : "Create"}
        </Button>
      </form>
    </Form>
  );
};
