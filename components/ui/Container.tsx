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
      className={`mx-auto flex min-h-screen w-full max-w-[440px] flex-col bg-surface px-4 py-6 sm:min-h-[calc(100vh-5rem)] ${uiStyles.cardRadiusResponsive} sm:px-6 sm:py-8 sm:shadow-[0_8px_30px_rgb(39_52_82_/_8%)] ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  );
}
