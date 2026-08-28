import type { HTMLAttributes, ReactNode } from "react";

export type ContainerProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Container({
  children,
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={`mx-auto mb-[50px] min-h-dvh flex w-full max-w-[880px] flex-col bg-surface px-4 py-6 pb-[80px] md:max-w-none md:px-6 md:py-8 md:shadow-none lg:max-w-[880px] lg:px-6 lg:py-8 lg:shadow-[0_8px_30px_rgb(39_52_82_/_8%)] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
