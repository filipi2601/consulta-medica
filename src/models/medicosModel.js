import { connectDB } from "../config/db.js";

// 🔹 Listar todos os médicos
export async function listarTodos() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM Medicos");
  return rows;
}

// 🔹 Buscar médico por ID
export async function buscarPorId(id) {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM Medicos WHERE id = ?", [id]);
  return rows[0] || null;
}

// 🔹 Criar médico (campos opcionais)
export async function criar(dados) {
  const db = await connectDB();

  const camposPermitidos = ["nome", "crm", "email"];
  const campos = [];
  const valores = [];

  for (const campo of camposPermitidos) {
    if (dados[campo] !== undefined) {
      campos.push(campo);
      valores.push(dados[campo]);
    }
  }

  if (campos.length === 0) {
    throw new Error("Nenhum dado informado para criação do médico.");
  }

  const placeholders = campos.map(() => "?").join(", ");
  const sql = `INSERT INTO Medicos (${campos.join(", ")}) VALUES (${placeholders})`;

  const [result] = await db.query(sql, valores);

  return { id: result.insertId, ...dados };
}

// 🔹 Atualizar médico (permite trocar ou remover campos)
export async function atualizar(id, campos) {
  const db = await connectDB();

  // Verifica se o médico existe
  const [rows] = await db.query("SELECT * FROM Medicos WHERE id = ?", [id]);
  if (rows.length === 0) {
    throw new Error("Médico não encontrado.");
  }

  const camposPermitidos = ["nome", "crm", "email"];
  const updates = [];
  const valores = [];

  for (const campo of camposPermitidos) {
    if (campos[campo] !== undefined) {
      // Se o valor for null → seta campo como NULL no banco
      if (campos[campo] === null) {
        updates.push(`${campo} = NULL`);
      } else {
        updates.push(`${campo} = ?`);
        valores.push(campos[campo]);
      }
    }
  }

  if (updates.length === 0) {
    throw new Error("Nenhum campo válido informado para atualização.");
  }

  valores.push(id);
  const sql = `UPDATE Medicos SET ${updates.join(", ")} WHERE id = ?`;
  const [result] = await db.query(sql, valores);

  return result.affectedRows > 0;
}

// 🔹 Remover médico
export async function remover(id) {
  const db = await connectDB();
  const [result] = await db.query("DELETE FROM Medicos WHERE id = ?", [id]);
  return result.affectedRows > 0;
}
