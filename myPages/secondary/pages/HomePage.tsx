import { HomeBenefits } from "@/myPages/secondary/sections/HomePageSections/HomeBenefits";
import { HomeFooter } from "@/myPages/secondary/sections/HomePageSections/HomeFooter";
import { HomeIntro } from "@/myPages/secondary/sections/HomePageSections/HomeIntro";
import { HomeProductImages } from "@/myPages/secondary/sections/HomePageSections/HomeProductImages";
import { BrandHeader } from "@/app/components/ui/BrandHeader";
import { Container } from "@/app/components/ui/Container";

export function HomePage() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center py-4">
        <HomeIntro />
        <HomeProductImages />
        <HomeBenefits />
      </div>
      <HomeFooter />
    </Container>
  );
}
