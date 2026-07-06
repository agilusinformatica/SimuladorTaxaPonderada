const { simulate } = require('./simulator.js');

// Test Case 1: SEPLAG MG (v9 baseline, verified on v10)
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
console.log(`Taxa Ponderada matches: ${Math.abs(results1.taxaPonderada - 0.0245) < 1e-5 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results1.troco - 33053.48) < 1e-1 ? "YES" : "NO"}`);

// Test Case 2: Siape (v10 defaults, verified on v10)
const inputs2 = {
    convenio: "Siape",
    produto: "Refin da Port",
    comSeguro: "Não",
    dataContrato: "2026-07-06",
    primeiroVencimento: "2026-08-07",
    prazoRefin: 120,
    taxaRefin: 0.015,
    pmtRefin: 3000,
    contracts: [
        { saldo: 90000.0, prazo: 50, pmt: 3000.0 },
        { saldo: 0.0182, prazo: 97939.92245159789, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 }
    ]
};

console.log("\nRUNNING TEST CASE 2: Siape (v10 Default)");
const results2 = simulate(inputs2);
console.log(`Taxa Ponderada:    ${(results2.taxaPonderada * 100).toFixed(2)}% (${results2.taxaPonderada})`);
console.log(`Troco Final:       R$ ${results2.troco.toFixed(2)}`);
console.log(`Taxa Ponderada matches: ${Math.abs(results2.taxaPonderada - 0.0172) < 1e-5 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results2.troco - 59414.02) < 1e-1 ? "YES" : "NO"}`);
