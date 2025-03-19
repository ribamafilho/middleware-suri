require('dotenv').config();
const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

const API_URL = 'https://api-sgf-gateway.triersistemas.com.br/sgfpod1';
const API_KEY = process.env.API_KEY;

// Middleware de autenticação
const autenticar = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || token !== `Bearer ${API_KEY}`) {
        return res.status(403).json({ erro: 'Acesso negado' });
    }
    next();
};

// Endpoint para buscar um produto por ID
app.get('/produto/:id', autenticar, async (req, res) => {
    try {
        const response = await axios.get(`${API_URL}/produtos/${req.params.id}`, {
            headers: { Authorization: `Bearer ${API_KEY}` }
        });
        res.json({
            id: response.data.id,
            nome: response.data.nome,
            descricao: response.data.descricao,
            preco: response.data.preco
        });
    } catch (error) {
        res.status(500).json({ erro: 'Erro ao buscar produto' });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
