import { Container, Skeleton } from "@/app/components";

export default function VentesLoading() {
  return (
    <Container className="gap-8 pb-[calc(var(--nav-height)+env(safe-area-inset-bottom))]">
      <div className="ml-1 grid gap-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>
      <Skeleton className="h-56 w-full" />
    </Container>
  );
}
