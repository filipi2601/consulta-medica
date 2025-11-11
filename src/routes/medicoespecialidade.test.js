import request from "supertest";
import app from "../app.js";
import { connectDB } from "../config/db.js";
import fs from "fs";
import path from "path";

const schemaSql = fs.readFileSync(
  path.resolve("./src/database/schema.sql"),
  "utf8"
);
const testSeedSql = fs.readFileSync(
  path.resolve("./src/database/seedTest.sql"),
  "utf8"
);

let db;

beforeAll(async () => {
  db = await connectDB();
});

beforeEach(async () => {
  const schemaCommands = schemaSql
    .split(";")
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);

  for (const command of schemaCommands) {
    await db.query(command);
  }

  const seedCommands = testSeedSql
    .split(";")
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);

  for (const command of seedCommands) {
    await db.query(command);
  }
});

afterAll(async () => {
  if (db) await db.end();
});

describe("Integração - MedicoEspecialidade", () => {
  // 🔹 POST
  describe("POST /api/medico-especialidade", () => {
    it("deve criar um vínculo entre médico e especialidade", async () => {
      const novoVinculo = { id_medico: 1, id_especialidade: 2 };

      const response = await request(app)
        .post("/api/medico-especialidade")
        .send(novoVinculo);

      expect([201, 200]).toContain(response.status);
      expect(response.body).toHaveProperty("message");
    });

    it("deve retornar erro 400 se faltar campos obrigatórios", async () => {
      const response = await request(app)
        .post("/api/medico-especialidade")
        .send({ id_medico: 1 });

      expect([400, 422]).toContain(response.status);
    });

    it("deve retornar erro 400 ou 409 se vínculo já existir", async () => {
      const response = await request(app)
        .post("/api/medico-especialidade")
        .send({ id_medico: 1, id_especialidade: 1 });

      expect([400, 409]).toContain(response.status);
    });
  });

  // 🔹 GET - Todos
  describe("GET /api/medico-especialidade", () => {
    it("deve listar todos os vínculos existentes", async () => {
      const response = await request(app).get("/api/medico-especialidade");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // 🔹 GET - Por Médico
  describe("GET /api/medico-especialidade/:id_medico", () => {
    it("deve listar especialidades de um médico existente", async () => {
      const response = await request(app).get("/api/medico-especialidade/1");

      expect([200, 204]).toContain(response.status);
      if (response.status === 200) {
        expect(Array.isArray(response.body)).toBe(true);
      }
    });

    it("deve retornar 200 com lista vazia ou 404 se não houver vínculos", async () => {
      const response = await request(app).get("/api/medico-especialidade/999");
      expect([200, 204, 404]).toContain(response.status);
    });
  });

  // 🔹 PUT - Atualizar vínculo
  describe("PUT /api/medico-especialidade/:id_medico/:id_especialidade", () => {
    it("deve atualizar o vínculo de um médico existente", async () => {
      const novoVinculo = { novo_id_especialidade: 3 }; // campo correto esperado pelo controller

      const response = await request(app)
        .put("/api/medico-especialidade/1/1")
        .send(novoVinculo);

      // Status deve ser sucesso (200 ou 204)
      expect([200, 204]).toContain(response.status);

      // Se houver corpo, checa se há mensagem válida
      if (response.body && (response.body.message || response.body.error)) {
        const msg = response.body.message || response.body.error;
        expect(typeof msg).toBe("string");
      }
    });

    it("deve retornar erro 404 (ou similar) se tentar atualizar vínculo inexistente", async () => {
      const response = await request(app)
        .put("/api/medico-especialidade/999/999")
        .send({ novo_id_especialidade: 2 });

      expect([400, 404, 500]).toContain(response.status);

      if (response.body && (response.body.message || response.body.error)) {
        const msg = response.body.message || response.body.error;
        expect(typeof msg).toBe("string");
      }
    });
  });

  // 🔹 DELETE
  describe("DELETE /api/medico-especialidade/:id_medico/:id_especialidade", () => {
    it("deve remover um vínculo existente", async () => {
      const response = await request(app).delete(
        "/api/medico-especialidade/1/1"
      );
      expect([200, 204]).toContain(response.status);
    });

    it("deve retornar 404 (ou similar) se vínculo não existir", async () => {
      const response = await request(app).delete(
        "/api/medico-especialidade/999/999"
      );
      expect([400, 404, 500]).toContain(response.status);
    });
  });
});
