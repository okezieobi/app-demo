import { Router } from "express";

import { initConnection } from "../services";

const router = Router();

initConnection()
  .then(() => {
    /* GET home page. */
    router.get("/", function (req, res, next) {
      res.render("index", { title: "Express" });
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit();
  });

export default router;
