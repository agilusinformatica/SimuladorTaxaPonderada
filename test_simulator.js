const { simulate } = require('./simulator.js');

const inputs = {
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
        { saldo: 0.0182, prazo: 97939.92245159789, pmt: 0.0 }, // Matches E23 and E24 placeholder values in sheet
        { saldo: 0.0, prazo: 0, pmt: 0.0 },
        { saldo: 0.0, prazo: 0, pmt: 0.0 }
    ]
};

const results = simulate(inputs);

console.log("SIMULATION RESULTS:");
console.log("===================");
console.log(`Carencia Real:     ${results.carenciaReal} days`);
console.log(`Taxa Ponderada:    ${(results.taxaPonderada * 100).toFixed(2)}% (${results.taxaPonderada})`);
console.log(`Min Rate Lookup:   ${(results.minRate * 100).toFixed(2)}% (${results.minRate})`);
console.log(`Max Rate Lookup:   ${(results.maxRate * 100).toFixed(2)}% (${results.maxRate})`);
console.log(`Parecer:           ${results.parecer}`);
console.log(`Comissao Table:    ${results.comissaoTableText}`);
console.log(`Comissao Rate:     ${(results.comissaoRate * 100).toFixed(1)}%`);
console.log(`Total IOF:         R$ ${results.totalIof.toFixed(2)}`);
console.log(`Total Seguro:      R$ ${results.totalSeguro.toFixed(2)}`);
console.log(`Troco Final:       R$ ${results.troco.toFixed(2)}`);
console.log("===================");

const expectedTaxa = 0.0245;
const expectedTroco = 33053.48;

console.log(`\nValidation:`);
console.log(`Taxa Ponderada matches: ${Math.abs(results.taxaPonderada - expectedTaxa) < 1e-5 ? "YES" : "NO"}`);
console.log(`Troco matches:          ${Math.abs(results.troco - expectedTroco) < 1e-1 ? "YES" : "NO"}`);
