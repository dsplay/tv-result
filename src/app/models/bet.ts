export interface IBet {
  id?: number;
  dst_bet?: any;
  src_checking_account: {
    id: number;
    user_id: number;
    balance: number;
  };
  created_at: string;
}
