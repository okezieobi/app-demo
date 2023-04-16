import { Sequelize } from "sequelize-typescript";
import debugModule from "debug";
import cls from "cls-hooked";
import { config } from "dotenv";

import { Users } from "../models";

const namespace = cls.createNamespace("graphql-app-demo-namespace");
Sequelize.useCLS(namespace);

const debug = debugModule("graphql-app-demo:database");

const setConnectionString = () => {
  config();
  let connectionString: string | undefined;
  switch (true) {
    case process.env.NODE_ENV === "production":
      connectionString = process.env.PRD_DATABASE_URL;
      break;
    default:
      connectionString = process.env.DEV_DATABASE_URL;
  }
  return connectionString ?? "";
};

export const sequelize = new Sequelize(setConnectionString(), {
  dialect: "postgres",
  models: [Users],
});

export const initConnection = async () => {
  await sequelize.authenticate();
  if (process.env.NODE_ENV === "development")
    await sequelize.sync({ alter: true, logging: console.log });

  debug("Db connection successful");
};

export const queryServices = {
  instanceExists<Instance>(instance: Instance) {
    return instance == null;
  },

  instanceIsUpdated(updateCount: number) {
    return updateCount < 1;
  },

  instanceAlreadyExists<Instance>(instance: Instance) {
    return instance != null;
  },
};
