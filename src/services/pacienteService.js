import * as pacienteModel from "../models/pacientesModel.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CPF_DIGITS_REGEX = /^\d{11}$/;

function normalizeCpf(cpf) {
  return (cpf || "").replace(/\D/g, "");
}

function formatCpf(cpfDigits) {
  return `${cpfDigits.slice(0, 3)}.${cpfDigits.slice(3, 6)}.${cpfDigits.slice(
    6,
    9
  )}-${cpfDigits.slice(9)}`;
}

function ensureRequiredFields(dados) {
  const required = ["nome", "cpf", "data_nascimento", "telefone", "email"];
  const missing = required.filter(
    (campo) => dados[campo] === undefined || dados[campo] === null
  );

  if (missing.length > 0) {
    throw new Error("Todos os campos obrigatorios devem ser informados.");
  }
}

function validarCamposComuns({ nome, telefone }) {
  if (!String(nome).trim()) {
    throw new Error("Nome nao pode ser vazio.");
  }

  if (!String(telefone).trim()) {
    throw new Error("Telefone nao pode ser vazio.");
  }
}

function validarEmail(email) {
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Email invalido.");
  }
}

function validarDataNascimento(data_nascimento) {
  const data = new Date(data_nascimento);
  const agora = new Date();

  if (Number.isNaN(data.getTime())) {
    throw new Error("Data de nascimento invalida.");
  }

  const hojeSemHoras = new Date(
    agora.getFullYear(),
    agora.getMonth(),
    agora.getDate()
  );

  if (data > hojeSemHoras) {
    throw new Error("Data de nascimento nao pode ser futura.");
  }
}

function validarCpf(cpf) {
  const cpfDigits = normalizeCpf(cpf);

  if (!CPF_DIGITS_REGEX.test(cpfDigits)) {
    throw new Error("CPF invalido. Informe 11 digitos.");
  }

  return cpfDigits;
}

export async function listar() {
  return pacienteModel.getPacientes();
}

export async function criar({
  nome,
  cpf,
  data_nascimento,
  telefone,
  email,
}) {
  ensureRequiredFields({ nome, cpf, data_nascimento, telefone, email });
  validarCamposComuns({ nome, telefone });
  validarEmail(email);
  validarDataNascimento(data_nascimento);
  const cpfDigits = validarCpf(cpf);

  const cpfExistente = await pacienteModel.findByCpfDigits(cpfDigits);
  if (cpfExistente) {
    throw new Error("Ja existe paciente com este CPF.");
  }

  const emailExistente = await pacienteModel.findByEmail(email);
  if (emailExistente) {
    throw new Error("Ja existe paciente com este email.");
  }

  const cpfFormatado = formatCpf(cpfDigits);

  return pacienteModel.addPaciente({
    nome: nome.trim(),
    cpf: cpfFormatado,
    data_nascimento,
    telefone: telefone.trim(),
    email: email.trim(),
  });
}

export async function buscarPorId(id) {
  const paciente = await pacienteModel.findById(id);
  if (!paciente) {
    throw new Error("Paciente nao encontrado.");
  }
  return paciente;
}

export async function atualizar(id, dadosRecebidos) {
  if (!id) {
    throw new Error("ID do paciente deve ser informado.");
  }

  const pacienteAtual = await pacienteModel.findById(id);
  if (!pacienteAtual) {
    throw new Error("Paciente nao encontrado.");
  }

  const dadosNormalizados = {
    nome:
      dadosRecebidos.nome !== undefined
        ? dadosRecebidos.nome
        : pacienteAtual.nome,
    telefone:
      dadosRecebidos.telefone !== undefined
        ? dadosRecebidos.telefone
        : pacienteAtual.telefone,
    data_nascimento:
      dadosRecebidos.data_nascimento !== undefined
        ? dadosRecebidos.data_nascimento
        : pacienteAtual.data_nascimento,
    email:
      dadosRecebidos.email !== undefined
        ? dadosRecebidos.email
        : pacienteAtual.email,
    cpf:
      dadosRecebidos.cpf !== undefined ? dadosRecebidos.cpf : pacienteAtual.cpf,
  };

  ensureRequiredFields(dadosNormalizados);
  validarCamposComuns(dadosNormalizados);
  validarEmail(dadosNormalizados.email);
  validarDataNascimento(dadosNormalizados.data_nascimento);
  const cpfDigits = validarCpf(dadosNormalizados.cpf);

  const pacienteMesmoCpf = await pacienteModel.findByCpfDigits(cpfDigits);
  if (pacienteMesmoCpf && pacienteMesmoCpf.id !== Number(id)) {
    throw new Error("Ja existe paciente com este CPF.");
  }

  const pacienteMesmoEmail = await pacienteModel.findByEmail(
    dadosNormalizados.email
  );
  if (pacienteMesmoEmail && pacienteMesmoEmail.id !== Number(id)) {
    throw new Error("Ja existe paciente com este email.");
  }

  const sucesso = await pacienteModel.updatePaciente(Number(id), {
    nome: dadosNormalizados.nome.trim(),
    telefone: dadosNormalizados.telefone.trim(),
    data_nascimento: dadosNormalizados.data_nascimento,
    email: dadosNormalizados.email.trim(),
    cpf: formatCpf(cpfDigits),
  });

  if (!sucesso) {
    throw new Error("Nao foi possivel atualizar paciente.");
  }

  return pacienteModel.findById(id);
}

export async function remover(id) {
  if (!id) {
    throw new Error("ID do paciente deve ser informado.");
  }

  const pacienteAtual = await pacienteModel.findById(id);
  if (!pacienteAtual) {
    throw new Error("Paciente nao encontrado.");
  }

  const sucesso = await pacienteModel.deletePaciente(Number(id));
  if (!sucesso) {
    throw new Error("Nao foi possivel remover paciente.");
  }
}
