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

const getDijelovi = async () => {
  const results = await pool.query("SELECT * from dio;");
  return results.rows;
};

const postDio = async (dio) => {
  await pool.query(
    "INSERT INTO dio (naziv_dijela, kolicina_na_lageru) VALUES ($1, $2);",
    [dio.nazivDio, dio.kolicinaNaLageru]
  );
};

const deleteDio = async (id) => {
  await pool.query("DELETE FROM dio WHERE sifra_dijela = $1;", [id]);
};

const putDio = async (dio, id) => {
  await pool.query(
    "UPDATE dio SET naziv_dijela = $1, kolicina_na_lageru = $2 WHERE sifra_dijela = $3;",
    [dio.nazivDio, dio.kolicinaNaLageru, id]
  );
};

const getDio = async (id) => {
  const results = await pool.query(
    "SELECT * from dio WHERE sifra_dijela = $1;",
    [id]
  );
  return results.rows[0];
};

const getProjekti = async () => {
  const results = await pool.query("SELECT * FROM projekt;");
  const projekti = results.rows;
  
  for (let i = 0; i < projekti.length; i++) {
    projekti[i].dijelovi = (await pool.query("SELECT sifra_dijela, naziv_dijela, kolicina_na_lageru FROM dio NATURAL JOIN dijelovi_projekt NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [projekti[i].sifra_projekta])).rows;

    projekti[i].alati = (await pool.query("SELECT sifra_alata, naziv_alata, kolicina_na_lageru FROM alat NATURAL JOIN alat_koristi NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [projekti[i].sifra_projekta])).rows;

    projekti[i].strojevi = (await pool.query("SELECT sifra_stroja, naziv_stroja FROM stroj NATURAL JOIN koristenje_stroja NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [projekti[i].sifra_projekta])).rows;
  }
  return projekti;
};

const getProjekt = async (id) => {
  const results = await pool.query("SELECT * FROM projekt WHERE sifra_projekta = $1;", [id]);
  const projekt = results.rows[0];

  projekt.dijelovi = (await pool.query("SELECT sifra_dijela, naziv_dijela, kolicina_na_lageru FROM dio NATURAL JOIN dijelovi_projekt NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [id])).rows;

  projekt.alati = (await pool.query("SELECT sifra_alata, naziv_alata, kolicina_na_lageru FROM alat NATURAL JOIN alat_koristi NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [id])).rows;

  projekt.strojevi = (await pool.query("SELECT sifra_stroja, naziv_stroja FROM stroj NATURAL JOIN koristenje_stroja NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [id])).rows;

  return projekt;
};

const postProjekt = async (projekt) => {
  await pool.query(
    "INSERT INTO projekt (naziv_projekta, opis_projekta, datum_pocetka, datum_završetka) VALUES ($1, $2, $3, $4);",
    [projekt.nazivProjekta, projekt.opisProjekta, projekt.datumPocetka, projekt.datumZavršetka]);
};

const deleteProjekt = async (id) => {
  await pool.query(
    "DELETE FROM projekt WHERE sifra_projekta = $1;",
    [id]);
};

const putProjekt = async (projekt, id) => {
  await pool.query(
    "UPDATE projekt SET naziv_projekta = $1, opis_projekta = $2, datum_pocetka = $3, datum_završetka = $4 WHERE sifra_projekta = $5;",
    [projekt.nazivProjekta, projekt.opisProjekta, projekt.datumPocetka, projekt.datumZavršetka, id]);
};

module.exports = { getDijelovi, postDio, deleteDio, putDio, getDio, getProjekti, getProjekt, postProjekt, deleteProjekt, putProjekt };
