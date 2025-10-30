import { connectDB } from "../config/db.js";

// Buscar todos os vínculos
export async function getAllVinculos() {
  const db = await connectDB();
  const [rows] = await db.query(`
    SELECT 
      m.idMedico,
      m.nomeMedico,
      e.idEspecialidade,
      e.nomeEspecialidade
    FROM medico_especialidade me
    JOIN medicos m ON me.id_medico = m.idMedico
    JOIN especialidades e ON me.id_especialidade = e.idEspecialidade
  `);
  return rows;
}

// Especialidades por médico
export async function getEspecialidadesMedico(id_medico) {
  const db = await connectDB();
  const [rows] = await db.query(`
    SELECT 
      e.idEspecialidade,
      e.nomeEspecialidade
    FROM medico_especialidade me
    JOIN especialidades e ON me.id_especialidade = e.idEspecialidade
    WHERE me.id_medico = ?
  `, [id_medico]);
  return rows;
}

// Criar vínculo
export async function vincular(id_medico, id_especialidade) {
  const db = await connectDB();
  await db.query(`
    INSERT INTO medico_especialidade (id_medico, id_especialidade)
    VALUES (?, ?)
  `, [id_medico, id_especialidade]);
}

// Atualizar vínculo
export async function atualizar(id_medico, id_especialidade, novo_id_especialidade) {
  const db = await connectDB();
  await db.query(`
    UPDATE medico_especialidade
    SET id_especialidade = ?
    WHERE id_medico = ? AND id_especialidade = ?
  `, [novo_id_especialidade, id_medico, id_especialidade]);
}

// Remover vínculo
export async function remover(id_medico, id_especialidade) {
  const db = await connectDB();
  await db.query(`
    DELETE FROM medico_especialidade
    WHERE id_medico = ? AND id_especialidade = ?
  `, [id_medico, id_especialidade]);
}
