import { HomeBenefits } from "@/components/pagesSections/HomePageSections/HomeBenefits";
import { HomeFooter } from "@/components/pagesSections/HomePageSections/HomeFooter";
import { HomeIntro } from "@/components/pagesSections/HomePageSections/HomeIntro";
import { HomeProductImages } from "@/components/pagesSections/HomePageSections/HomeProductImages";
import { BrandHeader } from "@/components/ui/BrandHeader";
import { Container } from "@/components/ui/Container";

export function HomePage() {
  return (
    <Container>
      <BrandHeader />
      <div className="flex flex-1 flex-col justify-center py-12">
        <HomeIntro />
        <HomeProductImages />
        <HomeBenefits />
      </div>
      <HomeFooter />
    </Container>
  );
}
