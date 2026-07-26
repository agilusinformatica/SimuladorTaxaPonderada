const { simulate } = require('./simulator.js');

// Test Case 1: SEPLAG MG (v9 baseline, verified on v11)
const inputs1 = {
    convenio: "SEPLAG MG",
    produto: "Refin da Port",
    comSeguro: "Não",
    dataContrato: "2026-06-22",
    primeiroVencimento: "2026-08-07",
    prazoRefin: 120,
    taxaRefin: 0.0225,
    pmtRefin: 3000,
    contracts: [
        { saldo: 80000.0, prazo: 50, pmt: 3000.0 },
        { saldo: 0.0182, prazo: 97939.92245159789, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 }
    ]
};

console.log("RUNNING TEST CASE 1: SEPLAG MG");
const results1 = simulate(inputs1);
console.log(`Taxa Ponderada:    ${(results1.taxaPonderada * 100).toFixed(2)}% (${results1.taxaPonderada})`);
console.log(`Troco Final:       R$ ${results1.troco.toFixed(2)}`);
console.log(`Parecer:           ${results1.parecer}`);
console.log(`Comissão Tabela:   ${results1.comissaoTableText || "Nenhuma"}`);
console.log(`Taxa Ponderada matches: ${Math.abs(results1.taxaPonderada - 0.0245) < 1e-5 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results1.troco - 33053.48) < 1e-1 ? "YES" : "NO"}`);
console.log(`Parecer matches:        ${results1.parecer === "Favorável" ? "YES" : "NO"}`);

// Test Case 2: Siape (v11 default baseline)
const inputs2 = {
    convenio: "Siape",
    produto: "Refin da Port",
    comSeguro: "Não",
    dataContrato: "2026-07-09",
    primeiroVencimento: "2026-08-07",
    prazoRefin: 120,
    taxaRefin: 0.028,
    pmtRefin: 3000,
    contracts: [
        { saldo: 90000.0, prazo: 50, pmt: 3000.0 },
        { saldo: 0.0182, prazo: 97939.92245159789, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 }
    ]
};

console.log("\nRUNNING TEST CASE 2: Siape (v11 Default)");
const results2 = simulate(inputs2);
console.log(`Taxa Ponderada:    ${(results2.taxaPonderada * 100).toFixed(2)}% (${results2.taxaPonderada})`);
console.log(`Troco Final:       R$ ${results2.troco.toFixed(2)}`);
console.log(`Parecer:           ${results2.parecer}`);
console.log(`Comissão Tabela:   ${results2.comissaoTableText || "Nenhuma"}`);
console.log(`Taxa Ponderada matches: ${Math.abs(results2.taxaPonderada - 0.025202) < 1e-5 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results2.troco - 22302.79) < 1e-1 ? "YES" : "NO"}`);
console.log(`Parecer matches:        ${results2.parecer === "Não Favorável" ? "YES" : "NO"}`);

// Test Case 3: Siape (v12 default baseline)
const inputs3 = {
    convenio: "Siape",
    produto: "Refin da Port",
    comSeguro: "Não",
    dataContrato: "2026-07-22",
    primeiroVencimento: "2026-08-07",
    prazoRefin: 120,
    taxaRefin: 0.028,
    pmtRefin: 3000,
    contracts: [
        { saldo: 90000.0, prazo: 50, pmt: 3000.0 },
        { saldo: 0.0182, prazo: 97939.92245159789, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 }
    ]
};

console.log("\nRUNNING TEST CASE 3: Siape (v12 Default)");
const results3 = simulate(inputs3);
console.log(`Taxa Ponderada:    ${(results3.taxaPonderada * 100).toFixed(2)}% (${results3.taxaPonderada})`);
console.log(`Troco Final:       R$ ${results3.troco.toFixed(2)}`);
console.log(`Parecer:           ${results3.parecer}`);
console.log(`Comissão Tabela:   ${results3.comissaoTableText || "Nenhuma"}`);
console.log(`Taxa Ponderada matches: ${Math.abs(results3.taxaPonderada - 0.0255) < 1e-4 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results3.troco - 22578.33) < 1e-1 ? "YES" : "NO"}`);
console.log(`Parecer matches:        ${results3.parecer === "Não Favorável" ? "YES" : "NO"}`);

// Test Case 4: Siape (v13 default baseline)
const inputs4 = {
    convenio: "Siape",
    produto: "Refin da Port",
    comSeguro: "Não",
    dataContrato: "2026-07-24",
    primeiroVencimento: "2026-08-07",
    prazoRefin: 120,
    taxaRefin: 0.0160,
    pmtRefin: 3000,
    contracts: [
        { saldo: 100000.0, prazo: 50, pmt: 3000.0 },
        { saldo: 0.0182, prazo: 97939.92245159789, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 }
    ]
};

console.log("\nRUNNING TEST CASE 4: Siape (v13 Default)");
const results4 = simulate(inputs4);
console.log(`Taxa Ponderada:    ${(results4.taxaPonderada * 100).toFixed(2)}% (${results4.taxaPonderada})`);
console.log(`Troco Final:       R$ ${results4.troco.toFixed(2)}`);
console.log(`Parecer:           ${results4.parecer}`);
console.log(`Comissão Tabela:   ${results4.comissaoTableText || "Nenhuma"}`);
console.log(`Taxa Ponderada matches: ${Math.abs(results4.taxaPonderada - 0.0165) < 1e-4 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results4.troco - 55492.04) < 1e-1 ? "YES" : "NO"}`);
console.log(`Parecer matches:        ${results4.parecer === "Favorável" ? "YES" : "NO"}`);
console.log(`Comissão matches:       ${results4.comissaoTableText === "Tabela 2 de comissionamento" ? "YES" : "NO"}`);

// Test Case 5: INSS (v13 Botão Baseline - Tabela Refin 7 / 1.80%)
const { findIdealRefinRate, getRefinTableLabel } = require('./simulator.js');

const inputs5 = {
    convenio: "INSS",
    produto: "Refin da Port",
    comSeguro: "Não",
    dataContrato: "2026-07-26",
    primeiroVencimento: "2026-08-07",
    prazoRefin: 120,
    taxaRefin: "Tabela Refin 7",
    pmtRefin: 3000,
    contracts: [
        { saldo: 100000.0, prazo: 50, pmt: 3000.0 },
        { saldo: 0.0182, prazo: 97939.92245159789, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 }
    ]
};

console.log("\nRUNNING TEST CASE 5: INSS (v13 Botão Baseline)");
const results5 = simulate(inputs5);
console.log(`Refin Label:       ${results5.refinTableLabel}`);
console.log(`Taxa Ponderada:    ${(results5.taxaPonderada * 100).toFixed(2)}% (${results5.taxaPonderada})`);
console.log(`Troco Final:       R$ ${results5.troco.toFixed(2)}`);
console.log(`Parecer:           ${results5.parecer}`);
console.log(`Comissão Tabela:   ${results5.comissaoTableText || "Nenhuma"}`);
console.log(`Label matches:          ${results5.refinTableLabel === "Tabela Refin 7" ? "YES" : "NO"}`);
console.log(`Taxa Ponderada matches: ${Math.abs(results5.taxaPonderada - 0.0179) < 1e-4 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results5.troco - 47637.72) < 1e-1 ? "YES" : "NO"}`);
console.log(`Parecer matches:        ${results5.parecer === "Favorável" ? "YES" : "NO"}`);

console.log("\nRUNNING TEST CASE 6: EncontrarTaxaIdeal Solver Macro (Maior Comissão + Menor Taxa)");
const idealResult = findIdealRefinRate(inputs5);
console.log(`Ideal Table Found: ${idealResult.label} (Rate: ${(idealResult.rate * 100).toFixed(2)}%)`);
console.log(`Comissão Ideal:    ${idealResult.simulation.comissaoTableText}`);
console.log(`Parecer Ideal:     ${idealResult.simulation.parecer}`);
console.log(`Solver Success:    ${idealResult.simulation.parecer === "Favorável" ? "YES" : "NO"}`);



