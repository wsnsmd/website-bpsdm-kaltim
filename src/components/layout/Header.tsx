// src/components/layout/Header.tsx
import { MainNav } from "./MainNav";
import { HeaderScrollWrapper } from "./HeaderClient";
import { SearchButton } from "./SearchButton";
import { HeaderLogoClient } from "./HeaderLogoClient";

export function Header() {
  return (
    <HeaderScrollWrapper>
      <div
        className="container-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          gap: "16px",
        }}
      >
        {/* Logo — client component agar ikut transparan */}
        <HeaderLogoClient />

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Desktop nav */}
        <div className="header-nav-desktop">
          <MainNav />
        </div>

        {/* Actions desktop */}
        <div className="header-actions-desktop">
          <SearchButton />
        </div>

        {/* Mobile actions */}
        <div className="header-actions-mobile">
          <SearchButton />
          <MainNav isMobileMenuButtonOnly />
        </div>
      </div>
    </HeaderScrollWrapper>
  );
}
