# 🧠 Social Interpreter — Inteligência Artificial para Acessibilidade Cognitiva

> **Documentação Técnica e de Negócio — Protótipo de Co-piloto de Habilidades Sociais para Neurodivergentes.**

[![AI Ready: Groq](https://img.shields.io/badge/AI--Engine-Groq--Llama3.3-blue)](https://groq.com/)
[![Status: MVP](https://img.shields.io/badge/Status-Public--MVP-success)](https://brnpessoa14.github.io/social-interpreter/)

---

## 📖 1. Visão Geral (Executive Summary)
O **Social Interpreter** é uma solução de Tecnologia Assistiva desenvolvida para auxiliar adultos neurodivergentes (Autismo Nível 1, TDAH e indivíduos com Ansiedade Social) na decodificação de nuances comunicativas no cotidiano. O projeto utiliza métodos avançados de Processamento de Linguagem Natural (NLP) e visão computacional para mitigar o burnout social caudado pelo "masking" e facilitar a inserção ativa de indivíduos em ambientes acadêmicos e corporativos.

---

## 🛠️ 2. PRD — Product Requirements Document

### 2.1. O Problema (Problem Statement)
Estima-se que até 20% da população mundial possua algum grau de neurodivergência. A comunicação humana é baseada em 70% de tons não literais (ironia, implícitos, linguagem corporal simulada em texto). Para quem processa informações de forma literal ou analítica, essa "zona cinzenta" gera ansiedade, paralisia por análise e mal-entendidos constantes com figuras de autoridade (chefes, professores).

### 2.2. Personas (Público-alvo)
*   **Persona A (Acadêmica)**: Estudante universitário neurodivergente que recebe e-mails curtos de professores e tem dificuldade em entender se o tom é de cobrança ou apenas informativo.
*   **Persona B (Corporativa)**: Profissional em cargo técnico que recebe feedbacks "entre linhas" no Slack/Teams e não sabe como responder de forma assertiva sem parecer rude ou submisso.

### 2.3. Requisitos Funcionais (RFs)
| ID | Requisito | Descrição |
| :--- | :--- | :--- |
| **RF01** | **Entrada Multimodal** | O usuário deve poder inserir dados via Texto, Áudio (Voice-to-text), Imagem (Screenshots via OCR) ou PDFs. |
| **RF02** | **Análise de Contexto Social** | O sistema deve processar a entrada e retornar o tom provável, o resumo da situação e as intenções ocultas. |
| **RF03** | **Gerador de Respostas** | O sistema deve oferecer 3 sugestões de resposta: Neutra, Assertiva e Acolhedora. |
| **RF04** | **Configuração de API** | Permite que o usuário insira sua própria chave de API para garantir autonomia e escalabilidade do protótipo. |

### 2.4. Regras de Negócio (RNs)
*   **RN01 (Privacidade Efêmera)**: Nenhuma mensagem enviada deve ser salva em bancos de dados no servidor da aplicação. O processamento deve ser volátil.
*   **RN02 (Neutralidade Assistiva)**: A IA não deve sugerir comportamentos hostis ou que violem normas legais/éticas.
*   **RN03 (Linguagem Clara)**: O resumo da interpretação deve obrigatoriamente evitar jargões complexos, sendo acessível para quem está em estado de ansiedade.

---

## 🗺️ 3. Fluxo de Processamento (Diagrama Mermaid)

Abaixo, descrevemos o fluxo lógico do sistema, desde a entrada multissensorial até a entrega da recomendação social:

```mermaid
flowchart TD
    A[Usuário Inicia Aplicação] --> B{Escolha da Entrada}
    B -- Digitação --> C[Texto Direto]
    B -- Voz / Áudio --> D[Transcrição Whisper Large V3]
    B -- Imagem / Print --> E[OCR via Tesseract.js]
    B -- Documento PDF --> F[Parsing via PDF.js]
    
    C & D & E & F --> G[Envio para Motor de IA - Groq Llama 3.3]
    
    G --> H[Análise de Tom e Contextualização]
    H --> I[Identificação de Expectativas Ocultas]
    
    I --> J[Saída: Dashboard de Interpretação]
    J --> K[Tradução Social Simplificada]
    J --> L[Sugestões de Resposta: Neutra/Assertiva/Acolhedora]
    
    L --> M[Usuário Copia Resposta e Finaliza Sessão]
```

---

## 🏗️ 4. Arquitetura Técnica e Métodos de IA

Para atender às demandas académicas de performance e aplicação, implementamos:

*   **Motor NLP Principal**: Utilização do modelo **Llama 3.3 70B Versatile** via infraestrutura Groq, alcançando velocidades de inferência de centenas de tokens por segundo (LPU technology).
*   **Processamento de Áudio**: Implementação do **Whisper-Large-V3-Turbo** para transcrição pt-BR de alta fidelidade, essencial para captar nuances de fala.
*   **Visão Computacional In-Browser**: Uso do **Tesseract.js** para garantir que prints de conversas (ex: WhatsApp Web) possam ser analisados sem que o usuário precise digitar todo o conteúdo manualmente.
*   **Stack Front-End**: Arquitetura SPA (Single Page Application) em Vanilla Javascript e CSS moderno, garantindo baixo footprint e foco total na acessibilidade visual.

---

## 📈 5. Análise de Mercado e Viabilidade de Negócio

Como parte do planejamento de um produto sustentável, identificamos as seguintes avenidas de crescimento:

### 5.1. Diferenciais Competitivos
Enquanto o ChatGPT é uma ferramenta generalista, o **Social Interpreter** é focado. Ele "mastiga" a informação, removendo a necessidade de longas conversas com a IA para chegar a uma conclusão. Nossa entrega é via **Actionable Insights**.

### 5.2. Modelos de Sustentabilidade Econômica
1.  **Assinatura Individual (B2C)**: Modelo mensal para usuários avançados que necessitam de volume ilimitado de análises multimodal.
2.  **Licenciamento Educacional (B2B)**: Universidades compram licenças para prover aos alunos neurodivergentes como ferramenta de acessibilidade acadêmica.
3.  **Licenciamento Corporativo (ESG/DE&I)**: Venda para empresas que possuem programas de inclusão de talentos neurodivergentes no RH.

---

## 📊 6. Roadmap de Evolução

1.  **Curto Prazo (Extensão de Navegador)**: Levar o motor do Social Interpreter para dentro do WhatsApp Web, LinkedIn e Slack, oferecendo sugestões "em tempo real" na caixa de digitação.
2.  **Médio Prazo (App Mobile/Teclado)**: Desenvolvimento de um teclado customizado para iOS/Android que sugere tons de resposta durante a escrita.
3.  **Longo Prazo (IA Offline/Local)**: Migração para modelos ONNX ou WebLLM para processamento 100% local, elevando a privacidade ao nível máximo.

---

## 👥 7. Equipe de Desenvolvimento
*   Bruno Pessoa
*   Gabriel de Santi
*   Guilherme Bastos
*   Jota
*   Fernando

---
