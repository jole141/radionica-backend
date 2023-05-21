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
    return `Stvoren dio sa šifrom: ${sifraDijela}`;
    return sifraDijela;
  } catch (error) {
    return "Greška pri stvaranju dijela:";
  }
}

// Funkcija za čitanje dijela
async function readDio(sifraDijela) {
  const query = "SELECT * FROM dio WHERE sifra_dijela = $1";
  const values = [sifraDijela];

  try {
    const { rows } = await pool.query(query, values);
    if (rows.length > 0) {
      return rows[0];
    } else {
      return `Dio s šifrom ${sifraDijela} ne postoji.`;
    }
  } catch (error) {
    return "Greška pri čitanju dijela:";
  }
}

// Funkcija za ažuriranje dijela
async function updateDio(sifraDijela, nazivDijela, kolicinaNaLageru) {
  const query =
    "UPDATE dio SET naziv_dijela = $1, kolicina_na_lageru = $2 WHERE sifra_dijela = $3";
  const values = [nazivDijela, kolicinaNaLageru, sifraDijela];

  try {
    await pool.query(query, values);
    return `Dio s šifrom ${sifraDijela} je ažuriran.`;
  } catch (error) {
    return "Greška pri ažuriranju dijela:";
  }
}

// Funkcija za brisanje dijela
async function deleteDio(sifraDijela) {
  const query = "DELETE FROM dio WHERE sifra_dijela = $1";
  const values = [sifraDijela];

  try {
    await pool.query(query, values);
    return `Dio s šifrom ${sifraDijela} je obrisan`;
  } catch (error) {
    return "Greška pri brisanju dijela";
  }
}

describe("CRUD Operations", () => {
  let sifraDijela;

  it("should create a dio", async () => {
    const nazivDijela = "Dio 1";
    const kolicinaNaLageru = 10;

    const result = await createDio(nazivDijela, kolicinaNaLageru);

    expect(result).toContain("Stvoren dio sa šifrom:");
  });

  it("should read a dio", async () => {
    spyOn(console, "log");

    const result = await readDio(sifraDijela);

    if (typeof result === "string") {
      expect(result).toContain("Dio s šifrom");
    } else {
      expect(result).toHaveProperty("sifra_dijela");
      expect(result).toHaveProperty("naziv_dijela");
      expect(result).toHaveProperty("kolicina_na_lageru");
    }
  });

  it("should update a dio", async () => {
    const nazivDijela = "Novi naziv";
    const kolicinaNaLageru = 15;

    const result = await updateDio(sifraDijela, nazivDijela, kolicinaNaLageru);

    expect(result).toContain("Dio s šifrom");
  });

  it("should delete a dio", async () => {
    const result = await deleteDio(sifraDijela);

    expect(result).toContain("Dio s šifrom");
  });
});
