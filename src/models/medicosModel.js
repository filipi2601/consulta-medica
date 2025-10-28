import { connectDB } from "../config/db.js";

export async function getMedicos() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM `Medicos`");
  return rows;
}

export async function addMedico({ nome, crm, email }) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO `Medicos` (nome, crm, email) VALUES (?, ?, ?)",
    [nome, crm, email]
  );
  return { id: result.insertId, nome, crm, email };
}

export async function updateMedico(id, { nome, crm, email }) {
  const db = await connectDB();
  await db.query(
    "UPDATE `Medicos` SET nome = ?, crm = ?, email = ? WHERE id = ?",
    [nome, crm, email, id]
  );
  return { id, nome, crm, email };
}

export async function deleteMedico(id) {
  const db = await connectDB();
  await db.query("DELETE FROM `Consultas` WHERE id_medico = ?", [id]);

  const [result] = await db.query("DELETE FROM `Medicos` WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw new Error("Medico não encontrado");
  }
}