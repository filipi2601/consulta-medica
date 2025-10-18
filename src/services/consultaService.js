import * as consultaModel from '../models/consultasModel.js';

export async function agendar(idPaciente, idMedico, dataAgendamento) {
  
  if (!idPaciente || !idMedico || !dataAgendamento) {
    throw new Error('ID do Paciente, ID do Médico e Data de Agendamento são obrigatórios.');
  }

  const agora = new Date();
  const dataDaConsulta = new Date(dataAgendamento);

  if (dataDaConsulta < agora) {
    throw new Error('Não é possível agendar consultas em datas ou horários passados.');
  }
  
  const conflitoPaciente = await consultaModel.findByPacienteAndHorario(idPaciente, dataAgendamento);
  if (conflitoPaciente) {
    throw new Error('O paciente já possui uma consulta agendada neste intervalo de horário.');
  }

  const conflitoMedico = await consultaModel.findByMedicoAndHorario(idMedico, dataAgendamento);
  if (conflitoMedico) {
    throw new Error('O médico não está disponível neste intervalo de horário.');
  }

  const novaConsultaId = await consultaModel.create({
    idPaciente,
    idMedico,
    data_agendamentoConsulta: dataAgendamento
  });

  return consultaModel.findById(novaConsultaId);
}

export async function listarTodas() {
  return consultaModel.findAll();
}

export async function buscarPorId(id) {
  const consulta = await consultaModel.findById(id);
  
  if (!consulta) {
    throw new Error('Consulta não encontrada.');
  }
  
  return consulta;
}

export async function atualizar(id, dadosParaAtualizar) {
  const consultaExistente = await consultaModel.findById(id);
  if (!consultaExistente) {
    throw new Error('Consulta não encontrada para atualizar.');
  }

  const sucesso = await consultaModel.update(id, dadosParaAtualizar);

  if (!sucesso) {
    throw new Error('Não foi possível atualizar a consulta.');
  }

  return consultaModel.findById(id);
}

export async function cancelar(id) {
  const consultaExistente = await consultaModel.findById(id);
  if (!consultaExistente) {
    throw new Error('Consulta não encontrada para cancelar.');
  }

  const sucesso = await consultaModel.remove(id);

  if (!sucesso) {
    throw new Error('Não foi possível cancelar a consulta.');
  }
}