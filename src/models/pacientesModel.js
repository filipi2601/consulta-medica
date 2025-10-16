import { connectDB } from '../config/db.js';

export async function initPacientesTable() {
  const db = await connectDB();
  await db.query(`
    CREATE TABLE IF NOT EXISTS pacientes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      data_nascimento DATE NOT NULL,
      telefone VARCHAR(20) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL
    );
  `);
  console.log('🧱 Tabela "pacientes" pronta.');
}

export async function getPacientes() {
  const db = await connectDB();
  const [rows] = await db.query('SELECT * FROM pacientes');
  return rows;
}

export async function addPaciente({ nome, data_nascimento, telefone, email }) {
  const db = await connectDB();
  const [result] = await db.query(
    'INSERT INTO pacientes (nome, data_nascimento, telefone, email) VALUES (?, ?, ?, ?)',
    [nome, data_nascimento, telefone, email]
  );
  return { id: result.insertId, nome, data_nascimento, telefone, email };
}
