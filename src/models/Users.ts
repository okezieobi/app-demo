import { Model, Table, Column, DataType, Default } from "sequelize-typescript";

export interface UserAttributes {
  id?: string;
  account_number?: number;
  bank_code?: number;
  account_name?: string;
  is_verIfied?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

@Table({ tableName: "users", timestamps: true })
export class Users
  extends Model<UserAttributes, UserAttributes>
  implements UserAttributes
{
  @Default(DataType.UUIDV4)
  @Column({ primaryKey: true, type: DataType.UUID })
  id?: string;

  @Column({ allowNull: true, type: DataType.DATE })
  createdAt?: Date;

  @Column({ allowNull: true, type: DataType.DATE })
  updatedAt?: Date;

  @Column({ allowNull: true, type: DataType.INTEGER })
  account_number?: number;

  @Column({ allowNull: true, type: DataType.INTEGER })
  bank_code?: number;

  @Column({ allowNull: true, unique: true, type: DataType.STRING })
  account_name?: string;

  @Column({ allowNull: true, type: DataType.BOOLEAN })
  is_verIfied?: boolean;
}
