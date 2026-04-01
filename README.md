# 🧠 Social Interpreter — Mensagens Claras, Mentes Calmas.

> **O primeiro co-piloto de inteligência social projetado especificamente para a mente neurodivergente.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: MVP](https://img.shields.io/badge/Status-Public--MVP-success)](https://brnpessoa14.github.io/social-interpreter/)
[![AI Ready: Groq](https://img.shields.io/badge/AI--Engine-Groq--Llama3.3-blue)](https://groq.com/)

---

## 🌟 Visão Geral
O **Social Interpreter** é uma solução de Tecnologia Assistiva voltada para adultos neurodivergente (Autistas, TDAH, pessoas com Ansiedade Social) que enfrentam o alto custo cognitivo da comunicação moderna. 

Vivemos em um mundo de subtextos, ironias e comunicações implícitas. Para quem processa o mundo de forma literal ou analítica, uma mensagem do chefe ou um e-mail acadêmico pode gerar horas de paralisia por análise. Nosso produto transforma essa incerteza em clareza acionável através de IA generativa de ponta.

---

## 🚀 Problema e Solução

### O Problema
Estima-se que **15% a 20% da população mundial** possua algum tipo de neurodivergência. No mercado de trabalho e na academia, o "Social Masking" (tentar agir como neurotípico) leva ao burnout. A falta de ferramentas simples para decodificar tom e intenção cria barreiras de produtividade e bem-estar.

### A Solução (O Produto)
Uma interface minimalista e "limpa" (sem distrações sensoriais) que atua como um tradutor bidirecional:
1.  **Entrada Multimodal**: Aceita texto direto, áudio (transcrição via Whisper), screenshots de conversas (OCR) ou documentos PDF.
2.  **Análise de Contexto**: Identifica o tom real (ironia, urgência, cobrança velada) e as "regras não ditas" daquela interação específica.
3.  **Sugestões de Resposta**: Entrega modelos de resposta prontos em três tons (Neutro, Assertivo e Acolhedor) para que o usuário mantenha sua voz sem o peso da criação do zero.

---

## 🛠️ Arquitetura Técnica (Stack)

O projeto foi construído sob o princípio de **Fricção Zero** e **Privacidade Máxima**:

*   **Frontend**: HTML5 Semântico, Vanilla JavaScript (ES6+), CSS3 customizado.
*   **Motor de IA**: 
    *   **LLM**: Llama 3.3 70B (via Groq API) para latência ultra-baixa.
    *   **STT (Speech-to-text)**: Whisper Large V3 Turbo para transcrição de áudio fluida.
*   **Visão Computacional**: Tesseract.js para processamento de OCR local no navegador.
*   **Document Parsing**: PDF.js para extração de contexto de documentos acadêmicos/legais.
*   **Segurança**: Comunicação efêmera. Os dados do usuário não são persistidos em bancos de dados no MVP, garantindo total privacidade das interações.

---

## 📈 Plano de Negócios e Monetização

O Social Interpreter não é apenas um app, é o início de um ecossistema B2B e B2C focado em acessibilidade cognitiva.

### 1. Market Fit
*   **B2C Individual**: Profissionais e estudantes que buscam autonomia.
*   **B2B Clínico**: Ferramenta de apoio para Psicólogos e Terapeutas Ocupacionais utilizarem com seus pacientes.
*   **B2B Enterprise**: Empresas que buscam cumprir metas de ESG e Diversidade & Inclusão através do apoio à neurodiversidade no local de trabalho.

### 2. Estratégias de Receita
| Modelo | Descrição | Público |
| :--- | :--- | :--- |
| **Freemium** | 5 análises diárias gratuitas. Versão PRO ilimitada + Multimodalidade. | Usuários Finais |
| **SaaS B2B** | Licenciamento corporativo para RHs e departamentos de Inclusão. | Empresas |
| **API as a Service** | Integração em plataformas de suporte e CRM para "humanização" de tons. | Desenvolvedores |
| **Tokens Avulsos** | Compra de créditos por processamento pesado (ex: reuniões longas). | Usuários Ocasionais |

---

## 🗺️ Roadmap de Evolução (H2 2024 - 2025)

### Fase 1: MVP Atual (Disponível)
*   SPA para análise de texto/voz/imagem.
*   Integração Groq/Llama3.
*   Output de resposta rápida.

### Fase 2: Ecossistema Ativo 🚀
*   **Extensão de Navegador**: Camada nativa no WhatsApp Web, Slack e LinkedIn para tradução "in-line" de mensagens recebidas.
*   **Teclado Customizado (Android/iOS)**: Sugestões de resposta direto no teclado do smartphone.
*   **Dashboard de Habilidades**: Relatório mensal anônimo sobre evolução de comunicação e redução de triggers de ansiedade.

### Fase 3: Enterprise & IA Local
*   Integração com calendários e ferramentas de task tracking.
*   Implementação de modelos de IA locais (WebLLM/ONNX) para privacidade 100% offline.

---

## 🛡️ Ética e Privacidade
O Social Interpreter segue diretrizes estritas:
*   **Transparência**: O usuário sempre sabe que está interagindo com uma IA.
*   **Privacidade por Design**: No MVP, nenhum dado de áudio ou texto é armazenado após o processamento da sessão.
*   **Limites**: A ferramenta não substitui diagnósticos clínicos ou intervenções de saúde mental.

---

## 💻 Como Rodar localmente

1.  Clone este repositório.
2.  Abra o arquivo `index.html` em seu navegador de preferência.
3.  *(Opcional)* Para desenvolvimento, configure sua própria `API_KEY` do Groq no arquivo `app.js`.

```bash
git clone https://github.com/brnpessoa14/social-interpreter.git
```

---

## 🤝 Contribuição e Social Impact
Acreditamos que a tecnologia deve ser o grande equalizador social. Se você é desenvolvedor, designer ou especialista em neurodiversidade, sua contribuição é bem-vinda!

---
**Criado com foco em neuroinclusão e impacto social real.**
*Para dúvidas ou parcerias comerciais: [brnpessoa14@gmail.com](mailto:brnpessoa14@gmail.com)*