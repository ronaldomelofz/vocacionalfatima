import { useEffect, useMemo, useState } from "react";

const QUESTION_TIME = 10;

const COLORS = {
  bgTop: "#fff4d8",
  bgBottom: "#e7f0ff",
  ink: "#271f3b",
  inkSoft: "#5d5573",
  primary: "#7c3aed",
  secondary: "#f97316",
  accent: "#ec4899",
  green: "#16a34a",
  surface: "rgba(255,255,255,0.78)",
  surfaceStrong: "rgba(255,255,255,0.9)",
  border: "rgba(124,58,237,0.14)",
  shadow: "0 24px 60px rgba(76,29,149,0.14)",
  sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
};

const GROUPS = [
  { id: "escola-fe", nome: "Escola da Fé", icon: "📘", color: "#7c3aed", resumo: "Para quem gosta de aprofundar a fé e formar outras pessoas." },
  { id: "pj", nome: "PJ", icon: "🔥", color: "#ef4444", resumo: "Juventude, missão, encontro e protagonismo jovem." },
  { id: "catequese-infantil", nome: "Catequese Infantil", icon: "🧒", color: "#f59e0b", resumo: "Acompanhamento da fé das crianças com carinho e criatividade." },
  { id: "catequese-ja", nome: "Catequese de Jovens e Adultos", icon: "🗣️", color: "#0ea5e9", resumo: "Para quem gosta de ensinar e caminhar com jovens e adultos na fé." },
  { id: "adolescente", nome: "Pastoral do Adolescente", icon: "🌟", color: "#22c55e", resumo: "Ideal para quem se conecta com adolescentes e quer acompanhá-los." },
  { id: "vocacional", nome: "Pastoral Vocacional", icon: "🧭", color: "#8b5cf6", resumo: "Ajuda jovens e adultos a discernirem seu chamado na Igreja." },
  { id: "batismo", nome: "Pastoral do Batismo", icon: "💧", color: "#06b6d4", resumo: "Acolhe famílias e prepara pais e padrinhos para o sacramento." },
  { id: "comunicacao", nome: "Pastoral da Comunicação", icon: "📱", color: "#2563eb", resumo: "Para quem comunica bem, cria conteúdo e gosta das mídias." },
  { id: "apostolado", nome: "Apostolado da Oração", icon: "🙏", color: "#db2777", resumo: "Espiritualidade, intercessão e vida de oração constante." },
  { id: "terco-homens", nome: "Terço dos Homens", icon: "📿", color: "#1d4ed8", resumo: "Devoção, fraternidade e testemunho na oração do terço." },
  { id: "legiao", nome: "Legião de Maria", icon: "🌹", color: "#9333ea", resumo: "Para quem ama a espiritualidade mariana e o serviço missionário." },
  { id: "bordando", nome: "Bordando Histórias", icon: "🧵", color: "#f97316", resumo: "Criatividade, delicadeza e evangelização com trabalho manual." },
  { id: "misericordia", nome: "Pastoral da Misericórdia", icon: "❤️", color: "#e11d48", resumo: "Serviço concreto, cuidado e presença junto a quem mais precisa." },
  { id: "dizimo", nome: "Pastoral do Dízimo", icon: "🪙", color: "#ca8a04", resumo: "Organização, corresponsabilidade e sustento da comunidade." },
  { id: "liturgia", nome: "Liturgia", icon: "✨", color: "#dc2626", resumo: "Celebração, preparação da missa e amor pela liturgia." },
  { id: "acolitos", nome: "Acólitos", icon: "⛪", color: "#7c3aed", resumo: "Serviço no altar, reverência e participação na celebração." },
  { id: "acolhida", nome: "Acolhida", icon: "🤝", color: "#f59e0b", resumo: "Receber bem, orientar e fazer cada pessoa se sentir em casa." },
  { id: "proclamadores", nome: "Proclamadores", icon: "📖", color: "#0f766e", resumo: "Para quem proclama a Palavra com clareza, fé e presença." },
];

const GROUP_MAP = Object.fromEntries(GROUPS.map((group) => [group.id, group]));

const QUESTIONS = [
  {
    id: "ambiente",
    categoria: "Pergunta 1",
    texto: "Onde você mais se anima em servir?",
    opcoes: [
      { texto: "Com adolescentes e jovens", pesos: { pj: 3, adolescente: 3, vocacional: 2, comunicacao: 1 } },
      { texto: "Ensinando e formando na fé", pesos: { "escola-fe": 3, "catequese-infantil": 2, "catequese-ja": 2, batismo: 1 } },
      { texto: "Na missa e na acolhida", pesos: { liturgia: 3, acolhida: 2, proclamadores: 2, acolitos: 2 } },
      { texto: "Na oração e na missão", pesos: { apostolado: 3, legiao: 2, "terco-homens": 2, misericordia: 1 } },
    ],
  },
  {
    id: "talento",
    categoria: "Pergunta 2",
    texto: "Seu talento aparece mais quando você...",
    opcoes: [
      { texto: "Fala bem em público ou lê com segurança", pesos: { proclamadores: 3, "escola-fe": 2, liturgia: 1 } },
      { texto: "Cria, comunica, fotografa ou posta", pesos: { comunicacao: 3, pj: 1, bordando: 1 } },
      { texto: "Organiza, acolhe e faz acontecer", pesos: { acolhida: 3, dizimo: 2, batismo: 1, liturgia: 1 } },
      { texto: "Capricha nos detalhes e gosta de fazer com as mãos", pesos: { bordando: 3, misericordia: 1, comunicacao: 1 } },
    ],
  },
  {
    id: "publico",
    categoria: "Pergunta 3",
    texto: "Quem você sente vontade de acompanhar mais de perto?",
    opcoes: [
      { texto: "Crianças", pesos: { "catequese-infantil": 3, batismo: 1 } },
      { texto: "Adolescentes e jovens", pesos: { adolescente: 3, pj: 3, vocacional: 1 } },
      { texto: "Adultos e famílias", pesos: { "catequese-ja": 3, acolhida: 1, dizimo: 1, batismo: 1 } },
      { texto: "Quem precisa de cuidado e oração", pesos: { misericordia: 3, apostolado: 2, legiao: 1 } },
    ],
  },
  {
    id: "espiritualidade",
    categoria: "Pergunta 4",
    texto: "Na espiritualidade, você se identifica mais com...",
    opcoes: [
      { texto: "Terço, devoção mariana e missão", pesos: { legiao: 3, "terco-homens": 2, apostolado: 1 } },
      { texto: "Adoração, intercessão e reparação", pesos: { apostolado: 3, misericordia: 1, vocacional: 1 } },
      { texto: "Louvor, missão e alegria em grupo", pesos: { pj: 2, adolescente: 2, vocacional: 2, comunicacao: 1 } },
      { texto: "Serviço na missa e amor à Palavra", pesos: { liturgia: 3, proclamadores: 2, acolitos: 2 } },
    ],
  },
  {
    id: "estilo",
    categoria: "Pergunta 5",
    texto: "Que tipo de serviço combina mais com você?",
    opcoes: [
      { texto: "Servir no altar e nas celebrações", pesos: { liturgia: 2, acolitos: 3, proclamadores: 2 } },
      { texto: "Receber pessoas e acompanhar famílias", pesos: { acolhida: 3, batismo: 2, dizimo: 2 } },
      { texto: "Missão jovem e dinamismo", pesos: { pj: 2, adolescente: 2, vocacional: 2, comunicacao: 1 } },
      { texto: "Caridade e cuidado fraterno", pesos: { misericordia: 3, apostolado: 1, legiao: 1 } },
    ],
  },
  {
    id: "feira",
    categoria: "Pergunta 6",
    texto: "Na feira de hoje, qual grupo você teria vontade de conhecer primeiro?",
    opcoes: [
      { texto: "Juventude, Vocacional ou Comunicação", pesos: { pj: 2, adolescente: 2, vocacional: 3, comunicacao: 2 } },
      { texto: "Catequese, Escola da Fé ou Batismo", pesos: { "escola-fe": 2, "catequese-infantil": 2, "catequese-ja": 2, batismo: 2 } },
      { texto: "Liturgia, Acólitos, Proclamadores ou Acolhida", pesos: { liturgia: 2, acolitos: 2, proclamadores: 2, acolhida: 2 } },
      { texto: "Oração, Misericórdia, Dízimo ou Bordando Histórias", pesos: { apostolado: 2, "terco-homens": 2, legiao: 2, misericordia: 2, dizimo: 2, bordando: 2 } },
    ],
  },
];

const INITIAL_PROFILE = {
  nome: "",
  idade: "",
  estadoCivil: "solteiro",
};

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { min-height: 100%; }
  body {
    font-family: ${COLORS.sans};
    color: ${COLORS.ink};
    background:
      radial-gradient(circle at top left, rgba(249, 115, 22, 0.25), transparent 26%),
      radial-gradient(circle at top right, rgba(236, 72, 153, 0.22), transparent 22%),
      radial-gradient(circle at bottom left, rgba(14, 165, 233, 0.22), transparent 24%),
      linear-gradient(180deg, ${COLORS.bgTop}, ${COLORS.bgBottom});
    -webkit-font-smoothing: antialiased;
  }
  html.quiz-lock, html.quiz-lock body { overflow: hidden; }
  button, input { font: inherit; }
  .app {
    min-height: 100dvh;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .panel {
    width: min(100%, 980px);
    background: ${COLORS.surface};
    border: 1px solid rgba(255,255,255,0.66);
    border-radius: 28px;
    box-shadow: ${COLORS.shadow};
    backdrop-filter: blur(18px);
    overflow: hidden;
  }
  .screen {
    padding: 28px;
  }
  .intro,
  .profile,
  .loading,
  .result {
    text-align: center;
  }
  .intro .cross {
    margin-bottom: 18px;
  }
  .cross {
    position: relative;
    width: 52px;
    height: 62px;
    margin: 0 auto;
  }
  .cross::before,
  .cross::after {
    content: "";
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 999px;
    background: linear-gradient(180deg, ${COLORS.secondary}, ${COLORS.primary});
  }
  .cross::before {
    top: 6px;
    width: 4px;
    height: 50px;
  }
  .cross::after {
    top: 22px;
    width: 34px;
    height: 4px;
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 7px 14px;
    border-radius: 999px;
    background: rgba(124,58,237,0.12);
    color: ${COLORS.primary};
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .title {
    margin-top: 18px;
    font-family: ${COLORS.serif};
    font-size: clamp(34px, 6vw, 58px);
    line-height: 1.05;
    color: ${COLORS.ink};
  }
  .title span {
    display: block;
    color: ${COLORS.secondary};
    font-style: italic;
  }
  .subtitle {
    margin: 18px auto 0;
    max-width: 640px;
    font-size: 18px;
    line-height: 1.7;
    color: ${COLORS.inkSoft};
  }
  .chips {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
  }
  .chip {
    padding: 8px 14px;
    border-radius: 999px;
    background: rgba(255,255,255,0.82);
    border: 1px solid rgba(124,58,237,0.12);
    color: ${COLORS.primary};
    font-size: 13px;
    font-weight: 700;
  }
  .primary-button,
  .secondary-button {
    border: none;
    border-radius: 16px;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  }
  .primary-button:hover,
  .secondary-button:hover {
    transform: translateY(-2px);
  }
  .primary-button {
    margin-top: 28px;
    padding: 16px 28px;
    background: linear-gradient(135deg, ${COLORS.secondary}, ${COLORS.accent});
    color: white;
    font-size: 18px;
    font-weight: 800;
    box-shadow: 0 16px 30px rgba(236, 72, 153, 0.22);
  }
  .quote {
    margin-top: 22px;
    font-family: ${COLORS.serif};
    font-style: italic;
    font-size: 18px;
    color: ${COLORS.inkSoft};
  }
  .profile h2,
  .loading h2,
  .result h2 {
    font-family: ${COLORS.serif};
    font-size: clamp(28px, 4vw, 42px);
    color: ${COLORS.ink};
  }
  .profile p,
  .loading p,
  .result p {
    color: ${COLORS.inkSoft};
  }
  .form {
    width: min(100%, 560px);
    margin: 26px auto 0;
    display: grid;
    gap: 14px;
  }
  .field-label {
    font-size: 14px;
    font-weight: 700;
    color: ${COLORS.primary};
    text-align: left;
    margin-bottom: 6px;
  }
  .input {
    width: 100%;
    padding: 15px 16px;
    border-radius: 16px;
    border: 1px solid rgba(124,58,237,0.18);
    background: rgba(255,255,255,0.92);
    color: ${COLORS.ink};
    font-size: 17px;
    outline: none;
  }
  .input:focus {
    border-color: rgba(124,58,237,0.55);
    box-shadow: 0 0 0 4px rgba(124,58,237,0.1);
  }
  .toggle-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .toggle {
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid rgba(124,58,237,0.16);
    background: rgba(255,255,255,0.9);
    color: ${COLORS.ink};
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
  }
  .toggle.active {
    background: linear-gradient(135deg, rgba(124,58,237,0.16), rgba(249,115,22,0.16));
    border-color: rgba(124,58,237,0.44);
    color: ${COLORS.primary};
  }
  .secondary-button {
    padding: 14px 24px;
    background: linear-gradient(135deg, ${COLORS.primary}, #4f46e5);
    color: white;
    font-size: 17px;
    font-weight: 800;
    box-shadow: 0 14px 28px rgba(79,70,229,0.2);
  }
  .secondary-button:disabled,
  .primary-button:disabled {
    opacity: 0.55;
    cursor: default;
    transform: none;
  }
  .quiz-header {
    padding: 16px 22px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .quiz-progress {
    display: flex;
    gap: 6px;
  }
  .quiz-progress-dot {
    height: 8px;
    border-radius: 999px;
    background: rgba(124,58,237,0.14);
    transition: width 0.2s ease, background 0.2s ease;
  }
  .quiz-progress-dot.done { background: linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent}); }
  .quiz-progress-dot.current { background: linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent}); }
  .timer-chip {
    min-width: 74px;
    text-align: center;
    padding: 8px 12px;
    border-radius: 999px;
    background: rgba(255,255,255,0.88);
    border: 1px solid rgba(249,115,22,0.22);
    color: ${COLORS.secondary};
    font-weight: 800;
  }
  .timer-bar {
    height: 8px;
    margin: 14px 22px 0;
    border-radius: 999px;
    background: rgba(124,58,237,0.1);
    overflow: hidden;
  }
  .timer-fill {
    height: 100%;
    background: linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent});
    border-radius: 999px;
    transition: width 1s linear;
  }
  .quiz-body {
    min-height: calc(100dvh - 150px);
    max-height: calc(100dvh - 150px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 22px 24px;
  }
  .question-card {
    width: min(100%, 860px);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .question-meta {
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${COLORS.primary};
  }
  .question-title {
    font-family: ${COLORS.serif};
    font-size: clamp(27px, 4vw, 40px);
    line-height: 1.15;
    color: ${COLORS.ink};
  }
  .question-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .answer {
    min-height: 118px;
    border: 1px solid rgba(124,58,237,0.14);
    border-radius: 20px;
    background: ${COLORS.surfaceStrong};
    padding: 16px;
    text-align: left;
    color: ${COLORS.ink};
    cursor: pointer;
    transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease;
  }
  .answer:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: rgba(124,58,237,0.4);
    box-shadow: 0 12px 26px rgba(124,58,237,0.12);
  }
  .answer strong {
    display: block;
    margin-bottom: 8px;
    color: ${COLORS.primary};
    font-size: 14px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
  .answer span {
    font-size: 18px;
    line-height: 1.45;
  }
  .answer.dim { opacity: 0.4; }
  .answer.selected {
    border-color: rgba(236,72,153,0.55);
    background: linear-gradient(135deg, rgba(249,115,22,0.14), rgba(236,72,153,0.16));
  }
  .loading {
    padding: 64px 28px 70px;
  }
  .loading-spinner {
    width: 52px;
    height: 52px;
    margin: 0 auto 18px;
    border-radius: 50%;
    border: 4px solid rgba(124,58,237,0.14);
    border-top-color: ${COLORS.primary};
    animation: spin 0.85s linear infinite;
  }
  .result {
    padding: 28px;
  }
  .result-note {
    margin: 12px auto 0;
    max-width: 700px;
    font-size: 17px;
    line-height: 1.65;
  }
  .result-grid {
    margin-top: 26px;
    display: grid;
    gap: 14px;
  }
  .result-card {
    text-align: left;
    padding: 18px;
    border-radius: 22px;
    background: rgba(255,255,255,0.85);
    border: 1px solid rgba(255,255,255,0.75);
    box-shadow: 0 14px 28px rgba(76,29,149,0.08);
  }
  .result-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 10px;
  }
  .result-card-title {
    display: flex;
    align-items: center;
    gap: 12px;
    color: ${COLORS.ink};
    font-family: ${COLORS.serif};
    font-size: 23px;
  }
  .result-card-rank {
    padding: 7px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: rgba(255,255,255,0.72);
  }
  .result-card p {
    font-size: 16px;
    line-height: 1.6;
  }
  .result-footer {
    margin-top: 24px;
    display: grid;
    gap: 12px;
    justify-items: center;
  }
  .result-final {
    font-size: 18px;
    line-height: 1.7;
    max-width: 720px;
  }
  .mini-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px;
    margin-top: 8px;
  }
  .mini-item {
    padding: 9px 13px;
    border-radius: 14px;
    background: rgba(255,255,255,0.78);
    border: 1px solid rgba(124,58,237,0.14);
    color: ${COLORS.inkSoft};
    font-size: 14px;
    font-weight: 700;
  }
  @media (max-width: 760px) {
    .app { padding: 14px; }
    .screen, .result { padding: 22px 18px; }
    .question-grid { grid-template-columns: 1fr; }
    .quiz-body { padding: 16px 14px 20px; min-height: auto; max-height: none; }
    html.quiz-lock, html.quiz-lock body { overflow: auto; }
  }
`;

function somarPesos(scores, pesos) {
  Object.entries(pesos).forEach(([id, valor]) => {
    scores[id] = (scores[id] || 0) + valor;
  });
}

function construirRanking(profile, answers) {
  const scores = Object.fromEntries(GROUPS.map((group) => [group.id, 0]));

  answers.forEach((answer) => {
    if (answer?.pesos) somarPesos(scores, answer.pesos);
  });

  const idade = Number(profile.idade || 0);
  if (idade > 0 && idade <= 17) {
    somarPesos(scores, { adolescente: 3, pj: 2, acolitos: 2, vocacional: 1 });
  } else if (idade <= 24) {
    somarPesos(scores, { pj: 3, vocacional: 2, comunicacao: 2, acolhida: 1 });
  } else if (idade <= 35) {
    somarPesos(scores, { "catequese-ja": 2, "escola-fe": 2, acolhida: 1, dizimo: 1 });
  } else if (idade > 35) {
    somarPesos(scores, { "escola-fe": 2, dizimo: 2, acolhida: 2, batismo: 1 });
  }

  if (profile.estadoCivil === "casado") {
    somarPesos(scores, { batismo: 3, dizimo: 2, acolhida: 2, "catequese-ja": 1 });
  } else {
    somarPesos(scores, { pj: 1, vocacional: 2, adolescente: 1, acolitos: 1 });
  }

  return GROUPS
    .map((group) => ({ ...group, pontos: scores[group.id] }))
    .sort((a, b) => b.pontos - a.pontos);
}

function Progress({ current, total }) {
  return (
    <div className="quiz-progress">
      {Array.from({ length: total }).map((_, index) => {
        const state =
          index < current ? "done" : index === current ? "current" : "";
        return (
          <div
            key={index}
            className={`quiz-progress-dot ${state}`}
            style={{ width: index === current ? 28 : index < current ? 18 : 10 }}
          />
        );
      })}
    </div>
  );
}

function QuestionCard({ question, index, total, selectedIndex, onSelect }) {
  return (
    <div className="question-card">
      <div className="question-meta">
        {question.categoria} · {index + 1} de {total}
      </div>
      <h2 className="question-title">{question.texto}</h2>
      <div className="question-grid">
        {question.opcoes.map((option, optionIndex) => {
          const isSelected = selectedIndex === optionIndex;
          const isDim = selectedIndex !== null && !isSelected;
          return (
            <button
              key={optionIndex}
              type="button"
              className={`answer${isSelected ? " selected" : ""}${isDim ? " dim" : ""}`}
              onClick={() => selectedIndex === null && onSelect(optionIndex)}
              disabled={selectedIndex !== null}
            >
              <strong>{String.fromCharCode(65 + optionIndex)}</strong>
              <span>{option.texto}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultCard({ item, rank }) {
  const label =
    rank === 0 ? "Mais indicada" : rank === 1 ? "Também combina" : "Vale visitar";

  return (
    <div
      className="result-card"
      style={{
        borderColor: `${item.color}44`,
        boxShadow: `0 14px 28px ${item.color}18`,
      }}
    >
      <div className="result-card-header">
        <div className="result-card-title" style={{ color: item.color }}>
          <span>{item.icon}</span>
          <span>{item.nome}</span>
        </div>
        <div className="result-card-rank" style={{ color: item.color }}>
          {label}
        </div>
      </div>
      <p>{item.resumo}</p>
    </div>
  );
}

export default function App() {
  const [stage, setStage] = useState("intro");
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [result, setResult] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle("quiz-lock", stage === "quiz");
    return () => document.documentElement.classList.remove("quiz-lock");
  }, [stage]);

  useEffect(() => {
    if (stage !== "quiz") return;
    setTimeLeft(QUESTION_TIME);
    setSelectedIndex(null);
  }, [currentQuestion, stage]);

  useEffect(() => {
    if (stage !== "quiz" || selectedIndex !== null) return;
    if (timeLeft <= 0) {
      responder(null);
      return;
    }
    const timer = window.setTimeout(() => {
      setTimeLeft((value) => value - 1);
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [stage, timeLeft, selectedIndex]);

  const topRecommendations = useMemo(() => result.slice(0, 4), [result]);

  function updateProfile(field, value) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function startQuiz() {
    if (!profile.nome.trim() || !profile.idade.trim()) return;
    setCurrentQuestion(0);
    setSelectedIndex(null);
    setAnswers([]);
    setResult([]);
    setTimeLeft(QUESTION_TIME);
    setStage("quiz");
  }

  function responder(optionIndex) {
    if (selectedIndex !== null) return;
    setSelectedIndex(optionIndex === null ? -1 : optionIndex);
    const option = optionIndex === null ? null : QUESTIONS[currentQuestion].opcoes[optionIndex];
    const nextAnswers = [...answers, option];
    setAnswers(nextAnswers);

    if (currentQuestion === QUESTIONS.length - 1) {
      setStage("loading");
      const ranking = construirRanking(profile, nextAnswers);
      window.setTimeout(() => {
        setResult(ranking);
        setStage("result");
      }, 1200);
      return;
    }

    window.setTimeout(() => {
      setCurrentQuestion((value) => value + 1);
    }, 260);
  }

  function restart() {
    setStage("intro");
    setProfile(INITIAL_PROFILE);
    setCurrentQuestion(0);
    setSelectedIndex(null);
    setAnswers([]);
    setResult([]);
    setTimeLeft(QUESTION_TIME);
  }

  const canStart = profile.nome.trim() && profile.idade.trim();
  const timerWidth = `${(timeLeft / QUESTION_TIME) * 100}%`;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="panel">
          {stage === "intro" && (
            <div className="screen intro">
              <div className="cross" />
              <div className="eyebrow">Feira das Pastorais 2026</div>
              <h1 className="title">Quiz Vocacional</h1>
              <button type="button" className="primary-button" onClick={() => setStage("profile")}>
                Começar agora
              </button>
            </div>
          )}

          {stage === "profile" && (
            <div className="screen profile">
              <div className="eyebrow">Antes de começar</div>
              <h2>Conta pra gente rapidinho</h2>
              <p className="subtitle" style={{ maxWidth: 520 }}>
                Nome, idade e estado civil ajudam a indicar melhor os grupos que combinam
                com a sua fase de vida.
              </p>
              <div className="form">
                <div>
                  <div className="field-label">Seu nome</div>
                  <input
                    className="input"
                    value={profile.nome}
                    onChange={(event) => updateProfile("nome", event.target.value)}
                    placeholder="Digite seu nome"
                  />
                </div>
                <div>
                  <div className="field-label">Sua idade</div>
                  <input
                    className="input"
                    type="number"
                    min="10"
                    max="99"
                    value={profile.idade}
                    onChange={(event) => updateProfile("idade", event.target.value)}
                    placeholder="Ex.: 16"
                  />
                </div>
                <div>
                  <div className="field-label">Você é casado(a)?</div>
                  <div className="toggle-row">
                    <button
                      type="button"
                      className={`toggle${profile.estadoCivil === "solteiro" ? " active" : ""}`}
                      onClick={() => updateProfile("estadoCivil", "solteiro")}
                    >
                      Não
                    </button>
                    <button
                      type="button"
                      className={`toggle${profile.estadoCivil === "casado" ? " active" : ""}`}
                      onClick={() => updateProfile("estadoCivil", "casado")}
                    >
                      Sim
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={startQuiz}
                  disabled={!canStart}
                >
                  Ir para o quiz
                </button>
              </div>
            </div>
          )}

          {stage === "quiz" && (
            <>
              <div className="quiz-header">
                <Progress current={currentQuestion} total={QUESTIONS.length} />
                <div className="timer-chip">{timeLeft}s</div>
              </div>
              <div className="timer-bar">
                <div className="timer-fill" style={{ width: timerWidth }} />
              </div>
              <div className="quiz-body">
                <QuestionCard
                  question={QUESTIONS[currentQuestion]}
                  index={currentQuestion}
                  total={QUESTIONS.length}
                  selectedIndex={selectedIndex}
                  onSelect={responder}
                />
              </div>
            </>
          )}

          {stage === "loading" && (
            <div className="screen loading">
              <div className="loading-spinner" />
              <h2>Analisando ......</h2>
              <p className="subtitle" style={{ maxWidth: 520 }}>
                Cruzando seu perfil com os grupos e pastorais da feira de hoje.
              </p>
            </div>
          )}

          {stage === "result" && topRecommendations.length > 0 && (
            <div className="result">
              <div className="eyebrow">Resultado da feira</div>
              <h2>{profile.nome},</h2>
              <p className="result-note">
                De acordo com suas respostas possivelmente você tem dons para servir nas
                seguintes pastorais. Não esqueça de conhecê-las hoje.
              </p>

              <div className="result-grid">
                {topRecommendations.map((item, index) => (
                  <ResultCard key={item.id} item={item} rank={index} />
                ))}
              </div>

              <div className="result-footer">
                <p className="result-final">
                  Visite os grupos indicados para conversar, tirar duvidas e conhecer melhor
                  cada servico.
                </p>

                <div className="mini-list">
                  {result.slice(4, 10).map((item) => (
                    <div key={item.id} className="mini-item">
                      {item.icon} {item.nome}
                    </div>
                  ))}
                </div>

                <button type="button" className="secondary-button" onClick={restart}>
                  Refazer quiz
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
