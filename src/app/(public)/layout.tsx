// src/app/(public)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeaderSpacer } from "@/components/layout/HeaderSpacer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <HeaderSpacer />
      <main>{children}</main>
      <Footer />
    </>
  );
}
