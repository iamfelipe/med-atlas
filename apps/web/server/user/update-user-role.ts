import { User } from "@prisma/client";
import { Response } from "@repo/types";

export const updateUserRole = async (
  id: string,
  roleId: string,
  currentRoleId: string
): Promise<Response<User>> => {
  // Instead of directly calling Kinde API, we'll use our backend API
  // which will handle the Kinde API call server-side
  const updatedRoleInDb = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/user/${id}/role`,
    {
      method: "POST",
      body: JSON.stringify({ roleId, currentRoleId }),
      headers: {
        Authorization: `Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6ImVjOmNiOmVkOjMzOjY3OjgyOjcwOjRkOjMyOmE1OjQzOjE5OmYxOjQ3OjgyOjEyIiwidHlwIjoiSldUIn0.eyJhdWQiOlsiaHR0cHM6Ly9tZWRhdGxhcy5raW5kZS5jb20vYXBpIl0sImF6cCI6IjgyZjc5YjgwNDdkYzQ3NDk5YzBhYzI3NDI1YjUwZDE5IiwiZXhwIjoxNzQxNjIxNDc1LCJndHkiOlsiY2xpZW50X2NyZWRlbnRpYWxzIl0sImlhdCI6MTc0MTUzNTA3NSwiaXNzIjoiaHR0cHM6Ly9tZWRhdGxhcy5raW5kZS5jb20iLCJqdGkiOiIxZjkwODIyNS1iNjQyLTQzOGItYTZhYy04NzcyOGU3NmQ1NTQiLCJzY29wZSI6ImNyZWF0ZTpvcmdhbml6YXRpb25fdXNlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX3VzZXJfcm9sZXMgcmVhZDpvcmdhbml6YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX3VzZXJfcm9sZXMgcmVhZDpyb2xlX3Blcm1pc3Npb25zIHJlYWQ6cm9sZXMiLCJzY3AiOltdLCJ2IjoiMiJ9.S9B9MwOlid48vchGpP7hA8ECvGLq4aeDDoi0YpTZ_XWCUS1DGI7ANgprElbHFhvwcXmTfhxF7RGF9cGsyWERNZCXE8QC3t8Q34s8sPz2mFi3vmKVarrGPr4m0iIcRnCHdFkDimw9z_oEto72j6YCOUidFTdc56ocimfkFOJZeyemRAHw8q8kRLtPk55aTmqqJwFra1xNxmappVAZk2YdjicCKKbLw6c4jzCNliv0afc91Wlx4jVes-6qlvcdFTq0Gs9pu087naMIqldKyCZUgDvsI3T5xTRRy5NPmD6GHRRRK3PEuHRvYBiJUq19Fv4PBFcOvzhqIvaO3jTaoS3Oyw`,
        "Content-Type": "application/json",
      },
    }
  );

  const updatedRoleInDbData = await updatedRoleInDb.json();

  return updatedRoleInDbData;
};
