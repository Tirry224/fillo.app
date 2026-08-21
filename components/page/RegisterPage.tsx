import { Container } from "@/components";
import { RegisterForm } from "@/components/pagesSections/RegisterPageSections/RegisterForm";
import { RegisterIntro } from "@/components/pagesSections/RegisterPageSections/RegisterIntro";
import { BrandHeader } from "@/components/ui/BrandHeader";

export function RegisterPage() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center gap-10 py-12">
        <RegisterIntro />
        <RegisterForm />
      </div>
    </Container>
  );
}
