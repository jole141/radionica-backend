const { Router } = require("express");
const { getDijelovi } = require("../datasource");

const radRouter = Router();

radRouter.get("/dijelovi", async (req, res, next) => {
  const dijelovi = await getDijelovi();
  res.status(200).json(dijelovi);
});

module.exports = { radRouter };
