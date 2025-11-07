import { connectDB } from "../config/db.js";

// Listar todos os vínculos
export async function listarTodosVinculos() {
  const db = await connectDB();
  const [rows] = await db.query(`
    SELECT 
      m.id AS id_medico,
      m.nome AS nome_medico,
      e.id AS id_especialidade,
      e.nome AS nome_especialidade
    FROM Medico_Especialidade me
    JOIN Medicos m ON m.id = me.id_medico
    JOIN Especialidades e ON e.id = me.id_especialidade
  `);
  return rows;
}

// Listar especialidades de um médico específico
export async function listarEspecialidadesMedico(id_medico) {
  const db = await connectDB();

  const [medico] = await db.query("SELECT * FROM Medicos WHERE id = ?", [id_medico]);
  if (medico.length === 0) return [];

  const [rows] = await db.query(
    `SELECT e.id, e.nome 
     FROM Medico_Especialidade me
     JOIN Especialidades e ON me.id_especialidade = e.id
     WHERE me.id_medico = ?`,
    [id_medico]
  );

  return rows;
}

// Criar vínculo
export async function vincularEspecialidade(id_medico, id_especialidade) {
  const db = await connectDB();

  if (!id_medico || !id_especialidade) {
    const err = new Error("Médico e especialidade são obrigatórios");
    err.status = 400;
    throw err;
  }

  const [existe] = await db.query(
    "SELECT * FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );
  if (existe.length > 0) {
    const err = new Error("Vínculo já existente");
    err.status = 400;
    throw err;
  }

  await db.query(
    "INSERT INTO Medico_Especialidade (id_medico, id_especialidade) VALUES (?, ?)",
    [id_medico, id_especialidade]
  );

  return { message: "Vínculo criado com sucesso" };
}

// Atualizar vínculo
export async function atualizarEspecialidade(id_medico, id_especialidade, novo_id_especialidade) {
  const db = await connectDB();

  const [existe] = await db.query(
    "SELECT * FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );
  if (existe.length === 0) {
    const err = new Error("Vínculo não encontrado");
    err.status = 404;
    throw err;
  }

  await db.query(
    "UPDATE Medico_Especialidade SET id_especialidade = ? WHERE id_medico = ? AND id_especialidade = ?",
    [novo_id_especialidade, id_medico, id_especialidade]
  );

  return { message: "Vínculo atualizado com sucesso" };
}

// Remover vínculo
export async function removerEspecialidade(id_medico, id_especialidade) {
  const db = await connectDB();

  await db.query(
    "DELETE FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );

  return { message: "Vínculo removido com sucesso" };
}

// Verifica existência do vínculo
export async function findVinculo(id_medico, id_especialidade) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT * FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );
  return rows.length > 0;
}
