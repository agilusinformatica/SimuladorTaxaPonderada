# Instruções de Atualização do Simulador (Excel para Node.js)

Este diretório contém as regras e o passo a passo para o agente Antigravity atualizar as tabelas de taxas e regras do simulador sempre que uma nova versão da planilha Excel (`Simulador Taxa Ponderada v.X.xlsx`) for disponibilizada.

---

## 📂 Mapeamento de Arquivos
* **[simulator.js](file:///C:/ExcelParaNode/simulator.js)**: Contém as tabelas estáticas de dados e a matemática financeira (`days360`, `xirr`, fluxo de amortização e cascata de seguro).
* **[public/index.html](file:///C:/ExcelParaNode/public/index.html)**: Contém o layout da interface web e a lista suspensa (`<select id="convenio">`) com a lista de convênios disponíveis.
* **[public/app.js](file:///C:/ExcelParaNode/public/app.js)**: Configura os valores de baseline (data atual, carência padrão de +45 dias e contratos de teste) e as listas de taxas refinanciamento (`RANGE_REFIN` para Com/Sem Seguro) que são atualizadas dinamicamente.
* **[test_simulator.js](file:///C:/ExcelParaNode/test_simulator.js)**: Suíte de testes unitários locais que validam os cálculos contra os resultados esperados do Excel.

---

## 🔄 Fluxo de Atualização (Passo a Passo)

### 1. Extração de Dados da Planilha
Sempre que uma nova planilha for fornecida, utilize um script Python (com a biblioteca `openpyxl`) para extrair os seguintes dados:
* **Aba Apoio**:
  * Lista de convênios ativos (Coluna A).
  * Mapeamento de convênios "De x Para" (Coluna D para E).
  * Taxa mínima (`Tx. Ponderada`, Coluna G) e máxima (`Taxa Máxima`, Coluna H) de cada convênio.
* **Aba Tabela de Comissionamento**:
  * Tabela de limites de taxas de juros (`Taxa`) e suas respectivas classificações (`Tabela 1` a `Tabela 6`) por convênio mapeado.
* **Aba Range Refin**:
  * Lista de taxas disponíveis "S/ Seguro" (Coluna A) e "C/ Seguro" (Coluna B).

### 2. Atualização das Constantes no Código
No arquivo **[simulator.js](file:///C:/ExcelParaNode/simulator.js)**, substitua as constantes correspondentes:
* `CONVENIO_DE_X_PARA`
* `APOIO_RATES`
* `COMMISSION_TABLES`

No arquivo **[public/app.js](file:///C:/ExcelParaNode/public/app.js)**, atualize a constante:
* `RANGE_REFIN` (contendo os arrays de taxas correspondentes a "Não" e "Sim" para Seguro).

### 3. Atualização dos Elementos Visuais
* No **[index.html](file:///C:/ExcelParaNode/public/index.html)**, certifique-se de que o `<select id="convenio">` possui todos os convênios extraídos da Coluna A da aba Apoio, ordenados alfabeticamente.
* Atualize a versão indicada nos títulos da página (ex: de `v.10` para `v.11`).

### 4. Validação dos Resultados
* Execute testes unitários locais usando a planilha com os dados padrão dela para garantir que o resultado de **Troco Final** e **Taxa Ponderada** retornado por `simulate()` seja idêntico (com tolerância decimal) aos campos correspondentes do Excel.
* Adicione novos casos de teste no **[test_simulator.js](file:///C:/ExcelParaNode/test_simulator.js)** para os cenários padrão da nova planilha.
