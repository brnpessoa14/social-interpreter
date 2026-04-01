# 🧠 Social Interpreter — Mensagens Claras, Mentes Calmas.

> **Protótipo de co-piloto de inteligência social projetado para apoiar a comunicação neurodivergente.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: MVP](https://img.shields.io/badge/Status-Public--MVP-success)](https://brnpessoa14.github.io/social-interpreter/)
[![AI Ready: Groq](https://img.shields.io/badge/AI--Engine-Groq--Llama3.3-blue)](https://groq.com/)

---

## 🌟 Visão Geral do Projeto
O **Social Interpreter** é um projeto de Tecnologia Assistiva que aplica métodos avançados de Inteligência Artificial para auxiliar adultos neurodivergentes (Autismo, TDAH, Ansiedade Social). Nosso objetivo é reduzir o custo cognitivo da comunicação moderna através da análise automatizada de contexto e tom.

Este trabalho foca na implementação prática de modelos de linguagem de larga escala (LLMs) e ferramentas de extração multimodal para transformar incertezas sociais em orientações acionáveis.

---

## 🚀 Problema e Solução Proposta

### O Problema
Estima-se que **15% a 20% da população mundial** possua algum tipo de neurodivergência. No ambiente acadêmico e corporativo, a dificuldade em interpretar subtextos e ironias gera paralisia por análise e exaustão mental (burnout). 

### A Solução (Protótipo Implementado)
Desenvolvemos uma interface minimalista e funcional que atua como um tradutor de contexto bidirecional, integrando as seguintes camadas de IA:
1.  **Processamento de Linguagem Natural (NLP)**: Análise de intenção e tom através de LLMs.
2.  **Multimodalidade (Entrada de Dados)**: Aceita texto direto, transcrição de áudio em tempo real, screenshots de conversas (OCR) ou documentos PDF.
3.  **Resultados Estruturados**: O sistema entrega uma "Tradução Social", expectativas de interação e três modelos de resposta prontos (Neutro, Assertivo e Acolhedor).

---

## 🛠️ Métodos e Aplicações de IA (Stack Técnica)

Neste projeto, priorizamos a latência mínima e o processamento de ponta utilizando a seguinte arquitetura:

*   **Motor de Inferência (NLP)**: 
    *   **LLM**: **Llama 3.3 70B** (via Groq API), selecionado pela alta capacidade de raciocínio contextual e velocidade de resposta.
    *   **Engenharia de Prompt**: Implementamos prompts estruturados (JSON-only) para garantir que a saída da IA seja determinística e fácil de integrar ao front-end.
*   **Recuperação e Extração Multimodal**:
    *   **STT (Speech-to-text)**: **Whisper Large V3 Turbo** para transcrição fluida.
    *   **OCR (Optical Character Recognition)**: **Tesseract.js** para processamento de imagens local no navegador.
    *   **Parsing de Documentos**: **PDF.js** para análise de contexto de manuais e e-mails acadêmicos.
*   **Frontend**: Desenvolvido em Vanilla JavaSript e CSS customizado para garantir portabilidade e baixo consumo de recursos.

---

## 📈 Análise de Viabilidade Social e Econômica

Como parte da documentação de projeto, realizamos uma análise de como esta aplicação poderia ser sustentada como um serviço real:

### 1. Mercados Sugeridos
*   **B2C Individual**: Apoio direto para pessoas físicas.
*   **B2B Clínico**: Apoio a profissionais de saúde (Psicólogos e Terapeutas Ocupacionais).
*   **B2B Enterprise/Edu**: Licenciamento para instituições que buscam inclusão acadêmica e corporativa.

### 2. Modelos de Sustentabilidade (Monetização)
| Modelo | Abordagem | Público-alvo |
| :--- | :--- | :--- |
| **SaaS Freemium** | Versão gratuita limitada; versão PRO com multimodalidade ilimitada. | Usuários Finais |
| **Licenciamento B2B** | Pacotes de acesso para RHs e departamentos de Inclusão. | Empresas |
| **API as a Service** | Integração em plataformas de suporte (B2B2C). | Desenvolvedores |
| **Pay-per-use** | Cobrança por volume de processamento ou tokens avulsos. | Usuários Ocasionais |

---

## 🗺️ Roadmap e Evoluções Futuras

Planejamos a evolução deste protótipo em três fases principais:

*   **Fase 1 (Atual)**: MVP funcional integrando NLP, Áudio e OCR.
*   **Fase 2 (Curto Prazo)**: Desenvolvimento de **Extensão de Navegador** para análise in-line em plataformas como WhatsApp Web e Slack.
*   **Fase 3 (Longo Prazo)**: Implementação de modelos locais (IA Edge) para garantir 100% de privacidade offline.

---

## 🛡️ Ética, Segurança e Privacidade
Este projeto foi concebido sob princípios éticos rigorosos:
*   **Privacidade por Design**: No atual estágio, nenhum dado pessoal de texto ou áudio é persistido em servidores externos (processamento efêmero).
*   **Foco Assistivo**: A ferramenta atua como suporte e **não substitui** acompanhamento profissional clínico.

---

## 👥 Equipe do Projeto
*   Bruno Pessoa
*   Gabriel de Santi
*   Guilherme Bastos
*   Jota
*   Fernando

---
**Trabalho desenvolvido no âmbito da disciplina de Métodos e Aplicações de IA.**
