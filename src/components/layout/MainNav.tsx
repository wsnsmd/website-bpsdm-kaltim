// src/components/layout/MainNav.tsx
import { getHeaderMenu } from "@/lib/queries/profil";
import { MainNavClient } from "./MainNavClient";

interface MainNavProps {
  isMobileMenuButtonOnly?: boolean;
}

export async function MainNav({
  isMobileMenuButtonOnly = false,
}: MainNavProps) {
  const menuItems = await getHeaderMenu();

  // Konversi data jika perlu, atau langsung passing
  return (
    <MainNavClient
      menuItems={menuItems as any}
      isMobileMenuButtonOnly={isMobileMenuButtonOnly}
    />
  );
}
