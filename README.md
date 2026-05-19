# Teste Vocacional das Pastorais
## Paróquia Nossa Senhora de Fátima — Teresina, PI

Site de teste vocacional para descobrir em qual pastoral da paróquia cada fiel é chamado a servir.
Desenvolvido com React + Vite + IA (Claude/Anthropic).

**Repositório:** [github.com/ronaldomelofz/vocacionalfatima](https://github.com/ronaldomelofz/vocacionalfatima)  
**Site (produção):** [vocacionalfatima.netlify.app](https://vocacionalfatima.netlify.app)  
**Pastorais da paróquia:** [nsfatima.org.br/pastorais](https://nsfatima.org.br/pastorais/)

---

## 🚀 Publicar no Netlify via GitHub (recomendado)

Cada `git push` na branch `main` pode gerar deploy automático no Netlify.

1. Acesse [Netlify — Add new site](https://app.netlify.com/teams/ronaldomelofz/projects) → **Add new site** → **Import an existing project**
2. Escolha **GitHub** e autorize o acesso à conta `ronaldomelofz`
3. Selecione o repositório **vocacionalfatima**
4. Confirme as configurações (já definidas em `netlify.toml`):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`
5. Em **Site settings → Domain management**, defina o subdomínio: `vocacionalfatima`
6. Clique em **Deploy site**

### Variável de ambiente (IA opcional)

No Netlify: **Site configuration → Environment variables** → adicione `ANTHROPIC_API_KEY` com sua chave da [Anthropic Console](https://console.anthropic.com/). Sem ela, o teste funciona com resultado local automático.

### Deploy manual (alternativa)

```bash
npm install
npm run build
# Arraste a pasta dist em https://app.netlify.com/drop
```

---

## 🤖 Configurar a IA (opcional, mas recomendado)

O resultado personalizado usa a API da Anthropic (Claude).

### Obter a chave de API (gratuita para começar):
1. Acesse **https://console.anthropic.com/**
2. Crie uma conta gratuita (recebe créditos iniciais)
3. Vá em "API Keys" → "Create Key"
4. Copie a chave gerada

### Configurar no Netlify:
1. No painel do Netlify, vá em **Site Settings → Environment Variables**
2. Clique em "Add a variable"
3. Nome: `ANTHROPIC_API_KEY`
4. Valor: sua chave (ex: `sk-ant-api03-...`)
5. Clique em "Save" e faça um novo deploy

> ⚠️ **Sem a chave configurada**, o teste ainda funciona normalmente —
> o resultado mostrará as pastorais indicadas com base na pontuação,
> mas sem o texto personalizado gerado pela IA.

---

## 📁 Estrutura do projeto

```
vocacionalfatima/
├── index.html                  # Página principal
├── netlify.toml                # Configuração do Netlify
├── package.json                # Dependências
├── vite.config.js              # Configuração do Vite
├── .env.example                # Modelo das variáveis de ambiente
├── netlify/
│   └── functions/
│       └── gerar-resultado.js  # Função serverless (IA)
└── src/
    ├── main.jsx                # Ponto de entrada React
    └── App.jsx                 # Aplicação completa (quiz + resultado)
```

---

## 🏛️ Pastorais avaliadas (18 no total)

| Pastoral | Site da Paróquia |
|----------|-----------------|
| Pastoral Litúrgica & Acólitos | nsfatima.org.br/pastoral-liturgica |
| Pastoral dos Enfermos / Min. Eucaristia | nsfatima.org.br/pastoral-dos-enfermos |
| Catequese & Escola da Fé | nsfatima.org.br/catequese |
| Pastoral do Batismo | nsfatima.org.br/pastoral-do-batismo |
| Pastoral da Juventude | nsfatima.org.br/pastoral-da-juventude |
| Pastoral da Família | nsfatima.org.br/familia |
| ECC / Equipes N. Sra. / Novos Casais | nsfatima.org.br/e-c-c |
| Preparação para o Matrimônio | nsfatima.org.br/preparacao-para-o-matrimonio |
| Pastoral da Misericórdia | nsfatima.org.br/pastoral-da-misericordia |
| Pastoral do Menor | nsfatima.org.br/pastoral-do-menor |
| Pastoral do Idoso | nsfatima.org.br/idoso |
| Legião de Maria / Peregrinos com Maria | nsfatima.org.br/legiao-de-maria-adultos |
| Renovação Carismática — R.C.C. | nsfatima.org.br/r-c-c |
| Pastoral Vocacional | nsfatima.org.br/pastoral-vocacional |
| Pastoral do Acolhimento & Integração | nsfatima.org.br/pastoral-do-acolhimento |
| Pastoral da Comunicação | nsfatima.org.br/comunicacao |
| Campanha da Fraternidade & Tempos Fortes | nsfatima.org.br/campanha-da-fraternidade |
| Dízimo & Sustentação Paroquial | nsfatima.org.br/dizimo-2 |

---

## 💻 Desenvolvimento local

```bash
git clone https://github.com/ronaldomelofz/vocacionalfatima.git
cd vocacionalfatima
npm install
npm run dev
```

Acesse http://localhost:5173

### Enviar alterações ao GitHub

```bash
git add .
git commit -m "sua mensagem"
git push origin main
```

O workflow [`.github/workflows/ci.yml`](.github/workflows/ci.yml) valida o build em cada push e pull request.

---

Desenvolvido com ❤️ para a Paróquia Nossa Senhora de Fátima — Teresina, PI
