import { Link } from "react-router-dom";
import { BadgeCheck, Circle } from "lucide-react";
import type { OrderDetail, OrderStatus } from "../../types/order";
import { formatDateTime, ORDER_PROGRESS_STEPS, ORDER_STATUS_LABEL } from "./orderConstants";
import { STEP_ICON } from "./statusIcons";

const PAYABLE_STATUSES: OrderStatus[] = ["washing", "ironing", "packing", "waiting_payment"];

interface Props {
  order: OrderDetail;
  onComplete: () => void;
  isCompleting: boolean;
  onComplaint: () => void;
}

export function OrderProgressTracker({ order, onComplete, isCompleting, onComplaint }: Props) {
  const paidEarly =
    order.payment?.status === "paid" && ["washing", "ironing", "packing"].includes(order.status);
  const visibleSteps = paidEarly
    ? ORDER_PROGRESS_STEPS.filter((s) => s.key !== "waiting_payment")
    : ORDER_PROGRESS_STEPS;
  const activeIndex = Math.max(0, visibleSteps.findIndex((s) => s.key === order.status));
  const currentStep = visibleSteps[activeIndex];
  const CurrentIcon = STEP_ICON[order.status] ?? Circle;
  const latestHistory = order.status_history[order.status_history.length - 1];

  return (
    <div className="space-y-4">
      <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">Status Order</p>

      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute -top-2 left-5 h-4 w-4 rounded-full border-2 border-primary/40 bg-primary-container"
        />
        <div className="flex items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <CurrentIcon className="w-[18px] h-[18px]" />
          </div>
          <div className="min-w-0">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-primary/70">Status saat ini</p>
            <p className="truncate text-sm font-bold text-on-surface">
              {currentStep?.label ?? ORDER_STATUS_LABEL[order.status]}
            </p>
          </div>
          {latestHistory && (
            <p className="ml-auto shrink-0 font-mono text-xs text-on-surface-variant">
              {formatDateTime(latestHistory.created_at)}
            </p>
          )}
        </div>
      </div>

      <ol className="relative pl-1">
        <div className="absolute left-[19px] top-1 bottom-1 w-px bg-outline-variant" aria-hidden="true" />
        {visibleSteps.map((step, idx) => {
          const isDone = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const Icon = STEP_ICON[step.key] ?? Circle;
          const history = order.status_history.find((e) => e.new_status === step.key);
          return (
            <li key={step.key} className="relative flex items-start gap-3 pb-4 last:pb-0">
              <span
                className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  isCurrent
                    ? "border-primary bg-primary text-on-primary"
                    : isDone
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-outline-variant bg-surface text-outline"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
              <div className="min-w-0 pt-1.5">
                <p
                  className={`text-sm ${
                    isCurrent ? "font-bold text-on-surface" : isDone ? "font-medium text-on-surface" : "text-on-surface-variant"
                  }`}
                >
                  {step.label}
                </p>
                {history && <p className="font-mono text-xs text-on-surface-variant">{formatDateTime(history.created_at)}</p>}
              </div>
            </li>
          );
        })}
      </ol>

      {PAYABLE_STATUSES.includes(order.status) &&
        order.total_price > 0 &&
        (order.payment?.status === "paid" ? (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary-container px-4 py-3 text-sm font-semibold text-on-primary-container">
            <BadgeCheck className="w-4 h-4 shrink-0" />
            <span>
              Pesanan ini sudah dibayar
              {order.payment?.paid_at && (
                <span className="block font-mono text-xs font-normal text-on-primary-container/70">
                  {formatDateTime(order.payment.paid_at)}
                </span>
              )}
            </span>
          </div>
        ) : (
          <Link
            to={`/payment/${order.id}`}
            className="block w-full text-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors"
          >
            Bayar Sekarang
          </Link>
        ))}

      {order.status === "received_by_customer" && (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={onComplete}
            disabled={isCompleting}
            className="flex-1 text-center rounded-xl bg-primary px-4 py-3 text-sm font-bold text-on-primary hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-50"
          >
            {isCompleting ? "Memproses..." : "Pesanan Selesai"}
          </button>
          {order.complaints.length > 0 ? (
            <p className="flex-1 text-center rounded-xl border border-outline-variant px-4 py-3 text-sm font-semibold text-on-surface-variant">
              Komplain sudah diajukan
            </p>
          ) : (
            <button
              type="button"
              onClick={onComplaint}
              className="flex-1 text-center rounded-xl border border-error px-4 py-3 text-sm font-bold text-error hover:bg-error/10 transition-colors"
            >
              Komplain
            </button>
          )}
        </div>
      )}
    </div>
  );
}
