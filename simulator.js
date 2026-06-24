// simulator.js
// Core calculation module for "Simulador Taxa Ponderada"

const CONVENIO_DE_X_PARA = {
    "Bombeiros MG": "Estado MG",
    "Def. Pública MG": "Estado MG",
    "Estado BA": "Estado BA",
    "Estado MS": "Estado MS",
    "Estado SC": "Estado SC",
    "Grupo I Governos": "Grupo I Governos",
    "Grupo II Prefeituras": "Grupo II Prefeituras",
    "INSS": "INSS",
    "IPSEMG": "Estado MG",
    "IPSM": "Estado MG",
    "Pref. Contagem": "Pref. Contagem",
    "Pref. Goiânia": "Pref. Goiânia",
    "Pref. SP": "Pref. SP",
    "SEPLAG MG": "Estado MG",
    "Tribunais Estaduais": "Tribunais Estaduais",
    "SPPrev": "SPPrev",
    "PMMG": "PMMG"
};

const APOIO_RATES = {
    "Bombeiros MG": { min: 0.0225, max: 0.05 },
    "Def. Pública MG": { min: 0.0225, max: 0.05 },
    "Estado BA": { min: 0.0202, max: 0.05 },
    "Estado MS": { min: 0.0188, max: 0.05 },
    "Estado SC": { min: 0.02, max: 0.05 },
    "Grupo I Governos": { min: 0.0219, max: 0.05 },
    "Grupo II Prefeituras": { min: 0.0212, max: 0.05 },
    "INSS": { min: 0.0178, max: 0.0185 },
    "IPSEMG": { min: 0.0225, max: 0.05 },
    "IPSM": { min: 0.0225, max: 0.05 },
    "Pref. Contagem": { min: 0.0197, max: 0.05 },
    "Pref. Goiânia": { min: 0.0204, max: 0.05 },
    "Pref. SP": { min: 0.0176, max: 0.05 },
    "SEPLAG MG": { min: 0.0225, max: 0.05 },
    "Tribunais Estaduais": { min: 0.0192, max: 0.05 },
    "SPPrev": { min: 0.0174, max: 0.05 },
    "PMMG": { min: 0.0217, max: 0.05 }
};

const COMMISSION_TABLES = {
    "Estado MG": [
        { limit: 0.0225, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0226, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0228, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0229, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0230, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0232, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "INSS": [
        { limit: 0.0178, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0179, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0181, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0182, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0183, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0185, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Pref. Contagem": [
        { limit: 0.0197, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0198, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0200, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0201, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0203, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0205, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Pref. Goiânia": [
        { limit: 0.0204, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0206, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0208, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0209, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0211, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0213, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Pref. SP": [
        { limit: 0.0176, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0177, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0179, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0180, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0182, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0183, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "SPPrev": [
        { limit: 0.0174, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0175, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0177, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0178, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0179, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0181, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Estado MS": [
        { limit: 0.0188, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0189, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0191, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0192, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0193, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0194, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Estado BA": [
        { limit: 0.0202, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0204, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0205, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0206, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0208, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0209, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Estado SC": [
        { limit: 0.0200, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0201, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0203, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0204, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0205, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0207, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Grupo I Governos": [
        { limit: 0.0200, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0201, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0203, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0204, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0205, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0207, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "PMMG": [
        { limit: 0.0217, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0219, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0220, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0221, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0223, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0224, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ],
    "Tribunais Estaduais": [
        { limit: 0.0192, table: "Tabela 1", rate: 0.005 },
        { limit: 0.0194, table: "Tabela 2", rate: 0.01 },
        { limit: 0.0195, table: "Tabela 3", rate: 0.015 },
        { limit: 0.0196, table: "Tabela 4", rate: 0.02 },
        { limit: 0.0197, table: "Tabela 5", rate: 0.025 },
        { limit: 0.0199, table: "Tabela 6", rate: 0.03 },
        { limit: 0.0500, table: "Tabela 6", rate: 0.03 }
    ]
};

// DAYS360 US NASD Method (equivalent to Excel DAYS360)
function days360(date1, date2) {
    const d1 = new Date(date1 + 'T00:00:00');
    const d2 = new Date(date2 + 'T00:00:00');
    
    let y1 = d1.getFullYear();
    let m1 = d1.getMonth() + 1;
    let dt1 = d1.getDate();
    
    let y2 = d2.getFullYear();
    let m2 = d2.getMonth() + 1;
    let dt2 = d2.getDate();
    
    if (dt1 === 31) dt1 = 30;
    if (dt2 === 31) {
        if (dt1 >= 30) {
            dt2 = 30;
        }
    }
    
    const isLastDayFeb = (y, m, d) => {
        if (m !== 2) return false;
        const isLeap = (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0));
        const lastD = isLeap ? 29 : 28;
        return d === lastD;
    };
    
    if (isLastDayFeb(y1, m1, dt1)) {
        dt1 = 30;
        if (isLastDayFeb(y2, m2, dt2)) {
            dt2 = 30;
        }
    }
    
    return (y2 - y1) * 360 + (m2 - m1) * 30 + (dt2 - dt1);
}

// Add months preserving date (Excel EDATE behavior)
function addMonths(startDateStr, months) {
    const d = new Date(startDateStr + 'T00:00:00');
    let y = d.getFullYear();
    let m = d.getMonth() + 1;
    let dt = d.getDate();
    
    let mNew = m + months;
    let yNew = y + Math.floor((mNew - 1) / 12);
    mNew = ((mNew - 1) % 12 + 1);
    
    let maxD;
    if (mNew === 2) {
        const isLeap = (yNew % 4 === 0 && (yNew % 100 !== 0 || yNew % 400 === 0));
        maxD = isLeap ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(mNew)) {
        maxD = 30;
    } else {
        maxD = 31;
    }
    
    let dtNew = Math.min(dt, maxD);
    const pad = (n) => String(n).padStart(2, '0');
    return `${yNew}-${pad(mNew)}-${pad(dtNew)}`;
}

// XIRR Root Solver (Newton-Raphson + Bisection fallback)
function xirr(cashflows, datesStr, guess = 0.1) {
    const dates = datesStr.map(d => new Date(d + 'T00:00:00'));
    const t0 = dates[0].getTime();
    const t = dates.map(d => (d.getTime() - t0) / (1000 * 60 * 60 * 24 * 365));
    
    let r = guess;
    const maxIter = 1000;
    const tol = 1e-11;
    
    for (let i = 0; i < maxIter; i++) {
        let f = 0;
        let df = 0;
        for (let j = 0; j < cashflows.length; j++) {
            const frac = t[j];
            const term = Math.pow(1 + r, frac);
            f += cashflows[j] / term;
            df -= frac * cashflows[j] / (term * (1 + r));
        }
        if (Math.abs(f) < tol) return r;
        if (df === 0) break;
        const nextR = r - f / df;
        if (Math.abs(nextR - r) < tol) return nextR;
        r = nextR;
    }
    
    // Bisection
    let low = -0.999;
    let high = 10.0;
    for (let i = 0; i < 100; i++) {
        let mid = (low + high) / 2;
        let fMid = 0;
        let fLow = 0;
        for (let j = 0; j < cashflows.length; j++) {
            fMid += cashflows[j] / Math.pow(1 + mid, t[j]);
            fLow += cashflows[j] / Math.pow(1 + low, t[j]);
        }
        if (Math.abs(fMid) < 1e-8) return mid;
        if ((fMid > 0) === (fLow > 0)) {
            low = mid;
        } else {
            high = mid;
        }
    }
    return (low + high) / 2;
}

// Perform the full Excel simulation
function simulate(inputs) {
    const {
        convenio,
        produto,
        comSeguro,
        dataContrato, // YYYY-MM-DD
        primeiroVencimento, // YYYY-MM-DD
        prazoRefin,
        taxaRefin,
        pmtRefin,
        contracts // Array of 4 objects { saldo, prazo, pmt }
    } = inputs;

    const carenciaReal = days360(dataContrato, primeiroVencimento);
    const activeContracts = contracts.filter(c => c.saldo > 0);
    const hasOtherContracts = activeContracts.length > 1; // Excel: E23>0 or E28>0 or E33>0 (Contratos 2,3,4 active)

    const totalPeriods = prazoRefin;

    // Date array (t=0 to t=120)
    const dates = [dataContrato, primeiroVencimento];
    for (let t = 2; t <= totalPeriods; t++) {
        dates.push(addMonths(primeiroVencimento, t - 1));
    }

    // Days accumulated (AA)
    const aa = [];
    for (let t = 1; t <= totalPeriods; t++) {
        aa.push(carenciaReal + 30 * (t - 1));
    }

    // Compute Refin Cash Flows for each contract
    const refinFlows = [];
    const trocos = [];

    // Refin rates for all contracts. Default to operation refin rate.
    const taxaRefinAnnualized = Math.pow(1 + taxaRefin, 12) - 1;

    for (let k = 0; k < 4; k++) {
        const c = contracts[k];
        const ac_k = [];
        
        if (k === 0) {
            // Contrato 1 Refin cash flow logic
            const pmtPort1 = c.pmt;
            const pmtRefin1 = hasOtherContracts ? pmtPort1 : pmtRefin;
            const prazoRemanescente1 = c.prazo;
            
            for (let t = 1; t <= totalPeriods; t++) {
                if (hasOtherContracts) {
                    ac_k.push((t > prazoRemanescente1 && t <= totalPeriods) ? pmtPort1 : 0.0);
                } else {
                    if (t > prazoRemanescente1 && t <= totalPeriods) {
                        ac_k.push(pmtRefin1);
                    } else if (t <= prazoRemanescente1) {
                        ac_k.push(pmtRefin - pmtPort1);
                    } else {
                        ac_k.push(0.0);
                    }
                }
            }
        } else {
            // Contratos 2, 3, 4 Refin cash flow logic
            for (let t = 1; t <= totalPeriods; t++) {
                ac_k.push((c.saldo > 0 && t > c.prazo && t <= totalPeriods) ? c.pmt : 0.0);
            }
        }

        // Discounted flow (AD, AG, AJ, AM)
        const ad_k = [];
        for (let t = 1; t <= totalPeriods; t++) {
            const discFactor = Math.pow(1 + taxaRefinAnnualized, aa[t-1] / 360.0);
            ad_k.push(ac_k[t-1] / discFactor);
        }
        
        const troco_k = c.saldo > 0 || k === 0 ? ad_k.reduce((s, x) => s + x, 0) : 0.0;
        
        trocos.push(troco_k);
        refinFlows.push(ac_k);
    }

    // Consolidated cash flow AN for t >= 1
    const anFlow = [];
    for (let t = 1; t <= totalPeriods; t++) {
        let totalPmtT = 0.0;
        for (let k = 0; k < 4; k++) {
            const c = contracts[k];
            const ab_k_t = (c.saldo > 0 && t <= c.prazo) ? c.pmt : 0.0;
            const ac_k_t = refinFlows[k][t-1];
            totalPmtT += ab_k_t + ac_k_t;
        }
        anFlow.push(totalPmtT);
    }

    // t=0 cash flow
    let anT0 = 0.0;
    for (let k = 0; k < 4; k++) {
        if (contracts[k].saldo > 0 || k === 0) {
            anT0 += -contracts[k].saldo - trocos[k];
        }
    }

    const consolidatedCashFlows = [anT0].concat(anFlow);

    // Compute IRR (Taxa Ponderada)
    const xirrAnnual = xirr(consolidatedCashFlows, dates);
    const ratePonderadaRaw = Math.pow(1 + xirrAnnual, 1/12.0) - 1;
    const taxaPonderada = Number(ratePonderadaRaw.toFixed(4)); // ROUND(..., 4)

    // --- AMORTIZATION AND IOF ---
    const pmtConsolidada = activeContracts.length > 0
        ? activeContracts.reduce((sum, c) => sum + c.pmt, 0)
        : pmtRefin;

    const termRate = Math.pow(1 + ratePonderadaRaw, -totalPeriods);
    const pmtFactor = ratePonderadaRaw / (1 - termRate);
    const theoreticalK3 = (pmtConsolidada / pmtFactor) / Math.pow(1 + ratePonderadaRaw, (carenciaReal - 30) / 30.0);

    const refinsNormais = contracts.reduce((sum, c) => sum + c.saldo, 0);
    const d3 = theoreticalK3 - refinsNormais;

    const j20 = pmtFactor * d3 * Math.pow(1 + ratePonderadaRaw, (carenciaReal - 30) / 30.0);

    const dailyIof = 0.000082;
    const additionalIof = 0.0038;

    const iofList = [];
    let fPrev = d3;

    for (let t = 1; t <= totalPeriods; t++) {
        const dtDate = new Date(dates[t] + 'T00:00:00');
        const h_t = Math.round((dtDate - new Date(dataContrato + 'T00:00:00')) / (1000 * 60 * 60 * 24));
        const c_t = (t === 1) ? carenciaReal : 30;

        const d_t = fPrev * Math.pow(1 + ratePonderadaRaw, c_t / 30.0);
        const e_t = -j20;
        const f_t = d_t + e_t;
        const g_t = (t === 1) ? (d3 - f_t) : (fPrev - f_t);

        const iof_t = Math.min(h_t, 365) * g_t * dailyIof + g_t * additionalIof;
        iofList.push(iof_t);

        fPrev = f_t;
    }

    const totalIof = iofList.reduce((sum, x) => sum + x, 0);

    // --- INSURANCE WATERFALL ---
    const k14 = contracts.reduce((sum, c, idx) => {
        if (c.saldo > 0 || idx === 0) {
            return sum + c.saldo + trocos[idx];
        }
        return sum;
    }, 0);

    const b55 = trocos.reduce((sum, x) => sum + x, 0) - totalIof;

    // Passo 01
    const taxSeguro1 = 0.09;
    const valSolicSeguro1 = (k14 - totalIof) / (1 + taxSeguro1);
    const valSeguro1 = valSolicSeguro1 * taxSeguro1;
    const valLimSeguro1 = b55 * 0.3;
    const limRespeitado1 = valSeguro1 < valLimSeguro1;

    // Passo 02
    const taxSeguro2 = 0.06;
    const valSolicSeguro2 = (k14 - totalIof) / (1 + taxSeguro2);
    const valSeguro2 = valSolicSeguro2 * taxSeguro2;
    const valLimSeguro2 = b55 * 0.3;
    const limRespeitado2 = valSeguro2 < valLimSeguro2;

    // Passo 03
    const taxSeguro3 = 0.03;
    const valSolicSeguro3 = (k14 - totalIof) / (1 + taxSeguro3);
    const valSeguro3 = valSolicSeguro3 * taxSeguro3;
    const valLimSeguro3 = b55 * 0.3; // Note: Excel formula resolved to b55 * 0.3
    const limRespeitado3 = valSeguro3 < valLimSeguro3;

    let aliquotaSeguro = 0.03;
    if (limRespeitado1) {
        aliquotaSeguro = 0.09;
    } else if (limRespeitado2) {
        aliquotaSeguro = 0.06;
    } else if (limRespeitado3) {
        aliquotaSeguro = 0.03;
    }

    const seguroAlíquota = (comSeguro === "Sim" || comSeguro === true) ? aliquotaSeguro : 0.0;
    const totalSeguro = (comSeguro === "Sim" || comSeguro === true)
        ? ((k14 - totalIof) / (1 + seguroAlíquota)) * seguroAlíquota
        : 0.0;

    // --- FINAL OUTPUTS ---
    const troco = trocos.reduce((s, x) => s + x, 0) - (totalIof + totalSeguro);

    // Lookups in Apoio
    const rateLimits = APOIO_RATES[convenio] || { min: 0.0225, max: 0.05 };
    const minRate = rateLimits.min;
    const maxRate = rateLimits.max;

    const parecerFavoravel = (taxaPonderada >= minRate && taxaPonderada <= maxRate);
    const parecer = parecerFavoravel ? "Favorável" : "Não Favorável";

    // Commission table lookup
    const mappedGroup = CONVENIO_DE_X_PARA[convenio];
    let comissaoTableText = "";
    let comissaoRate = 0.0;

    if (parecerFavoravel && mappedGroup) {
        const table = COMMISSION_TABLES[mappedGroup];
        if (table) {
            const sorted = [...table].sort((a, b) => a.limit - b.limit);
            let matchedEntry = null;
            for (let entry of sorted) {
                if (taxaPonderada <= entry.limit) {
                    matchedEntry = entry;
                    break;
                }
            }
            if (matchedEntry) {
                comissaoTableText = `${matchedEntry.table} de comissionamento`;
                comissaoRate = matchedEntry.rate;
            }
        }
    }

    return {
        carenciaReal,
        theoreticalK3,
        d3,
        totalIof,
        seguroAlíquota,
        totalSeguro,
        trocos,
        troco,
        taxaPonderada,
        minRate,
        maxRate,
        parecer,
        comissaoTableText,
        // Detailed breakdown vectors for UI representation
        dates
    };
}

module.exports = {
    days360,
    addMonths,
    xirr,
    simulate,
    CONVENIO_DE_X_PARA,
    APOIO_RATES,
    COMMISSION_TABLES
};
