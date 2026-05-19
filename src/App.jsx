import { useState, useRef, useEffect } from "react";

// ── 18 PASTORAIS da Paróquia N. Sra. de Fátima — Teresina, PI ─────────────
const PASTORAIS = {
  liturgia:     { id:"liturgia",     nome:"Pastoral Litúrgica & Acólitos",               icon:"✝️",  color:"#8B0000", bg:"rgba(139,0,0,0.13)",      desc:"Planeja e anima as celebrações eucarísticas. Os acólitos servem no altar junto ao padre nos momentos mais sagrados da Missa.",                    url:"https://nsfatima.org.br/pastoral-liturgica/" },
  enfermos:     { id:"enfermos",     nome:"Pastoral dos Enfermos / Min. da Eucaristia",  icon:"🤲",  color:"#2A7A5A", bg:"rgba(42,122,90,0.13)",    desc:"Leva a Eucaristia e a Palavra de Deus a enfermos e acamados. Auxilia o padre no altar e acompanha quem sofre com presença espiritual.",           url:"https://nsfatima.org.br/pastoral-dos-enfermos-mm-ee-ee/" },
  catequese:    { id:"catequese",    nome:"Catequese & Escola da Fé Santa Edith Stein",  icon:"📖",  color:"#1a4a8a", bg:"rgba(26,74,138,0.13)",    desc:"Acompanha crianças, jovens e adultos na jornada da fé. A Escola da Fé aprofunda o conhecimento teológico e espiritual dos fiéis.",                  url:"https://nsfatima.org.br/catequese/" },
  batismo:      { id:"batismo",      nome:"Pastoral do Batismo",                         icon:"💧",  color:"#0A7B8E", bg:"rgba(10,123,142,0.13)",   desc:"Prepara pais e padrinhos para as exigências do compromisso batismal, acompanhando as famílias desde o início da vida cristã.",                    url:"https://nsfatima.org.br/pastoral-do-batismo/" },
  juventude:    { id:"juventude",    nome:"Pastoral da Juventude",                       icon:"🔥",  color:"#B85E00", bg:"rgba(184,94,0,0.13)",     desc:"Ação da Igreja no meio jovem, em sintonia com as diretrizes da CNBB. Grupos de fé, retiros, missões e formação integral do jovem cristão.",        url:"https://nsfatima.org.br/pastoral-da-juventude/" },
  familia:      { id:"familia",      nome:"Pastoral da Família",                         icon:"🏠",  color:"#4a7a30", bg:"rgba(74,122,48,0.13)",    desc:"Possibilita a evangelização da família segundo as diretrizes da Igreja, acompanhando e fortalecendo os lares na vivência cristã.",                  url:"https://nsfatima.org.br/familia/" },
  casais:       { id:"casais",       nome:"ECC / Equipes de N. Sra. / Novos Casais",     icon:"💍",  color:"#8B3A6A", bg:"rgba(139,58,106,0.13)",   desc:"Engloba o Encontro de Casais com Cristo (ECC), as Equipes de Nossa Senhora e a Pastoral dos Novos Casais — evangelização do matrimônio.",          url:"https://nsfatima.org.br/e-c-c/" },
  matrimonio:   { id:"matrimonio",   nome:"Preparação para o Matrimônio",                icon:"💒",  color:"#7A3060", bg:"rgba(122,48,96,0.13)",    desc:"Prepara noivos para a celebração e vivência do Sacramento do Matrimônio, com orientações sobre os aspectos humanos, cristãos e canônicos.",         url:"https://nsfatima.org.br/preparacao-para-o-matrimonio/" },
  misericordia: { id:"misericordia", nome:"Pastoral da Misericórdia",                    icon:"❤️",  color:"#8B1A3A", bg:"rgba(139,26,58,0.13)",    desc:"Com sede no Centro Pastoral Bom Samaritano. Atua nas periferias com ações concretas de misericórdia, solidariedade e cuidado aos mais pobres.",   url:"https://nsfatima.org.br/pastoral-da-misericordia/" },
  menor:        { id:"menor",        nome:"Pastoral do Menor",                           icon:"🌱",  color:"#3A7A3A", bg:"rgba(58,122,58,0.13)",    desc:"Acompanha crianças e adolescentes em situação de risco social, com educação informal, orientação escolar e acompanhamento familiar.",               url:"https://nsfatima.org.br/pastoral-do-menor/" },
  idoso:        { id:"idoso",        nome:"Pastoral do Idoso",                           icon:"🌿",  color:"#5A7A2A", bg:"rgba(90,122,42,0.13)",    desc:"Cuida da dignidade e espiritualidade da pessoa idosa, promovendo inclusão, visitas e atenção pastoral aos mais velhos da comunidade.",             url:"https://nsfatima.org.br/idoso/" },
  maria:        { id:"maria",        nome:"Legião de Maria / Peregrinos com Maria",       icon:"🌹",  color:"#4A5A9B", bg:"rgba(74,90,155,0.13)",    desc:"Busca Jesus Cristo através de Maria. Visita hospitais, pratica caridade e anima o terço, novenas e peregrinações na devoção popular.",            url:"https://nsfatima.org.br/legiao-de-maria-adultos/" },
  rcc:          { id:"rcc",          nome:"Renovação Carismática Católica — R.C.C.",      icon:"🕊️",  color:"#6A4A9B", bg:"rgba(106,74,155,0.13)",   desc:"Evangeliza por encontros de espiritualidade e celebrações, com ênfase nos carismas do Espírito Santo, na vocação missionária e na Palavra.",      url:"https://nsfatima.org.br/r-c-c/" },
  vocacional:   { id:"vocacional",   nome:"Pastoral Vocacional",                         icon:"⚜️",  color:"#4A4A8B", bg:"rgba(74,74,139,0.13)",    desc:"Motiva os batizados a reconhecerem-se chamados pelo Pai, escolhidos pelo Filho e enviados em missão — acompanha o discernimento vocacional.",       url:"https://nsfatima.org.br/pastoral-vocacional/" },
  acolhimento:  { id:"acolhimento",  nome:"Pastoral do Acolhimento & Integração",        icon:"🤝",  color:"#7A5A2A", bg:"rgba(122,90,42,0.13)",    desc:"Recebe com carinho quem busca a Igreja, criando ambiente acolhedor para que todos se sintam em casa e participem ativamente da comunidade.",        url:"https://nsfatima.org.br/pastoral-do-acolhimento/" },
  comunicacao:  { id:"comunicacao",  nome:"Pastoral da Comunicação",                     icon:"📡",  color:"#1e6b8a", bg:"rgba(30,107,138,0.13)",   desc:"Estimula a comunicação em toda a comunidade, utilizando mídias modernas — redes sociais, fotografia, vídeo e transmissões ao vivo da paróquia.",  url:"https://nsfatima.org.br/comunicacao/" },
  campanha:     { id:"campanha",     nome:"Campanha da Fraternidade & Tempos Fortes",    icon:"✊",  color:"#8B3A1A", bg:"rgba(139,58,26,0.13)",    desc:"Evangeliza a partir do tema anual da CF, denunciando injustiças que ferem a dignidade humana e animando a comunidade nas datas especiais.",        url:"https://nsfatima.org.br/campanha-da-fraternidade/" },
  dizimo:       { id:"dizimo",       nome:"Dízimo & Sustentação Paroquial",              icon:"🕯️",  color:"#6A4A1A", bg:"rgba(106,74,26,0.13)",    desc:"Trabalha pela auto-sustentação da paróquia, conscientizando os fiéis sobre a corresponsabilidade na manutenção e crescimento da comunidade.",      url:"https://nsfatima.org.br/dizimo-2/" },
};

// ── 12 PERGUNTAS VOCACIONAIS ──────────────────────────────────────────────
const PERGUNTAS = [
  {
    id:1, cat:"Espiritualidade",
    texto:"Como você descreveria seu encontro mais profundo e autêntico com Deus?",
    sub:"Pense no ambiente ou momento em que sua fé mais se alimenta e onde Deus parece mais real para você.",
    opcoes:[
      { l:"A", texto:"Na beleza e no silêncio dos ritos sagrados — a Missa, a Eucaristia e os sacramentos me elevam ao divino de forma única",   pesos:{liturgia:3,enfermos:1} },
      { l:"B", texto:"Na oração contemplativa, no rosário e na intimidade com Nossa Senhora — é com Maria que encontro Jesus mais facilmente",      pesos:{maria:3,vocacional:1} },
      { l:"C", texto:"Na experiência viva do Espírito Santo — nos carismas, na Palavra proclamada com fogo e no louvor fervoroso",                 pesos:{rcc:3,juventude:1} },
      { l:"D", texto:"No rosto do pobre, do enfermo e do excluído — é ali, nas periferias, que Cristo mais se revela para mim",                    pesos:{misericordia:3,campanha:2} },
    ],
  },
  {
    id:2, cat:"Chamado Urgente",
    texto:"Diante de qual situação você sente um chamado mais urgente e incontrolável de agir?",
    sub:"Qual sofrimento ou necessidade ao seu redor mais mobiliza seu coração a ponto de você não conseguir ficar parado(a)?",
    opcoes:[
      { l:"A", texto:"Crianças e jovens crescendo sem conhecer Jesus, sem catequese e sem formação cristã sólida que os ancore na vida",           pesos:{catequese:3,menor:2,juventude:1} },
      { l:"B", texto:"Casais e famílias se desfazendo por falta do alicerce do amor cristão e do sacramento do matrimônio",                        pesos:{casais:3,familia:2,matrimonio:1} },
      { l:"C", texto:"Enfermos, idosos e acamados em solidão absoluta, sem visita e sem o conforto espiritual da presença de Cristo",             pesos:{enfermos:3,idoso:2,misericordia:1} },
      { l:"D", texto:"Pessoas que chegam à Igreja sentindo-se estranhas, sem acolhimento e sem encontrar sentido para continuar",                  pesos:{acolhimento:3,batismo:2,vocacional:1} },
    ],
  },
  {
    id:3, cat:"Estado de Vida",
    texto:"Como você descreveria seu momento atual de vida — e como ele se conecta com sua vocação de serviço?",
    sub:"O estado de vida não é apenas uma circunstância — é o próprio caminho pelo qual Deus nos chama.",
    opcoes:[
      { l:"A", texto:"Sou jovem (ou me identifico com a juventude) e quero viver a fé com intensidade, missão e comunidade",                      pesos:{juventude:3,rcc:2,vocacional:1} },
      { l:"B", texto:"Sou casado(a) — meu matrimônio é uma vocação sagrada e quero que ele inspire e fortaleça outros casais",                     pesos:{casais:3,familia:2,matrimonio:2} },
      { l:"C", texto:"Tenho maturidade, experiência de vida e desejo colocar esse tesouro a serviço das pessoas e da comunidade",                  pesos:{catequese:2,idoso:2,enfermos:2,acolhimento:1} },
      { l:"D", texto:"Estou em fase de discernimento — buscando entender com clareza qual é meu chamado específico dentro da Igreja",             pesos:{vocacional:3,rcc:1,maria:1} },
    ],
  },
  {
    id:4, cat:"Dons e Talentos",
    texto:"Qual das seguintes habilidades mais reflete seus dons naturais e cultivados?",
    sub:"Os talentos que Deus nos deu não são acidentais — são pistas concretas do nosso chamado ao serviço.",
    opcoes:[
      { l:"A", texto:"Comunicar, criar conteúdo, fotografar, filmar, escrever ou gerenciar mídias digitais e redes sociais",                       pesos:{comunicacao:3,campanha:1} },
      { l:"B", texto:"Organizar, planejar, gerir recursos e garantir que estruturas e projetos funcionem com fidelidade",                          pesos:{dizimo:3,acolhimento:1,liturgia:1} },
      { l:"C", texto:"Proclamar a Palavra, falar em público, conduzir orações e celebrações com presença e autoridade",                            pesos:{liturgia:3,rcc:2} },
      { l:"D", texto:"Ouvir com profundidade, acolher sem julgamento, consolar e estar presente para quem sofre",                                  pesos:{enfermos:3,misericordia:2,acolhimento:2} },
    ],
  },
  {
    id:5, cat:"Inquietação Profética",
    texto:"Qual realidade ao redor da paróquia mais provoca em você uma inquietação que não consegue silenciar?",
    sub:"A indignação justa é uma forma de chamado — o que te move a querer mudar o mundo ao redor?",
    opcoes:[
      { l:"A", texto:"As injustiças estruturais que violam a dignidade humana e impedem o Reino de Deus de crescer entre nós",                     pesos:{campanha:3,misericordia:2} },
      { l:"B", texto:"Crianças e adolescentes em situação de vulnerabilidade, risco social e sem perspectiva de futuro",                           pesos:{menor:3,misericordia:1} },
      { l:"C", texto:"A ausência da Igreja na comunicação moderna e o afastamento crescente dos jovens da fé e dos sacramentos",                   pesos:{comunicacao:3,juventude:2} },
      { l:"D", texto:"A solidão dos idosos e enfermos, esquecidos pela sociedade e, às vezes, até pela própria família",                           pesos:{idoso:3,enfermos:3} },
    ],
  },
  {
    id:6, cat:"Palavra de Deus",
    texto:"Qual passagem do Evangelho mais ressoa em você como um chamado pessoal e inegociável?",
    sub:"A Palavra de Deus é lâmpada — ela ilumina o caminho específico que cada um é chamado a percorrer.",
    opcoes:[
      { l:"A", texto:'"Ide, portanto, fazei discípulos de todas as nações, batizando-os..." — Mateus 28,19',                                       pesos:{catequese:2,batismo:2,vocacional:1} },
      { l:"B", texto:'"Tudo o que fizestes a um destes meus irmãos mais pequeninos, a mim o fizestes." — Mateus 25,40',                            pesos:{misericordia:2,menor:2,idoso:2,enfermos:1} },
      { l:"C", texto:'"Isto é o meu corpo que é dado por vós; fazei isto em memória de mim." — Lucas 22,19',                                       pesos:{liturgia:3,enfermos:2} },
      { l:"D", texto:'"Onde estiverem dois ou três reunidos em meu nome, estou no meio deles." — Mateus 18,20',                                    pesos:{casais:2,familia:2,acolhimento:2,rcc:1} },
    ],
  },
  {
    id:7, cat:"Ritmo de Serviço",
    texto:"De que forma você se sente mais chamado(a) a comprometer-se com o serviço pastoral?",
    sub:"Não há forma superior — cada ritmo de serviço é necessário e valioso para o conjunto da comunidade.",
    opcoes:[
      { l:"A", texto:"Com regularidade semanal e compromisso fixo — a disciplina do serviço estrutura e alimenta minha vida de fé",                pesos:{catequese:2,liturgia:2,dizimo:1,maria:1} },
      { l:"B", texto:"Em momentos intensos de graça — retiros, missões, encontros e celebrações especiais que renovam tudo",                       pesos:{rcc:3,juventude:2,casais:1} },
      { l:"C", texto:"No cotidiano, de forma espontânea e disponível — estou onde a comunidade precisar, quando precisar",                         pesos:{acolhimento:3,enfermos:2,misericordia:1} },
      { l:"D", texto:"Em projetos concretos e mensuráveis que transformam situações reais na vida das pessoas",                                    pesos:{comunicacao:2,campanha:2,menor:2} },
    ],
  },
  {
    id:8, cat:"Grupo de Missão",
    texto:"Com qual grupo de pessoas você sente maior afinidade, amor e vocação de serviço?",
    sub:"Deus coloca em nós um amor especial por determinadas pessoas — quem toca mais profundamente o seu coração?",
    opcoes:[
      { l:"A", texto:"Crianças de 7 a 14 anos, numa fase decisiva de formação da fé, da identidade e do caráter",                                 pesos:{catequese:3,menor:2,batismo:1} },
      { l:"B", texto:"Casais e famílias — o núcleo da Igreja doméstica que sustenta e edifica toda a paróquia",                                    pesos:{casais:3,familia:3,matrimonio:2} },
      { l:"C", texto:"Pessoas em sofrimento — enfermos, pobres, idosos solitários e marginalizados pela sociedade",                               pesos:{enfermos:2,misericordia:3,idoso:2} },
      { l:"D", texto:"Aqueles que chegam à fé pela primeira vez ou retornam após afastamento — os que estão buscando sentido",                     pesos:{acolhimento:3,batismo:2,vocacional:1} },
    ],
  },
  {
    id:9, cat:"Identidade na Comunidade",
    texto:"Qual das frases abaixo melhor descreve como você genuinamente se percebe dentro da comunidade de fé?",
    sub:"O autoconhecimento honesto é o ponto de partida para o discernimento vocacional autêntico.",
    opcoes:[
      { l:"A", texto:"Sou uma pessoa de oração profunda, fé silenciosa e vida interior intensa — minha arma é o joelho dobrado",                  pesos:{maria:3,vocacional:2,liturgia:1} },
      { l:"B", texto:"Sou animado(a) e comunicativo(a) — tenho facilidade de contagiar outros com minha fé e trazer pessoas à comunidade",        pesos:{rcc:3,juventude:2,acolhimento:1} },
      { l:"C", texto:"Sou confiável, organizado(a) e pragmático(a) — sei transformar boas intenções em ações concretas e resultados",             pesos:{dizimo:3,comunicacao:2,liturgia:1} },
      { l:"D", texto:"Sou movido(a) pelo amor ao próximo — meu coração transborda, especialmente diante de quem mais sofre",                      pesos:{misericordia:2,enfermos:2,menor:2,idoso:1} },
    ],
  },
  {
    id:10, cat:"Experiência Transformadora",
    texto:"Qual experiência espiritual foi mais marcante e transformadora em sua caminhada de fé até hoje?",
    sub:"Os momentos de graça que mais nos tocaram revelam o estilo único da ação de Deus em nossa vida.",
    opcoes:[
      { l:"A", texto:"Um retiro espiritual intenso, uma missão, um Encontro de Casais ou experiência carismática que mudou tudo",                  pesos:{rcc:3,casais:2,juventude:1} },
      { l:"B", texto:"A descoberta do rosário, uma peregrinação ou uma devoção profunda que me aproximou de Maria e de Jesus",                     pesos:{maria:3,liturgia:1} },
      { l:"C", texto:"O encontro com alguém que me serviu com amor incondicional e gratuito — e eu vi Cristo nele(a)",                             pesos:{misericordia:2,enfermos:2,acolhimento:2} },
      { l:"D", texto:"Um estudo profundo da fé, da Bíblia ou do magistério que iluminou minha vida e despertou minha vocação",                    pesos:{catequese:3,vocacional:2} },
    ],
  },
  {
    id:11, cat:"Visão de Paróquia",
    texto:"O que você mais sonha e deseja que aconteça em Nossa Senhora de Fátima?",
    sub:"A visão que Deus coloca no coração não é devaneio — é semente do chamado que Ele tem para nós.",
    opcoes:[
      { l:"A", texto:"Uma liturgia cada vez mais bela, digna e participativa, que faça as almas se elevarem ao Céu na Missa dominical",            pesos:{liturgia:3,enfermos:1,rcc:1} },
      { l:"B", texto:"Uma comunidade que abraça jovens e crianças com formação sólida, propostas de vida e espaço de pertencimento",              pesos:{juventude:2,catequese:2,menor:2} },
      { l:"C", texto:"Uma paróquia missionária, presente nas periferias de Teresina e que fala a linguagem do mundo moderno",                     pesos:{misericordia:2,comunicacao:2,campanha:2} },
      { l:"D", texto:"Casais e famílias cada vez mais fortalecidos — lares que são pequenas Igrejas irradiando Cristo para os vizinhos",           pesos:{familia:3,casais:3,matrimonio:1} },
    ],
  },
  {
    id:12, cat:"Legado Eterno",
    texto:"Ao final de sua jornada de serviço em Nossa Senhora de Fátima, qual legado você mais deseja ter deixado?",
    sub:"O legado que desejamos deixar revela, com clareza, o que de fato mais valoriza nosso coração.",
    opcoes:[
      { l:"A", texto:"Ter formado catequizandos que hoje são adultos de fé sólida, ativa e transmissível aos seus próprios filhos",                pesos:{catequese:3,batismo:1} },
      { l:"B", texto:"Ter sido ponte para que pessoas se sentissem acolhidas, encontrassem seu lugar e nunca mais saíssem da Igreja",             pesos:{acolhimento:3,vocacional:1,batismo:1} },
      { l:"C", texto:"Ter levado o Evangelho a muitas pessoas através das mídias e da denúncia profética das injustiças",                         pesos:{comunicacao:3,campanha:2} },
      { l:"D", texto:"Ter estado presente no sofrimento de quem mais precisava — sendo as mãos e o coração de Cristo no mundo",                  pesos:{enfermos:3,misericordia:2,idoso:2,menor:1} },
    ],
  },
];

// ── SCORING ────────────────────────────────────────────────────────────────
function calcScores(respostas) {
  const s = Object.fromEntries(Object.keys(PASTORAIS).map(k => [k, 0]));
  respostas.forEach(({ opcao }) =>
    Object.entries(opcao.pesos).forEach(([k, v]) => { s[k] += v; })
  );
  return s;
}
function getRanking(scores) {
  return Object.values(PASTORAIS)
    .map(p => ({ ...p, pts: scores[p.id] || 0 }))
    .sort((a, b) => b.pts - a.pts);
}
function getRecomendados(ranking) {
  const max = ranking[0]?.pts || 1;
  return ranking.filter((p, i) => i === 0 || p.pts >= max * 0.65);
}

// ── AI via Netlify Function ────────────────────────────────────────────────
function makePrompt(nome, top) {
  return `Você é um orientador vocacional espiritual da Paróquia Nossa Senhora de Fátima, Teresina-PI (Igreja Católica Apostólica Romana).

O fiel "${nome}" concluiu o teste vocacional. As pastorais mais indicadas foram:
${top.map((p, i) => `${i + 1}ª: ${p.nome} (${p.pts} pontos)`).join("\n")}

Escreva uma análise vocacional personalizada. Use EXATAMENTE este formato:

CHAMADO: [3 frases descrevendo o chamado vocacional de ${nome} de forma espiritual, pessoal e acolhedora]
DONS: [dom 1] | [dom 2] | [dom 3] | [dom 4]
VERSÍCULO: [versículo bíblico adequado ao perfil com referência completa]
PRÓXIMOS_PASSOS: [2 frases concretas sobre como ${nome} pode começar a servir nessa pastoral]
MENSAGEM: [3-4 frases de encorajamento espiritual usando o nome ${nome}, terminando com uma bênção]

Use linguagem católica, calorosa e direta. Seja específico ao perfil revelado pelo teste.`;
}

function parseAI(text) {
  const get = k => { const m = text.match(new RegExp(`${k}:\\s*(.+)`)); return m ? m[1].trim() : ""; };
  return {
    chamado: get("CHAMADO"),
    dons: get("DONS").split("|").map(d => d.trim()).filter(Boolean),
    versiculo: get("VERSÍCULO"),
    passos: get("PRÓXIMOS_PASSOS"),
    mensagem: get("MENSAGEM"),
  };
}

const VERSICULOS = {
  liturgia: "Sir 24,26 — No meio da assembleia abri a boca e bendisse o Senhor.",
  enfermos: "Mt 25,40 — Tudo o que fizestes a um destes meus irmãos mais pequeninos, a mim o fizestes.",
  catequese: "2 Tm 3,14 — Permanece firme no que aprendeste e de que tens convicção.",
  batismo: "Mt 28,19 — Ide, portanto, fazei discípulos de todas as nações, batizando-os.",
  juventude: "1 Tm 4,12 — Sê modelo para os fiéis na palavra, na conduta, no amor, na fé.",
  familia: "Ef 5,25 — Maridos, amai vossas mulheres, como Cristo amou a Igreja.",
  casais: "Mt 18,20 — Onde estiverem dois ou três reunidos em meu nome, estou no meio deles.",
  matrimonio: "Gn 2,24 — Por isso deixa o homem pai e mãe e se une à sua mulher.",
  misericordia: "Lc 6,36 — Sede misericordiosos, como o Pai é misericordioso.",
  menor: "Mt 19,14 — Deixai vir a mim as crianças e não as impeçais.",
  idoso: "Lv 19,32 — Diante dos cabelos brancos te levantarás e honrarás a pessoa do ancião.",
  maria: "Lc 1,38 — Eis aqui a serva do Senhor; cumpra-se em mim a tua palavra.",
  rcc: "At 2,4 — Todos ficaram cheios do Espírito Santo e começaram a falar em outras línguas.",
  vocacional: "Jo 15,16 — Não fostes vós que me escolhestes; fui eu que vos escolhi.",
  acolhimento: "Rm 15,7 — Acolhei-vos uns aos outros, como Cristo vos acolheu.",
  comunicacao: "Rm 10,15 — Como são belos os pés dos que anunciam a paz!",
  campanha: "Is 1,17 — Aprendei a fazer o bem; buscai a justiça.",
  dizimo: "2 Co 9,7 — Cada um contribua segundo propôs no coração, não com tristeza.",
};

function gerarFallback(nome, top) {
  const principal = top[0];
  const secundarias = top.slice(1, 3).map(p => p.nome).join(" e ");
  return {
    chamado: `${nome}, seu perfil aponta com clareza para a ${principal.nome}. ${principal.desc} Este discernimento convida você a colocar seus dons a serviço da comunidade de Fátima.`,
    dons: ["Serviço", "Fé viva", "Comunhão", "Missão"],
    versiculo: VERSICULOS[principal.id] || "1 Pe 4,10 — Cada um recebeu um dom; use-o para servir os outros.",
    passos: `Entre em contato com o coordenador(a) da ${principal.nome} pela página da paróquia. Participe de uma reunião ou celebração da pastoral para conhecer a equipe.${secundarias ? ` Também vale explorar: ${secundarias}.` : ""}`,
    mensagem: `${nome}, Deus não chama os capacitados — capacita os chamados. Que Nossa Senhora de Fátima interceda por você neste novo caminho de serviço na paróquia. Vá em paz e com alegria missionária!`,
  };
}

async function chamarIA(prompt) {
  try {
    const res = await fetch("/.netlify/functions/gerar-resultado", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.text || null;
  } catch {
    return null;
  }
}

// ── PALETA E TIPOGRAFIA ────────────────────────────────────────────────────
const T = {
  bg: "#0c0a08",
  surface: "rgba(255,255,255,0.045)",
  border: "rgba(255,255,255,0.1)",
  text: "#f6f0e4",
  textSoft: "#d4c8b4",
  muted: "#a89880",
  gold: "#e8c96a",
  goldDim: "#c9a84c",
  sans: "'Segoe UI', system-ui, -apple-system, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
};

// ── ESTILOS GLOBAIS ────────────────────────────────────────────────────────
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body, #root { height: 100%; background: ${T.bg}; }
  html.quiz-lock, html.quiz-lock body, html.quiz-lock #root { overflow: hidden; }
  body { font-family: ${T.serif}; color: ${T.text}; -webkit-font-smoothing: antialiased; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  details > summary { list-style: none; }
  details > summary::-webkit-details-marker { display: none; }
  a { text-decoration: none; }
  .app-shell { min-height: 100dvh; max-height: 100dvh; display: flex; flex-direction: column; overflow: hidden; }
  .app-shell.scrollable { overflow-y: auto; max-height: none; min-height: 100dvh; }
  .quiz-header { flex-shrink: 0; padding: 8px 16px; border-bottom: 1px solid ${T.border}; background: rgba(0,0,0,0.45); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .quiz-header--progress { justify-content: flex-end; }
  .quiz-header span { font-family: ${T.sans}; font-size: 11px; color: ${T.muted}; letter-spacing: 0.02em; }
  .quiz-body { flex: 1; min-height: 0; display: flex; align-items: center; justify-content: center; padding: 10px 14px 14px; overflow: hidden; }
  .quiz-card { width: 100%; max-width: 720px; max-height: 100%; display: flex; flex-direction: column; gap: 8px; animation: fadeUp 0.35s ease; }
  .quiz-meta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .quiz-meta .cat { font-family: ${T.sans}; font-size: 13.5px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: ${T.gold}; }
  .quiz-meta .num { font-family: ${T.sans}; font-size: 13.5px; color: ${T.muted}; }
  .quiz-title { font-size: clamp(20px, 2.97vh, 26px); font-weight: 400; line-height: 1.35; color: ${T.text}; flex-shrink: 0; }
  .quiz-sub { font-family: ${T.sans}; font-size: clamp(15px, 2.03vh, 17px); line-height: 1.4; color: ${T.muted}; font-style: italic; flex-shrink: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
  .quiz-options { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 8px; }
  .quiz-opt { display: flex; align-items: flex-start; gap: 8px; padding: 10px 11px; background: ${T.surface}; border: 1px solid ${T.border}; border-radius: 10px; cursor: pointer; text-align: left; width: 100%; height: 100%; transition: border-color 0.15s, background 0.15s, transform 0.15s; overflow: hidden; }
  .quiz-opt:hover:not(:disabled) { background: rgba(255,255,255,0.07); border-color: rgba(232,201,106,0.35); transform: translateY(-1px); }
  .quiz-opt:disabled { cursor: default; }
  .quiz-opt.dim { opacity: 0.25; }
  .quiz-opt.sel { border-width: 1.5px; }
  .quiz-opt-letter { min-width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-family: ${T.sans}; font-size: 13.5px; font-weight: 700; border: 1px solid ${T.border}; color: ${T.muted}; }
  .quiz-opt-text { font-family: ${T.sans}; font-size: clamp(15px, 1.96vh, 17px); line-height: 1.35; color: ${T.textSoft}; display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
  .quiz-opt.sel .quiz-opt-text { color: ${T.text}; }
  .result-scroll { flex: 1; min-height: 0; overflow-y: auto; padding: 12px 14px 20px; }
  .result-scroll::-webkit-scrollbar { width: 5px; }
  .result-scroll::-webkit-scrollbar-thumb { background: rgba(232,201,106,0.25); border-radius: 3px; }
  @media (max-width: 560px), (max-height: 620px) {
    .quiz-options { grid-template-columns: 1fr; grid-template-rows: repeat(4, minmax(0, 1fr)); gap: 6px; }
    .quiz-body { padding: 8px 10px 10px; }
    .quiz-opt { padding: 8px 10px; }
    .quiz-opt-text { -webkit-line-clamp: 3; }
  }
`;

// ── COMPONENTES AUXILIARES ─────────────────────────────────────────────────
function Cross() {
  return (
    <div style={{ position:"relative", width:48, height:56, margin:"0 auto 24px", flexShrink:0 }}>
      <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:3, height:50, background:"linear-gradient(180deg,#C9A84C55,#C9A84C)", borderRadius:2 }}/>
      <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:30, height:3, background:"linear-gradient(90deg,#C9A84C55,#C9A84C,#C9A84C55)", borderRadius:2 }}/>
    </div>
  );
}

function Pill({ children }) {
  return (
    <span style={{ padding:"4px 12px", background:T.surface, border:`1px solid ${T.border}`, borderRadius:999, fontSize:11, fontFamily:T.sans, color:T.muted }}>
      {children}
    </span>
  );
}

function ProgressDots({ atual, total }) {
  return (
    <div style={{ display:"flex", gap:3, flexShrink:0 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          height:4, borderRadius:999,
          width: i < atual ? 16 : i === atual ? 10 : 5,
          background: i < atual ? `linear-gradient(90deg,${T.gold},${T.goldDim})` : i === atual ? "rgba(232,201,106,0.5)" : "rgba(255,255,255,0.08)",
          transition:"all 0.4s ease",
        }}/>
      ))}
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:16, padding:"32px 0" }}>
      <div style={{ width:32, height:32, borderRadius:"50%", border:"2px solid rgba(201,168,76,0.15)", borderTopColor:"#C9A84C", animation:"spin 0.9s linear infinite" }}/>
      <p style={{ fontSize:13, color:"#6a5a4a", fontStyle:"italic" }}>Gerando seu resultado personalizado...</p>
    </div>
  );
}

const CORES_OPC = ["#8B0000","#1a4a8a","#4a7a30","#7A5000"];

function QuestionCard({ pergunta, numero, total, selecionada, onSelect }) {
  const [hov, setHov] = useState(null);
  useEffect(() => { setHov(null); }, [pergunta.id]);

  return (
    <div className="quiz-card" key={pergunta.id}>
      <div className="quiz-meta">
        <span className="cat">{pergunta.cat}</span>
        <span className="num">· {numero} de {total}</span>
      </div>
      <h2 className="quiz-title">{pergunta.texto}</h2>
      <p className="quiz-sub">{pergunta.sub}</p>
      <div className="quiz-options">
        {pergunta.opcoes.map((opt, i) => {
          const isSel = selecionada === i;
          const isDim = selecionada !== null && !isSel;
          const c = CORES_OPC[i];
          return (
            <button
              key={i}
              type="button"
              title={opt.texto}
              className={`quiz-opt${isSel ? " sel" : ""}${isDim ? " dim" : ""}`}
              onClick={() => selecionada === null && onSelect(i, opt)}
              disabled={selecionada !== null}
              onMouseEnter={() => selecionada === null && setHov(i)}
              onMouseLeave={() => setHov(null)}
              style={{
                background: isSel ? `${c}22` : hov === i ? "rgba(255,255,255,0.08)" : undefined,
                borderColor: isSel ? `${c}88` : hov === i ? "rgba(232,201,106,0.35)" : undefined,
              }}
            >
              <span
                className="quiz-opt-letter"
                style={{
                  borderColor: isSel ? c : undefined,
                  background: isSel ? `${c}25` : undefined,
                  color: isSel ? c : undefined,
                }}
              >
                {isSel ? "✓" : opt.l}
              </span>
              <span className="quiz-opt-text">{opt.texto}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PastoralCard({ pastoral, rank, aiData, maxPts }) {
  const pct = Math.round((pastoral.pts / maxPts) * 100);
  const isFirst = rank === 0;
  return (
    <div style={{
      background: pastoral.bg, border:`1px solid ${pastoral.color}${isFirst?"70":"45"}`,
      borderRadius: isFirst ? 14 : 12, padding: isFirst ? "16px 14px" : "12px 12px",
      marginBottom: isFirst ? 12 : 8, position:"relative", overflow:"hidden",
      boxShadow: isFirst ? `0 0 32px ${pastoral.color}22` : "none",
      animation:"fadeUp 0.6s ease both",
    }}>
      {isFirst && (
        <div style={{ position:"absolute", top:-30, right:-30, width:120, height:120, borderRadius:"50%", background:`radial-gradient(circle,${pastoral.color}20,transparent 70%)` }}/>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom: isFirst ? 12 : 0 }}>
        <span style={{ fontSize: isFirst ? 36 : 26, flexShrink:0 }}>{pastoral.icon}</span>
        <div style={{ flex:1, minWidth:0 }}>
          {isFirst && (
            <div style={{ fontFamily:T.sans, fontSize:10, fontWeight:600, letterSpacing:"0.12em", color:pastoral.color, textTransform:"uppercase", marginBottom:3 }}>
              Sua Principal Pastoral
            </div>
          )}
          <div style={{ fontSize: isFirst ? "clamp(14px,2vh,16px)" : 13, color:T.text, fontWeight:400, lineHeight:1.3 }}>
            {pastoral.nome}
          </div>
          {!isFirst && (
            <div style={{ marginTop:6, background:"rgba(255,255,255,0.07)", borderRadius:999, height:3 }}>
              <div style={{ width:`${pct}%`, height:"100%", borderRadius:999, background:pastoral.color, transition:"width 1s ease" }}/>
            </div>
          )}
        </div>
        <span style={{ fontSize: isFirst ? 14 : 12, color:pastoral.color, fontWeight:700, flexShrink:0 }}>{pct}%</span>
      </div>

      {isFirst && (
        <>
          <p style={{ fontFamily:T.sans, fontSize:12, color:T.textSoft, lineHeight:1.5, margin:"0 0 8px" }}>{pastoral.desc}</p>
          {aiData && (
            <>
              <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:10, marginBottom:8 }}>
                <p style={{ fontFamily:T.sans, fontSize:12, color:T.textSoft, lineHeight:1.55, margin:"0 0 8px" }}>{aiData.chamado}</p>
                <p style={{ fontSize:11.5, color:pastoral.color, fontStyle:"italic", margin:"0 0 8px" }}>{aiData.versiculo}</p>
                {aiData.passos && (
                  <div style={{ background:"rgba(255,255,255,0.04)", padding:"8px 12px", borderRadius:8, borderLeft:`3px solid ${pastoral.color}` }}>
                    <span style={{ fontFamily:T.sans, fontSize:10, fontWeight:700, color:pastoral.color, display:"block", marginBottom:3, letterSpacing:"0.1em", textTransform:"uppercase" }}>Próximos Passos</span>
                    <p style={{ fontFamily:T.sans, fontSize:11.5, color:T.muted, lineHeight:1.5, margin:0 }}>{aiData.passos}</p>
                  </div>
                )}
              </div>
            </>
          )}
          <a href={pastoral.url} target="_blank" rel="noopener noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:`${pastoral.color}15`, border:`1px solid ${pastoral.color}40`, borderRadius:8, fontSize:12, color:pastoral.color, transition:"all 0.2s" }}>
            Ver esta pastoral no site da paróquia →
          </a>
        </>
      )}
    </div>
  );
}

// ── APP PRINCIPAL ──────────────────────────────────────────────────────────
export default function App() {
  const [fase, setFase] = useState("intro");
  const [nome, setNome] = useState("");
  const [inputNome, setInputNome] = useState("");
  const [qAtual, setQAtual] = useState(0);
  const [respostas, setRespostas] = useState([]);
  const [selecionada, setSelecionada] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [recomendados, setRecomendados] = useState([]);
  const [aiData, setAiData] = useState(null);
  const [carregandoIA, setCarregandoIA] = useState(false);
  const topoRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (fase === "nome") setTimeout(() => inputRef.current?.focus(), 150);
  }, [fase]);

  useEffect(() => {
    document.documentElement.classList.toggle("quiz-lock", fase === "quiz");
    return () => document.documentElement.classList.remove("quiz-lock");
  }, [fase]);

  function iniciar() {
    if (!inputNome.trim()) return;
    setNome(inputNome.trim());
    setFase("quiz");
  }

  async function selecionar(idx, opt) {
    if (selecionada !== null) return;
    setSelecionada(idx);
    const novas = [...respostas, { pId: PERGUNTAS[qAtual].id, opcao: opt }];
    setRespostas(novas);

    setTimeout(async () => {
      if (qAtual < PERGUNTAS.length - 1) {
        setQAtual(q => q + 1);
        setSelecionada(null);
      } else {
        const s = calcScores(novas);
        const r = getRanking(s);
        const rec = getRecomendados(r);
        setRanking(r);
        setRecomendados(rec);
        setFase("resultado");
        setCarregandoIA(true);
        const texto = await chamarIA(makePrompt(inputNome.trim(), rec));
        setCarregandoIA(false);
        if (texto) {
          const parsed = parseAI(texto);
          setAiData(parsed.chamado ? parsed : gerarFallback(inputNome.trim(), rec));
        } else {
          setAiData(gerarFallback(inputNome.trim(), rec));
        }
      }
    }, 900);
  }

  function reiniciar() {
    setFase("intro"); setNome(""); setInputNome("");
    setQAtual(0); setRespostas([]); setSelecionada(null);
    setRanking([]); setRecomendados([]); setAiData(null); setCarregandoIA(false);
  }

  const maxPts = recomendados[0]?.pts || 1;

  // ── RENDER ──
  return (
    <>
      <style>{css}</style>
      <div className={`app-shell${fase !== "quiz" ? " scrollable" : ""}`} style={{ background:T.bg, fontFamily:T.serif, color:T.text }}>
        {/* Ambiente */}
        <div style={{ position:"fixed", inset:0, pointerEvents:"none", background:"radial-gradient(ellipse 70% 50% at 12% 5%,rgba(201,168,76,.08) 0%,transparent 60%),radial-gradient(ellipse 50% 70% at 88% 95%,rgba(139,0,0,.06) 0%,transparent 60%)" }}/>

        {/* ── INTRO ── */}
        {fase === "intro" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 24px", textAlign:"center", maxWidth:540, margin:"0 auto", animation:"fadeUp 0.5s ease" }}>
            <Cross/>
            <div style={{ fontSize:10, letterSpacing:4, color:"#C9A84C", textTransform:"uppercase", marginBottom:5 }}>
              Paróquia Nossa Senhora de Fátima
            </div>
            <div style={{ fontSize:9, letterSpacing:3, color:"#5a4a3a", textTransform:"uppercase", marginBottom:22 }}>
              Teresina · Piauí · Igreja Católica Apostólica Romana
            </div>
            <h1 style={{ fontSize:"clamp(22px,6vw,36px)", fontWeight:400, lineHeight:1.25, marginBottom:12, color:"#f5ede0" }}>
              Teste Vocacional<br/><em style={{ color:"#C9A84C" }}>das Pastorais</em>
            </h1>
            <p style={{ fontSize:14.5, color:"#8a7a6a", lineHeight:1.8, maxWidth:400, marginBottom:28 }}>
              Responda {PERGUNTAS.length} perguntas elaboradas para o discernimento vocacional e descubra em qual pastoral da nossa paróquia Deus está te chamando a servir.
            </p>
            <div style={{ display:"flex", gap:7, flexWrap:"wrap", justifyContent:"center", marginBottom:32 }}>
              <Pill>{PERGUNTAS.length} perguntas de discernimento</Pill>
              <Pill>18 pastorais avaliadas</Pill>
              <Pill>~5 minutos</Pill>
              <Pill>Resultado personalizado por IA</Pill>
            </div>
            <button
              onClick={() => setFase("nome")}
              style={{ padding:"14px 44px", background:"linear-gradient(135deg,#C9A84C,#8B6B2E)", border:"none", borderRadius:12, color:"#0d0a06", fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"Georgia,serif", boxShadow:"0 8px 28px rgba(201,168,76,.22)", transition:"transform .2s,box-shadow .2s" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="0 12px 36px rgba(201,168,76,.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 8px 28px rgba(201,168,76,.22)"; }}>
              Iniciar Discernimento ✦
            </button>
            <p style={{ marginTop:22, fontSize:11, color:"#3a2a1a", fontStyle:"italic" }}>
              "Cada um recebeu um dom; use-o para servir os outros." — 1 Pe 4,10
            </p>
          </div>
        )}

        {/* ── NOME ── */}
        {fase === "nome" && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"48px 24px", textAlign:"center", maxWidth:420, margin:"0 auto", width:"100%", animation:"fadeUp 0.5s ease" }}>
            <div style={{ fontSize:40, marginBottom:16 }}>🙏</div>
            <h2 style={{ fontSize:22, fontWeight:400, color:"#f5ede0", marginBottom:8 }}>Bem-vindo(a)!</h2>
            <p style={{ fontSize:14, color:"#8a7a6a", lineHeight:1.7, marginBottom:28, maxWidth:340 }}>
              Antes de começar, como você se chama? Seu resultado será personalizado especialmente para você.
            </p>
            <input
              ref={inputRef}
              value={inputNome}
              onChange={e => setInputNome(e.target.value)}
              onKeyDown={e => e.key === "Enter" && iniciar()}
              placeholder="Digite seu nome..."
              style={{ width:"100%", padding:"13px 18px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:12, color:"#f0e8d8", fontSize:15, fontFamily:"Georgia,serif", outline:"none", marginBottom:14, textAlign:"center", transition:"border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "rgba(201,168,76,0.45)"}
              onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.12)"}
            />
            <button
              onClick={iniciar}
              disabled={!inputNome.trim()}
              style={{ width:"100%", padding:"13px", background: inputNome.trim() ? "linear-gradient(135deg,#C9A84C,#8B6B2E)" : "rgba(255,255,255,0.05)", border:"none", borderRadius:12, color: inputNome.trim() ? "#0d0a06" : "#5a4a3a", fontSize:15, fontWeight:700, cursor: inputNome.trim() ? "pointer" : "default", fontFamily:"Georgia,serif", transition:"all 0.2s" }}>
              Começar →
            </button>
          </div>
        )}

        {/* ── QUIZ ── */}
        {fase === "quiz" && (
          <>
            <div ref={topoRef} className="quiz-header quiz-header--progress">
              <ProgressDots atual={qAtual} total={PERGUNTAS.length}/>
            </div>
            <div className="quiz-body">
              <QuestionCard
                pergunta={PERGUNTAS[qAtual]}
                numero={qAtual + 1}
                total={PERGUNTAS.length}
                selecionada={selecionada}
                onSelect={selecionar}
              />
            </div>
          </>
        )}

        {/* ── RESULTADO ── */}
        {fase === "resultado" && recomendados.length > 0 && (
          <>
            <div className="quiz-header" style={{ justifyContent:"center" }}>
              <span>Resultado Vocacional · {nome}</span>
            </div>
            <div className="result-scroll" style={{ maxWidth:640, margin:"0 auto", width:"100%" }}>

              {/* Cabeçalho do resultado */}
              <div style={{ textAlign:"center", marginBottom:24, animation:"fadeUp 0.5s ease" }}>
                <div style={{ display:"inline-block", padding:"3px 14px", border:"1px solid rgba(201,168,76,0.35)", borderRadius:999, fontSize:9, letterSpacing:4, color:"#C9A84C", textTransform:"uppercase", marginBottom:10 }}>
                  Chamado Identificado
                </div>
                <h2 style={{ fontSize:20, fontWeight:400, color:"#f5ede0", margin:0 }}>
                  O chamado de <em style={{ color:"#C9A84C" }}>{nome}</em>
                </h2>
              </div>

              {/* Loader IA */}
              {carregandoIA && <Spinner/>}

              {/* Pastorais recomendadas */}
              {recomendados.length > 1 && (
                <div style={{ fontSize:9, letterSpacing:3, color:"#6a5a4a", textTransform:"uppercase", marginBottom:12, textAlign:"center" }}>
                  {recomendados.length === 1 ? "Sua Pastoral Indicada" : "Suas Pastorais Indicadas"}
                </div>
              )}
              {recomendados.map((p, i) => (
                <PastoralCard key={p.id} pastoral={p} rank={i} aiData={i === 0 ? aiData : null} maxPts={maxPts}/>
              ))}

              {/* Dons identificados */}
              {aiData?.dons?.length > 0 && (
                <div style={{ textAlign:"center", marginBottom:16, animation:"fadeUp 0.5s ease" }}>
                  <div style={{ fontSize:9, letterSpacing:3, color:"#6a5a4a", textTransform:"uppercase", marginBottom:8 }}>Dons Identificados</div>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center" }}>
                    {aiData.dons.map(d => (
                      <span key={d} style={{ padding:"4px 13px", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.22)", borderRadius:999, fontSize:11, color:"#C9A84C" }}>{d}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Mensagem final */}
              {aiData?.mensagem && (
                <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:13, padding:"16px 18px", textAlign:"center", marginBottom:16, animation:"fadeUp 0.5s ease" }}>
                  <p style={{ fontSize:13, color:"#9a8a78", lineHeight:1.85, margin:0, fontStyle:"italic" }}>"{aiData.mensagem}"</p>
                </div>
              )}

              {/* Ranking completo */}
              <details style={{ marginBottom:24 }}>
                <summary style={{ fontSize:10, letterSpacing:3, color:"#5a4a3a", textTransform:"uppercase", cursor:"pointer", marginBottom:12, outline:"none", userSelect:"none", padding:"8px 0" }}>
                  Ver todas as 18 pastorais avaliadas ▾
                </summary>
                <div style={{ display:"flex", flexDirection:"column", gap:7, marginTop:12 }}>
                  {ranking.map((p) => {
                    const pct = Math.round((p.pts / (ranking[0].pts || 1)) * 100);
                    return (
                      <div key={p.id} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:8 }}>
                        <span style={{ fontSize:16, minWidth:22 }}>{p.icon}</span>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
                            <span style={{ fontSize:11, color:"#8a7a68", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", maxWidth:"80%" }}>{p.nome}</span>
                            <span style={{ fontSize:10, color:p.color, fontWeight:700, flexShrink:0, marginLeft:6 }}>{pct}%</span>
                          </div>
                          <div style={{ background:"rgba(255,255,255,0.06)", borderRadius:999, height:3 }}>
                            <div style={{ width:`${pct}%`, height:"100%", borderRadius:999, background:p.color, transition:"width 1s ease" }}/>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </details>

              {/* Botões finais */}
              <div style={{ textAlign:"center" }}>
                <p style={{ fontSize:11, color:"#4a3a2a", fontStyle:"italic", marginBottom:18 }}>
                  Converse com o pároco ou coordenador(a) da pastoral para dar os próximos passos no seu serviço!
                </p>
                <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" }}>
                  <a href="https://nsfatima.org.br/pastorais/" target="_blank" rel="noopener noreferrer"
                    style={{ padding:"10px 22px", background:"rgba(201,168,76,0.08)", border:"1px solid rgba(201,168,76,0.25)", borderRadius:10, color:"#C9A84C", fontSize:12, fontFamily:"Georgia,serif" }}>
                    Ver todas as pastorais ↗
                  </a>
                  <button
                    onClick={reiniciar}
                    style={{ padding:"10px 22px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.09)", borderRadius:10, color:"#9a8a78", fontSize:12, cursor:"pointer", fontFamily:"Georgia,serif", transition:"all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.08)"; e.currentTarget.style.color="#e0d6c8"; }}
                    onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.04)"; e.currentTarget.style.color="#9a8a78"; }}>
                    Refazer o Teste
                  </button>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </>
  );
}
