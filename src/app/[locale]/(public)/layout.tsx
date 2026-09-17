import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}
