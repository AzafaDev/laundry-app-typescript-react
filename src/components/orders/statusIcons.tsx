import {
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  Flame,
  Home,
  Package,
  PackageCheck,
  Truck,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import type { OrderStatus } from "../../types/order";

export const STEP_ICON: Record<OrderStatus, LucideIcon> = {
  waiting_pickup_driver: Clock,
  laundry_to_outlet: Truck,
  laundry_arrived_outlet: Building2,
  washing: Droplets,
  ironing: Flame,
  packing: Package,
  waiting_payment: Wallet,
  ready_for_delivery: PackageCheck,
  delivery_to_customer: Truck,
  received_by_customer: Home,
  completed: CheckCircle2,
};

type StatusTone = "progress" | "action" | "done";

const STATUS_TONE: Record<OrderStatus, StatusTone> = {
  waiting_pickup_driver: "progress",
  laundry_to_outlet: "progress",
  laundry_arrived_outlet: "progress",
  washing: "progress",
  ironing: "progress",
  packing: "progress",
  waiting_payment: "action",
  ready_for_delivery: "progress",
  delivery_to_customer: "progress",
  received_by_customer: "progress",
  completed: "done",
};

const TONE_CLASSES: Record<StatusTone, string> = {
  progress: "bg-secondary-container text-on-secondary-container",
  action: "bg-tertiary-container text-on-tertiary-container",
  done: "bg-primary-container text-on-primary-container",
};

export function statusBadgeClasses(status: OrderStatus) {
  return TONE_CLASSES[STATUS_TONE[status]];
}
