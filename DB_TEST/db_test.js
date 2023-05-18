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

// Funkcija za stvaranje dijela
async function createDio(nazivDijela, kolicinaNaLageru) {
  const query =
    "INSERT INTO dio (naziv_dijela, kolicina_na_lageru) VALUES ($1, $2) RETURNING sifra_dijela";
  const values = [nazivDijela, kolicinaNaLageru];

  try {
    const { rows } = await pool.query(query, values);
    const sifraDijela = rows[0].sifra_dijela;
    console.log(`✅ Stvoren dio sa šifrom: ${sifraDijela}`);
    return sifraDijela;
  } catch (error) {
    console.error("❌ Greška pri stvaranju dijela:", error);
  }
}

// Funkcija za čitanje dijela
async function readDio(sifraDijela) {
  const query = "SELECT * FROM dio WHERE sifra_dijela = $1";
  const values = [sifraDijela];

  try {
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      console.log("✅ Pronađen dio:");
      console.log("   - Šifra dijela:", rows[0].sifra_dijela);
      console.log("   - Naziv dijela:", rows[0].naziv_dijela);
      console.log("   - Količina na lageru:", rows[0].kolicina_na_lageru);
    } else {
      console.log(`✅ Dio s šifrom ${sifraDijela} ne postoji.`);
    }
  } catch (error) {
    console.error("❌ Greška pri čitanju dijela:", error);
  }
}

// Funkcija za ažuriranje dijela
async function updateDio(sifraDijela, nazivDijela, kolicinaNaLageru) {
  const query =
    "UPDATE dio SET naziv_dijela = $1, kolicina_na_lageru = $2 WHERE sifra_dijela = $3";
  const values = [nazivDijela, kolicinaNaLageru, sifraDijela];

  try {
    await pool.query(query, values);
    console.log(`✅ Dio s šifrom ${sifraDijela} je ažuriran.`);
  } catch (error) {
    console.error("❌ Greška pri ažuriranju dijela:", error);
  }
}

// Funkcija za brisanje dijela
async function deleteDio(sifraDijela) {
  const query = "DELETE FROM dio WHERE sifra_dijela = $1";
  const values = [sifraDijela];

  try {
    await pool.query(query, values);
    console.log(`✅ Dio s šifrom ${sifraDijela} je obrisan.`);
  } catch (error) {
    console.error("❌ Greška pri brisanju dijela:", error);
  }
}

// Glavna funkcija za testiranje
async function testCrudOperations() {
  try {
    // Testiranje stvaranja dijela
    const sifraDijela = await createDio("Dio 1", 10);

    // Testiranje čitanja dijela
    await readDio(sifraDijela);

    // Testiranje ažuriranja dijela
    await updateDio(sifraDijela, "Novi naziv", 15);

    // Ponovno čitanje dijela nakon ažuriranja
    await readDio(sifraDijela);

    // Testiranje brisanja dijela
    await deleteDio(sifraDijela);

    // Ponovno čitanje dijela nakon brisanja
    await readDio(sifraDijela);
  } catch (error) {
    console.error("Greška pri izvršavanju testova:", error);
  } finally {
    pool.end(); // Zatvaranje bazene veza
  }
}

// Pokretanje testa CRUD operacija
testCrudOperations();
