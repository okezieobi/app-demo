import axios from "axios";
import { config } from "dotenv";

interface PayStackResponse<Data> {
  status: boolean;
  message: string;
  data: Data;
}

interface ResolvedAcctNoData {
  account_number: string;
  account_name: string;
  bank_id: number;
}

type ResolvedAcctNo = PayStackResponse<ResolvedAcctNoData>;

interface BankData {
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway?: any;
  pay_with_bank: boolean;
  active: boolean;
  is_deleted: boolean;
  country: string;
  currency: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

type Bank = PayStackResponse<BankData[]>;

export class PayStackServices {
  private baseUrl = "https://api.paystack.co";

  private readSecret() {
    config();
    return process.env.PAYSTACK_TEST_SECRET_KEY ?? "";
  }

  async resolveAcctNo(account_number: string, bank_code: string) {
    return axios<ResolvedAcctNo, ResolvedAcctNo>({
      method: "get",
      baseURL: this.baseUrl,
      url: `bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      headers: {
        Authorization: `Bearer ${this.readSecret()}`,
      },
    });
  }
  async listBanks() {
    return axios<Bank, Bank>({
      method: "get",
      baseURL: this.baseUrl,
      url: `bank`,
      headers: {
        Authorization: `Bearer ${this.readSecret()}`,
      },
    });
  }
}
