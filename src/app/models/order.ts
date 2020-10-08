export interface Order {
  product_id: number;
  checking_account_id: number;
  created_at?: string;
  updated_at?: string;
  id?: number;
  checkout_link?: string;
  status?: string;
}
