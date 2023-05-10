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
  pridijeliStrojProjektu,
  pridijeliAlatProjektu,
  pridijeliDioProjektu,
  pridijeliDioProjektuEdit,
  ukloniDioIzProjekta,
  getAlat,
  getAlati,
  postAlat,
  deleteAlat,
  putAlat,
  getStroj,
  getStrojevi,
  postStroj,
  deleteStroj,
  putStroj,
} = require("../datasource");

const radRouter = Router();

radRouter.get("/dijelovi", async (req, res, next) => {
  const dijelovi = await getDijelovi();
  res
    .status(200)
    .json(
      dijelovi.sort((a, b) => Number(a.sifra_dijela) - Number(b.sifra_dijela))
    );
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

radRouter.get("/alati", async (req, res, next) => {
  const alati = await getAlati();
  res.status(200).json(alati);
});

radRouter.post("/alati", async (req, res, next) => {
  const alat = req.body;
  await postAlat(alat);
  res.status(201).json({ message: "alat added" });
});

radRouter.delete("/alati/:id", async (req, res, next) => {
  const id = req.params.id;
  await deleteAlat(id);
  res.status(200).json({ message: "alat deleted" });
});

radRouter.put("/alati/:id", async (req, res, next) => {
  const alat = req.body;
  const id = req.params.id;
  await putAlat(alat, id);
  res.status(200).json({ message: "alat updated" });
});

radRouter.get("/alati/:id", async (req, res, next) => {
  const id = req.params.id;
  const alat = await getAlat(id);
  if (!alat) {
    return res.status(404).json({ error: "alat not found" });
  }
  res.status(200).json(alat);
});

radRouter.get("/strojevi", async (req, res, next) => {
  const strojevi = await getStrojevi();
  res.status(200).json(strojevi);
});

radRouter.post("/strojevi", async (req, res, next) => {
  const stroj = req.body;
  await postStroj(stroj);
  res.status(201).json({ message: "stroj added" });
});

radRouter.delete("/strojevi/:id", async (req, res, next) => {
  const id = req.params.id;
  await deleteStroj(id);
  res.status(200).json({ message: "stroj deleted" });
});

radRouter.put("/strojevi/:id", async (req, res, next) => {
  const stroj = req.body;
  const id = req.params.id;
  await putStroj(stroj, id);
  res.status(200).json({ message: "stroj updated" });
});

radRouter.get("/strojevi/:id", async (req, res, next) => {
  const id = req.params.id;
  const stroj = await getStroj(id);
  if (!stroj) {
    return res.status(404).json({ error: "stroj not found" });
  }
  res.status(200).json(stroj);
});

radRouter.get("/projekti", async (req, res, next) => {
  const projekti = await getProjekti();
  res
    .status(200)
    .json(
      projekti.sort(
        (a, b) => Number(a.sifra_projekta) - Number(b.sifra_projekta)
      )
    );
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

radRouter.post("/projekti/stroj", async (req, res, next) => {
  const koristenje = req.body;
  await pridijeliStrojProjektu(koristenje);
  res.status(200).json({ message: "stroj assigned to projekt" });
});

radRouter.post("/projekti/alat", async (req, res, next) => {
  const koristenje = req.body;
  const alat = await getAlat(koristenje.sifraAlata);
  if (alat.kolicina_na_lageru < koristenje.kolicinaAlata) {
    res.status(400).json({ message: "not enough alata on lager" });
    return;
  }
  await pridijeliAlatProjektu(koristenje);
  res.status(200).json({ message: "alat assigned to projekt" });
});

radRouter.post("/projekti/dio", async (req, res, next) => {
  const koristenje = req.body;

  console.log(koristenje);
  const dio = await getDio(koristenje.sifraDijela);
  console.log(dio);
  if (dio.kolicina_na_lageru < koristenje.kolicinaDijelova) {
    res.status(400).json({ message: "not enough dijelova on lager" });
    return;
  }
  await pridijeliDioProjektu(koristenje);
  res.status(200).json({ message: "dio assigned to projekt" });
});

radRouter.put("/projekti/dio/edit", async (req, res, next) => {
  const koristenje = req.body;

  console.log(koristenje);
  const dio = await getDio(koristenje.sifraDijela);
  console.log(dio);
  if (dio.kolicina_na_lageru < koristenje.kolicinaDijelova) {
    res.status(400).json({ message: "not enough dijelova on lager" });
    return;
  }
  await pridijeliDioProjektuEdit(koristenje);
  res.status(200).json({ message: "dio assigned to projekt" });
});

radRouter.delete("/projekti/remove/dio", async (req, res, next) => {
  const koristenje = req.body;
  await ukloniDioIzProjekta(koristenje);
  res.status(200).json({ message: "dio uklonjen from projekt" });
});

module.exports = { radRouter };
