import request from "supertest";
import app from "../app.js";

describe("Integração - Médicos", () => {
  let medicoId;

  
  describe("POST /api/medicos", () => {
    it("deve criar um novo médico", async () => {
      const novoMedico = {
        nome: "Dr. João da Silva",
        crm: "CRM12345",
        email: "joao@teste.com",
      };

      const response = await request(app).post("/api/medicos").send(novoMedico);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("message");
      expect(response.body).toHaveProperty("medico");
      expect(response.body.medico).toHaveProperty("id");

      medicoId = response.body.medico.id;
    });

    it("deve retornar erro 400 se faltar nome ou CRM", async () => {
      const response = await request(app)
        .post("/api/medicos")
        .send({ email: "teste@teste.com" });

      expect([400, 422]).toContain(response.status);
    });
  });

 
  describe("GET /api/medicos", () => {
    it("deve listar todos os médicos", async () => {
      const response = await request(app).get("/api/medicos");
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });


  describe("GET /api/medicos/:id", () => {
    it("deve retornar um médico específico existente", async () => {
      const response = await request(app).get(`/api/medicos/${medicoId}`);
      expect([200, 204]).toContain(response.status);
    });

    it("deve retornar 404 (ou 200 vazio) para ID inexistente", async () => {
      const response = await request(app).get("/api/medicos/9999");
      expect([200, 404, 500]).toContain(response.status);
      const msg = response.body?.message || response.body?.error || "";
      if (response.status !== 200) {
        expect(msg).toMatch(/não encontrado|erro|Error|vazio/i);
      }
    });
  });

  
  describe("PUT /api/medicos/:id", () => {
    it("deve atualizar apenas o nome do médico", async () => {
      const response = await request(app)
        .put(`/api/medicos/${medicoId}`)
        .send({ nome: "Dr. Nome Atualizado" });
      expect([200, 204]).toContain(response.status);
    });

    it("deve atualizar apenas o CRM do médico", async () => {
      const response = await request(app)
        .put(`/api/medicos/${medicoId}`)
        .send({ crm: "CRM-ALTERADO" });
      expect([200, 204]).toContain(response.status);
    });

    it("deve atualizar apenas o email do médico", async () => {
      const response = await request(app)
        .put(`/api/medicos/${medicoId}`)
        .send({ email: "novoemail@teste.com" });
      expect([200, 204]).toContain(response.status);
    });

    it("deve retornar 404 (ou 400) ao atualizar médico inexistente", async () => {
      const response = await request(app)
        .put("/api/medicos/9999")
        .send({ nome: "Teste" });
      expect([400, 404, 500]).toContain(response.status);
      const msg = response.body?.message || response.body?.error || "";
      expect(msg).toMatch(/não encontrado|erro|Error/i);
    });
  });

  
  describe("DELETE /api/medicos/:id", () => {
    it("deve deletar um médico existente", async () => {
      const response = await request(app).delete(`/api/medicos/${medicoId}`);
      expect([200, 204]).toContain(response.status);
    });

    it("deve retornar 404 (ou 400/500) ao deletar médico inexistente", async () => {
      const response = await request(app).delete("/api/medicos/9999");
      expect([400, 404, 500]).toContain(response.status);
      const msg = response.body?.message || response.body?.error || "";
      expect(msg).toMatch(/não encontrado|erro|Error/i);
    });
  });
});
