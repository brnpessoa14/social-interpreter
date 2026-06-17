# Social Interpreter

IA para acessibilidade cognitiva. O projeto ajuda pessoas neurodivergentes a entender mensagens ambíguas, separar fato de interpretação e responder com mais segurança.

## O que é

O Social Interpreter é uma interface simples que recebe texto, voz, print ou PDF e devolve:

- leitura literal do que foi dito;
- intenção social provável, com nível de confiança;
- explicação simples para reduzir sobrecarga cognitiva;
- próximos passos concretos;
- respostas prontas em três tons: neutra, assertiva e acolhedora.

## Como funciona

1. O usuário informa com quem está falando e cola/descreve a situação.
2. A interface pode extrair texto de imagem com Tesseract.js, de PDF com PDF.js ou transcrever áudio via Groq Whisper.
3. O texto consolidado é enviado para um modelo de linguagem.
4. A resposta volta em JSON e é renderizada em blocos curtos e copiáveis.

O MVP é uma SPA estática em HTML, CSS e JavaScript. Não há banco de dados.

## O que resolve

Mensagens curtas, indiretas ou com cobrança implícita podem gerar ansiedade e paralisia por análise. O app reduz essa carga ao transformar a situação em linguagem direta e em ações possíveis.

## Rodar localmente

Abra `index.html` no navegador ou sirva a pasta com qualquer servidor estático. Exemplo com Node:

```powershell
npx serve .
```

Durante esta sessão, o app também está disponível em:

```text
http://127.0.0.1:5173
```

## Configurar chave de API

Use Groq para este MVP, porque é rápido, simples e tem endpoint compatível com OpenAI.

1. Acesse https://console.groq.com/keys.
2. Crie uma API key.
3. Abra o app.
4. Clique no botão `API` no topo.
5. Cole a chave no campo `Chave Groq`.
6. Mantenha o modelo `llama-3.3-70b-versatile`.
7. Clique em `Salvar chave`.

Modelos recomendados em junho de 2026:

- Texto principal: `llama-3.3-70b-versatile`.
- Texto mais barato/rápido: `llama-3.1-8b-instant`.
- Áudio/transcrição: `whisper-large-v3-turbo`.

Observação importante: neste MVP, a chave fica no `localStorage` do navegador. Para produto real, use um backend para proteger a chave e evitar exposição no front-end.

### Chave padrão local

Para deixar uma chave pré-configurada no seu computador sem subir segredo para o GitHub:

1. Copie `config.example.js` para `config.local.js`.
2. Troque `gsk_COLE_SUA_CHAVE_AQUI` pela sua chave Groq.
3. Abra o app normalmente.

`config.local.js` está no `.gitignore`, então não entra no commit.

Também é possível importar uma chave uma única vez por link usando fragmento de URL:

```text
https://brnpessoa14.github.io/social-interpreter/#groq_key=SUA_CHAVE_AQUI
```

Ao carregar, o app salva a chave no navegador e remove o fragmento da barra de endereço. Use isso apenas em canais privados.

## Modo demo

Se nenhuma chave for configurada, o app entra em modo demo. Isso garante que a apresentação funcione mesmo se a API estiver fora, sem crédito ou com limite de uso.

## Recursos para apresentação

- Botão `Usar exemplo` para preencher a mensagem do professor rapidamente.
- Botão `Testar API` para validar a chave antes da demonstração.
- Contador de caracteres para evitar entradas longas demais.
- Botão `Copiar resumo` para salvar a análise completa em texto.
- Roteiro de 5 slides dentro do próprio app.

## Roteiro de 5 slides

1. **O que é:** uma camada de tradução social para pessoas neurodivergentes.
2. **Problema:** tons implícitos, ironia e cobranças indiretas aumentam ansiedade e esforço de interpretação.
3. **Como funciona:** entrada multimodal, extração de texto, análise por IA e sugestões de resposta.
4. **O que resolve:** reduz dúvida antes de responder e melhora autonomia comunicativa.
5. **Demonstração:** interpretar uma mensagem real, copiar uma resposta e explicar o aviso de validação profissional.

## Validação profissional

O app é apoio de comunicação, não diagnóstico e não substitui acompanhamento terapêutico, jurídico ou profissional. Para situações de assédio, crise emocional, contrato, saúde ou risco legal, valide com profissional da área.

## Stack

- HTML, CSS e JavaScript puro
- Tailwind CDN para utilitários visuais
- Groq Chat Completions
- Groq Audio Transcriptions
- Tesseract.js para OCR local no navegador
- PDF.js para leitura de PDF no navegador
