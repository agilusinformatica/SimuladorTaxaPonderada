# Simulador de Taxa Ponderada - Portabilidade & Refinanciamento (v.9)

Este projeto é uma conversão completa e fiel do modelo de cálculo financeiro contido no arquivo Excel `Simulador Taxa Ponderada v.9.xlsx` para um programa feito em **Node.js** usando **Javascript** puro.

O simulador calcula a **Taxa Ponderada** da operação consolidada através do cálculo do **TIR mensal** (baseado no XIRR anual das datas exatas dos fluxos de caixa), estima o **Troco Líquido** do cliente deduzindo encargos fiscais (**IOF**) e prêmio de **Seguro Prestamista** (opcional), e emite um **Parecer** e a indicação da **Tabela de Comissionamento** aplicável.

---

## 🛠️ Tecnologias e Arquitetura do Projeto

O projeto foi modularizado para permitir tanto a execução local quanto em servidores, contendo:

1. **`simulator.js` (Núcleo de Cálculo)**: Implementa as fórmulas financeiras equivalentes ao Excel em Javascript puro:
   - `days360()`: Cálculo de dias com base no ano comercial de 360 dias (método US NASD 30/360).
   - `addMonths()`: Incremento mensal de datas mantendo o fim do mês (equivalente à fórmula `EDATE` do Excel).
   - `xirr()`: Solucionador numérico (Newton-Raphson com fallback em bisseção) para a Taxa Interna de Retorno Estendida.
   - `simulate()`: O fluxo principal que consolida os saldos devedores, calcula os trocos contratuais, monta os fluxos de caixa, calcula o IOF detalhado e processa o modelo cascata do seguro.
2. **`server.js` (Servidor Web)**: Um servidor Express básico que expõe a API de cálculo (`POST /api/simulate`) e serve a interface gráfica.
3. **`cli.js` (Terminal Interface)**: Interface de linha de comando que aceita parâmetros ou um arquivo de entrada JSON.
4. **`public/` (Interface Premium)**: Uma aplicação web moderna e responsiva (Single Page Application) feita em HTML5, CSS3 vanilla (design com efeito vidro/glassmorphism, gradientes e animações) e Javascript para visualização em tempo real e análise detalhada dos fluxos de caixa gerados.

---

## 🚀 Como Executar

### Pré-requisitos
* **Node.js** instalado (v16 ou superior recomendado).

### Instalação
1. Abra o terminal na pasta do projeto:
   ```bash
   npm install
   ```

### Opção 1: Interface Web Premium (Recomendado)
Para iniciar o servidor web local e acessar a interface gráfica interativa:
1. Inicie o servidor:
   ```bash
   npm start
   ```
2. Abra o seu navegador e acesse:
   ```
   http://localhost:3000
   ```
   *A interface carrega por padrão os valores idênticos ao cenário da planilha original para que você possa comparar os resultados instantaneamente.*

### Opção 2: Interface de Linha de Comando (CLI)
Para simular rapidamente no terminal:
* Executar simulação com valores padrão (cenário SEPLAG MG original):
  ```bash
  npm run cli
  ```
* Ver opções de argumentos:
  ```bash
  node cli.js --help
  ```
* Simular fornecendo argumentos customizados:
  ```bash
  node cli.js --convenio "INSS" --taxaRefin 0.0178 --pmtRefin 1500 --c1 50000,60,1500
  ```

---

## 🧮 Detalhes das Fórmulas Implementadas

### 1. Taxa Ponderada (TIR Mensal)
A taxa ponderada no Excel é obtida a partir do fluxo de caixa consolidado das amortizações e pagamentos de portabilidade.
* O fluxo é gerado para cada contrato $k$. A parcela total paga pelo cliente no mês $t$ é consolidada.
* O XIRR calcula a taxa de juros anual $R$ que zera o valor presente líquido do fluxo em datas exatas:
  $$0 = Fluxo_0 + \sum_{t=1}^{120} \frac{Fluxo_t}{(1 + R)^{\frac{Data_t - Data_0}{365}}}$$
* A taxa ponderada mensal (a.m.) é calculada pela equivalência de juros:
  $$TaxaPonderada = (1 + R)^{\frac{1}{12}} - 1$$

### 2. Imposto sobre Operações Financeiras (IOF)
O IOF é calculado mês a mês com base nas parcelas amortizadas do refinanciamento teórico:
* Alíquota Diária: `0,0082%` (`0.000082`) limitada a 365 dias.
* Alíquota Adicional: `0,38%` (`0.0038`) aplicada sobre cada amortização.
* O valor de IOF de cada mês $t$ é dado por:
  $$IOF_t = \min(DiasCorridos_t, 365) \times Amortizacao_t \times 0.000082 + Amortizacao_t \times 0.0038$$

### 3. Seguro Prestamista (Modelo Cascata)
Se ativado (`comSeguro = "Sim"`), o simulador verifica em qual faixa de taxa o prêmio de seguro se enquadra sem comprometer o limite de 30% sobre o valor liberado (Passos 1, 2 e 3):
1. **Passo 1 (9%)**: Avalia se o seguro $\le 30\%$ do valor líquido. Se sim, define a alíquota em `9%`.
2. **Passo 2 (6%)**: Se o passo 1 falhar, avalia a taxa em `6%`.
3. **Passo 3 (3%)**: Se o passo 2 falhar, avalia a taxa em `3%`.
4. O valor final do seguro é deduzido do troco do cliente.

---

## 📋 Mapeamento de Arquivos Principais

* [simulator.js](file:///C:/ExcelParaNode/simulator.js) - Núcleo de processamento e matemática financeira.
* [server.js](file:///C:/ExcelParaNode/server.js) - Servidor Express e roteamento de APIs.
* [cli.js](file:///C:/ExcelParaNode/cli.js) - Interface de terminal executável.
* [public/index.html](file:///C:/ExcelParaNode/public/index.html) - Estrutura da UI Web.
* [public/style.css](file:///C:/ExcelParaNode/public/style.css) - Estilização moderna e premium (CSS variables, Dark Mode, efeitos de vidro).
* [public/app.js](file:///C:/ExcelParaNode/public/app.js) - Script de controle de tela, adição de múltiplos contratos dinâmicos e conexão à API.
