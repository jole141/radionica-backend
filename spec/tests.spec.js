const request = require("supertest");
const { app } = require("../index");
const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: "radionicadb",
  password: process.env.DB_PASSWORD,
  port: 5432,
  ssl: true,
});

describe("Unit tests for radRouter", () => {
  it("should return dijelovi", (done) => {
    request(app)
      .get("/dijelovi")
      .expect(200)
      .end((err, res) => {
        done();
      });
  });

  it("should add a new dio", (done) => {
    const dio = {
      nazivDio: "Testni naziv",
      kolicinaNaLageru: 13,
    };

    request(app)
      .post("/dijelovi")
      .send(dio)
      .expect(201)
      .end(async (err, res) => {
        expect(res.body).toEqual({ message: "dio added" });
        const { rows } = await pool.query(
          "SELECT * FROM dio WHERE naziv_dijela=$1 AND kolicina_na_lageru=$2;",
          [dio.nazivDio, dio.kolicinaNaLageru]
        );

        const addedDio = rows[0];
        expect(addedDio.naziv_dijela).toEqual(dio.nazivDio);
        expect(addedDio.kolicina_na_lageru).toEqual(dio.kolicinaNaLageru);

        await pool.query("DELETE FROM dio WHERE sifra_dijela=$1;", [
          addedDio.sifra_dijela,
        ]);

        done();
      });
  });

  it("should delete a dio", (done) => {
    const dio = {
      nazivDio: "Testni naziv",
      kolicinaNaLageru: 13,
    };
    pool
      .query(
        "INSERT INTO dio (naziv_dijela, kolicina_na_lageru) VALUES ($1, $2) RETURNING sifra_dijela",
        [dio.nazivDio, dio.kolicinaNaLageru]
      )
      .then((rez) => {
        const id = rez.rows[0].sifra_dijela;
        request(app)
          .delete(`/dijelovi/${id}`)
          .expect(200)
          .end(async (err, res) => {
            expect(res.body).toEqual({ message: "dio deleted" });

            const { rows } = await pool.query(
              "SELECT * FROM dio WHERE sifra_dijela=$1;",
              [id]
            );
            expect(rows.length).toEqual(0);
            done();
          });
      });
  });

  it("should update a dio", (done) => {
    const dio = {
      nazivDio: "Testni dio update",
      kolicinaNaLageru: 22,
    };
    const newDio = {
      nazivDio: "Testni dijelić update",
      kolicinaNaLageru: 30,
    };

    pool
      .query(
        "INSERT INTO dio (naziv_dijela, kolicina_na_lageru) VALUES ($1, $2) RETURNING sifra_dijela",
        [dio.nazivDio, dio.kolicinaNaLageru]
      )
      .then((rez) => {
        const id = rez.rows[0].sifra_dijela;

        request(app)
          .put(`/dijelovi/${id}`)
          .send(newDio)
          .expect(200)
          .end(async (err, res) => {
            expect(res.body).toEqual({ message: "dio updated" });
            const { rows } = await pool.query(
              "SELECT * FROM dio WHERE sifra_dijela=$1;",
              [id]
            );

            const updatedDio = rows[0];

            expect(updatedDio.naziv_dijela).toEqual(newDio.nazivDio);
            expect(updatedDio.kolicina_na_lageru).toEqual(
              newDio.kolicinaNaLageru
            );

            await pool.query("DELETE FROM dio WHERE sifra_dijela=$1;", [
              updatedDio.sifra_dijela,
            ]);

            done();
          });
      });
  });

  it("should return a specific dio", (done) => {
    const dio = {
      nazivDio: "Testni dio get",
      kolicinaNaLageru: 25,
    };

    pool
      .query(
        "INSERT INTO dio (naziv_dijela, kolicina_na_lageru) VALUES ($1, $2) RETURNING sifra_dijela",
        [dio.nazivDio, dio.kolicinaNaLageru]
      )
      .then((rez) => {
        const id = rez.rows[0].sifra_dijela;

        request(app)
          .get(`/dijelovi/${id}`)
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.naziv_dijela).toEqual(dio.nazivDio);
            expect(res.body.kolicina_na_lageru).toEqual(dio.kolicinaNaLageru);

            await pool.query("DELETE FROM dio WHERE sifra_dijela=$1;", [
              res.body.sifra_dijela,
            ]);

            done();
          });
      });
  });

  it("should return projekti", (done) => {
    request(app)
      .get("/projekti")
      .expect(200)
      .end((err, res) => {
        done();
      });
  });

  it("should add a new projekt", (done) => {
    const projekt = {
      nazivProjekta: "Testni naziv",
      opisProjekta: "Testni opis",
      datumPocetka: new Date(),
      datumZavršetka: new Date(),
    };

    request(app)
      .post("/projekti")
      .send(projekt)
      .expect(201)
      .end(async (err, res) => {
        expect(res.body).toEqual({ message: "projekt added" });
        const { rows } = await pool.query(
          "SELECT * FROM projekt WHERE naziv_projekta=$1 AND opis_projekta=$2 AND datum_pocetka=$3 AND datum_završetka=$4;",
          [
            projekt.nazivProjekta,
            projekt.opisProjekta,
            projekt.datumPocetka,
            projekt.datumZavršetka,
          ]
        );

        const addedProjekt = rows[0];
        expect(addedProjekt.naziv_projekta).toEqual(projekt.nazivProjekta);
        expect(addedProjekt.opis_projekta).toEqual(projekt.opisProjekta);
        expect(addedProjekt.datum_pocetka.toLocaleDateString()).toEqual(
          projekt.datumPocetka.toLocaleDateString()
        );
        expect(addedProjekt.datum_završetka.toLocaleDateString()).toEqual(
          projekt.datumZavršetka.toLocaleDateString()
        );

        await pool.query("DELETE FROM projekt WHERE sifra_projekta=$1;", [
          addedProjekt.sifra_projekta,
        ]);

        done();
      });
  });

  it("should delete a projekt", (done) => {
    const projekt = {
      nazivProjekta: "Testni naziv",
      opisProjekta: "Testni opis",
      datumPocetka: new Date(),
      datumZavršetka: new Date(),
    };

    pool
      .query(
        "INSERT INTO projekt (naziv_projekta, opis_projekta, datum_pocetka, datum_završetka) VALUES ($1, $2, $3, $4) RETURNING sifra_projekta",
        [
          projekt.nazivProjekta,
          projekt.opisProjekta,
          projekt.datumPocetka,
          projekt.datumZavršetka,
        ]
      )
      .then((rez) => {
        const id = rez.rows[0].sifra_projekta;
        request(app)
          .delete(`/projekti/${id}`)
          .expect(200)
          .end(async (err, res) => {
            expect(res.body).toEqual({ message: "projekt deleted" });

            const { rows } = await pool.query(
              "SELECT * FROM projekt WHERE sifra_projekta=$1;",
              [id]
            );
            expect(rows.length).toEqual(0);
            done();
          });
      });
  });

  it("should update a projekt", (done) => {
    const projekt = {
      nazivProjekta: "Testni naziv",
      opisProjekta: "Testni opis",
      datumPocetka: new Date(),
      datumZavršetka: new Date(),
    };
    const newProjekt = {
      nazivProjekta: "Testni naziv 2",
      opisProjekta: "Testni opis 2",
      datumPocetka: new Date(),
      datumZavršetka: new Date(),
    };

    pool
      .query(
        "INSERT INTO projekt (naziv_projekta, opis_projekta, datum_pocetka, datum_završetka) VALUES ($1, $2, $3, $4) RETURNING sifra_projekta",
        [
          projekt.nazivProjekta,
          projekt.opisProjekta,
          projekt.datumPocetka,
          projekt.datumZavršetka,
        ]
      )
      .then((rez) => {
        const id = rez.rows[0].sifra_projekta;

        request(app)
          .put(`/projekti/${id}`)
          .send(newProjekt)
          .expect(200)
          .end(async (err, res) => {
            expect(res.body).toEqual({ message: "projekt updated" });
            const { rows } = await pool.query(
              "SELECT * FROM projekt WHERE sifra_projekta=$1;",
              [id]
            );

            const updatedProjekt = rows[0];

            expect(updatedProjekt.naziv_projekta).toEqual(
              newProjekt.nazivProjekta
            );
            expect(updatedProjekt.opis_projekta).toEqual(
              newProjekt.opisProjekta
            );
            expect(updatedProjekt.datum_pocetka.toLocaleDateString()).toEqual(
              newProjekt.datumPocetka.toLocaleDateString()
            );
            expect(updatedProjekt.datum_završetka.toLocaleDateString()).toEqual(
              newProjekt.datumZavršetka.toLocaleDateString()
            );

            await pool.query("DELETE FROM projekt WHERE sifra_projekta=$1;", [
              updatedProjekt.sifra_projekta,
            ]);

            done();
          });
      });
  });

  it("should return a specific projekt", (done) => {
    const projekt = {
      nazivProjekta: "Testni naziv",
      opisProjekta: "Testni opis",
      datumPocetka: new Date(),
      datumZavršetka: new Date(),
    };

    pool
      .query(
        "INSERT INTO projekt (naziv_projekta, opis_projekta, datum_pocetka, datum_završetka) VALUES ($1, $2, $3, $4) RETURNING sifra_projekta",
        [
          projekt.nazivProjekta,
          projekt.opisProjekta,
          projekt.datumPocetka,
          projekt.datumZavršetka,
        ]
      )
      .then((rez) => {
        const id = rez.rows[0].sifra_projekta;

        request(app)
          .get(`/projekti/${id}`)
          .expect(200)
          .end(async (err, res) => {
            expect(res.body.naziv_projekta).toEqual(projekt.nazivProjekta);
            expect(res.body.opis_projekta).toEqual(projekt.opisProjekta);
            expect(
              new Date(res.body.datum_pocetka).toLocaleDateString()
            ).toEqual(projekt.datumPocetka.toLocaleDateString());
            expect(
              new Date(res.body.datum_završetka).toLocaleDateString()
            ).toEqual(projekt.datumZavršetka.toLocaleDateString());

            await pool.query("DELETE FROM projekt WHERE sifra_projekta=$1;", [
              res.body.sifra_projekta,
            ]);

            done();
          });
      });
  });
});
