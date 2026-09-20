"use client";

import NavigationProvider from "../providers/NavigationProvider";
import ThemeProvider from "../providers/ThemeProvider";
import Footer from "./Footer";
import Header from "./Header";

interface AppClientLayoutProps {
  children: React.ReactNode;
}
const AppClientLayout = ({ children }: AppClientLayoutProps) => {
  return (
    <ThemeProvider>
      <NavigationProvider>
        <Header />
        <main className="main screen-height">{children}</main>
        <Footer />
      </NavigationProvider>
    </ThemeProvider>
  );
};

export default AppClientLayout;
