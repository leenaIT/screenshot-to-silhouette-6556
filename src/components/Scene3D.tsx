import { ClientOnly } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import type { EnvelopeProps } from "./Envelope3D";

const Envelope3D = lazy(() => import("./Envelope3D"));

export function Scene3D(props: EnvelopeProps & { className?: string }) {
  const fallback = <div className="blueprint flex h-full w-full items-center justify-center text-sm text-muted-foreground">جارٍ تحميل النموذج ثلاثي الأبعاد…</div>;
  return (
    <div className={props.className ?? "h-full w-full"}>
      <ClientOnly fallback={fallback}>
        <Suspense fallback={fallback}>
          <Envelope3D {...props} />
        </Suspense>
      </ClientOnly>
    </div>
  );
}
