#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { simulate, CONVENIO_DE_X_PARA } = require('./simulator.js');

// Help message
function showHelp() {
    console.log(`
Uso:
  node cli.js [opções]
  node cli.js --file <caminho_para_arquivo.json>

Opções:
  --convenio <nome>        Convênio (ex: "SEPLAG MG", "INSS", "PMMG")
  --comSeguro <Sim|Não>    Indica se inclui seguro (padrão: "Não")
  --dataContrato <data>    Data do contrato YYYY-MM-DD (padrão: hoje)
  --primeiroVenc <data>    Primeiro vencimento YYYY-MM-DD (padrão: 45 dias a partir do contrato)
  --prazoRefin <meses>     Prazo do Refinanciamento (padrão: 120)
  --taxaRefin <decimal>    Taxa do Refin (ex: 0.0225 para 2.25%)
  --pmtRefin <valor>       Valor da parcela do Refin (padrão: 3000)
  
Contratos Portados (você pode informar até 4 contratos no formato C_k:saldo,prazo,pmt):
  --c1 <saldo,prazo,pmt>   Dados do Contrato 1 separados por vírgula (ex: 80000,50,3000)
  --c2 <saldo,prazo,pmt>   Dados do Contrato 2
  --c3 <saldo,prazo,pmt>   Dados do Contrato 3
  --c4 <saldo,prazo,pmt>   Dados do Contrato 4

Exemplos:
  node cli.js --convenio "SEPLAG MG" --taxaRefin 0.0225 --pmtRefin 3000 --c1 80000,50,3000
  node cli.js --file inputs_exemplo.json
    `);
}

// Parse command line arguments
function parseArgs() {
    const args = process.argv.slice(2);
    const parsed = {};
    
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].slice(2);
            const val = args[i + 1];
            if (val && !val.startsWith('--')) {
                parsed[key] = val;
                i++;
            } else {
                parsed[key] = true;
            }
        }
    }
    return parsed;
}

// Helper to parse contract arg
function parseContract(str) {
    if (!str) return { saldo: 0, prazo: 0, pmt: 0 };
    const parts = str.split(',').map(Number);
    return {
        saldo: parts[0] || 0,
        prazo: parts[1] || 0,
        pmt: parts[2] || 0
    };
}

function run() {
    const options = parseArgs();
    
    if (options.help || options.h) {
        showHelp();
        process.exit(0);
    }
    
    let inputs = {};
    
    // Check if JSON file is provided
    if (options.file) {
        try {
            const filePath = path.resolve(options.file);
            const data = fs.readFileSync(filePath, 'utf8');
            inputs = JSON.parse(data);
        } catch (error) {
            console.error("Erro ao ler o arquivo JSON:", error.message);
            process.exit(1);
        }
    } else {
        // Fallback to manual args or default example
        const conveniosDisponiveis = Object.keys(CONVENIO_DE_X_PARA);
        
        inputs = {
            convenio: options.convenio || "SEPLAG MG",
            produto: "Refin da Port",
            comSeguro: options.comSeguro || "Não",
            dataContrato: options.dataContrato || new Date().toISOString().slice(0, 10),
            prazoRefin: parseInt(options.prazoRefin) || 120,
            taxaRefin: parseFloat(options.taxaRefin) || 0.0225,
            pmtRefin: parseFloat(options.pmtRefin) || 3000,
            contracts: [
                parseContract(options.c1 || "80000,50,3000"),
                parseContract(options.c2 || "0,0,0"),
                parseContract(options.c3 || "0,0,0"),
                parseContract(options.c4 || "0,0,0")
            ]
        };
        
        // Calculate default primeiroVencimento as dataContrato + 45 days if not provided
        if (options.primeiroVenc) {
            inputs.primeiroVencimento = options.primeiroVenc;
        } else {
            const d = new Date(inputs.dataContrato + 'T00:00:00');
            d.setDate(d.getDate() + 45);
            inputs.primeiroVencimento = d.toISOString().slice(0, 10);
        }
    }
    
    // Print inputs
    console.log("\n=== DADOS DE ENTRADA ===");
    console.log(`Convênio:             ${inputs.convenio}`);
    console.log(`Com Seguro:           ${inputs.comSeguro}`);
    console.log(`Data Contrato:        ${inputs.dataContrato}`);
    console.log(`Primeiro Vencimento:  ${inputs.primeiroVencimento}`);
    console.log(`Prazo Refin:          ${inputs.prazoRefin} meses`);
    console.log(`Taxa Refin:           ${(inputs.taxaRefin * 100).toFixed(4)}%`);
    console.log(`PMT Refin:            R$ ${inputs.pmtRefin.toFixed(2)}`);
    console.log("Contratos Portados:");
    inputs.contracts.forEach((c, i) => {
        if (c.saldo > 0) {
            console.log(`  Contrato ${i+1}: Saldo R$ ${c.saldo.toFixed(2)} | Prazo ${c.prazo} meses | PMT R$ ${c.pmt.toFixed(2)}`);
        }
    });
    
    // Run simulation
    const results = simulate(inputs);
    
    // Print results
    console.log("\n=== RESULTADOS DE SAÍDA ===");
    console.log(`Troco:                R$ ${results.troco.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
    console.log(`Taxa Ponderada:       ${(results.taxaPonderada * 100).toFixed(2)}% (${(results.taxaPonderada * 100).toFixed(2)}% a.m.)`);
    console.log(`Taxa Ponderada Mín:   ${(results.minRate * 100).toFixed(2)}%`);
    console.log(`Taxa Ponderada Máx:   ${(results.maxRate * 100).toFixed(2)}%`);
    console.log(`Parecer:              ${results.parecer}`);
    console.log(`Comissão:             ${results.comissaoTableText || "Sem comissionamento"}`);
    if (results.comissaoRate > 0) {
        console.log(`Alíquota Comissão:    ${(results.comissaoRate * 100).toFixed(2)}%`);
    }
    console.log(`Total IOF:            R$ ${results.totalIof.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log(`Total Seguro:         R$ ${results.totalSeguro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    console.log("===========================\n");
}

run();
