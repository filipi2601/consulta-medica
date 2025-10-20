import { connectDB } from '../config/db.js';

export async function create({ id_paciente, id_medico, data_agendamento }) {
  const db = await connectDB();
  const sql = `
    INSERT INTO Consultas (id_paciente, id_medico, data_agendamento) 
    VALUES (?, ?, ?)
  `;
  
  try {
    const [result] = await db.query(sql, [id_paciente, id_medico, data_agendamento]);
    return result.insertId;
  } catch (error) {
    console.error('Erro ao criar consulta no modelo:', error);
    throw new Error('Erro ao salvar consulta no banco de dados.');
  }
}

export async function findAll() {
  const db = await connectDB();
  const sql = `
    SELECT 
      c.id,
      c.data_agendamento,
      c.status,
      c.observacoes,
      p.id,
      p.nome,
      m.id,
      m.nome
    FROM Consultas c
    JOIN Pacientes p ON c.id_paciente = p.id
    JOIN Medicos m ON c.id_medico = m.id
  `;
  
  try {
    const [rows] = await db.query(sql);
    return rows;
  } catch (error) {
    console.error('Erro ao buscar todas as consultas no modelo:', error);
    throw new Error('Erro ao buscar consultas no banco de dados.');
  }
}

export async function findById(id) {
  const db = await connectDB();
  const sql = `
    SELECT 
      c.id,
      c.data_agendamento,
      c.status,
      c.observacoes,
      p.id as paciente_id,
      p.nome as nome_paciente,
      m.id as medico_id,
      m.nome as nome_medico
    FROM Consultas c
    JOIN Pacientes p ON c.id_paciente = p.id
    JOIN Medicos m ON c.id_medico = m.id
    WHERE c.id = ?
  `;
  
  try {
    const [rows] = await db.query(sql, [id]);
    return rows[0];
  } catch (error) {
    console.error('Erro ao buscar consulta por ID no modelo:', error);
    throw new Error('Erro ao buscar consulta no banco de dados.');
  }
}

export async function update(id, dadosParaAtualizar) {
  const db = await connectDB();
  
  const campos = Object.keys(dadosParaAtualizar).map(key => `${key} = ?`).join(', ');
  const valores = Object.values(dadosParaAtualizar);
  
  const sql = `UPDATE Consultas SET ${campos} WHERE id = ?`;

  try {
    const [result] = await db.query(sql, [...valores, id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao atualizar consulta no modelo:', error);
    throw new Error('Erro ao atualizar consulta no banco de dados.');
  }
}

export async function remove(id) {
  const db = await connectDB();
  const sql = `DELETE FROM Consultas WHERE id = ?`;

  try {
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao remover consulta no modelo:', error);
    throw new Error('Erro ao remover consulta no banco de dados.');
  }
}

export async function findByMedicoAndHorario(id_medico, data_agendamento) {
  const db = await connectDB();
  const sql = `
    SELECT * FROM Consultas 
    WHERE id_medico = ? 
    AND status = 'Agendada'
    AND data_agendamento BETWEEN (? - INTERVAL 59 MINUTE) AND (? + INTERVAL 59 MINUTE);
  `;
  
  try {
    const [rows] = await db.query(sql, [id_medico, data_agendamento, data_agendamento]);
    return rows[0];
  } catch (error) {
    console.error('Erro ao verificar conflito de médico no modelo:', error);
    throw new Error('Erro ao verificar agenda do médico.');
  }
}

export async function findByPacienteAndHorario(id_paciente, data_agendamento) {
  const db = await connectDB();
  const sql = `
    SELECT * FROM Consultas 
    WHERE id_paciente = ? 
    AND status = 'Agendada'
    AND data_agendamento BETWEEN (? - INTERVAL 59 MINUTE) AND (? + INTERVAL 59 MINUTE);
  `;
  
  try {
    const [rows] = await db.query(sql, [id_paciente, data_agendamento, data_agendamento]);
    return rows[0];
  } catch (error) {
    console.error('Erro ao verificar conflito de paciente no modelo:', error);
    throw new Error('Erro ao verificar agenda do paciente.');
  }
}