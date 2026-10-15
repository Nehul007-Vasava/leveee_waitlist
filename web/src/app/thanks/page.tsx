import type { Metadata } from "next";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/Sections";
import { ThanksView } from "@/components/thanks/ThanksView";

export const metadata: Metadata = {
  title: "You're on the list | Leveee",
  robots: { index: false },
};

export default function ThanksPage() {
  return (
    <>
      <Nav showLinks={false} showCta={false} />
      <main className="relative z-[2]">
        <ThanksView />
      </main>
      <div className="mt-28">
        {/* Note hidden until confirmation emails are actually sent:
            <Footer note="Questions? Reply to your confirmation email." /> */}
        <Footer />
      </div>
    </>
  );
}
