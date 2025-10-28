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

describe("Pacientes API", () => {
  describe("POST /api/pacientes", () => {
    it("deve criar um paciente com sucesso", async () => {
      const novoPaciente = {
        nome: "Fernanda Lima",
        cpf: "66666666666",
        data_nascimento: "1992-09-10",
        telefone: "(11) 96666-6666",
        email: "fernanda.lima@email.com",
      };

      const response = await request(app)
        .post("/api/pacientes")
        .send(novoPaciente);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        nome: "Fernanda Lima",
        cpf: "666.666.666-66",
        data_nascimento: "1992-09-10",
        telefone: "(11) 96666-6666",
        email: "fernanda.lima@email.com",
      });
      expect(response.body).toHaveProperty("id");
    });

    it("deve retornar 400 quando falta campo obrigatorio", async () => {
      const pacienteIncompleto = {
        nome: "Joao Falcao",
        cpf: "77777777777",
        data_nascimento: "1980-01-01",
        telefone: "(11) 97777-7777",
      };

      const response = await request(app)
        .post("/api/pacientes")
        .send(pacienteIncompleto);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Todos os campos obrigatorios devem ser informados."
      );
    });

    it("deve retornar 400 para CPF invalido", async () => {
      const pacienteCpfInvalido = {
        nome: "Jose Invalido",
        cpf: "1234567890",
        data_nascimento: "1980-01-01",
        telefone: "(11) 98888-8888",
        email: "jose.invalido@email.com",
      };

      const response = await request(app)
        .post("/api/pacientes")
        .send(pacienteCpfInvalido);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "CPF invalido. Informe 11 digitos."
      );
    });

    it("deve retornar 400 para data de nascimento futura", async () => {
      const pacienteDataFutura = {
        nome: "Lucas Futuro",
        cpf: "88888888888",
        data_nascimento: "2999-01-01",
        telefone: "(11) 98888-9999",
        email: "lucas.futuro@email.com",
      };

      const response = await request(app)
        .post("/api/pacientes")
        .send(pacienteDataFutura);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Data de nascimento nao pode ser futura."
      );
    });

    it("deve retornar 400 quando CPF ja existir", async () => {
      const pacienteDuplicado = {
        nome: "Novo Paciente",
        cpf: "111.111.111-11",
        data_nascimento: "1999-03-03",
        telefone: "(11) 90000-0000",
        email: "novo.paciente@email.com",
      };

      const response = await request(app)
        .post("/api/pacientes")
        .send(pacienteDuplicado);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Ja existe paciente com este CPF."
      );
    });

    it("deve retornar 400 quando email ja existir", async () => {
      const pacienteDuplicado = {
        nome: "Email Duplicado",
        cpf: "99999999999",
        data_nascimento: "1999-03-03",
        telefone: "(11) 97777-7777",
        email: "ana.silva@email.com",
      };

      const response = await request(app)
        .post("/api/pacientes")
        .send(pacienteDuplicado);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        "Ja existe paciente com este email."
      );
    });
  });

  describe("GET /api/pacientes", () => {
    it("deve listar os pacientes existentes", async () => {
      const response = await request(app).get("/api/pacientes");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe("PUT /api/pacientes/:id", () => {
    it("deve atualizar os dados de um paciente", async () => {
      const atualizacao = {
        nome: "Ana Silva Atualizada",
        cpf: "11111111111",
        data_nascimento: "1990-05-15",
        telefone: "(11) 90000-0001",
        email: "ana.silva@atualizado.com",
      };

      const response = await request(app)
        .put("/api/pacientes/1")
        .send(atualizacao);

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe("Ana Silva Atualizada");
      expect(response.body.telefone).toBe("(11) 90000-0001");
      expect(response.body.cpf).toBe("111.111.111-11");
      expect(response.body.email).toBe("ana.silva@atualizado.com");
    });

    it("deve retornar 400 quando atualizar com email existente", async () => {
      const atualizacao = {
        nome: "Paciente Email Duplicado",
        cpf: "222.222.222-22",
        data_nascimento: "1985-02-20",
        telefone: "(11) 95555-5555",
        email: "ana.silva@email.com",
      };

      const response = await request(app)
        .put("/api/pacientes/2")
        .send(atualizacao);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Ja existe paciente com este email.");
    });

    it("deve retornar 404 para paciente inexistente", async () => {
      const atualizacao = {
        nome: "Paciente Inexistente",
        cpf: "12312312311",
        data_nascimento: "1990-01-01",
        telefone: "(11) 98888-1111",
        email: "paciente.inexistente@email.com",
      };

      const response = await request(app)
        .put("/api/pacientes/99999")
        .send(atualizacao);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Paciente nao encontrado.");
    });
  });

  describe("DELETE /api/pacientes/:id", () => {
    it("deve remover um paciente com sucesso", async () => {
      const novoPaciente = {
        nome: "Paciente Para Remocao",
        cpf: "77777777770",
        data_nascimento: "1990-01-01",
        telefone: "(11) 95555-0000",
        email: "remover@email.com",
      };

      const criado = await request(app)
        .post("/api/pacientes")
        .send(novoPaciente);

      const response = await request(app).delete(
        `/api/pacientes/${criado.body.id}`
      );

      expect(response.status).toBe(204);
    });

    it("deve retornar 404 quando paciente nao existe", async () => {
      const response = await request(app).delete("/api/pacientes/99999");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Paciente nao encontrado.");
    });
  });
});
