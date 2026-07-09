const { simulate } = require('./simulator.js');

const inputs = {
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

const res = simulate(inputs);
console.log("=== JS Simulation Debug ===");
console.log("Troco:", res.troco);
console.log("Taxa Ponderada:", res.taxaPonderada);
console.log("Total IOF:", res.totalIof);
console.log("Seguro:", res.totalSeguro);
console.log("Carencia Real:", res.carenciaReal);

console.log("\n=== JS Contract 1 Cash Flows (payments) ===");
// In simulate(), we can find the payments vector.
// Let's print the results' trocos breakdown:
console.log("Contract trocos:", res.trocos);

// Let's print first 10 dates and some information
for (let i = 0; i < 15; i++) {
    console.log(`Month ${i+1}: Date=${res.dates[i]}`);
}
