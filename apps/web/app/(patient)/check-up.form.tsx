"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateCheckUpDto,
  createCheckUpDtoSchema,
} from "@repo/api/links/dto/create-check-up.dto";
import { CreateFormDto } from "@repo/api/links/dto/create-form.dto";
import { useFieldArray, useForm } from "react-hook-form";

import { CheckUpTable } from "@/components/table-check-up/check-up.table";
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
import { createForm } from "@/server/form/create-form";
import { getUserForm } from "@/server/form/get-user-form";
import { EHRWithMappings, FormWithQuestions } from "@repo/types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Define the form data type

export const CheckUpForm = ({
  userId,
  ehr,
  handleSubmit,
}: {
  userId: string;
  ehr: EHRWithMappings;
  handleSubmit?: (values: CreateCheckUpDto) => Promise<void>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userForm, setUserForm] = useState<FormWithQuestions | null>(null);
  const [forceUpdate, setForceUpdate] = useState(0);
  const router = useRouter();

  // Fetch the user's form on component mount or when forceUpdate changes
  useEffect(() => {
    const fetchUserForm = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching user form for userId:", userId);
        const response = await getUserForm(userId);
        console.log("User form response:", response);

        if (response.statusCode === 200) {
          console.log("Setting userForm from API response:", response.data);
          setUserForm(response.data);
        } else {
          // If the user doesn't have a form, that's fine
          if (response.statusCode !== 404) {
            toast.error(response.message);
          }
        }
      } catch (error) {
        console.error("Error fetching user form:", error);
        toast.error("Failed to fetch user form");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserForm();
  }, [userId, forceUpdate]);

  const form = useForm<CreateCheckUpDto>({
    resolver: zodResolver(createCheckUpDtoSchema),
    defaultValues: {
      status: "pending",
      questions:
        ehr.mappings?.map((mapping) => ({
          mappingId: mapping.id,
          name: mapping.fieldName,
          dataType: mapping.dataType,
          value: "",
          options: mapping.options || undefined,
        })) ?? [],
    },
    mode: "onChange", // Validate on change for immediate feedback
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // Validate required fields and set errors
  const validateRequiredFields = (values: CreateCheckUpDto): boolean => {
    // Get required mapping IDs
    const requiredMappingIds =
      ehr.mappings
        ?.filter((mapping) => mapping.required)
        .map((mapping) => mapping.id) || [];

    let isValid = true;

    // Check each question and set errors directly on the form
    values.questions?.forEach((question, index) => {
      if (
        requiredMappingIds.includes(question.mappingId || "") &&
        !question.value
      ) {
        form.setError(`questions.${index}.value`, {
          type: "manual",
          message: "This field is required",
        });
        isValid = false;
      }
    });

    return isValid;
  };

  async function onSubmit(values: CreateCheckUpDto) {
    try {
      // Clear previous errors
      form.clearErrors();

      // Validate required fields
      const isValid = validateRequiredFields(values);
      if (!isValid) {
        return;
      }

      setIsSubmitting(true);
      setIsLoading(true); // Set loading state to true during submission

      // If custom handler is provided, use it
      if (handleSubmit) {
        await handleSubmit(values);
      } else {
        // Otherwise, create a form using the form creation service
        const formData: CreateFormDto = {
          name: `Check-up for ${userId}`,
          userId,
          ehrId: ehr.id,
          status: values.status,
          questions:
            values.questions?.map((question) => ({
              mappingId: question.mappingId || "",
              value: question.value,
            })) || [],
        };

        const response = await createForm(formData);

        console.log("Form creation response:", response);

        if (!response.success) {
          throw new Error(response.message);
        }

        // Show success message
        toast.success("Your check-up information has been saved.");

        // Instead of directly setting the userForm state, trigger a re-fetch
        console.log("Triggering re-fetch of user form data");
        setForceUpdate((prev) => prev + 1);
      }

      console.log({ userId, ehrId: ehr.id, questions: values.questions });
    } catch (error) {
      console.error("Error submitting form:", error);

      // Show error message
      toast.error(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-lg font-medium">Loading form data...</p>
      </div>
    );
  }

  // If the user already has a form, display it in a table
  if (userForm && userForm.questions && userForm.questions.length > 0) {
    console.log("Rendering CheckUpTable with userForm:", userForm);
    return <CheckUpTable userForm={userForm} ehr={ehr} />;
  }

  // Otherwise, display the form for the user to fill out
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => {
          const dataType =
            form.getValues(`questions.${index}.dataType`) || "string";
          const fieldName = form.getValues(`questions.${index}.name`) || "";
          const mappingId = form.getValues(
            `questions.${index}.mappingId`
          ) as string;
          const isRequired = ehr.mappings?.find(
            (m) => m.id === mappingId
          )?.required;

          return (
            <div key={field.id} className="p-4 border rounded-md">
              <FormField
                control={form.control}
                name={`questions.${index}.value`}
                render={({ field: valueField }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      {fieldName}{" "}
                      {isRequired && <span className="text-red-500">*</span>}
                    </FormLabel>
                    {renderFormControl(dataType, valueField, index)}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          );
        })}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
  );
};
