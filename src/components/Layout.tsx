import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import "../styles/auth.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
