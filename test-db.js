// test-db.js
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// carrega o .env
dotenv.config({ path: './.env' });

// função principal
async function testarConexao() {
  try {
    // cria conexão com base nas variáveis do .env
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
    });

    // executa uma query simples
    const [rows] = await connection.query('SELECT NOW() AS data');
    console.log('✅ Conexão bem-sucedida!');
    console.log('🕓 Data/hora do MySQL:', rows[0].data);

    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao conectar:', error.message);
  }
}

// executa a função
testarConexao();
