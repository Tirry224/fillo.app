import { Suspense } from "react";
import { BrandHeader, Container } from "@/app/components";
import { LoginForm } from "@/myPages/secondary/sections/LoginPageSections/LoginForm";
import { LoginIntro } from "@/myPages/secondary/sections/LoginPageSections/LoginIntro";

export function LoginPage() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center gap-6 py-4">
        <LoginIntro />
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </Container>
  );
}
