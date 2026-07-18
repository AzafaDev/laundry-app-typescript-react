// Maps every named SSE event the backend broadcasts (grep sse.Default.Broadcast
// across internal/) to the React Query key prefixes it should invalidate.
// TanStack Query matches by prefix (exact:false is the default), so e.g.
// ["orders"] invalidates both the list query and every ["orders", id] detail
// query in one shot — no need to know which order changed.
//
// Some events target admin screens (complaints list, bypass review list,
// attendance report, order pickup requests) that don't exist in the
// frontend yet. Their keys are listed anyway so nothing needs to change
// here once those pages land — invalidating a query key with no active
// observers is a harmless no-op.
export const SSE_EVENT_QUERY_KEYS: Record<string, string[][]> = {
  // Same event name fires for both customer and employee notifications
  // (NotifyCustomer/NotifyEmployee both broadcast "notification:new" on
  // their own "user:<id>" channel) — invalidating both keys is harmless
  // since only one of the two queries is ever actually mounted/observed
  // depending on which area of the app the connected user is in.
  "notification:new": [["notifications"], ["staff-notifications"]],

  "order:status-updated": [["orders"]],
  "order:payment-completed": [["orders"], ["payment-status"]],
  "order:new-pickup-request": [["pipeline", "pending-process"]],
  "order:complaint-submitted": [["orders"], ["admin", "complaints"]],
  "complaint:updated": [["orders"], ["admin", "complaints"]],

  "outlet:payment-received": [["pipeline", "pending-process"]],

  "driver:task-claimed": [["driver"], ["worker", "station"]],
  "driver:task-completed": [["driver"], ["worker", "station"], ["pipeline", "pending-process"]],

  "station:new-order": [["worker", "station"]],
  "station:order-completed": [["worker", "station"]],

  "bypass:created": [["worker", "bypass"], ["admin", "bypass-requests"]],
  "bypass:approved": [["worker", "bypass"], ["admin", "bypass-requests"]],
  "bypass:rejected": [["worker", "bypass"], ["admin", "bypass-requests"]],

  "attendance:checkin": [["attendance"], ["admin", "attendance-report"]],
  "attendance:checkout": [["attendance"], ["admin", "attendance-report"]],
  "attendance:updated": [["admin", "attendance-report"]],
};

export type SseToastIcon = "bell" | "payment" | "package" | "truck" | "bypass" | "complaint";

export interface SseToastContent {
  icon: SseToastIcon;
  title: string;
  description?: string;
}

export interface SseToastContext {
  // The connected employee's own station, if they're a station worker —
  // undefined for customers, drivers, and non-worker staff roles.
  employeeStation?: string;
  // The connected employee's own role — undefined for customers.
  employeeRole?: string;
}

// Deliberately a small subset of the events above — see the conversation
// that added this: toasting every SSE event would spam high-frequency ones
// (attendance:updated fires on every check-in/out for every employee on the
// role:super_admin channel; order:status-updated fires on nearly every
// pipeline step). These are the ones that are both low-frequency and
// actionable/interesting to whoever is connected when they arrive — the
// backend's channel scoping (outlet:/user:/role:) already means anything
// that reaches the client is relevant to them, so no extra filtering here,
// EXCEPT station:new-order: it's broadcast outlet-wide (every role on that
// outlet receives it, including the worker whose own submission just
// caused it), so it needs an extra client-side check against the
// connected employee's own station to avoid a duplicate toast on top of
// their own submit-success toast.
export const SSE_TOAST_CONTENT: Record<
  string,
  (data: Record<string, unknown>, ctx: SseToastContext) => SseToastContent | null
> = {
  "notification:new": (data) => ({
    icon: "bell",
    title: String(data.title ?? "Notifikasi baru"),
    description: data.body ? String(data.body) : undefined,
  }),
  "order:payment-completed": (data) => ({
    icon: "payment",
    title: "Pembayaran diterima",
    description: data.invoiceNumber ? `Pesanan ${data.invoiceNumber} telah dibayar oleh customer.` : undefined,
  }),
  "station:new-order": (data, ctx) =>
    data.station && data.station === ctx.employeeStation
      ? { icon: "package", title: "Order baru di antrian", description: "Ada pesanan baru masuk ke station kamu." }
      : null,
  "order:new-pickup-request": (data) => ({
    icon: "truck",
    title: "Permintaan pickup baru",
    description: data.invoiceNumber ? `Pesanan ${data.invoiceNumber} menunggu dijemput.` : undefined,
  }),
  // CreateBypassRequest broadcasts this same event name twice — once to the
  // outlet channel (for outlet_admin) and once to the requesting worker's
  // own user channel (so a future "my bypass requests" view can pick it
  // up). The worker is subscribed to both, and already has their own
  // submit-success toast from StationProcessModal, so skip it for anyone
  // with a station (i.e. any station worker) — same fix as station:new-order.
  "bypass:created": (data, ctx) =>
    ctx.employeeStation
      ? null
      : {
          icon: "bypass",
          title: "Permintaan bypass baru",
          description: data.invoiceNumber ? `Pesanan ${data.invoiceNumber} butuh review admin.` : "Menunggu review admin.",
        },
  "order:complaint-submitted": (data) => ({
    icon: "complaint",
    title: "Komplain baru",
    description: data.invoiceNumber ? `Pesanan ${data.invoiceNumber} mendapat komplain dari customer.` : undefined,
  }),
  // Only meaningful to toast for pickup completions — that's the transition
  // that lands an order in outlet_admin's "Proses Pesanan" queue. Delivery
  // completions also fire this same event name but aren't relevant there.
  // Also skipped for the driver role itself: this broadcasts outlet-wide,
  // so the driver who just completed their own task would otherwise get
  // this on top of DriverActiveTask's own "Task berhasil diselesaikan"
  // toast — same duplicate-toast issue station:new-order had.
  "driver:task-completed": (data, ctx) =>
    data.taskType === "pickup" && ctx.employeeRole !== "driver"
      ? { icon: "package", title: "Pesanan tiba di outlet", description: "Siap diproses — cek antrian Proses Pesanan." }
      : null,
};
