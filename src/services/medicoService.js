import * as medicosModel from "../models/medicosModel.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CRM_REGEX = /^[0-9]{4,6}-[A-Za-z]{2}$/;

function ensureRequiredFields(dados) {
  const required = ["nome", "crm", "email"];
  const missing = required.filter(
    (campo) => dados[campo] === undefined || dados[campo] === null
  );

  if (missing.length > 0) {
    throw new Error("Nome, CRM e email devem ser informados.");
  }
}

function validarNome(nome) {
  if (!String(nome).trim()) {
    throw new Error("Nome nao pode ser vazio.");
  }
}

function validarEmail(email) {
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("Email invalido.");
  }
}

function validarCrm(crm) {
  const crmNormalizado = String(crm).trim().toUpperCase();

  if (!CRM_REGEX.test(crmNormalizado)) {
    throw new Error("CRM invalido. Utilize o formato 00000-UF.");
  }

  return crmNormalizado;
}

export async function listar() {
  return medicosModel.getMedicos();
}

export async function criar({ nome, crm, email }) {
  ensureRequiredFields({ nome, crm, email });
  validarNome(nome);
  validarEmail(email);
  const crmNormalizado = validarCrm(crm);

  const crmExistente = await medicosModel.findByCrm(crmNormalizado);
  if (crmExistente) {
    throw new Error("Ja existe medico com este CRM.");
  }

  const emailExistente = await medicosModel.findByEmail(email);
  if (emailExistente) {
    throw new Error("Ja existe medico com este email.");
  }

  return medicosModel.addMedico({
    nome: nome.trim(),
    crm: crmNormalizado,
    email: email.trim(),
  });
}

export async function buscarPorId(id) {
  const medico = await medicosModel.findById(id);
  if (!medico) {
    throw new Error("Medico nao encontrado.");
  }
  return medico;
}

export async function atualizar(id, dadosRecebidos) {
  if (!id) {
    throw new Error("ID do medico deve ser informado.");
  }

  const medicoAtual = await medicosModel.findById(id);
  if (!medicoAtual) {
    throw new Error("Medico nao encontrado.");
  }

  const dadosNormalizados = {
    nome:
      dadosRecebidos.nome !== undefined
        ? dadosRecebidos.nome
        : medicoAtual.nome,
    crm:
      dadosRecebidos.crm !== undefined ? dadosRecebidos.crm : medicoAtual.crm,
    email:
      dadosRecebidos.email !== undefined
        ? dadosRecebidos.email
        : medicoAtual.email,
  };

  ensureRequiredFields(dadosNormalizados);
  validarNome(dadosNormalizados.nome);
  validarEmail(dadosNormalizados.email);
  const crmNormalizado = validarCrm(dadosNormalizados.crm);

  const medicoMesmoCrm = await medicosModel.findByCrm(crmNormalizado);
  if (medicoMesmoCrm && medicoMesmoCrm.id !== Number(id)) {
    throw new Error("Ja existe medico com este CRM.");
  }

  const medicoMesmoEmail = await medicosModel.findByEmail(
    dadosNormalizados.email
  );
  if (medicoMesmoEmail && medicoMesmoEmail.id !== Number(id)) {
    throw new Error("Ja existe medico com este email.");
  }

  const sucesso = await medicosModel.updateMedico(Number(id), {
    nome: dadosNormalizados.nome.trim(),
    crm: crmNormalizado,
    email: dadosNormalizados.email.trim(),
  });

  if (!sucesso) {
    throw new Error("Nao foi possivel atualizar medico.");
  }

  return medicosModel.findById(id);
}

export async function remover(id) {
  if (!id) {
    throw new Error("ID do medico deve ser informado.");
  }

  const medicoAtual = await medicosModel.findById(id);
  if (!medicoAtual) {
    throw new Error("Medico nao encontrado.");
  }

  const sucesso = await medicosModel.deleteMedico(Number(id));
  if (!sucesso) {
    throw new Error("Nao foi possivel remover medico.");
  }
}
