import { connectDB } from "../config/db.js";

async function getAll() {
  const db = await connectDB();
  const [rows] = await db.query("SELECT * FROM Especialidades");
  return rows;
}

async function getById(id) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT * FROM Especialidades WHERE idEspecialidade = ?",
    [id]
  );
  return rows[0];
}

async function create(nomeEspecialidade) {
  const db = await connectDB();
  const [result] = await db.query(
    "INSERT INTO Especialidades (nomeEspecialidade) VALUES (?)",
    [nomeEspecialidade]
  );
  return { idEspecialidade: result.insertId, nomeEspecialidade };
}

async function update(id, nomeEspecialidade) {
  const db = await connectDB();
  await db.query(
    "UPDATE Especialidades SET nomeEspecialidade = ? WHERE idEspecialidade = ?",
    [nomeEspecialidade, id]
  );
  return { idEspecialidade: id, nomeEspecialidade };
}

async function remove(id) {
  const db = await connectDB();
  await db.query("DELETE FROM Especialidades WHERE idEspecialidade = ?", [id]);
  return { message: "Especialidade removida com sucesso" };
}


export default {
  getAll,
  getById,
  create,
  update,
  delete: remove,
};
