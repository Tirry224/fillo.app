import type { HTMLAttributes, ReactNode } from "react";
import { uiStyles } from "./Typography";

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
      className={`mx-auto flex min-h-screen w-full max-w-[880px] flex-col bg-surface px-4 py-6 sm:min-h-[calc(100vh-5rem)] md:max-w-none md:px-6 md:py-8 md:shadow-none lg:max-w-[880px] lg:px-6 lg:py-8 lg:shadow-[0_8px_30px_rgb(39_52_82_/_8%)] ${uiStyles.cardRadiusResponsive} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
