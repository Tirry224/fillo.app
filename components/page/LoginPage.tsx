import { BrandHeader, Container } from "@/components";
import { LoginForm } from "@/components/pagesSections/LoginPageSections/LoginForm";
import { LoginIntro } from "@/components/pagesSections/LoginPageSections/LoginIntro";

export function LoginPage() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center gap-10 py-12">
        <LoginIntro />
        <LoginForm />
      </div>
    </Container>
  );
}
