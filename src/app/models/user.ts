export interface IUser {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  birthday: string;
  checking_account?: {
    id: number;
    balance: number;
  };
  created_at?: string;
  updated_at?: string;
}
