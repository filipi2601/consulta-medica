import express from 'express';
import pacientesRoutes from './src/routes/pacientesRoutes.js';

const app = express();
app.use(express.json());

// Rota de pacientes
app.use('/api/pacientes', pacientesRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('Servidor e banco de dados conectados com sucesso ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
