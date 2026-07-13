export interface Province {
  id: number;
  name: string;
}

export interface City {
  id: number;
  province_id: number;
  name: string;
}

export interface District {
  id: number;
  city_id: number;
  name: string;
}
