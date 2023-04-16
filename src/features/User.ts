import { Users, UserAttributes } from "../models";
import {
  sequelize,
  PayStackServices,
  queryServices,
  AppError,
  InsertUserSchema,
  ValidateUserSchema,
  ValidateAcctNameSchema,
  ValidateAcctSchema,
} from "../services";

export class UserFeatures {
  private payStack = new PayStackServices();

  constructor(readonly params?: UserAttributes) {}

  async insertOne() {
    const input = await InsertUserSchema.parseAsync(this.params);
    return sequelize.transaction(async () => {
      return Users.create(input);
    });
  }

  async verifyAcct(bank_code: string) {
    const input = await ValidateUserSchema.parseAsync({
      account_name: this.params?.account_name,
      account_number: this.params?.account_number,
      bank_code,
    });
    const payStackResult = await this.payStack.resolveAcctNo(
      input.account_number,
      input.bank_code
    );
    await ValidateAcctNameSchema.parseAsync({
      validated: payStackResult.data.account_name.toLowerCase(),
      input: input.account_name?.toLowerCase(),
    });
    const [update] = await sequelize.transaction(async () => {
      return Users.update(
        {
          is_verIfied: true,
          account_number: payStackResult.data.account_number,
          bank_code: bank_code,
        },
        { where: { account_name: input.account_name.toLowerCase() } }
      );
    });
    if (!queryServices.instanceIsUpdated(update)) {
      throw new AppError("NotFoundError", "User to be verified not found");
    }
  }

  async getAcct(bank_code: string) {
    const input = await ValidateAcctSchema.parseAsync({
      account_number: this.params?.account_number,
      bank_code,
    });
    const user =
      (await sequelize.transaction(async () => {
        return Users.findOne({ where: input });
      })) ??
      (await this.payStack.resolveAcctNo(
        input.account_number,
        input.bank_code
      ));
    return user;
  }
}
