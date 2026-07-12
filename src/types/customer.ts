export interface Customer {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  message?: string;
}

export interface MessageResponse {
  message: string;
}
