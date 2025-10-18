import express from 'express';
import pacientesRoutes from './routes/pacientesRoutes.js';
import consultaRoutes from './routes/consultasRoutes.js';
import { connectDB } from './config/db.js';

const app = express();
app.use(express.json());
app.use('/api/consultas', consultaRoutes);
app.use('/api/pacientes', pacientesRoutes);

app.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    await db.query('SELECT 1'); 
    res.send('Servidor e banco de dados conectados com sucesso ✅');
  } catch (error) {
    console.error('Erro ao conectar com o banco:', error);
    res.status(500).send('Servidor no ar, mas FALHA ao conectar com o banco de dados ❌');
  }
});

export default app;