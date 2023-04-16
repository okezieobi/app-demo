import { Users, UserAttributes } from "../models";
import { IsEmail, sequelize } from "../services";
import { Features } from ".";

export class UserFeatures extends Features<UserAttributes> {
  async insertOne() {
    await IsEmail.passthrough().parseAsync(this.params);
    return sequelize.transaction(async () => {
      return Users.create(this.params);
    });
  }

  test() {
    return this.params;
  }
}
