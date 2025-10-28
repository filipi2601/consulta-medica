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
  if (db) {
    await db.end();
  }
});

describe("Medicos API", () => {
  describe("POST /api/medicos", () => {
    it("deve criar um medico com sucesso", async () => {
      const novoMedico = {
        nome: "Dr. Mauricio Lima",
        crm: "54321-RS",
        email: "mauricio.lima@clinica.com",
      };

      const response = await request(app)
        .post("/api/medicos")
        .send(novoMedico);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        nome: "Dr. Mauricio Lima",
        crm: "54321-RS",
        email: "mauricio.lima@clinica.com",
      });
      expect(response.body).toHaveProperty("id");
    });

    it("deve retornar 400 quando faltar campos obrigatorios", async () => {
      const medicoIncompleto = {
        nome: "Dr. Incompleto",
        email: "incompleto@clinica.com",
      };

      const response = await request(app)
        .post("/api/medicos")
        .send(medicoIncompleto);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Nome, CRM e email devem ser informados."
      );
    });

    it("deve retornar 400 para CRM invalido", async () => {
      const medicoCrmInvalido = {
        nome: "Dr. CRM Invalido",
        crm: "123456",
        email: "crm.invalido@clinica.com",
      };

      const response = await request(app)
        .post("/api/medicos")
        .send(medicoCrmInvalido);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "CRM invalido. Utilize o formato 00000-UF."
      );
    });

    it("deve retornar 400 para email invalido", async () => {
      const medicoEmailInvalido = {
        nome: "Dr. Email Invalido",
        crm: "55555-SP",
        email: "email-invalido",
      };

      const response = await request(app)
        .post("/api/medicos")
        .send(medicoEmailInvalido);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email invalido.");
    });

    it("deve retornar 400 quando CRM ja existir", async () => {
      const medicoDuplicado = {
        nome: "Dr. CRM Repetido",
        crm: "12345-SP",
        email: "crm.repetido@clinica.com",
      };

      const response = await request(app)
        .post("/api/medicos")
        .send(medicoDuplicado);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Ja existe medico com este CRM.");
    });

    it("deve retornar 400 quando email ja existir", async () => {
      const medicoDuplicado = {
        nome: "Dr. Email Repetido",
        crm: "98765-SP",
        email: "carlos.oliveira@clinica.com",
      };

      const response = await request(app)
        .post("/api/medicos")
        .send(medicoDuplicado);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Ja existe medico com este email.");
    });
  });

  describe("GET /api/medicos", () => {
    it("deve listar medicos cadastrados", async () => {
      const response = await request(app).get("/api/medicos");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("PUT /api/medicos/:id", () => {
    it("deve atualizar dados de um medico", async () => {
      const atualizacao = {
        nome: "Dr. Carlos Oliveira Junior",
        crm: "12345-SP",
        email: "carlos.oliveira@clinica.com",
      };

      const response = await request(app)
        .put("/api/medicos/1")
        .send(atualizacao);

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("Dr. Carlos Oliveira Junior");
      expect(response.body.crm).toBe("12345-SP");
      expect(response.body.email).toBe("carlos.oliveira@clinica.com");
    });

    it("deve retornar 400 ao tentar atualizar com CRM existente de outro medico", async () => {
      const atualizacao = {
        nome: "Dr. Carlos Oliveira",
        crm: "67890-RJ",
        email: "novo.crm@clinica.com",
      };

      const response = await request(app)
        .put("/api/medicos/1")
        .send(atualizacao);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Ja existe medico com este CRM.");
    });

    it("deve retornar 400 ao tentar atualizar com email existente de outro medico", async () => {
      const atualizacao = {
        nome: "Dr. Carlos Oliveira",
        crm: "12345-SP",
        email: "sofia.martins@clinica.com",
      };

      const response = await request(app)
        .put("/api/medicos/1")
        .send(atualizacao);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Ja existe medico com este email.");
    });

    it("deve retornar 404 para medico inexistente", async () => {
      const atualizacao = {
        nome: "Dr. Inexistente",
        crm: "33333-SP",
        email: "medico.inexistente@clinica.com",
      };

      const response = await request(app)
        .put("/api/medicos/99999")
        .send(atualizacao);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Medico nao encontrado.");
    });
  });

  describe("DELETE /api/medicos/:id", () => {
    it("deve remover um medico com sucesso", async () => {
      const novoMedico = {
        nome: "Dr. Para Remocao",
        crm: "88888-MG",
        email: "remover.medico@clinica.com",
      };

      const criado = await request(app)
        .post("/api/medicos")
        .send(novoMedico);

      const response = await request(app).delete(
        `/api/medicos/${criado.body.id}`
      );

      expect(response.status).toBe(204);
    });

    it("deve retornar 404 quando medico nao existe", async () => {
      const response = await request(app).delete("/api/medicos/99999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Medico nao encontrado.");
    });
  });
});
