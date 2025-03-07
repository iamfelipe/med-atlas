import { UpdateEhrDto } from "@repo/api/links/dto/update.ehr.dto";

export const updateEhr = async (id: string, ehr: UpdateEhrDto) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER}/ehr/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ehr),
    }
  );
  const data = await response.json();
  return data;
};
