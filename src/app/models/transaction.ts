import { Order } from './order';
export interface Transaction {
  id?: number;
  value?: number;
  source?: number;
  destination?: string;
  src_checking_account?: {
    id?: number;
    user_id?: number;
    balance?: number;
  };
  src_bet?: any;
  src_order?: Order;
  dst_bet?: any;
  dst_checking_account?: {
    id?: number;
    user_id?: number;
    balance?: number;
  };
  dst_external_account?: {
    id?: number;
    account_type?: string;
    account_data?: any;
  };
  created_at?: string;
}
