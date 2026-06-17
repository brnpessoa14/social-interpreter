const STORAGE_KEYS = {
    groqApiKey: "socialInterpreter.groqApiKey",
    textModel: "socialInterpreter.textModel"
};

const DEFAULT_MODEL = "llama-3.3-70b-versatile";
const SAMPLE_MESSAGE = "O professor escreveu no grupo: \"Vocês vêm hoje? Preciso ver a apresentação funcionando e entender claramente o que é o projeto, como funciona e qual problema ele resolve. Lembrem de validar a proposta com um profissional da área.\"";
let recognition = null;
let isRecording = false;
let loadingTimer = null;
let lastResult = null;
let lastContext = null;

function getSettings() {
    const localConfig = window.SOCIAL_INTERPRETER_CONFIG || {};
    return {
        apiKey: localStorage.getItem(STORAGE_KEYS.groqApiKey) || localConfig.groqApiKey || "",
        model: localStorage.getItem(STORAGE_KEYS.textModel) || localConfig.textModel || DEFAULT_MODEL
    };
}

function importKeyFromUrlHash() {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    const params = new URLSearchParams(hash);
    const key = (params.get("groq_key") || params.get("api_key") || "").trim();
    const model = (params.get("model") || DEFAULT_MODEL).trim();

    if (!key) return;
    if (!key.startsWith("gsk_")) {
        showToast("Chave no link ignorada: formato inválido.");
        return;
    }

    localStorage.setItem(STORAGE_KEYS.groqApiKey, key);
    localStorage.setItem(STORAGE_KEYS.textModel, model);
    history.replaceState(null, document.title, window.location.pathname + window.location.search);
    showToast("Chave importada para este navegador.");
}

function updateApiStatus() {
    const { apiKey } = getSettings();
    const status = document.getElementById("api-status");
    status.textContent = apiKey ? "IA real" : "Demo";
    status.className = apiKey ? "status-pill ready" : "status-pill";
}

function openSettings() {
    const { apiKey, model } = getSettings();
    document.getElementById("api-key").value = apiKey;
    document.getElementById("api-model").value = model;
    document.getElementById("settings-dialog").showModal();
}

function saveSettings() {
    const key = document.getElementById("api-key").value.trim();
    const model = document.getElementById("api-model").value;

    if (key && !key.startsWith("gsk_")) {
        showToast("A chave Groq normalmente começa com gsk_. Confira antes de salvar.");
        return;
    }

    if (key) {
        localStorage.setItem(STORAGE_KEYS.groqApiKey, key);
    } else {
        localStorage.removeItem(STORAGE_KEYS.groqApiKey);
    }
    localStorage.setItem(STORAGE_KEYS.textModel, model);
    updateApiStatus();
    document.getElementById("settings-dialog").close();
    showToast(key ? "Chave salva neste navegador." : "Modo demo ativado.");
}

function clearSettings() {
    localStorage.removeItem(STORAGE_KEYS.groqApiKey);
    localStorage.removeItem(STORAGE_KEYS.textModel);
    document.getElementById("api-key").value = "";
    document.getElementById("api-model").value = DEFAULT_MODEL;
    updateApiStatus();
    showToast("Chave removida. O app voltou ao modo demo.");
}

async function testApiKey() {
    const key = document.getElementById("api-key").value.trim();
    const model = document.getElementById("api-model").value;

    if (!key) {
        showToast("Cole uma chave Groq antes de testar.");
        return;
    }

    if (!key.startsWith("gsk_")) {
        showToast("A chave Groq normalmente começa com gsk_.");
        return;
    }

    showToast("Testando a conexão...");
    try {
        await callGroq("Responda somente com {\"ok\":true}.", { apiKey: key, model });
        showToast("Conexão funcionando. Pode salvar e apresentar.");
    } catch (error) {
        showToast(error.message || "Não foi possível testar a conexão.");
    }
}

function showPanel(name) {
    document.getElementById("panel-results").classList.toggle("hidden", name !== "results");
    document.getElementById("panel-results").classList.toggle("active", name === "results");
    document.getElementById("panel-presentation").classList.toggle("hidden", name !== "presentation");
    document.getElementById("panel-presentation").classList.toggle("active", name === "presentation");
}

function switchInputType(type) {
    ["text", "voice", "file"].forEach((item) => {
        document.getElementById(`tab-${item}`).classList.toggle("active", item === type);
        document.getElementById(`input-${item}-container`).classList.toggle("hidden", item !== type);
    });
}

function fillExample() {
    document.getElementById("recipient").value = "Professor";
    document.getElementById("message").value = SAMPLE_MESSAGE;
    document.getElementById("mood").value = "Ansioso";
    document.getElementById("goal").value = "Responder de forma adequada";
    updateCharCount();
    switchInputType("text");
    showToast("Exemplo preenchido para a demonstração.");
}

function clearForm() {
    document.getElementById("message").value = "";
    document.getElementById("mood").value = "";
    document.getElementById("goal").value = "Entender melhor o que aconteceu";
    updateCharCount();
    showToast("Campo limpo.");
}

async function startAnalysis() {
    const context = readFormContext();
    const error = document.getElementById("form-error");

    if (context.message.length < 8) {
        error.textContent = "Descreva a mensagem ou situação com um pouco mais de detalhe.";
        error.classList.remove("hidden");
        return;
    }

    error.classList.add("hidden");
    showPanel("results");
    showLoading();

    try {
        const settings = getSettings();
        const result = settings.apiKey
            ? await callGroq(buildPrompt(context), settings)
            : await getDemoResult(context);

        renderResults(sanitizeResultForLayUser(result), context, !settings.apiKey);
    } catch (error) {
        console.error(error);
        renderError(error);
    } finally {
        stopLoading();
    }
}

function readFormContext() {
    return {
        recipient: document.getElementById("recipient").value,
        message: document.getElementById("message").value.trim(),
        mood: document.getElementById("mood").value,
        goal: document.getElementById("goal").value
    };
}

function buildPrompt(context) {
    return `Você é um assistente de acessibilidade cognitiva para pessoas neurodivergentes adultas, especialmente autistas, pessoas com TDAH e pessoas com ansiedade social.

Analise a situação abaixo com cuidado. Evite dramatizar. Se a mensagem for ambígua, diga que há incerteza. Não invente intenção negativa quando houver explicação neutra.

Relação com a pessoa: ${context.recipient}
Estado emocional informado pelo usuário: ${context.mood || "não informado"}
Objetivo do usuário: ${context.goal}
Mensagem ou situação:
"""${context.message}"""

Responda somente com JSON válido neste formato:
{
  "tom": "tom provável em até 4 palavras",
  "confianca": "baixa|media|alta",
  "explicacao_simples": "2 frases simples, diretas e tranquilizadoras",
  "leitura_literal": "o que foi dito literalmente, sem interpretação extra",
  "leitura_social": "o que a pessoa provavelmente quis comunicar, com ressalva se houver dúvida",
  "cuidado": "um cuidado importante antes de responder",
  "proximos_passos": ["ação concreta 1", "ação concreta 2", "ação concreta 3"],
  "sugestoes": [
    {"rotulo": "Neutra", "texto": "resposta pronta, curta e educada"},
    {"rotulo": "Assertiva", "texto": "resposta pronta, clara e respeitosa"},
    {"rotulo": "Acolhedora", "texto": "resposta pronta, mais calorosa sem submissão"}
  ]
}

Regras:
- Use português brasileiro.
- Use linguagem simples, sem jargões.
- Não dê diagnóstico nem conselho terapêutico.
- Nunca mencione detalhes técnicos, nomes de integração, nomes de arquivo, formato interno, código, bastidores do sistema ou modo de apresentação.
- Se precisar falar sobre funcionamento técnico, use termos simples como "ferramenta", "análise", "demonstração" ou "conexão".
- Respostas devem ser seguras, respeitosas e aplicáveis em contexto acadêmico/profissional.
- Se houver risco de assédio, saúde, crise, contrato ou direito, oriente validar com profissional da área.`;
}

async function callGroq(prompt, settings) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
            model: settings.model,
            messages: [
                {
                    role: "system",
                    content: "Você devolve apenas JSON válido para uma interface de acessibilidade cognitiva."
                },
                { role: "user", content: prompt }
            ],
            temperature: 0.25,
            max_tokens: 1300,
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data?.error?.message || `HTTP ${response.status}`;
        if (response.status === 401) throw new Error("Chave de acesso inválida. Abra IA e cole uma chave Groq válida.");
        if (response.status === 429) throw new Error("Limite de uso atingido. Aguarde um pouco ou use outra chave.");
        throw new Error(message);
    }

    const data = await response.json();
    const raw = data?.choices?.[0]?.message?.content;
    if (!raw) throw new Error("A IA respondeu vazio. Tente novamente.");
    return parseJsonResponse(raw);
}

function sanitizeResultForLayUser(data) {
    const clean = JSON.parse(JSON.stringify(data || {}));
    const cleanText = (value) => sanitizeTechnicalTerms(String(value || ""));

    clean.tom = cleanText(clean.tom);
    clean.confianca = cleanText(clean.confianca);
    clean.explicacao_simples = cleanText(clean.explicacao_simples);
    clean.leitura_social = cleanText(clean.leitura_social);
    clean.cuidado = cleanText(clean.cuidado);
    clean.proximos_passos = Array.isArray(clean.proximos_passos)
        ? clean.proximos_passos.map(cleanText)
        : [];
    clean.sugestoes = Array.isArray(clean.sugestoes)
        ? clean.sugestoes.map((suggestion) => ({
            ...suggestion,
            rotulo: cleanText(suggestion.rotulo),
            texto: cleanText(suggestion.texto)
        }))
        : [];

    return clean;
}

function sanitizeTechnicalTerms(text) {
    return text
        .replace(/\bAPI\b/gi, "ferramenta")
        .replace(/\bAPIs\b/gi, "ferramentas")
        .replace(/\bbackend\b/gi, "parte interna")
        .replace(/\bfrontend\b/gi, "tela")
        .replace(/\bprompt\b/gi, "instrução")
        .replace(/\bJSON\b/gi, "resposta")
        .replace(/\btokens?\b/gi, "uso")
        .replace(/\bmodo demo\b/gi, "modo de apresentação")
        .replace(/\bfluxo da ferramenta\b/gi, "funcionamento da ferramenta")
        .replace(/\bproblema técnico\b/gi, "ponto a ajustar")
        .replace(/\bcorrigir a ferramenta\b/gi, "ajustar a demonstração");
}

function parseJsonResponse(raw) {
    const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch {
        const match = cleaned.match(/\{[\s\S]*\}/);
        if (!match) throw new Error("A IA não devolveu um JSON válido.");
        return JSON.parse(match[0]);
    }
}

async function getDemoResult(context) {
    await new Promise((resolve) => setTimeout(resolve, 850));
    const lower = context.message.toLowerCase();
    const mentionsClass = lower.includes("hoje") || lower.includes("apresent") || lower.includes("professor");
    const mentionsValidation = lower.includes("validar") || lower.includes("profissional");

    return {
        tom: mentionsClass ? "objetivo e urgente" : "neutro com urgência",
        confianca: "media",
        explicacao_simples: mentionsClass
            ? "A pessoa está pedindo uma demonstração clara e objetiva do projeto. Parece haver urgência, mas não dá para concluir que a mensagem é uma bronca só pelo texto."
            : "A mensagem parece pedir uma resposta objetiva. Vale responder com calma, confirmando o que você entendeu e o próximo passo.",
        leitura_literal: context.message,
        leitura_social: mentionsClass
            ? "Provavelmente esperam que vocês mostrem o app funcionando e expliquem, de forma simples, o que é, como funciona e qual problema resolve."
            : "Provavelmente esperam uma resposta objetiva, com status do que está pronto e do que ainda falta.",
        cuidado: mentionsValidation
            ? "Não apresente a ferramenta como diagnóstico. Explique que é um apoio de comunicação e cite a validação com profissional da área."
            : "Evite responder se justificando demais. Prefira confirmar presença, objetivo da apresentação e próximo passo.",
        proximos_passos: [
            "Confirmar que a demonstração principal já está funcionando.",
            "Preparar uma explicação curta: o que é, como funciona e o que resolve.",
            "Separar um exemplo realista para mostrar antes e depois da interpretação."
        ],
        sugestoes: [
            {
                rotulo: "Neutra",
                texto: "Sim, vamos apresentar hoje. Vamos mostrar o app funcionando e explicar de forma objetiva o que é, como funciona e qual problema resolve."
            },
            {
                rotulo: "Assertiva",
                texto: "Vamos levar uma demonstração direta do produto, com um exemplo de uso e os 5 slides organizados nesses três pontos: o que é, como funciona e o que resolve."
            },
            {
                rotulo: "Acolhedora",
                texto: "Obrigado pela orientação. Vamos organizar a apresentação com esses pontos e mostrar uma situação prática para ficar claro como o Social Interpreter ajuda o usuário."
            }
        ]
    };
}

function renderResults(data, context, isDemo) {
    lastResult = data;
    lastContext = context;
    document.getElementById("empty-state").classList.add("hidden");
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("result-state").classList.remove("hidden");

    document.getElementById("result-relation").textContent = context.recipient;
    document.getElementById("result-tone").textContent = `Tom: ${data.tom || "incerto"}`;
    document.getElementById("result-confidence").textContent = `${isDemo ? "Demo | " : ""}Confiança: ${normalizeConfidence(data.confianca)}`;
    document.getElementById("result-simple").textContent = data.explicacao_simples || "Não foi possível gerar uma explicação simples.";
    document.getElementById("result-literal").textContent = data.leitura_literal || context.message;
    document.getElementById("result-social").textContent = data.leitura_social || "A intenção está ambígua. Vale pedir confirmação com uma pergunta curta.";

    const actions = Array.isArray(data.proximos_passos) ? data.proximos_passos : [];
    const actionList = document.getElementById("result-actions");
    actionList.innerHTML = "";
    actions.concat(data.cuidado ? [`Cuidado: ${data.cuidado}`] : []).slice(0, 4).forEach((item) => {
        const li = document.createElement("li");
        li.className = "flex gap-3";
        li.innerHTML = `<span class="material-symbols-outlined text-primary">check_circle</span><span></span>`;
        li.querySelector("span:last-child").textContent = item;
        actionList.appendChild(li);
    });

    const suggestions = Array.isArray(data.sugestoes) ? data.sugestoes : [];
    const container = document.getElementById("result-suggestions");
    container.innerHTML = "";
    suggestions.forEach((suggestion) => {
        const card = document.createElement("div");
        card.className = "suggestion";
        const label = document.createElement("span");
        label.className = "suggestion-label";
        label.textContent = suggestion.rotulo || "Resposta";
        const text = document.createElement("p");
        text.textContent = suggestion.texto || "";
        const copy = document.createElement("button");
        copy.className = "icon-button";
        copy.type = "button";
        copy.title = "Copiar resposta";
        copy.innerHTML = `<span class="material-symbols-outlined">content_copy</span>`;
        copy.addEventListener("click", () => copyText(suggestion.texto || "", copy));
        card.append(label, text, copy);
        container.appendChild(card);
    });
}

function copyResultSummary() {
    if (!lastResult || !lastContext) {
        showToast("Faça uma análise antes de copiar o resumo.");
        return;
    }

    const actions = Array.isArray(lastResult.proximos_passos) ? lastResult.proximos_passos : [];
    const suggestions = Array.isArray(lastResult.sugestoes) ? lastResult.sugestoes : [];
    const summary = [
        "Social Interpreter - resumo da análise",
        `Relação: ${lastContext.recipient}`,
        `Tom provável: ${lastResult.tom || "incerto"}`,
        `Confiança: ${normalizeConfidence(lastResult.confianca)}`,
        "",
        "Explicação simples:",
        lastResult.explicacao_simples || "",
        "",
        "Intenção provável:",
        lastResult.leitura_social || "",
        "",
        "Próximos passos:",
        ...actions.map((item, index) => `${index + 1}. ${item}`),
        "",
        "Respostas prontas:",
        ...suggestions.map((item) => `${item.rotulo || "Resposta"}: ${item.texto || ""}`)
    ].join("\n");

    navigator.clipboard.writeText(summary)
        .then(() => showToast("Resumo completo copiado."))
        .catch(() => showToast("Não consegui copiar automaticamente."));
}

function renderError(error) {
    document.getElementById("empty-state").classList.remove("hidden");
    document.getElementById("loading-state").classList.add("hidden");
    document.getElementById("result-state").classList.add("hidden");
    showToast(error.message || "Não foi possível processar a análise.");
}

function normalizeConfidence(value) {
    const confidence = String(value || "media").toLowerCase();
    if (confidence.includes("alta")) return "alta";
    if (confidence.includes("baixa")) return "baixa";
    return "média";
}

function showLoading() {
    document.getElementById("empty-state").classList.add("hidden");
    document.getElementById("result-state").classList.add("hidden");
    document.getElementById("loading-state").classList.remove("hidden");
    const labels = ["Preparando leitura social", "Separando fato de interpretação", "Gerando respostas seguras"];
    let index = 0;
    document.getElementById("loading-bar").style.width = "18%";
    loadingTimer = setInterval(() => {
        index = (index + 1) % labels.length;
        document.getElementById("loading-status").textContent = labels[index];
        document.getElementById("loading-bar").style.width = `${Math.min(92, 28 + index * 24 + Math.random() * 12)}%`;
    }, 900);
}

function stopLoading() {
    if (loadingTimer) clearInterval(loadingTimer);
    loadingTimer = null;
    document.getElementById("loading-bar").style.width = "100%";
}

async function copyText(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        button.innerHTML = `<span class="material-symbols-outlined">check</span>`;
        showToast("Resposta copiada.");
        setTimeout(() => {
            button.innerHTML = `<span class="material-symbols-outlined">content_copy</span>`;
        }, 1400);
    } catch {
        showToast("Não consegui copiar automaticamente.");
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.remove("hidden");
    clearTimeout(window.toastTimer);
    window.toastTimer = setTimeout(() => toast.classList.add("hidden"), 3200);
}

function toggleRecording() {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
        showToast("Este navegador não suporta ditado por voz. Você pode digitar ou enviar áudio.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognition) {
        recognition = new SpeechRecognition();
        recognition.lang = "pt-BR";
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onstart = () => {
            isRecording = true;
            document.getElementById("mic-btn").classList.add("recording");
            document.getElementById("mic-status").textContent = "Gravando. Toque novamente para parar.";
            document.getElementById("voice-transcript-preview").classList.remove("hidden");
            document.getElementById("voice-transcript-preview").textContent = "Ouvindo...";
        };
        recognition.onresult = (event) => {
            let finalText = "";
            let interimText = "";
            for (let i = event.resultIndex; i < event.results.length; i += 1) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) finalText += transcript;
                else interimText += transcript;
            }
            if (finalText) appendToMessage(finalText);
            document.getElementById("voice-transcript-preview").textContent = finalText || interimText || "Ouvindo...";
        };
        recognition.onerror = () => {
            stopRecording();
            showToast("Não consegui acessar o microfone.");
        };
        recognition.onend = stopRecording;
    }

    if (isRecording) {
        recognition.stop();
    } else {
        recognition.start();
    }
}

function stopRecording() {
    isRecording = false;
    document.getElementById("mic-btn").classList.remove("recording");
    document.getElementById("mic-status").textContent = "Toque para ditar a situação";
}

async function handleGenericUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById("file-transcript-preview");
    const status = document.getElementById("file-upload-status");
    preview.classList.remove("hidden");
    preview.textContent = "Extraindo texto...";
    status.textContent = "Processando arquivo";

    try {
        let text = "";
        if (file.type.startsWith("audio/")) {
            text = await transcribeAudio(file);
        } else if (file.type.startsWith("image/")) {
            text = await readImage(file, preview);
        } else if (file.type === "application/pdf") {
            text = await readPdf(file, preview);
        } else {
            throw new Error("Formato não suportado. Use áudio, imagem ou PDF.");
        }

        if (!text.trim()) throw new Error("Não encontrei texto legível neste arquivo.");
        appendToMessage(text.trim());
        preview.textContent = "Texto extraído e colocado no campo principal.";
        switchInputType("text");
    } catch (error) {
        preview.textContent = error.message || "Falha ao processar arquivo.";
    } finally {
        status.textContent = "Print, PDF ou áudio";
        event.target.value = "";
    }
}

async function transcribeAudio(file) {
    const { apiKey } = getSettings();
    if (!apiKey) {
        throw new Error("Para transcrever áudio enviado, abra IA e salve uma chave Groq.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("model", "whisper-large-v3-turbo");
    formData.append("language", "pt");
    formData.append("response_format", "json");

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}` },
        body: formData
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error("Chave Groq inválida para transcrição.");
        throw new Error("Não consegui transcrever o áudio agora.");
    }

    const data = await response.json();
    return data.text || "";
}

async function readImage(file, preview) {
    preview.textContent = "Lendo imagem com OCR. Pode levar alguns segundos.";
    const worker = await Tesseract.createWorker("por");
    const result = await worker.recognize(file);
    await worker.terminate();
    return result.data.text || "";
}

async function readPdf(file, preview) {
    preview.textContent = "Lendo páginas do PDF.";
    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    const pdf = await pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const parts = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const content = await page.getTextContent();
        parts.push(content.items.map((item) => item.str).join(" "));
    }
    return parts.join("\n");
}

function appendToMessage(text) {
    const input = document.getElementById("message");
    input.value = `${input.value}${input.value.trim() ? "\n" : ""}${text}`.trim();
    updateCharCount();
}

function updateCharCount() {
    const input = document.getElementById("message");
    const counter = document.getElementById("char-count");
    if (!input || !counter) return;
    const count = input.value.trim().length;
    counter.textContent = `${count} ${count === 1 ? "caractere" : "caracteres"}`;
    counter.classList.toggle("text-amber-600", count > 3500);
}

document.addEventListener("DOMContentLoaded", () => {
    importKeyFromUrlHash();
    updateApiStatus();
    updateCharCount();
    document.getElementById("message").addEventListener("input", updateCharCount);
});
