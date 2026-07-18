import { request, requestAllowStatus } from "./client";
import type { Order } from "../types/order";
import type {
  ActualBreakdownItem,
  ActualSatuanItem,
  BypassRequest,
  ExpectedItem,
  Station,
  StationHistoryResponse,
  SubmitItemsResult,
} from "../types/worker";

export const getStationOrders = (station: Station) =>
  request<{ data: Order[] }>(`/api/v1/employee/worker/station/${station}/orders`);

export const getStationOrderItems = (station: Station, orderId: string) =>
  request<{ data: ExpectedItem[] }>(`/api/v1/employee/worker/station/${station}/orders/${orderId}/items`);

export const getStationHistory = (station: Station, limit = 20, offset = 0) =>
  request<StationHistoryResponse>(
    `/api/v1/employee/worker/station/${station}/history?limit=${limit}&offset=${offset}`,
  );

export const submitItems = (
  station: Station,
  orderId: string,
  data: { actual_items: ActualBreakdownItem[]; actual_satuan_items: ActualSatuanItem[] },
) =>
  requestAllowStatus<SubmitItemsResult>(
    `/api/v1/employee/worker/station/${station}/orders/${orderId}/submit-items`,
    [409],
    { method: "POST", body: JSON.stringify(data) },
  );

export interface CreateBypassInput {
  order_id: string;
  discrepancy_description: string;
  actual_items: ActualBreakdownItem[];
  actual_satuan_items: ActualSatuanItem[];
  photos?: File[];
}

export const createBypassRequest = (data: CreateBypassInput) => {
  const { photos, ...payload } = data;
  const formData = new FormData();
  formData.append("payload", JSON.stringify(payload));
  for (const photo of photos ?? []) {
    formData.append("photos", photo);
  }
  return request<BypassRequest>("/api/v1/employee/worker/bypass", { method: "POST", body: formData });
};

export const getBypassByOrder = (orderId: string) =>
  request<{ data: BypassRequest[] }>(`/api/v1/employee/worker/orders/${orderId}/bypass`);
