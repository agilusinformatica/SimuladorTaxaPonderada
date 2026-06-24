using System;
using System.Collections.Generic;

namespace ExcelParaNode
{
    public class Simulator
    {
        // 1. Data Structure Definitions
        public class ContractInput
        {
            public double Saldo { get; set; }
            public int Prazo { get; set; }
            public double Pmt { get; set; }
        }

        public class SimulationInput
        {
            public string Convenio { get; set; }
            public string Produto { get; set; }
            public string ComSeguro { get; set; } // "Sim" or "Não"
            public DateTime DataContrato { get; set; }
            public DateTime PrimeiroVencimento { get; set; }
            public int PrazoRefin { get; set; }
            public double TaxaRefin { get; set; } // Monthly rate (e.g. 0.0225 for 2.25%)
            public double PmtRefin { get; set; }
            public List<ContractInput> Contracts { get; set; }
        }

        public class SimulationResult
        {
            public int CarenciaReal { get; set; }
            public double TheoreticalK3 { get; set; }
            public double D3 { get; set; }
            public double TotalIof { get; set; }
            public double SeguroAliquota { get; set; }
            public double TotalSeguro { get; set; }
            public List<double> Trocos { get; set; }
            public double Troco { get; set; }
            public double TaxaPonderada { get; set; } // Monthly rate (e.g. 0.0245)
            public double MinRate { get; set; }
            public double MaxRate { get; set; }
            public string Parecer { get; set; } // "Favorável" or "Não Favorável"
            public string ComissaoTableText { get; set; }
            public double ComissaoRate { get; set; }
            public List<DateTime> Dates { get; set; }
            public List<double> ConsolidatedCashFlows { get; set; }
        }

        private class MinMaxRate
        {
            public double Min { get; set; }
            public double Max { get; set; }
        }

        private class CommissionEntry
        {
            public double Limit { get; set; }
            public string Table { get; set; }
            public double Rate { get; set; }
        }

        // 2. static Configurations
        private static readonly Dictionary<string, string> ConvenioDeXPara = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
        {
            { "Bombeiros MG", "Estado MG" },
            { "Def. Pública MG", "Estado MG" },
            { "Estado BA", "Estado BA" },
            { "Estado MS", "Estado MS" },
            { "Estado SC", "Estado SC" },
            { "Grupo I Governos", "Grupo I Governos" },
            { "Grupo II Prefeituras", "Grupo II Prefeituras" },
            { "INSS", "INSS" },
            { "IPSEMG", "Estado MG" },
            { "IPSM", "Estado MG" },
            { "Pref. Contagem", "Pref. Contagem" },
            { "Pref. Goiânia", "Pref. Goiânia" },
            { "Pref. SP", "Pref. SP" },
            { "SEPLAG MG", "Estado MG" },
            { "Tribunais Estaduais", "Tribunais Estaduais" },
            { "SPPrev", "SPPrev" },
            { "PMMG", "PMMG" }
        };

        private static readonly Dictionary<string, MinMaxRate> ApoioRates = new Dictionary<string, MinMaxRate>(StringComparer.OrdinalIgnoreCase)
        {
            { "Bombeiros MG", new MinMaxRate { Min = 0.0225, Max = 0.05 } },
            { "Def. Pública MG", new MinMaxRate { Min = 0.0225, Max = 0.05 } },
            { "Estado BA", new MinMaxRate { Min = 0.0202, Max = 0.05 } },
            { "Estado MS", new MinMaxRate { Min = 0.0188, Max = 0.05 } },
            { "Estado SC", new MinMaxRate { Min = 0.0200, Max = 0.05 } },
            { "Grupo I Governos", new MinMaxRate { Min = 0.0219, Max = 0.05 } },
            { "Grupo II Prefeituras", new MinMaxRate { Min = 0.0212, Max = 0.05 } },
            { "INSS", new MinMaxRate { Min = 0.0178, Max = 0.0185 } },
            { "IPSEMG", new MinMaxRate { Min = 0.0225, Max = 0.05 } },
            { "IPSM", new MinMaxRate { Min = 0.0225, Max = 0.05 } },
            { "Pref. Contagem", new MinMaxRate { Min = 0.0197, Max = 0.05 } },
            { "Pref. Goiânia", new MinMaxRate { Min = 0.0204, Max = 0.05 } },
            { "Pref. SP", new MinMaxRate { Min = 0.0176, Max = 0.05 } },
            { "SEPLAG MG", new MinMaxRate { Min = 0.0225, Max = 0.05 } },
            { "Tribunais Estaduais", new MinMaxRate { Min = 0.0192, Max = 0.05 } },
            { "SPPrev", new MinMaxRate { Min = 0.0174, Max = 0.05 } },
            { "PMMG", new MinMaxRate { Min = 0.0217, Max = 0.05 } }
        };

        private static readonly Dictionary<string, List<CommissionEntry>> CommissionTables = new Dictionary<string, List<CommissionEntry>>(StringComparer.OrdinalIgnoreCase)
        {
            {
                "Estado MG", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0225, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0226, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0228, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0229, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0230, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0232, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "INSS", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0178, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0179, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0181, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0182, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0183, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0185, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Pref. Contagem", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0197, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0198, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0200, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0201, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0203, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0205, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Pref. Goiânia", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0204, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0206, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0208, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0209, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0211, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0213, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Pref. SP", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0176, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0177, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0179, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0180, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0182, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0183, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "SPPrev", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0174, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0175, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0177, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0178, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0179, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0181, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Estado MS", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0188, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0189, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0191, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0192, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0193, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0194, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Estado BA", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0202, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0204, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0205, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0206, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0208, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0209, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Estado SC", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0200, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0201, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0203, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0204, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0205, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0207, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Grupo I Governos", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0200, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0201, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0203, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0204, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0205, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0207, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "PMMG", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0217, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0219, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0220, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0221, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0223, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0224, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            },
            {
                "Tribunais Estaduais", new List<CommissionEntry>
                {
                    new CommissionEntry { Limit = 0.0192, Table = "Tabela 1", Rate = 0.005 },
                    new CommissionEntry { Limit = 0.0194, Table = "Tabela 2", Rate = 0.01 },
                    new CommissionEntry { Limit = 0.0195, Table = "Tabela 3", Rate = 0.015 },
                    new CommissionEntry { Limit = 0.0196, Table = "Tabela 4", Rate = 0.02 },
                    new CommissionEntry { Limit = 0.0197, Table = "Tabela 5", Rate = 0.025 },
                    new CommissionEntry { Limit = 0.0199, Table = "Tabela 6", Rate = 0.03 },
                    new CommissionEntry { Limit = 0.0500, Table = "Tabela 6", Rate = 0.03 }
                }
            }
        };

        // 3. Helper Functions
        public static int Days360(DateTime date1, DateTime date2)
        {
            int y1 = date1.Year;
            int m1 = date1.Month;
            int d1 = date1.Day;

            int y2 = date2.Year;
            int m2 = date2.Month;
            int d2 = date2.Day;

            if (d1 == 31) d1 = 30;
            if (d2 == 31)
            {
                if (d1 >= 30)
                {
                    d2 = 30;
                }
            }

            if (m1 == 2 && IsLastDayOfFeb(date1))
            {
                d1 = 30;
                if (m2 == 2 && IsLastDayOfFeb(date2))
                {
                    d2 = 30;
                }
            }

            return (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1);
        }

        private static bool IsLastDayOfFeb(DateTime date)
        {
            int lastDay = DateTime.DaysInMonth(date.Year, 2);
            return date.Day == lastDay;
        }

        // XIRR numerical solver using Newton-Raphson + Bisection fallback (No LINQ)
        public static double Xirr(List<double> cashflows, List<DateTime> dates, double guess = 0.1)
        {
            DateTime d0 = dates[0];
            List<double> t = new List<double>();
            for (int i = 0; i < dates.Count; i++)
            {
                t.Add((dates[i] - d0).TotalDays / 365.0);
            }

            double r = guess;
            const int maxIter = 1000;
            const double tol = 1e-11;

            for (int i = 0; i < maxIter; i++)
            {
                double f = 0.0;
                double df = 0.0;
                for (int j = 0; j < cashflows.Count; j++)
                {
                    double frac = t[j];
                    double term = Math.Pow(1 + r, frac);
                    f += cashflows[j] / term;
                    df -= frac * cashflows[j] / (term * (1 + r));
                }

                if (Math.Abs(f) < tol) return r;
                if (df == 0.0) break;
                double nextR = r - f / df;
                if (Math.Abs(nextR - r) < tol) return nextR;
                r = nextR;
            }

            // Bisection Fallback
            double low = -0.999;
            double high = 10.0;
            for (int i = 0; i < 100; i++)
            {
                double mid = (low + high) / 2.0;
                double fMid = 0.0;
                double fLow = 0.0;
                for (int j = 0; j < cashflows.Count; j++)
                {
                    fMid += cashflows[j] / Math.Pow(1 + mid, t[j]);
                    fLow += cashflows[j] / Math.Pow(1 + low, t[j]);
                }
                if (Math.Abs(fMid) < 1e-8) return mid;
                if ((fMid > 0) == (fLow > 0))
                {
                    low = mid;
                }
                else
                {
                    high = mid;
                }
            }
            return (low + high) / 2.0;
        }

        // 4. Core Simulation Engine (Procedural style, no LINQ dependencies)
        public static SimulationResult Simulate(SimulationInput inputs)
        {
            // Pad inputs.Contracts to 4 items
            List<ContractInput> contracts = new List<ContractInput>();
            if (inputs.Contracts != null)
            {
                foreach (var c in inputs.Contracts)
                {
                    contracts.Add(c);
                }
            }
            while (contracts.Count < 4)
            {
                contracts.Add(new ContractInput { Saldo = 0, Prazo = 0, Pmt = 0 });
            }

            int carenciaReal = Days360(inputs.DataContrato, inputs.PrimeiroVencimento);
            
            // Build activeContracts without Linq .Where()
            List<ContractInput> activeContracts = new List<ContractInput>();
            foreach (var c in contracts)
            {
                if (c.Saldo > 0)
                {
                    activeContracts.Add(c);
                }
            }
            bool hasOtherContracts = activeContracts.Count > 1;

            int totalPeriods = inputs.PrazoRefin;

            // Generate Date arrays
            List<DateTime> dates = new List<DateTime> { inputs.DataContrato, inputs.PrimeiroVencimento };
            for (int t = 2; t <= totalPeriods; t++)
            {
                dates.Add(inputs.PrimeiroVencimento.AddMonths(t - 1));
            }

            // Generate accumulated days list (AA)
            List<int> aa = new List<int>();
            for (int t = 1; t <= totalPeriods; t++)
            {
                aa.Add(carenciaReal + 30 * (t - 1));
            }

            // Calculate refin cash flows for each contract
            List<List<double>> refinFlows = new List<List<double>>();
            List<double> trocos = new List<double>();

            double taxaRefinAnnualized = Math.Pow(1 + inputs.TaxaRefin, 12) - 1;

            for (int k = 0; k < 4; k++)
            {
                ContractInput c = contracts[k];
                List<double> ac_k = new List<double>();

                if (k == 0)
                {
                    double pmtPort1 = c.Pmt;
                    double pmtRefin1 = hasOtherContracts ? pmtPort1 : inputs.PmtRefin;
                    int prazoRemanescente1 = c.Prazo;

                    for (int t = 1; t <= totalPeriods; t++)
                    {
                        if (hasOtherContracts)
                        {
                            ac_k.Add((t > prazoRemanescente1 && t <= totalPeriods) ? pmtPort1 : 0.0);
                        }
                        else
                        {
                            if (t > prazoRemanescente1 && t <= totalPeriods)
                            {
                                ac_k.Add(pmtRefin1);
                            }
                            else if (t <= prazoRemanescente1)
                            {
                                ac_k.Add(inputs.PmtRefin - pmtPort1);
                            }
                            else
                            {
                                ac_k.Add(0.0);
                            }
                        }
                    }
                }
                else
                {
                    for (int t = 1; t <= totalPeriods; t++)
                    {
                        ac_k.Add((c.Saldo > 0 && t > c.Prazo && t <= totalPeriods) ? c.Pmt : 0.0);
                    }
                }

                // Discounted flows
                List<double> ad_k = new List<double>();
                double troco_k = 0.0;
                for (int t = 1; t <= totalPeriods; t++)
                {
                    double discFactor = Math.Pow(1 + taxaRefinAnnualized, aa[t - 1] / 360.0);
                    double valDisc = ac_k[t - 1] / discFactor;
                    ad_k.Add(valDisc);
                    if (c.Saldo > 0 || k == 0)
                    {
                        troco_k += valDisc;
                    }
                }

                trocos.Add(troco_k);
                refinFlows.Add(ac_k);
            }

            // Consolidated cash flow AN for t >= 1
            List<double> anFlow = new List<double>();
            for (int t = 1; t <= totalPeriods; t++)
            {
                double totalPmtT = 0.0;
                for (int k = 0; k < 4; k++)
                {
                    ContractInput c = contracts[k];
                    double ab_k_t = (c.Saldo > 0 && t <= c.Prazo) ? c.Pmt : 0.0;
                    double ac_k_t = refinFlows[k][t - 1];
                    totalPmtT += ab_k_t + ac_k_t;
                }
                anFlow.Add(totalPmtT);
            }

            // t=0 flow
            double anT0 = 0.0;
            for (int k = 0; k < 4; k++)
            {
                if (contracts[k].Saldo > 0 || k == 0)
                {
                    anT0 += -contracts[k].Saldo - trocos[k];
                }
            }

            List<double> consolidatedCashFlows = new List<double> { anT0 };
            consolidatedCashFlows.AddRange(anFlow);

            // Compute IRR (Taxa Ponderada)
            double xirrAnnual = Xirr(consolidatedCashFlows, dates);
            double ratePonderadaRaw = Math.Pow(1 + xirrAnnual, 1.0 / 12.0) - 1;
            double taxaPonderada = Math.Round(ratePonderadaRaw, 4);

            // --- AMORTIZATION AND IOF ---
            // Sum active contracts PMT without Linq
            double pmtConsolidada = 0.0;
            if (activeContracts.Count > 0)
            {
                foreach (var c in activeContracts)
                {
                    pmtConsolidada += c.Pmt;
                }
            }
            else
            {
                pmtConsolidada = inputs.PmtRefin;
            }

            double termRate = Math.Pow(1 + ratePonderadaRaw, -totalPeriods);
            double pmtFactor = ratePonderadaRaw / (1 - termRate);
            double theoreticalK3 = (pmtConsolidada / pmtFactor) / Math.Pow(1 + ratePonderadaRaw, (carenciaReal - 30) / 30.0);

            // Sum refinsNormais without Linq
            double refinsNormais = 0.0;
            foreach (var c in contracts)
            {
                refinsNormais += c.Saldo;
            }
            
            double d3 = theoreticalK3 - refinsNormais;

            double j20 = pmtFactor * d3 * Math.Pow(1 + ratePonderadaRaw, (carenciaReal - 30) / 30.0);

            const double dailyIof = 0.000082;
            const double additionalIof = 0.0038;

            List<double> iofList = new List<double>();
            double fPrev = d3;
            double totalIof = 0.0;

            for (int t = 1; t <= totalPeriods; t++)
            {
                DateTime dtDate = dates[t];
                int h_t = (int)Math.Round((dtDate - inputs.DataContrato).TotalDays);
                int c_t = (t == 1) ? carenciaReal : 30;

                double d_t = fPrev * Math.Pow(1 + ratePonderadaRaw, c_t / 30.0);
                double e_t = -j20;
                double f_t = d_t + e_t;
                double g_t = (t == 1) ? (d3 - f_t) : (fPrev - f_t);

                double iof_t = Math.Min(h_t, 365) * g_t * dailyIof + g_t * additionalIof;
                iofList.Add(iof_t);
                totalIof += iof_t;

                fPrev = f_t;
            }

            // --- INSURANCE WATERFALL ---
            double k14 = 0.0;
            for (int idx = 0; idx < 4; idx++)
            {
                if (contracts[idx].Saldo > 0 || idx == 0)
                {
                    k14 += contracts[idx].Saldo + trocos[idx];
                }
            }

            // Sum trocos without Linq
            double sumTrocos = 0.0;
            foreach (var tr in trocos)
            {
                sumTrocos += tr;
            }
            double b55 = sumTrocos - totalIof;

            // Passo 01
            double taxSeguro1 = 0.09;
            double valSolicSeguro1 = (k14 - totalIof) / (1 + taxSeguro1);
            double valSeguro1 = valSolicSeguro1 * taxSeguro1;
            double valLimSeguro1 = b55 * 0.3;
            bool limRespeitado1 = valSeguro1 < valLimSeguro1;

            // Passo 02
            double taxSeguro2 = 0.06;
            double valSolicSeguro2 = (k14 - totalIof) / (1 + taxSeguro2);
            double valSeguro2 = valSolicSeguro2 * taxSeguro2;
            double valLimSeguro2 = b55 * 0.3;
            bool limRespeitado2 = valSeguro2 < valLimSeguro2;

            // Passo 03
            double taxSeguro3 = 0.03;
            double valSolicSeguro3 = (k14 - totalIof) / (1 + taxSeguro3);
            double valSeguro3 = valSolicSeguro3 * taxSeguro3;
            double valLimSeguro3 = b55 * 0.3;
            bool limRespeitado3 = valSeguro3 < valLimSeguro3;

            double aliquotaSeguro = 0.03;
            if (limRespeitado1)
            {
                aliquotaSeguro = 0.09;
            }
            else if (limRespeitado2)
            {
                aliquotaSeguro = 0.06;
            }
            else if (limRespeitado3)
            {
                aliquotaSeguro = 0.03;
            }

            bool includeInsurance = string.Equals(inputs.ComSeguro, "Sim", StringComparison.OrdinalIgnoreCase);
            double seguroAliquotaFinal = includeInsurance ? aliquotaSeguro : 0.0;
            double totalSeguro = includeInsurance
                ? ((k14 - totalIof) / (1 + seguroAliquotaFinal)) * seguroAliquotaFinal
                : 0.0;

            // --- FINAL OUTPUTS ---
            double troco = sumTrocos - (totalIof + totalSeguro);

            // Mapeamentos e Limites do Convênio
            double minRate = 0.0225;
            double maxRate = 0.05;
            if (ApoioRates.TryGetValue(inputs.Convenio, out MinMaxRate rateLimits))
            {
                minRate = rateLimits.Min;
                maxRate = rateLimits.Max;
            }

            bool parecerFavoravel = (taxaPonderada >= minRate && taxaPonderada <= maxRate);
            string parecer = parecerFavoravel ? "Favorável" : "Não Favorável";

            // Comissão
            string comissaoTableText = "";
            double comissaoRate = 0.0;

            if (parecerFavoravel && ConvenioDeXPara.TryGetValue(inputs.Convenio, out string mappedGroup))
            {
                if (CommissionTables.TryGetValue(mappedGroup, out List<CommissionEntry> table))
                {
                    // Sort the list without LINQ OrderBy
                    List<CommissionEntry> sortedTable = new List<CommissionEntry>(table);
                    sortedTable.Sort((a, b) => a.Limit.CompareTo(b.Limit));

                    CommissionEntry matchedEntry = null;
                    foreach (var entry in sortedTable)
                    {
                        if (taxaPonderada <= entry.Limit)
                        {
                            matchedEntry = entry;
                            break;
                        }
                    }

                    if (matchedEntry != null)
                    {
                        comissaoTableText = matchedEntry.Table + " de comissionamento";
                        comissaoRate = matchedEntry.Rate;
                    }
                }
            }

            return new SimulationResult
            {
                CarenciaReal = carenciaReal,
                TheoreticalK3 = theoreticalK3,
                D3 = d3,
                TotalIof = totalIof,
                SeguroAliquota = seguroAliquotaFinal,
                TotalSeguro = totalSeguro,
                Trocos = trocos,
                Troco = troco,
                TaxaPonderada = taxaPonderada,
                MinRate = minRate,
                MaxRate = maxRate,
                Parecer = parecer,
                ComissaoTableText = comissaoTableText,
                ComissaoRate = comissaoRate,
                Dates = dates,
                ConsolidatedCashFlows = consolidatedCashFlows
            };
        }
    }
}
