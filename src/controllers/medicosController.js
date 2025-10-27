import * as medicosModel from "../models/medicosModel.js";

export async function getMedicos(req, res) {
  try {
    const medicos = await medicosModel.getMedicos();
    return res.json(medicos);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function createMedico(req, res) {
  try {
    const { nome, crm, email } = req.body;
    if (!nome || !crm) {
      return res.status(400).json({ error: "nome e crm são obrigatórios" });
    }
    const medico = await medicosModel.addMedico({ nome, crm, email });
    return res.status(201).json(medico);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateMedico(req, res) {
  try {
    const id = Number(req.params.id);
    const { nome, crm, email } = req.body;
    const medico = await medicosModel.updateMedico(id, { nome, crm, email });
    return res.json(medico);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function deleteMedico(req, res) {
  try {
    const id = req.params.id;
    await medicosModel.deleteMedico(id);
    return res.status(204).send();
  } catch (err) {
    if (err) {
      return res.status(404).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message });
  }
}