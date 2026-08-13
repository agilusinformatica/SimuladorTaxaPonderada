const express = require('express');
const path = require('path');
const cors = require('cors');
const { simulate, getRefinOptions, findIdealRefinRate, simulateAll } = require('./simulator.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint for getting refin range rates & table options
app.get('/api/refin-range', (req, res) => {
    try {
        //let minRefinRate = 0.0080;
        const { convenio, comSeguro } = req.query;
        if (!convenio) {
            return res.status(400).json({ error: "Missing required parameter: convenio" });
        }
        const options = getRefinOptions(convenio, comSeguro/*, minRefinRate*/);
        res.json(options);
    } catch (error) {
        console.error("Error fetching refin range:", error);
        res.status(500).json({ error: "Erro ao buscar intervalo de taxas de refinanciamento." });
    }
});

// Helper for parsing simulation request body
function parseSimulationInputs(reqBody) {
    const inputs = { ...reqBody };

    if (!inputs.convenio || !inputs.produto || !inputs.dataContrato || !inputs.primeiroVencimento) {
        throw new Error("Missing required inputs (convenio, produto, dataContrato, primeiroVencimento)");
    }

    inputs.prazoRefin = parseInt(inputs.prazoRefin) || 120;
    inputs.pmtRefin = parseFloat(inputs.pmtRefin) || 0;

    // Preserve taxaRefin string if it's a label (e.g. "Tabela Refin 7") or parse float
    if (typeof inputs.taxaRefin === 'string' && inputs.taxaRefin.includes("Tabela")) {
        // Keep string
    } else {
        inputs.taxaRefin = parseFloat(inputs.taxaRefin) || 0;
        if (inputs.taxaRefin > 1.0) {
            inputs.taxaRefin = inputs.taxaRefin / 100.0;
        }
    }

    if (!Array.isArray(inputs.contracts)) {
        inputs.contracts = [];
    }

    while (inputs.contracts.length < 4) {
        inputs.contracts.push({ saldo: 0, prazo: 0, pmt: 0 });
    }

    inputs.contracts = inputs.contracts.map(c => ({
        saldo: parseFloat(c.saldo) || 0,
        prazo: parseInt(c.prazo) || 0,
        pmt: parseFloat(c.pmt) || 0
    }));

    if (inputs.dataNascimento) {
        inputs.dataNascimento = String(inputs.dataNascimento).trim();
    }

    return inputs;
}

// API endpoint for simulation
app.post('/api/simulate', (req, res) => {
    try {
        const inputs = parseSimulationInputs(req.body);

        // inputs.alternativeRates = { "Siape": { min: 0.0150, max: 0.018 } }
        // inputs.comissionsAdded = { "Siape": [{ "limit_s_seg": 0.0150, "limit_c_seg": 0.0150, "table": "Tabela 1", "rate": 0.005 }] }

        const results = simulate(inputs);

        delete results.theoreticalK3;
        delete results.d3;
        delete results.trocos;

        res.json(results);

    } catch (error) {
        console.error("Simulation error:", error);
        res.status(500).json({ error: error.message || "Erro interno no cálculo da simulação. Verifique os dados inseridos." });
    }
});

// API endpoint for simulating all refin options
app.post('/api/simulate-all', (req, res) => {
    try {
        const inputs = parseSimulationInputs(req.body);
        const results = simulateAll(inputs);

        const cleanedResults = results.map(item => {
            const sim = { ...item.simulation };
            delete sim.theoreticalK3;
            delete sim.d3;
            delete sim.trocos;
            return {
                ...item,
                simulation: sim
            };
        });

        res.json(cleanedResults);

    } catch (error) {
        console.error("Simulate all options error:", error);
        res.status(500).json({ error: error.message || "Erro ao simular todas as opções de refin." });
    }
});

// API endpoint for EncontrarTaxaIdeal button macro
app.post('/api/find-ideal-rate', (req, res) => {
    try {
        const inputs = parseSimulationInputs(req.body);
        const bestOption = findIdealRefinRate(inputs);

        if (!bestOption) {
            return res.status(404).json({ error: "Nenhuma taxa disponível supera a taxa mínima do convênio." });
        }

        delete bestOption.simulation.theoreticalK3;
        delete bestOption.simulation.d3;
        delete bestOption.simulation.trocos;

        res.json(bestOption);

    } catch (error) {
        console.error("Ideal rate calculation error:", error);
        res.status(500).json({ error: error.message || "Erro ao calcular taxa ideal." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
