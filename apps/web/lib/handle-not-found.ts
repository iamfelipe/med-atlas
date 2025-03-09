import { notFound } from "next/navigation";

export const handleNotFound = (response: { statusCode: number; data: any }) => {
  if (response.statusCode !== 200 || !response.data) {
    notFound();
  }
};
