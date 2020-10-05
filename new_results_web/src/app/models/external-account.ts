export interface ExternalAccount {
  id?: string;
  is_main?: boolean;
  account_type?: string;
  account_data?: {
    bank_number: number;
    bank_name: string;
    agency: number;
    account_number: number;
    operation?: string;
    account_type?: string;
    full_name: string;
    cpf: string;
  };
}
