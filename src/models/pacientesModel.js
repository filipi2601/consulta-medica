import { connectDB } from "../config/db.js";

export async function getPacientes() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM pacientes");
  return rows;
}

export async function findById(id) {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM pacientes WHERE id = ?", [id]);
  return rows[0];
}

export async function findByEmail(email) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT * FROM pacientes WHERE LOWER(email) = LOWER(?) LIMIT 1",
    [email]
  );
  return rows[0];
}

export async function findByCpfDigits(cpfDigits) {
  const db = await connectDB();
  const [rows] = await db.query(
    `SELECT * FROM pacientes
     WHERE REPLACE(REPLACE(REPLACE(cpf, '.', ''), '-', ''), '/', '') = ?
     LIMIT 1`,
    [cpfDigits]
  );
  return rows[0];
}

export async function addPaciente({
  nome,
  cpf,
  data_nascimento,
  telefone,
  email,
}) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO pacientes (nome, cpf, data_nascimento, telefone, email) VALUES (?, ?, ?, ?, ?)",
    [nome, cpf, data_nascimento, telefone, email]
  );
  return { id: result.insertId, nome, cpf, data_nascimento, telefone, email };
}

export async function updatePaciente(id, camposParaAtualizar) {
  const db = await connectDB();
  const campos = Object.keys(camposParaAtualizar);

  if (campos.length === 0) {
    return false;
  }

  const setClause = campos.map((campo) => `${campo} = ?`).join(", ");
  const valores = campos.map((campo) => camposParaAtualizar[campo]);

  const [result] = await db.query(
    `UPDATE pacientes SET ${setClause} WHERE id = ?`,
    [...valores, id]
  );

  return result.affectedRows > 0;
}

export async function deletePaciente(id) {
  const db = await connectDB();
  await db.query("DELETE FROM consultas WHERE id_paciente = ?", [id]);

  const [result] = await db.query("DELETE FROM pacientes WHERE id = ?", [id]);

  return result.affectedRows > 0;
}
