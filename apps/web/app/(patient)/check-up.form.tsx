"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCheckUpDto,
  createCheckUpDtoSchema,
} from "@repo/api/links/dto/create-check-up.dto";
import { useFieldArray, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { EHRWithMappings } from "@repo/types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

export const CheckUpForm = ({
  userId,
  ehr,
  handleSubmit,
}: {
  userId: string;
  ehr: EHRWithMappings;
  handleSubmit?: (values: CreateCheckUpDto) => Promise<void>;
}) => {
  const form = useForm<CreateCheckUpDto>({
    resolver: zodResolver(createCheckUpDtoSchema),
    defaultValues: {
      questions:
        ehr.mappings?.map((mapping) => ({
          mappingId: mapping.id,
          name: mapping.fieldName,
          dataType: mapping.dataType,
          value: "",
        })) ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  async function onSubmit(values: CreateCheckUpDto) {
    if (handleSubmit) {
      await handleSubmit(values);
    }
    console.log({ userId, ehrId: ehr.id, questions: values.questions });
  }

  // Function to render the appropriate input based on dataType
  const renderFormControl = (dataType: string, field: any, index: number) => {
    switch (dataType) {
      case "boolean":
        return (
          <FormControl>
            <Checkbox
              checked={field.value === "true"}
              onCheckedChange={(checked) => {
                form.setValue(
                  `questions.${index}.value`,
                  checked ? "true" : "false"
                );
              }}
            />
          </FormControl>
        );
      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  form.setValue(
                    `questions.${index}.value`,
                    date ? date.toISOString() : ""
                  );
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      case "radio":
        // Get the mapping ID to find the correct mapping
        const radioMappingId = form.getValues(
          `questions.${index}.mappingId`
        ) as string;

        // Find the mapping using the mappingId
        const radioMapping = ehr?.mappings?.find(
          (m) => m.id === radioMappingId
        );
        let radioOptions: string[] = [];

        if (radioMapping?.options) {
          radioOptions = radioMapping.options
            .split(",")
            .map((opt: string) => opt.trim());
        }

        return (
          <FormControl>
            <RadioGroup
              value={field.value}
              onValueChange={(value) => {
                form.setValue(`questions.${index}.value`, value);
              }}
              className="flex flex-col space-y-1"
            >
              {radioOptions.length > 0 ? (
                radioOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={option}
                      id={`${field.id}-${option}`}
                    />
                    <label
                      htmlFor={`${field.id}-${option}`}
                      className="text-sm font-medium leading-none"
                    >
                      {option}
                    </label>
                  </div>
                ))
              ) : (
                <div className="text-sm text-red-500">
                  No options available for this field
                </div>
              )}
            </RadioGroup>
          </FormControl>
        );
      case "dropdown":
        // Get the mapping ID to find the correct mapping
        const dropdownMappingId = form.getValues(
          `questions.${index}.mappingId`
        ) as string;

        // Find the mapping using the mappingId
        const dropdownMapping = ehr?.mappings?.find(
          (m) => m.id === dropdownMappingId
        );
        let dropdownOptions: string[] = [];

        if (dropdownMapping?.options) {
          dropdownOptions = dropdownMapping.options
            .split(",")
            .map((opt: string) => opt.trim());
        }

        return (
          <FormControl>
            <Select
              value={field.value}
              onValueChange={(value) => {
                form.setValue(`questions.${index}.value`, value);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {dropdownOptions.length > 0 ? (
                  dropdownOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-options" disabled>
                    No options available for this field
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormControl>
        );
      case "number":
        return (
          <FormControl>
            <Input
              type="number"
              placeholder="Enter a number"
              {...field}
              onChange={(e) => {
                form.setValue(`questions.${index}.value`, e.target.value);
              }}
            />
          </FormControl>
        );
      case "multiple":
        // Get the mapping ID to find the correct mapping
        const multipleMappingId = form.getValues(
          `questions.${index}.mappingId`
        ) as string;

        // Find the mapping using the mappingId
        const multipleMapping = ehr?.mappings?.find(
          (m) => m.id === multipleMappingId
        );
        let checkboxOptions: string[] = [];

        if (multipleMapping?.mappingPath) {
          checkboxOptions = multipleMapping.mappingPath
            .split(",")
            .map((opt: string) => opt.trim());
        }

        const selectedValues = field.value ? field.value.split(",") : [];

        return (
          <FormControl>
            <div className="flex flex-col space-y-2">
              {checkboxOptions.length > 0 ? (
                checkboxOptions.map((option) => {
                  return (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${field.id}-${option}`}
                        checked={selectedValues.includes(option)}
                        onCheckedChange={(checked) => {
                          const newValues = checked
                            ? [...selectedValues, option]
                            : selectedValues.filter(
                                (val: string) => val !== option
                              );

                          form.setValue(
                            `questions.${index}.value`,
                            newValues.join(",")
                          );
                        }}
                      />
                      <label
                        htmlFor={`${field.id}-${option}`}
                        className="text-sm font-medium leading-none"
                      >
                        {option}
                      </label>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-red-500">
                  No options available for this field
                </div>
              )}
            </div>
          </FormControl>
        );
      case "string":
      default:
        return (
          <FormControl>
            <Input placeholder="Enter text" {...field} />
          </FormControl>
        );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => {
          const dataType =
            form.getValues(`questions.${index}.dataType`) || "string";
          const fieldName = form.getValues(`questions.${index}.name`) || "";
          return (
            <div key={field.id} className="p-4 border rounded-md">
              <FormField
                control={form.control}
                name={`questions.${index}.value`}
                render={({ field: valueField }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {fieldName}
                    </FormLabel>
                    {renderFormControl(dataType, valueField, index)}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
};
