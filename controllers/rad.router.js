const { Router } = require("express");
const {
  getDijelovi,
  postDio,
  deleteDio,
  putDio,
  getDio,
  getProjekti,
  getProjekt,
  postProjekt,
  deleteProjekt,
  putProjekt,
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

radRouter.get("/projekti", async (req, res, next) => {
  const projekti = await getProjekti();
  res.status(200).json(projekti);
});

radRouter.get("/projekti/:id", async (req, res, next) => {
  const id = req.params.id;
  const projekt = await getProjekt(id);
  if (!projekt) {
    return res.status(404).json({ error: "projekt not found" });
  }
  res.status(200).json(projekt);
});

radRouter.post("/projekti", async (req, res, next) => {
  const projekt = req.body;
  await postProjekt(projekt);
  res.status(201).json({ message: "projekt added" });
});

radRouter.delete("/projekti/:id", async (req, res, next) => {
  const id = req.params.id;
  await deleteProjekt(id);
  res.status(200).json({ message: "projekt deleted" });
});

radRouter.put("/projekti/:id", async (req, res, next) => {
  const projekt = req.body;
  const id = req.params.id;
  await putProjekt(projekt, id);
  res.status(200).json({ message: "projekt updated" });
});

module.exports = { radRouter };
