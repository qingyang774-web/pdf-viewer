import { Suspense } from "react";
import ViewerClient from "@/components/ViewerClient";
import Loading from "@/components/Loading";

export default function ViewerPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ViewerClient />
    </Suspense>
  );
}
