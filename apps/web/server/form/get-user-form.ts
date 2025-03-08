/**
 * Fetches a form for a specific user
 * @param userId The ID of the user
 * @returns The response from the API
 */
export const getUserForm = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER}/forms/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // If the response is 404, it means the user doesn't have a form
    if (response.status === 404) {
      return {
        success: false,
        statusCode: 404,
        message: "User doesn't have a form",
        data: null,
      };
    }

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        statusCode: response.status,
        message: errorData.message || "Failed to fetch form",
        data: null,
      };
    }

    const data = await response.json();
    return {
      success: true,
      statusCode: 200,
      message: "Form fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching form:", error);
    return {
      success: false,
      statusCode: 500,
      message:
        error instanceof Error ? error.message : "An unknown error occurred",
      data: null,
    };
  }
};
