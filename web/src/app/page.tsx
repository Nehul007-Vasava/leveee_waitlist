import { Nav } from "@/components/landing/Nav";
import { Closing, Faq, Footer, Founder, Hero, Measure, Promises, Trust } from "@/components/landing/Sections";
import { Mirror } from "@/components/landing/Mirror";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Tools } from "@/components/landing/Tools";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="relative z-[2]">
        <Hero />
        <Promises />
        <Mirror />
        <HowItWorks />
        <Tools />
        <Measure />
        <Trust />
        <Founder />
        <Faq />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
