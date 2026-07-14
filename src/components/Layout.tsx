import type { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { StaffNavbar } from "./StaffNavbar";
import "../styles/auth.css";

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isStaffArea = location.pathname.startsWith("/staff");

  return (
    <>
      {isStaffArea ? <StaffNavbar /> : <Navbar />}
      {children}
    </>
  );
}
