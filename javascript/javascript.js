const QUESTIONS = [
  {
    q: "Você estava na região de Kanto, no Japão, durante o início das mortes inexplicáveis de criminosos?",
    weight: 12,
    quote: "Se estivesse em Kanto, você se enquadra na área geográfica inicial do experimento diário de Kira..."
  },
  {
    q: "Você tem acesso direto ou indireto às redes confidenciais da Polícia Japonesa ou da Força-Tarefa?",
    weight: 15,
    quote: "Kira demonstrou acesso imediato a informações sigilosas da polícia..."
  },
  {
    q: "Você já teve posse ou tocou num caderno de capa preta com regras de utilização em inglês?",
    weight: 20,
    quote: "A existência do caderno é a peça chave deste caso..."
  },
  {
    q: "Você considera justa a eliminação sumária de criminosos para a construção de um 'novo mundo'?",
    weight: 10,
    quote: "O perfil ideológico do assassino revela um grave desvio de justiça..."
  },
  {
    q: "Seu ritmo cardíaco se altera ou você sente tensão fisiológica ao ouvir o nome 'L'?",
    weight: 8,
    quote: "Analisando micro-variações na sua frequência miocárdica..."
  },
  {
    q: "Você usou métodos de dissimulação para evitar o monitoramento por câmeras ocultas no seu quarto?",
    weight: 18,
    quote: "A vigilância de 24 horas expõe comportamentos compulsivos de disfarce..."
  },
  {
    q: "Existe algum fragmento de papel cortado escondido num compartimento secreto do seu relógio?",
    weight: 22,
    quote: "Um único pedaço de papel é suficiente para executar uma vítima..."
  },
  {
    q: "Você sente alívio ao cogitar a hipótese da Força-Tarefa e L falharem na investigação?",
    weight: 14,
    quote: "O desejo de eliminação do investigador principal é característico do suspeito..."
  },
  {
    q: "Você usaria a boa-fé de um familiar ou policial veterano para proteger o seu segredo?",
    weight: 16,
    quote: "Kira não hesita em manipular pessoas próximas para garantir imunidade..."
  },
  {
    q: "Você afirma sob juramento diante deste polígrafo que NÃO É o Kira?",
    weight: 5,
    quote: "Processando resposta final para o cálculo de probabilidade conclusivo..."
  }
];

let currentIndex = 0;
let totalKiraScore = 0;
let maxScore = QUESTIONS.reduce((acc, curr) => acc + curr.weight, 0);
let soundEnabled = true;
let audioCtx = null;

window.addEventListener('DOMContentLoaded', () => {
  renderDots();
});

function renderDots() {
  const dotsContainer = document.getElementById('p-pontos');
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  for (let i = 0; i < QUESTIONS.length; i++) {
    const dot = document.createElement('div');
    dot.className = `dot-item ${i === 0 ? 'active' : ''}`;
    dot.id = `dot-${i}`;
    dotsContainer.appendChild(dot);
  }
}

function playSound(freq, duration = 0.08) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {}
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const soundBtn = document.getElementById('botao-som');
  if (soundBtn) {
    soundBtn.innerText = soundEnabled ? "🔊 SOM: LIGADO" : "🔇 SOM: DESLIGADO";
  }
}

function startTest() {
  playSound(800, 0.1);
  
  const inicioScreen = document.getElementById('inicio');
  if (inicioScreen) {
    inicioScreen.classList.add('hidden');
  }
  
  const quizScreen = document.getElementById('Teste');
  if (quizScreen) {
    quizScreen.classList.remove('hidden');
  }

  loadQuestion();
}

function loadQuestion() {
  const current = QUESTIONS[currentIndex];
  const qNumElem = document.getElementById('q-num');
  const pTextoElem = document.getElementById('p-texto');
  const deducaoElem = document.getElementById('deducao');

  if (qNumElem) qNumElem.innerText = currentIndex + 1;
  if (pTextoElem) pTextoElem.innerText = `"${current.q}"`;
  if (deducaoElem) deducaoElem.innerText = `"${current.quote}"`;

  for (let i = 0; i < QUESTIONS.length; i++) {
    const dot = document.getElementById(`dot-${i}`);
    if (dot) {
      if (i <= currentIndex) dot.classList.add('active');
      else dot.classList.remove('active');
    }
  }
}

function answer(isYes) {
  playSound(isYes ? 900 : 400, 0.08);

  const current = QUESTIONS[currentIndex];
  if (isYes) {
    totalKiraScore += current.weight;
  }

  updateBiometrics();

  const registroStatus = document.getElementById('registro-status');
  if (registroStatus) {
    registroStatus.innerText = `> Resposta [${isYes ? 'SIM' : 'NÃO'}] registrada. Analisando oscilação na curva GSR...`;
  }

  currentIndex++;

  if (currentIndex < QUESTIONS.length) {
    setTimeout(loadQuestion, 300);
  } else {
    setTimeout(finishTest, 500);
  }
}

function updateBiometrics() {
  const ratio = totalKiraScore / maxScore;
  const probPct = (ratio * 100).toFixed(1);
  const stressVal = Math.round(ratio * 100);

  const stressPctElem = document.getElementById('stress-pct');
  const kiraProbPctElem = document.getElementById('kira-prob-pct');
  const kiraProbBarElem = document.getElementById('kira-prob-bar');

  if (stressPctElem) stressPctElem.innerText = `${stressVal}%`;
  if (kiraProbPctElem) kiraProbPctPctElem = kiraProbPctElem.innerText = `${probPct}%`;
  if (kiraProbBarElem) kiraProbBarElem.style.width = `${probPct}%`;

  const angle = -60 + (ratio * 120);
  const pointer = document.getElementById('medida-ponteiro');
  if (pointer) {
    pointer.style.transform = `rotate(${angle}deg)`;
  }
}

function finishTest() {
  playSound(1200, 0.3);
  
  const quizScreen = document.getElementById('Teste');
  if (quizScreen) quizScreen.classList.add('hidden');

  const resultScreen = document.getElementById('tela-resultado');
  if (resultScreen) resultScreen.classList.remove('hidden');

  const finalRatio = totalKiraScore / maxScore;
  const finalProb = (finalRatio * 100).toFixed(1);
  const finalStress = Math.round(finalRatio * 100);

  const finalProbElem = document.getElementById('final-prob');
  const finalStressElem = document.getElementById('final-stress');

  if (finalProbElem) finalProbElem.innerText = `${finalProb}%`;
  if (finalStressElem) finalStressElem.innerText = `${finalStress}%`;

  const banner = document.getElementById('veredito-banner');
  const notes = document.getElementById('l-notas-finais');

  if (finalRatio > 0.45) {
    if (banner) {
      banner.className = "veredito-banner veredito-kira";
      banner.innerText = "VEREDITO: SUSPEITO IDENTIFICADO COMO KIRA";
    }
    if (notes) {
      notes.innerHTML = `<strong>Dedução de Lawliet:</strong> "As alterações galvânicas e os padrões de resposta confirmam uma correspondência elevada com o perfil de Kira. Recomendo custódia imediata."`;
    }
  } else {
    if (banner) {
      banner.className = "veredito-banner veredito-inocente";
      banner.innerText = "VEREDITO: INOCENTE (BAIXA SUSPEITA)";
    }
    if (notes) {
      notes.innerHTML = `<strong>Dedução de Lawliet:</strong> "Os sinais biométricos mantiveram-se dentro dos níveis normais de estresse biológico. A probabilidade de ligação com o caso Kira é baixa."`;
    }
  }
}

function resetTest() {
  currentIndex = 0;
  totalKiraScore = 0;
  updateBiometrics();
  renderDots();
  
  const resultScreen = document.getElementById('tela-resultado');
  if (resultScreen) resultScreen.classList.add('hidden');

  const inicioScreen = document.getElementById('inicio');
  if (inicioScreen) inicioScreen.classList.remove('hidden');
}