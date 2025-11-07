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
    JOIN Medicos m ON me.id_medico = m.id
    JOIN Especialidades e ON me.id_especialidade = e.id
  `);
  return rows;
}

// Listar especialidades de um médico específico
export async function listarEspecialidadesMedico(id_medico) {
  const db = await connectDB();

  // Verifica se o médico existe
  const [medicoExiste] = await db.query("SELECT * FROM Medicos WHERE id = ?", [id_medico]);
  if (medicoExiste.length === 0) {
    return { error: "Médico não encontrado" };
  }

  // Lista especialidades (pode retornar vazio)
  const [rows] = await db.query(
    `SELECT e.id, e.nome 
     FROM Medico_Especialidade me
     JOIN Especialidades e ON me.id_especialidade = e.id
     WHERE me.id_medico = ?`,
    [id_medico]
  );

  return rows;
}

// Verificar se vínculo já existe
export async function findVinculo(id_medico, id_especialidade) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT * FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );
  return rows.length > 0 ? rows[0] : null;
}

// Criar vínculo
export async function vincularEspecialidade(id_medico, id_especialidade) {
  const db = await connectDB();

  const [medico] = await db.query("SELECT * FROM Medicos WHERE id = ?", [id_medico]);
  if (medico.length === 0) throw new Error("Médico não encontrado");

  const [especialidade] = await db.query("SELECT * FROM Especialidades WHERE id = ?", [id_especialidade]);
  if (especialidade.length === 0) throw new Error("Especialidade não encontrada");

  const [vinculo] = await db.query(
    "SELECT * FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );
  if (vinculo.length > 0) throw new Error("Vínculo já existe");

  await db.query(
    "INSERT INTO Medico_Especialidade (id_medico, id_especialidade) VALUES (?, ?)",
    [id_medico, id_especialidade]
  );

  return { message: "Vínculo criado com sucesso!" };
}

// Atualizar vínculo
export async function atualizarEspecialidade(id_medico, id_especialidade, novo_id_especialidade) {
  const db = await connectDB();

  const [vinculo] = await db.query(
    "SELECT * FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );

  if (vinculo.length === 0) throw new Error("Vínculo não encontrado");

  await db.query(
    "UPDATE Medico_Especialidade SET id_especialidade = ? WHERE id_medico = ? AND id_especialidade = ?",
    [novo_id_especialidade, id_medico, id_especialidade]
  );

  return { message: "Vínculo atualizado com sucesso!" };
}

//  Remover vínculo
export async function removerEspecialidade(id_medico, id_especialidade) {
  const db = await connectDB();

  const [vinculo] = await db.query(
    "SELECT * FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );

  if (vinculo.length === 0) {
    return { error: "Vínculo não encontrado" };
  }

  await db.query(
    "DELETE FROM Medico_Especialidade WHERE id_medico = ? AND id_especialidade = ?",
    [id_medico, id_especialidade]
  );

  return { message: "Vínculo removido com sucesso!" };
}
