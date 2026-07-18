import type { EmployeeRole } from "../../types/employee";
import type { Station } from "../../types/worker";

// Mirrors internal/order/constants.go's stationForRole: each worker role is
// locked to exactly one station.
export const STATION_FOR_ROLE: Partial<Record<EmployeeRole, Station>> = {
  washing_worker: "washing",
  ironing_worker: "ironing",
  packing_worker: "packing",
};

export const STATION_LABEL: Record<Station, string> = {
  washing: "Stasiun Cuci",
  ironing: "Stasiun Setrika",
  packing: "Stasiun Packing",
};
