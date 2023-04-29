const { Router } = require("express");
const {
  getDijelovi,
  postDio,
  deleteDio,
  putDio,
  getDio,
} = require("../datasource");

const radRouter = Router();

radRouter.get("/dijelovi", async (req, res, next) => {
  const dijelovi = await getDijelovi();
  res.status(200).json(dijelovi);
});

radRouter.post("/dijelovi", async (req, res, next) => {
  const dio = req.body;
  await postDio(dio);
  res.status(201).json({ message: "dio added" });
});

radRouter.delete("/dijelovi/:id", async (req, res, next) => {
  const id = req.params.id;
  await deleteDio(id);
  res.status(200).json({ message: "dio deleted" });
});

radRouter.put("/dijelovi/:id", async (req, res, next) => {
  const dio = req.body;
  const id = req.params.id;
  await putDio(dio, id);
  res.status(200).json({ message: "dio updated" });
});

radRouter.get("/dijelovi/:id", async (req, res, next) => {
  const id = req.params.id;
  const dio = await getDio(id);
  if (!dio) {
    return res.status(404).json({ error: "dio not found" });
  }
  res.status(200).json(dio);
});

module.exports = { radRouter };
