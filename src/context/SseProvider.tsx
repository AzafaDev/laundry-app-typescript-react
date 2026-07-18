import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./AuthContext";
import { useStaffAuth } from "./StaffAuthContext";
import { BASE_URL } from "../api/client";
import { SSE_EVENT_QUERY_KEYS, SSE_TOAST_CONTENT, type SseToastContext } from "../lib/sseEvents";
import { showSseToast } from "../components/SseToast";
import { STATION_FOR_ROLE } from "../components/worker/workerConstants";
import type { ReactNode } from "react";

// Single shared connection to the backend's /api/v1/events stream. Cookie
// auth is ambiguous when a browser holds both a customer and a staff
// session at once (e.g. testing both roles in the same browser) — the
// backend's identify() picks customer by default, so `?as=staff` on
// /staff/* routes is required to get the right one. Because that choice is
// route-dependent, the connection is re-established whenever we cross the
// customer/staff boundary, not just once at login (see ticket #57).
export function SseProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const { isAuthenticated: isCustomerAuthenticated } = useAuth();
  const { isAuthenticated: isStaffAuthenticated, employee } = useStaffAuth();
  const location = useLocation();
  const isStaffArea = location.pathname.startsWith("/staff");
  const shouldConnect = isCustomerAuthenticated || isStaffAuthenticated;
  const employeeStation = employee ? STATION_FOR_ROLE[employee.role] : undefined;
  const employeeRole = employee?.role;
  // Read via ref inside the event handler rather than depending on it
  // directly in the connection effect below — reconnecting the EventSource
  // itself should only happen for shouldConnect/isStaffArea changes, not
  // every time this derived value is recomputed.
  const toastContextRef = useRef<SseToastContext>({ employeeStation, employeeRole });
  useEffect(() => {
    toastContextRef.current = { employeeStation, employeeRole };
  }, [employeeStation, employeeRole]);

  useEffect(() => {
    if (!shouldConnect) return;

    const source = new EventSource(`${BASE_URL}/api/v1/events${isStaffArea ? "?as=staff" : ""}`, {
      withCredentials: true,
    });
    const allEventNames = new Set([...Object.keys(SSE_EVENT_QUERY_KEYS), ...Object.keys(SSE_TOAST_CONTENT)]);

    const cleanups = Array.from(allEventNames).map((eventName) => {
      const handler = (event: MessageEvent) => {
        SSE_EVENT_QUERY_KEYS[eventName]?.forEach((queryKey) => queryClient.invalidateQueries({ queryKey }));

        const buildContent = SSE_TOAST_CONTENT[eventName];
        if (buildContent) {
          let data: Record<string, unknown> = {};
          try {
            data = JSON.parse(event.data);
          } catch {
            // fall through with empty data — content builders all handle missing fields
          }
          const content = buildContent(data, toastContextRef.current);
          if (content) showSseToast(content);
        }
      };
      source.addEventListener(eventName, handler);
      return () => source.removeEventListener(eventName, handler);
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      source.close();
    };
  }, [shouldConnect, isStaffArea, queryClient]);

  return <>{children}</>;
}
