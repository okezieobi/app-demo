import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { graphql_schema, createHandler } from "./graphql";
import { initConnection } from "./services";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

initConnection()
  .then(() => {
    app.all("/graphql", createHandler({ schema: graphql_schema }));
  })
  .catch((error) => {
    console.error(error);
    process.exit();
  });

export default app;
