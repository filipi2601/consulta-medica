import { connectDB } from "../config/db.js";

export async function getPacientes() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM pacientes");
  return rows;
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

export async function updatePaciente(
  id,
  { nome, cpf, data_nascimento, telefone, email }
) {
  const db = await connectDB();
  await db.query(
    `UPDATE pacientes
     SET nome = ?, cpf = ?, data_nascimento = ?, telefone = ?, email = ?
     WHERE id = ?`,
    [nome, cpf, data_nascimento, telefone, email, id]
  );
  return { id, nome, cpf, data_nascimento, telefone, email };
}

export async function deletePaciente(id) {
  const db = await connectDB();
  await db.query("DELETE FROM consultas WHERE idPaciente = ?", [id]);

  const [result] = await db.query("DELETE FROM pacientes WHERE id = ?", [id]);

  if (result.affectedRows === 0) {
    throw new Error("Paciente não encontrado");
  }
}