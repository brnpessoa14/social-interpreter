// ==================== STATE ====================
        let state = { recipient: '', message: '', mood: '', goal: '' };

        // ==================== NAVIGATION ====================
        function goToScreen(id) {
            document.querySelectorAll('.screen').forEach(s => {
                s.classList.remove('active');
                s.style.display = 'none';
            });
            const target = document.getElementById(id);
            target.classList.add('active');
            target.style.display = 'flex';
            window.scrollTo(0, 0);
        }

        function showSection(id) {
            const el = document.getElementById(id);
            if (el) { el.scrollIntoView({ behavior: 'smooth' }); }
        }

        // ==================== SCREEN 2 → 3 ====================
        function goToContextScreen() {
            const recipient = document.getElementById('recipient').value;
            const message = document.getElementById('message').value.trim();
            const errEl = document.getElementById('entry-error');

            if (!recipient) {
                errEl.textContent = 'Por favor, selecione com quem você está falando.';
                errEl.classList.remove('hidden');
                return;
            }
            if (!message || message.length < 10) {
                errEl.textContent = 'Por favor, descreva a situação com pelo menos 10 caracteres.';
                errEl.classList.remove('hidden');
                return;
            }
            errEl.classList.add('hidden');
            state.recipient = recipient;
            state.message = message;
            goToScreen('screen-context');
        }

        // ==================== MOOD SELECTION ====================
        function selectMood(btn) {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            state.mood = btn.dataset.mood;
        }

        // ==================== GOAL SELECTION ====================
        function selectGoal(item, value) {
            const isSelected = item.classList.contains('selected');
            document.querySelectorAll('.goal-item').forEach(i => {
                i.classList.remove('selected');
                i.style.borderColor = '';
                i.style.backgroundColor = '';
                const icon = i.querySelector('.goal-icon');
                if (icon) { icon.style.backgroundColor = ''; icon.style.color = ''; }
                const check = i.querySelector('.goal-check');
                if (check) { check.style.backgroundColor = ''; check.style.borderColor = ''; check.querySelector('.material-symbols-outlined').classList.add('hidden'); }
            });
            if (!isSelected) {
                item.classList.add('selected');
                const check = item.querySelector('.goal-check');
                if (check) {
                    check.style.backgroundColor = '#136dec';
                    check.style.borderColor = '#136dec';
                    check.querySelector('.material-symbols-outlined').classList.remove('hidden');
                }
                state.goal = value;
            } else {
                state.goal = '';
            }
        }

        // ==================== CONFIGURATION ====================
        const API_CONFIG = {
            provider: 'groq',
            model: 'llama-3.3-70b-versatile',
            apiKey: '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'
        };

        // ==================== ANALYSIS ====================
        async function startAnalysis() {
            runAnalysis();
        }

        async function runAnalysis() {
            goToScreen('screen-loading');
            resetLoadingBar();

            const prompt = buildPrompt();
            try {
                const result = await callAI(prompt);
                renderResults(result);
                goToScreen('screen-results');
            } catch (err) {
                console.error(err);
                if (window._loadingInterval) clearInterval(window._loadingInterval);

                let msg = err.message || 'Tente novamente.';
                if (msg.includes('QUOTA')) {
                    msg = '⚠️ Cota da API esgotada. Tente novamente mais tarde.';
                } else if (msg.includes('API_KEY') || msg.includes('invalid') || msg.includes('Unauthorized')) {
                    msg = 'Chave de API inválida ou não configurada. Verifique sua chave antes de tentar novamente.';
                }

                alert('Erro ao processar: ' + msg);
                goToScreen('screen-context');
            }
        }

        function resetLoadingBar() {
            const bar = document.getElementById('loading-bar');
            bar.style.animation = 'none';
            bar.offsetHeight; // reflow
            bar.style.animation = 'progress-bar 10s ease-out forwards';

            const statuses = ['Processando informações', 'Identificando o tom', 'Analisando intenção', 'Gerando sugestões'];
            let i = 0;
            const statusEl = document.getElementById('loading-status');
            const interval = setInterval(() => {
                i = (i + 1) % statuses.length;
                statusEl.textContent = statuses[i];
            }, 2200);
            window._loadingInterval = interval;
        }

        function buildPrompt() {
            const moodPart = state.mood ? `\nEstado emocional do usuário: ${state.mood}` : '';
            const goalPart = state.goal ? `\nObjetivo do usuário com a resposta: ${state.goal}` : '';

            return `Você é um assistente especialista em comunicação social para pessoas neurodivergentes (autismo, TDAH, ansiedade social).
Analise a situação social abaixo e responda EXATAMENTE no formato JSON especificado, sem texto adicional antes ou depois.

SITUAÇÃO:
Relação: ${state.recipient}
Mensagem/Situação: "${state.message}"${moodPart}${goalPart}

Responda SOMENTE com este JSON (sem markdown, sem blocos de código):
{
  "tom": "string curta: o tom provável da mensagem (ex: preocupado, neutro, irritado, formal, amigável)",
  "resumo": "1-2 frases explicando em linguagem simples e direta o que está acontecendo",
  "expectativas": [
    { "icone": "nome do material symbol", "titulo": "título curto", "descricao": "descrição clara do que esperam de você" },
    { "icone": "nome do material symbol", "titulo": "título curto", "descricao": "..." },
    { "icone": "nome do material symbol", "titulo": "título curto", "descricao": "..." }
  ],
  "sugestoes": [
    { "rotulo": "Neutra", "cor": "slate", "texto": "texto da sugestão de resposta neutra" },
    { "rotulo": "Assertiva", "cor": "primary", "texto": "texto da sugestão de resposta assertiva" },
    { "rotulo": "Acolhedora", "cor": "emerald", "texto": "texto da sugestão de resposta mais calorosa/acolhedora" }
  ]
}

Regras:
- "resumo" deve ser em linguagem muito simples, sem jargões, como se explicando para alguém que está ansioso
- As "expectativas" devem ser concretas e específicas à situação
- As "sugestoes" devem ser textos prontos para enviar, respeitosos e adequados ao contexto
- Para "icone" use nomes válidos de Material Symbols: psychology, schedule, verified, warning, chat, person, task_alt, priority_high, favorite
- Sempre em português brasileiro`;
        }

        // ==================== GENERIC AI CALLER ====================
        function parseAIResponse(raw) {
            const clean = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();
            try {
                return JSON.parse(clean);
            } catch (e) {
                const match = clean.match(/\{[\s\S]*\}/);
                if (match) return JSON.parse(match[0]);
                throw new Error('Formato de resposta inválido da IA.');
            }
        }

        async function callAI(prompt) {
            const { provider, model, apiKey } = API_CONFIG;

            const endpoint = 'https://api.groq.com/openai/v1/chat/completions';

            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            };

            const body = {
                model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 1200,
                response_format: { type: "json_object" }
            };

            const res = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                const msg = errData?.error?.message || `HTTP ${res.status}`;
                if (res.status === 429) throw new Error('QUOTA_EXCEEDED: ' + msg);
                throw new Error(msg);
            }

            const data = await res.json();
            const raw = data?.choices?.[0]?.message?.content || '';
            if (!raw) throw new Error('Resposta vazia da IA.');
            return parseAIResponse(raw);
        }

        // ==================== RENDER RESULTS ====================
        function renderResults(data) {
            if (window._loadingInterval) clearInterval(window._loadingInterval);

            // Badge
            document.getElementById('result-relation-badge').textContent = state.recipient;
            document.getElementById('result-tone-badge').textContent = data.tom ? `Tom: ${data.tom}` : '';

            // Summary
            document.getElementById('result-happening').textContent = data.resumo || '';

            // Expectations
            const expList = document.getElementById('result-expectations');
            expList.innerHTML = '';
            (data.expectativas || []).forEach(exp => {
                expList.innerHTML += `
      <li class="flex gap-4 items-start">
        <div class="bg-primary/10 p-2 rounded-lg text-primary flex-shrink-0">
          <span class="material-symbols-outlined">${exp.icone || 'check'}</span>
        </div>
        <div>
          <h3 class="font-semibold text-base">${exp.titulo || ''}</h3>
          <p class="text-slate-500 text-sm mt-1">${exp.descricao || ''}</p>
        </div>
      </li>`;
            });

            // Suggestions
            const sugContainer = document.getElementById('result-suggestions');
            sugContainer.innerHTML = '';
            const corMap = {
                'slate': 'bg-slate-100 text-slate-600',
                'primary': 'bg-primary/10 text-primary',
                'emerald': 'bg-emerald-100 text-emerald-700',
            };
            (data.sugestoes || []).forEach((sug, i) => {
                const badgeClass = corMap[sug.cor] || corMap['slate'];
                sugContainer.innerHTML += `
      <div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div class="flex justify-between items-start mb-4">
          <span class="${badgeClass} px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">${sug.rotulo || 'Sugestão'}</span>
          <button class="copy-btn text-primary hover:bg-primary/10 p-2 rounded-full transition-colors" onclick="copyText(this, '${escapeForAttr(sug.texto)}')" title="Copiar resposta">
            <span class="material-symbols-outlined">content_copy</span>
          </button>
        </div>
        <p class="text-slate-700 italic leading-relaxed text-sm">"${sug.texto || ''}"</p>
      </div>`;
            });
        }

        function escapeForAttr(str) {
            return (str || '').replace(/'/g, "\\'").replace(/"/g, '&quot;').replace(/\n/g, ' ');
        }

        async function copyText(btn, text) {
            const decoded = text.replace(/&quot;/g, '"');
            try {
                await navigator.clipboard.writeText(decoded);
                const icon = btn.querySelector('.material-symbols-outlined');
                icon.textContent = 'check';
                btn.style.color = '#16a34a';
                setTimeout(() => { icon.textContent = 'content_copy'; btn.style.color = ''; }, 2000);
            } catch (e) { }
        }

        // ==================== RESET ====================
        function resetAndStart() {
            document.getElementById('recipient').value = '';
            document.getElementById('message').value = '';
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            document.querySelectorAll('.goal-item').forEach(i => {
                i.classList.remove('selected');
                const check = i.querySelector('.goal-check');
                if (check) { check.style.backgroundColor = ''; check.style.borderColor = ''; check.querySelector('.material-symbols-outlined').classList.add('hidden'); }
            });
            state = { recipient: '', message: '', mood: '', goal: '' };
            goToScreen('screen-entry');
        }

        // ==================== AUDIO RECORDING ====================
        let recognition = null;
        let isRecording = false;

        function switchInputType(type) {
            const tabs = {
                'text': document.getElementById('tab-text'),
                'voice': document.getElementById('tab-voice'),
                'file': document.getElementById('tab-file')
            };
            const containers = {
                'text': document.getElementById('input-text-container'),
                'voice': document.getElementById('input-voice-container'),
                'file': document.getElementById('input-file-container')
            };

            for (const key in tabs) {
                if (key === type) {
                    tabs[key].classList.replace('text-slate-500', 'text-primary');
                    tabs[key].classList.add('bg-white', 'shadow-sm');
                    tabs[key].classList.remove('hover:text-slate-700');
                    containers[key].classList.remove('hidden');
                    if(key !== 'text') containers[key].classList.add('flex');
                } else {
                    tabs[key].classList.remove('bg-white', 'shadow-sm', 'text-primary');
                    tabs[key].classList.add('text-slate-500', 'hover:text-slate-700');
                    containers[key].classList.add('hidden');
                    containers[key].classList.remove('flex');
                }
            }
        }

        function toggleRecording() {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                alert('Gravação de voz não suportada neste navegador. Você ainda pode digitar seu texto.');
                return;
            }

            const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!recognition) {
                recognition = new SpeechRec();
                recognition.lang = 'pt-BR';
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onstart = () => {
                    isRecording = true;
                    document.getElementById('mic-btn').classList.add('recording');
                    document.getElementById('mic-btn').classList.replace('bg-slate-200', 'bg-red-500');
                    document.getElementById('mic-btn').classList.replace('text-slate-600', 'text-white');
                    document.getElementById('mic-status').textContent = 'Gravando... Toque no botão para parar';
                    document.getElementById('voice-transcript-preview').classList.remove('hidden');
                    document.getElementById('voice-transcript-preview').textContent = 'Ouvindo... (fale agora)';
                };

                recognition.onresult = (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';
                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interimTranscript += event.results[i][0].transcript;
                        }
                    }
                    const ta = document.getElementById('message');
                    if (finalTranscript) {
                        ta.value += (ta.value && !ta.value.endsWith(' ') ? ' ' : '') + finalTranscript;
                    }
                    document.getElementById('voice-transcript-preview').textContent = finalTranscript || interimTranscript || 'Ouvindo...';
                };

                recognition.onerror = (e) => {
                    console.error('Erro no microfone', e);
                    stopRecording();
                };

                recognition.onend = () => {
                    stopRecording();
                };
            }

            if (isRecording) {
                recognition.stop();
                stopRecording();
            } else {
                recognition.start();
            }
        }

        function stopRecording() {
            isRecording = false;
            document.getElementById('mic-btn').classList.remove('recording');
            document.getElementById('mic-btn').classList.replace('bg-red-500', 'bg-slate-200');
            document.getElementById('mic-btn').classList.replace('text-white', 'text-slate-600');
            document.getElementById('mic-status').textContent = 'Toque aqui para falar o que aconteceu';
            
            setTimeout(() => {
                if(document.getElementById('message').value.trim() !== "") {
                   switchInputType('text');
                }
            }, 1000);
        }

        async function handleGenericUpload(event) {
            const file = event.target.files[0];
            if (!file) return;

            const preview = document.getElementById('file-transcript-preview');
            const status = document.getElementById('file-upload-status');
            preview.classList.remove('hidden');
            preview.textContent = 'Extraindo texto do arquivo... Aguarde.';
            status.textContent = 'Processando...';

            try {
                let extractedText = '';

                // Is it an Audio? -> Whisper via Groq
                if (file.type.startsWith('audio/')) {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('model', 'whisper-large-v3-turbo');
                    formData.append('language', 'pt');
                    formData.append('response_format', 'json');

                    const res = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${API_CONFIG.apiKey}` },
                        body: formData
                    });

                    if (!res.ok) throw new Error(await res.text());
                    const data = await res.json();
                    extractedText = data.text;
                } 
                // Is it an Image? -> Tesseract.js OCR
                else if (file.type.startsWith('image/')) {
                    preview.textContent = 'Lendo a imagem (OCR)... Pode levar uns instantes.';
                    const worker = await Tesseract.createWorker('por');
                    const ret = await worker.recognize(file);
                    await worker.terminate();
                    extractedText = ret.data.text;
                }
                // Is it a PDF? -> PDF.js
                else if (file.type === 'application/pdf') {
                    preview.textContent = 'Lendo páginas do PDF...';
                    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
                    const arrayBuffer = await file.arrayBuffer();
                    const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
                    extractedText = "";
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        extractedText += textContent.items.map(item => item.str).join(' ') + '';
                    }
                } else {
                    throw new Error('Formato de arquivo não suportado. Envie Imagem, PDF ou Áudio.');
                }

                if (extractedText && extractedText.trim().length > 0) {
                    const ta = document.getElementById('message');
                    ta.value += (ta.value && !ta.value.endsWith(' ') ? '': '') + extractedText.trim();
                    preview.textContent = 'Leitura concluída com sucesso!';
                    setTimeout(() => {
                        switchInputType('text');
                    }, 1500);
                } else {
                    preview.textContent = 'Não conseguimos extrair texto deste arquivo.';
                }
            } catch (err) {
                console.error('Upload Error:', err);
                preview.textContent = 'Erro ao processar: ' + (err.message || 'Falha na extração.');
            } finally {
                status.textContent = 'Fotos (Print), PDFs ou Áudios';
                event.target.value = ''; // reseta input config
            }
        }

        // Init
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.screen').forEach(s => { if (!s.classList.contains('active')) s.style.display = 'none'; });
        });