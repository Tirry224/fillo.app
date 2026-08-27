import { Container, Skeleton } from "@/app/components";

export default function ClientsLoading() {
  return (
    <Container className="gap-8 pb-[calc(var(--nav-height)+env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="size-9" />
      </div>
      <div className="grid gap-4">
        <Skeleton className="h-11 w-full" />
        <div className="grid gap-2">
          {Array.from({ length: 5 }, (_, index) => (
            <Skeleton className="h-16 w-full" key={index} />
          ))}
        </div>
      </div>
    </Container>
  );
}
