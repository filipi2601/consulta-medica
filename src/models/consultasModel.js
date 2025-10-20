import { connectDB } from '../config/db.js';

export async function create({ idPaciente, idMedico, data_agendamentoConsulta }) {
  const db = await connectDB();
  const sql = `
    INSERT INTO Consultas (idPaciente, idMedico, data_agendamentoConsulta) 
    VALUES (?, ?, ?)
  `;
  
  try {
    const [result] = await db.query(sql, [idPaciente, idMedico, data_agendamentoConsulta]);
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
      c.idConsulta,
      c.data_agendamentoConsulta,
      c.statusConsulta,
      c.observacoesConsulta,
      p.idPaciente,
      p.nomePaciente,
      m.idMedico,
      m.nomeMedico
    FROM Consultas c
    JOIN Pacientes p ON c.idPaciente = p.idPaciente
    JOIN Medicos m ON c.idMedico = m.idMedico
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
      c.idConsulta,
      c.data_agendamentoConsulta,
      c.statusConsulta,
      c.observacoesConsulta,
      p.idPaciente,
      p.nomePaciente,
      m.idMedico,
      m.nomeMedico
    FROM Consultas c
    JOIN Pacientes p ON c.idPaciente = p.idPaciente
    JOIN Medicos m ON c.idMedico = m.idMedico
    WHERE c.idConsulta = ?
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
  
  const sql = `UPDATE Consultas SET ${campos} WHERE idConsulta = ?`;

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
  const sql = `DELETE FROM Consultas WHERE idConsulta = ?`;

  try {
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Erro ao remover consulta no modelo:', error);
    throw new Error('Erro ao remover consulta no banco de dados.');
  }
}

export async function findByMedicoAndHorario(idMedico, dataAgendamento) {
  const db = await connectDB();
  const sql = `
    SELECT * FROM Consultas 
    WHERE idMedico = ? 
    AND statusConsulta = 'Agendada'
    AND data_agendamentoConsulta BETWEEN (? - INTERVAL 59 MINUTE) AND (? + INTERVAL 59 MINUTE);
  `;
  
  try {
    const [rows] = await db.query(sql, [idMedico, dataAgendamento, dataAgendamento]);
    return rows[0];
  } catch (error) {
    console.error('Erro ao verificar conflito de médico no modelo:', error);
    throw new Error('Erro ao verificar agenda do médico.');
  }
}

export async function findByPacienteAndHorario(idPaciente, dataAgendamento) {
  const db = await connectDB();
  const sql = `
    SELECT * FROM Consultas 
    WHERE idPaciente = ? 
    AND statusConsulta = 'Agendada'
    AND data_agendamentoConsulta BETWEEN (? - INTERVAL 59 MINUTE) AND (? + INTERVAL 59 MINUTE);
  `;
  
  try {
    const [rows] = await db.query(sql, [idPaciente, dataAgendamento, dataAgendamento]);
    return rows[0];
  } catch (error) {
    console.error('Erro ao verificar conflito de paciente no modelo:', error);
    throw new Error('Erro ao verificar agenda do paciente.');
  }
}