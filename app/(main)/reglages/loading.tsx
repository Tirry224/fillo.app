import { Container, Skeleton } from "@/app/components";
import { uiStyles } from "@/app/components/ui/Typography";

export default function ReglagesLoading() {
  return (
    <Container
      className={`${uiStyles.sectionGap} pb-[calc(var(--nav-height)+env(safe-area-inset-bottom))]`}
    >
      <Skeleton className="ml-1 mt-1 h-7 w-28" />
      <div className="space-y-8">
        <Skeleton className="h-52 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    </Container>
  );
}
