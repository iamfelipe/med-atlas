import { getEhrList } from "@/server/ehrs";

export default async function Ehr() {
  const ehrList = await getEhrList();

  return (
    <>
      <h1>Ehr</h1>
      <p>{JSON.stringify(ehrList, null, 2)}</p>
    </>
  );
}
