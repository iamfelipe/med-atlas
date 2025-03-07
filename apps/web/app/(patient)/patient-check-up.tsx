"use client";

import { getEhr } from "@/server/ehr/get-ehr";
import { EHRWithMappings } from "@repo/types";
import { useEffect, useState } from "react";
import { CheckUpForm } from "./check-up.form";

export const PatientCheckUp = ({
  userId,
  ehrId,
}: {
  userId: string;
  ehrId: string;
}) => {
  const [ehr, setEhr] = useState<EHRWithMappings | null>(null);

  useEffect(() => {
    const fetchEhr = async () => {
      const { data: ehr } = await getEhr(ehrId);
      setEhr(ehr);
    };
    fetchEhr();
  }, [ehrId]);

  if (!ehr) {
    return <div>Loading...</div>;
  }

  console.log(ehr.mappings);

  return (
    <div>
      <h1>CheckUp</h1>
      <CheckUpForm
        handleSubmit={async (values) => {
          console.log(values);
        }}
        userId={userId}
        ehr={ehr}
      />
    </div>
  );
};
