import { connectDB } from "../config/db.js";

export async function getMedicos() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM `Medicos`");
  return rows;
}

export async function findById(id) {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM `Medicos` WHERE id = ?", [id]);
  return rows[0];
}

export async function findByEmail(email) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT * FROM `Medicos` WHERE LOWER(email) = LOWER(?) LIMIT 1",
    [email]
  );
  return rows[0];
}

export async function findByCrm(crm) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT * FROM `Medicos` WHERE UPPER(crm) = UPPER(?) LIMIT 1",
    [crm]
  );
  return rows[0];
}

export async function addMedico({ nome, crm, email }) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO `Medicos` (nome, crm, email) VALUES (?, ?, ?)",
    [nome, crm, email]
  );
  return { id: result.insertId, nome, crm, email };
}

export async function updateMedico(id, camposParaAtualizar) {
  const db = await connectDB();
  const campos = Object.keys(camposParaAtualizar);

  if (campos.length === 0) {
    return false;
  }

  const setClause = campos.map((campo) => `${campo} = ?`).join(", ");
  const valores = campos.map((campo) => camposParaAtualizar[campo]);

  const [result] = await db.query(
    `UPDATE \`Medicos\` SET ${setClause} WHERE id = ?`,
    [...valores, id]
  );

  return result.affectedRows > 0;
}

export async function deleteMedico(id) {
  const db = await connectDB();
  await db.query("DELETE FROM `Consultas` WHERE id_medico = ?", [id]);

  const [result] = await db.query("DELETE FROM `Medicos` WHERE id = ?", [id]);

  return result.affectedRows > 0;
}
