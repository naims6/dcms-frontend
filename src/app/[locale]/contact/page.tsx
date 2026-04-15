import { Metadata } from "next";
import { ContactSection } from "@/components/pages/landing/contact-section";
import ContactIntro from "@/components/pages/contact-us/contact-intro";
import { ContactInfoCards } from "@/components/pages/contact-us/contact-info-cards";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Dhanbari Collegiate Model School.",
};

export default function ContactPage() {
  return (
    <main className="flex-1 overflow-hidden">
      <ContactIntro />
      <ContactInfoCards />
      <ContactSection />
    </main>
  );
}
