export interface WithdrawResponse {
  id: number;
  source: number;
  destination: number;
  src_checking_account: {
    id: number;
    user_id: number;
    balance: number;
  };
  dst_external_account: {
    id: number;
    account_type: string;
    account_data: {}
  };
  created_at: string;
}
