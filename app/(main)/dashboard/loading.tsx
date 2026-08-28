import { Container, Skeleton } from "@/app/components";

export default function DashboardLoading() {
  return (
    <Container>
      <div className="-mx-4 -mt-6 grid gap-5 rounded-b-[var(--radius-card)] bg-navy px-4 pb-5 pt-6 sm:-mx-6 sm:-mt-8 sm:px-6">
        <div className="flex items-start justify-between">
          <div className="grid gap-2">
            <Skeleton className="h-5 w-32 bg-white/15" />
            <Skeleton className="h-3 w-24 bg-white/10" />
          </div>
          <Skeleton className="size-9 shrink-0 bg-white/10" />
        </div>
        <Skeleton className="h-20 w-full bg-white/10" />
      </div>
      <div className="grid flex-1 content-start gap-8 py-8">
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <div className="grid gap-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    </Container>
  );
}
