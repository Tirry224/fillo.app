import { Container } from "@/app/components";
import { RegisterForm } from "@/myPages/secondary/sections/RegisterPageSections/RegisterForm";
import { RegisterIntro } from "@/myPages/secondary/sections/RegisterPageSections/RegisterIntro";
import { BrandHeader } from "@/app/components/ui/BrandHeader";

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
