import request from 'supertest';
import app from '../app.js'; 
import { connectDB } from '../config/db.js';
import fs from 'fs';
import path from 'path';

const schemaSql = fs.readFileSync(path.resolve('./src/database/schema.sql'), 'utf8');
const testSeedSql = fs.readFileSync(path.resolve('./src/database/seedTest.sql'), 'utf8');

let db;

beforeAll(async () => {
  db = await connectDB();
});

beforeEach(async () => {
  const schemaCommands = schemaSql
    .split(';') 
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0);

  for (const command of schemaCommands) {
    try {
      await db.query(command);
    } catch (error) {
      
      console.error(`Erro ao executar comando do schema: ${command}\n`, error);
      throw error; 
    }
  }

  const seedCommands = testSeedSql
    .split(';')
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0);

  for (const command of seedCommands) {
    try {
      await db.query(command);
    } catch (error) {
      console.error(`Erro ao executar comando do seed: ${command}\n`, error);
      throw error;
    }
  }
});

afterAll(async () => {
  await db.end();
});

describe('Testes de Integração do CRUD de Consultas (/api/consultas)', () => {

  describe('POST /api/consultas (Agendar)', () => {

    it('deve agendar uma consulta com sucesso (status 201)', async () => {
      const novaConsulta = {
        id_paciente: 1,
        id_medico: 1,
        data_agendamento: '2030-10-25T10:00:00'
      };

      const response = await request(app)
        .post('/api/consultas')
        .send(novaConsulta);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.nome_paciente).toBe('Ana Silva');
      expect(response.body.nome_medico).toBe('Dr. Carlos Oliveira');
    });

    it('deve retornar erro 400 se faltar o id_medico', async () => {
      const consultaInvalida = {
        id_paciente: 1,
        data_agendamento: '2030-10-25T11:00:00'
      };

      const response = await request(app)
        .post('/api/consultas')
        .send(consultaInvalida);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('ID do Paciente, ID do Médico e Data de Agendamento são obrigatórios.');
    });

    it('deve retornar erro 400 ao tentar agendar no passado', async () => {
      const consultaInvalida = {
        id_paciente: 1,
        id_medico: 1,
        data_agendamento: '2001-01-01T10:00:00'
      };

      const response = await request(app)
        .post('/api/consultas')
        .send(consultaInvalida);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Não é possível agendar consultas em datas ou horários passados.');
    });

    it('deve retornar erro 400 ao tentar agendar em horário de médico ocupado', async () => {
      const consulta1 = {
        id_paciente: 1, 
        id_medico: 2,
        data_agendamento: '2030-11-01T10:00:00'
      };
      await request(app).post('/api/consultas').send(consulta1);

      const consultaConflitante = {
        id_paciente: 2,
        id_medico: 2,
        data_agendamento: '2030-11-01T10:30:00'
      };

      const response = await request(app)
        .post('/api/consultas')
        .send(consultaConflitante);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('O médico não está disponível neste intervalo de horário.');
    });

    it('deve retornar erro 400 ao tentar agendar em horário de paciente ocupado', async () => {
      const consulta1 = {
        id_paciente: 3,
        id_medico: 3,
        data_agendamento: '2030-12-01T14:00:00'
      };
      await request(app).post('/api/consultas').send(consulta1);

      const consultaConflitante = {
        id_paciente: 3,
        id_medico: 4,
        data_agendamento: '2030-12-01T14:00:00'
      };

      const response = await request(app)
        .post('/api/consultas')
        .send(consultaConflitante);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('O paciente já possui uma consulta agendada neste intervalo de horário.');
    });
  });

  describe('GET /api/consultas/:id (Buscar por ID)', () => {

    it('deve retornar erro 404 para um ID que não existe', async () => {
      const response = await request(app)
        .get('/api/consultas/99999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Consulta não encontrada.');
    });

    it('deve retornar uma consulta específica com sucesso (status 200)', async () => {
      const consultaAgendada = {
        id_paciente: 1, 
        id_medico: 1,
        data_agendamento: '2030-10-25T10:00:00'
      };
      await request(app).post('/api/consultas').send(consultaAgendada);

      const response = await request(app)
        .get('/api/consultas/1');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.nome_paciente).toBe('Ana Silva');
    });
  });
  
  describe('GET /api/consultas', () => {

    it('deve retornar uma lista vazia quando não há consultas (status 200)', async () => {
      const response = await request(app).get('/api/consultas');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('deve retornar todas as consultas agendadas (status 200)', async () => {
      const consulta1 = { id_paciente: 1, id_medico: 1, data_agendamento: '2030-01-01T10:00:00' };
      const consulta2 = { id_paciente: 2, id_medico: 2, data_agendamento: '2030-01-02T11:00:00' };
      await request(app).post('/api/consultas').send(consulta1);
      await request(app).post('/api/consultas').send(consulta2);
      
      const response = await request(app).get('/api/consultas');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].nome_paciente).toBe('Ana Silva');
      expect(response.body[1].nome_paciente).toBe('Bruno Costa');
    });
  });

  describe('PUT /api/consultas/:id', () => {

    it('deve atualizar o status de uma consulta com sucesso (status 200)', async () => {
      const consultaAgendada = { id_paciente: 1, id_medico: 1, data_agendamento: '2030-10-25T10:00:00' };
      await request(app).post('/api/consultas').send(consultaAgendada);
      
      const atualizacao = { status: 'Realizada', observacoes: 'Paciente compareceu.' };
      const response = await request(app)
        .put('/api/consultas/1')
        .send(atualizacao);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.status).toBe('Realizada');
      expect(response.body.observacoes).toBe('Paciente compareceu.');
    });

    it('deve retornar erro 404 ao tentar atualizar uma consulta que não existe', async () => {
      const atualizacao = { status: 'Realizada' };
      const response = await request(app)
        .put('/api/consultas/99999')
        .send(atualizacao);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Consulta não encontrada para atualizar.');
    });
  });

  describe('DELETE /api/consultas/:id', () => {

    it('deve cancelar (deletar) uma consulta com sucesso (status 204)', async () => {
      const consultaAgendada = { id_paciente: 1, id_medico: 1, data_agendamento: '2030-10-25T10:00:00' };
      await request(app).post('/api/consultas').send(consultaAgendada);
      
      const responseDelete = await request(app)
        .delete('/api/consultas/1');

      expect(responseDelete.status).toBe(204);
      
      const responseGet = await request(app).get('/api/consultas/1');
      expect(responseGet.status).toBe(404);
    });

    it('deve retornar erro 404 ao tentar deletar uma consulta que não existe', async () => {
      const response = await request(app)
        .delete('/api/consultas/99999');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Consulta não encontrada para cancelar.');
    });
  });
});