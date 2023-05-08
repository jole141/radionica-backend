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



const getAlati = async () => {
  const results = await pool.query("SELECT * from alat;");
  return results.rows;
};

const postAlat = async (alat) => {
  await pool.query(
    "INSERT INTO alat (naziv_alata, kolicina_na_lageru) VALUES ($1, $2);",
    [alat.nazivAlat, alat.kolicinaNaLageru]
  );
};

const deleteAlat = async (id) => {
  await pool.query("DELETE FROM alat WHERE sifra_alata = $1;", [id]);
};

const putAlat = async (alat, id) => {
  await pool.query(
    "UPDATE alat SET naziv_alata = $1, kolicina_na_lageru = $2 WHERE sifra_alata = $3;",
    [alat.nazivAlat, alat.kolicinaNaLageru, id]
  );
};

const getAlat = async (id) => {
  const results = await pool.query(
    "SELECT * from alat WHERE sifra_alata = $1;",
    [id]
  );
  return results.rows[0];
};



const getStrojevi = async () => {
  const results = await pool.query("SELECT * from stroj;");
  return results.rows;
};

const postStroj = async (stroj) => {
  await pool.query(
    "INSERT INTO stroj (naziv_stroja) VALUES ($1);",
    [alat.nazivStroj]
  );
};

const deleteStroj = async (id) => {
  await pool.query("DELETE FROM stroj WHERE sifra_stroja = $1;", [id]);
};

const putStroj = async (alat, id) => {
  await pool.query(
    "UPDATE stroj SET naziv_stroja = $1 WHERE sifra_stroja = $2;",
    [stroj.nazivStroj, id]
  );
};

const getStroj = async (id) => {
  const results = await pool.query(
    "SELECT * from stroj WHERE sifra_stroja = $1;",
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

  projekt.dijelovi = (await pool.query("SELECT sifra_dijela, naziv_dijela, kolicina_dijelova, kolicina_na_lageru FROM dio NATURAL JOIN dijelovi_projekt NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [id])).rows;

  projekt.alati = (await pool.query("SELECT sifra_alata, naziv_alata, kolicina_alata, kolicina_na_lageru FROM alat NATURAL JOIN alat_koristi NATURAL JOIN projekt WHERE sifra_projekta=$1;",
    [id])).rows;

  projekt.strojevi = (await pool.query("SELECT sifra_stroja, naziv_stroja, datum_koristenja FROM stroj NATURAL JOIN koristenje_stroja NATURAL JOIN projekt WHERE sifra_projekta=$1;",
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

const pridijeliStrojProjektu = async(koristenje) => {
  await pool.query("INSERT INTO koristenje_stroja (sifra_stroja, sifra_projekta, datum_koristenja) VALUES ($1, $2, $3);",
  [koristenje.sifraStroja, koristenje.sifraProjekta, koristenje.datumKoristenja]);
}

const pridijeliAlatProjektu = async(koristenje) => {
  const results = await pool.query("SELECT * FROM alat_koristi WHERE sifra_alata = $1 AND sifra_projekta = $2;", [koristenje.sifraAlata, koristenje.sifraProjekta]);
  if(results.rows.length>0){
    const kolicina = results.rows[0].kolicina_alata;
    await pool.query("UPDATE alat_koristi SET kolicina_alata = $1 WHERE sifra_alata = $2 AND sifra_projekta = $3;",
    [kolicina + koristenje.kolicinaAlata, koristenje.sifraAlata, koristenje.sifraProjekta]);
  }else{
    await pool.query("INSERT INTO alat_koristi (sifra_alata, sifra_projekta, kolicina_alata) VALUES ($1, $2, $3);",
    [koristenje.sifraAlata, koristenje.sifraProjekta, koristenje.kolicinaAlata]);
  }
  const results2 = await pool.query("SELECT * FROM alat WHERE sifra_alata = $1;", [koristenje.sifraAlata]);
  const alat = results2.rows[0];
  await pool.query("UPDATE alat SET kolicina_na_lageru = $1 WHERE sifra_alata = $2;", [alat.kolicina_na_lageru-koristenje.kolicinaAlata, koristenje.sifraAlata])
}

const pridijeliDioProjektu = async(koristenje) => {
  const results = await pool.query("SELECT * FROM dijelovi_projekt WHERE sifra_dijela = $1 AND sifra_projekta = $2;", [koristenje.sifraDijela, koristenje.sifraProjekta]);
  if(results.rows.length>0){
    const kolicina = results.rows[0].kolicina_dijelova;
    await pool.query("UPDATE dijelovi_projekt SET kolicina_dijelova = $1 WHERE sifra_dijela = $2 AND sifra_projekta = $3;",
    [kolicina + koristenje.kolicinaDijelova, koristenje.sifraDijela, koristenje.sifraProjekta]);
  }else{
    await pool.query("INSERT INTO dijelovi_projekt (sifra_dijela, sifra_projekta, kolicina_dijelova) VALUES ($1, $2, $3);",
    [koristenje.sifraDijela, koristenje.sifraProjekta, koristenje.kolicinaDijelova]);
  }
  const results2 = await pool.query("SELECT * FROM dio WHERE sifra_dijela = $1;", [koristenje.sifraDijela]);
  const dio = results2.rows[0];
  await pool.query("UPDATE dio SET kolicina_na_lageru = $1 WHERE sifra_dijela = $2;", [dio.kolicina_na_lageru-koristenje.kolicinaDijelova, koristenje.sifraDijela])
}

module.exports = {  getDijelovi, postDio, deleteDio, putDio, getDio,
                    getAlati, getAlat, deleteAlat, postAlat, putAlat,
                    getStrojevi, getStroj, deleteStroj, postStroj, putStroj,
                    getProjekti, getProjekt, deleteProjekt, postProjekt, putProjekt,
                    pridijeliStrojProjektu, pridijeliAlatProjektu, pridijeliDioProjektu };
