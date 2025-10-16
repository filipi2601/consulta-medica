import express from 'express';
import pacientesRoutes from './src/routes/pacientesRoutes.js';

const app = express();
app.use(express.json());

app.use('/api/pacientes', pacientesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));
