import { UpdateEhrDtoWithMappings } from "@repo/api/links/dto/update.ehr.dto";

export const updateEhr = async (id: string, ehr: UpdateEhrDtoWithMappings) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/ehr/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ehr),
    }
  );
  const data = await response.json();
  return data;
};
