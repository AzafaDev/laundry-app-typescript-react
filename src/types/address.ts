export interface Address {
  id: string;
  label: string;
  address: string;
  province_id: number;
  city_id: number;
  district_id: number;
  province: string;
  city: string;
  district: string;
  postal_code?: string;
  latitude: number;
  longitude: number;
  is_primary: boolean;
}
