const express = require('express');
const path = require('path');
const { simulate, getRefinRange } = require('./simulator.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for getting refin range rates
app.get('/api/refin-range', (req, res) => {
    try {
        const { convenio, comSeguro } = req.query;
        if (!convenio) {
            return res.status(400).json({ error: "Missing required parameter: convenio" });
        }
        const rates = getRefinRange(convenio, comSeguro);
        // Convert to percentage values (e.g. 0.0177 -> 1.77) for the frontend dropdown
        const percentageRates = rates.map(r => Math.round(r * 10000) / 100);
        res.json(percentageRates);
    } catch (error) {
        console.error("Error fetching refin range:", error);
        res.status(500).json({ error: "Erro ao buscar intervalo de taxas de refinanciamento." });
    }
});

// API endpoint for simulation
app.post('/api/simulate', (req, res) => {
    try {
        const inputs = req.body;

        // Basic validation
        if (!inputs.convenio || !inputs.produto || !inputs.dataContrato || !inputs.primeiroVencimento) {
            return res.status(400).json({ error: "Missing required inputs (convenio, produto, dataContrato, primeiroVencimento)" });
        }

        // Parse numbers
        inputs.prazoRefin = parseInt(inputs.prazoRefin) || 120;
        inputs.taxaRefin = parseFloat(inputs.taxaRefin) || 0;
        inputs.pmtRefin = parseFloat(inputs.pmtRefin) || 0;

        if (!Array.isArray(inputs.contracts)) {
            inputs.contracts = [];
        }

        // Pad contracts array to 4 items
        while (inputs.contracts.length < 4) {
            inputs.contracts.push({ saldo: 0, prazo: 0, pmt: 0 });
        }

        // Parse contract numbers
        inputs.contracts = inputs.contracts.map(c => ({
            saldo: parseFloat(c.saldo) || 0,
            prazo: parseInt(c.prazo) || 0,
            pmt: parseFloat(c.pmt) || 0
        }));

        const results = simulate(inputs);

        delete results.theoreticalK3
        delete results.d3
        delete results.trocos

        res.json(results);

    } catch (error) {
        console.error("Simulation error:", error);
        res.status(500).json({ error: "Erro interno no cálculo da simulação. Verifique os dados inseridos." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
