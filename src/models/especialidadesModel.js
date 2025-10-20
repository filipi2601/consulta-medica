import { connectDB } from "../config/db.js";

export async function getEspecialidades() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM especialidades");
  return rows;
}

export async function addEspecialidade({
  nome
}) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO especialidades (nome) VALUES (?)",
    [nome]
  );
  return { id: result.insertId, nome};
}

export async function updateEspecialidade(
  id,
  { nome }
) {
  const db = await connectDB();
  await db.query(
    `UPDATE especialidades
     SET nome = ? WHERE id = ?`,
    [nome, id]
  );
  return { id, nome };
}

export async function deleteEspecialidade(id) {
  const db = await connectDB();
  await db.query("DELETE FROM medico_especialidade WHERE id_especialidade = ?", [id]);

  const [result] = await db.query("DELETE FROM especialidades WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw new Error("Especialidade não encontrada");
  }
}