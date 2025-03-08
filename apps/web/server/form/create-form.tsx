import { CreateFormDto } from "@repo/api/links/dto/create-form.dto";

/**
 * Creates a new form by sending a request to the backend API
 * @param form The form data to create
 * @returns The response from the API
 */
export const createForm = async (form: CreateFormDto) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/forms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        statusCode: response.status,
        message: errorData.message || "Failed to create form",
      };
    }

    const data = await response.json();
    return {
      success: true,
      statusCode: 201,
      message: "Form created successfully",
      data,
    };
  } catch (error) {
    console.error("Error creating form:", error);
    return {
      success: false,
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};
