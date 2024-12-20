import FormTask from "@/components/form-task";
import { Suspense } from "react";

export default function Manage() {
  return (
    <div className="flex justify-center font-[family-name:var(--font-geist-sans)]">
      <Suspense>
        <FormTask />
      </Suspense>
    </div>
  );
}
