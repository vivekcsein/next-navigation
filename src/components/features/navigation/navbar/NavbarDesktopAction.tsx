"use client";

import ThemeToggle from "@/components/layouts/ThemeToggle";
import {
  useNavigationActions,
  useNavigationState,
} from "@/components/providers/NavigationProvider";

const NavbarDesktopAction = () => {
  const mobileMenuOpen = useNavigationState("mobileMenuOpen");
  const { toggleMobileMenu } = useNavigationActions();

  return (
    <div className="header-actions">
      <ThemeToggle />

      {/* Mobile Menu Toggle Burger Button */}
      <button
        type="button"
        className={`hamburger ${mobileMenuOpen ? "open" : ""}`}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
        aria-expanded={mobileMenuOpen}
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  );
};

export default NavbarDesktopAction;
