import { getEhrList } from "@/server/ehrs";

export default async function Patient() {
  const ehrList = await getEhrList();

  return (
    <>
      <h1>Patient list</h1>
      <p>{JSON.stringify(ehrList, null, 2)}</p>
    </>
  );
}
