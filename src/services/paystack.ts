import axios from "axios";
import { config } from "dotenv";

interface ResolvedAcctRes {
  status: boolean;
  message: string;
  data: {
    account_number: number;
    account_name: string;
    bank_id: number;
  };
}

export class PayStackServices {
  private baseUrl = "https://api.paystack.co";

  private readSecret() {
    config();
    return process.env.PAYSTACK_TEST_SECRET_KEY ?? "";
  }

  async resolveAcctNo(account_number: number, bank_code: number) {
    return axios<ResolvedAcctRes, ResolvedAcctRes>({
      method: "get",
      baseURL: this.baseUrl,
      url: `/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      headers: {
        Authorization: this.readSecret(),
      },
    });
  }
}
