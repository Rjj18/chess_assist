# 📝 Como Criar uma Nova Aula no Chess Assist

## 🎯 Introdução

Este guia mostra como criar uma nova lição de xadrez para o Chess Assist usando arquivos JSON. Não é necessário conhecimento de programação!

## 🚀 Passo a Passo Rápido

### 1. Criar o Arquivo JSON

Crie um novo arquivo na pasta `themes/` com o nome `minha-aula.json`:

```json
{
  "metadata": {
    "id": "minha-aula",
    "title": "Título da Minha Aula",
    "description": "O que os alunos vão aprender",
    "level": "beginner",
    "author": "Seu Nome",
    "version": "1.0.0"
  },
  "slides": [
    {
      "title": "Primeiro Slide",
      "content": "Texto explicativo aqui. Use **negrito** para destacar palavras importantes."
    }
  ]
}
```

### 2. Registrar a Aula

Abra o arquivo `modules/ThemeLoader.js` e adicione sua aula na lista:

```javascript
this.#themeRegistry.set('minha-aula', {
    id: 'minha-aula',
    name: 'Título da Minha Aula',
    description: 'O que os alunos vão aprender',
    level: 'beginner',
    file: 'themes/minha-aula.json'
});
```

### 3. Testar

Acesse: `ppt.html?theme=minha-aula`

---

## 📚 Estrutura Detalhada

### Metadados da Aula
```json
"metadata": {
  "id": "nome-unico-da-aula",          // Apenas letras, números e hífens
  "title": "Nome Bonito da Aula",      // Aparece no cabeçalho
  "description": "Descrição breve",    // Aparece no seletor
  "level": "beginner",                 // beginner, intermediate, advanced
  "author": "Professor João",          // Seu nome
  "version": "1.0.0",                  // Versão da aula
  "tags": ["tática", "abertura"]       // Opcional: categorias
}
```

### Slides
```json
"slides": [
  {
    "title": "Título do Slide",
    "content": "Texto explicativo. Use **negrito** para destacar.",
    "examples": [                      // Opcional: exemplos com tabuleiro
      {
        "name": "Nome do Exemplo",
        "moves": "1.e4 e5 2.Nf3",
        "description": "O que acontece neste exemplo",
        "pgn": "1.e4 e5 2.Nf3"
      }
    ]
  }
]
```

---

## 🎲 Exemplos Práticos

### Aula Simples (Só Texto)
```json
{
  "metadata": {
    "id": "valor-das-pecas",
    "title": "Valor das Peças",
    "description": "Aprenda quanto vale cada peça",
    "level": "beginner",
    "author": "Professor Silva",
    "version": "1.0.0"
  },
  "slides": [
    {
      "title": "Quanto Vale Cada Peça?",
      "content": "No xadrez, cada peça tem um valor diferente:\n\n**Peão** = 1 ponto\n**Cavalo** = 3 pontos\n**Bispo** = 3 pontos\n**Torre** = 5 pontos\n**Dama** = 9 pontos\n**Rei** = Infinito (não pode ser capturado!)"
    },
    {
      "title": "Por Que Isso Importa?",
      "content": "Conhecer o valor das peças ajuda a tomar boas decisões! Nunca troque uma **torre** (5 pontos) por um **cavalo** (3 pontos), a menos que tenha uma boa razão!"
    }
  ]
}
```

### Aula com Tabuleiros
```json
{
  "metadata": {
    "id": "garfo-de-cavalo",
    "title": "Garfo de Cavalo",
    "description": "Aprenda a atacar duas peças ao mesmo tempo",
    "level": "intermediate",
    "author": "Mestre Carlos",
    "version": "1.0.0",
    "tags": ["tática", "cavalo"]
  },
  "slides": [
    {
      "title": "O Que é um Garfo?",
      "content": "Um **garfo** acontece quando o cavalo ataca duas peças inimigas ao mesmo tempo. O adversário só pode salvar uma!"
    },
    {
      "title": "Garfo Real",
      "content": "O garfo mais poderoso é quando o cavalo ataca o **rei** e outra peça simultaneamente. O rei deve sair do xeque, e a outra peça será capturada!",
      "examples": [
        {
          "name": "Garfo Rei e Dama",
          "moves": "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.Ng5 d6 5.Nf7",
          "description": "O cavalo em f7 dá xeque no rei e ataca a torre em h8!",
          "pgn": "1.e4 e5 2.Nf3 Nc6 3.Bc4 f5 4.Ng5 d6 5.Nf7"
        }
      ]
    }
  ]
}
```

---

## 🛠️ Dicas Importantes

### ✅ Faça
- Use linguagem simples e clara
- Inclua analogias para explicar conceitos
- Destaque palavras importantes com **negrito**
- Teste os movimentos antes de incluir no PGN
- Mantenha slides curtos (máximo 4 exemplos)

### ❌ Evite
- Texto muito longo em um slide
- PGN com erros (sempre teste!)
- Mais de 10 slides por aula
- Linguagem muito técnica para iniciantes

### 📝 Formatação do Texto
- `**texto**` = **negrito**
- `\n\n` = quebra de parágrafo
- Use emojis para tornar visual: ⚠️ ✅ ❌ 🎯 👑

---

## 🎨 Níveis de Dificuldade

### 👶 Beginner (Iniciante)
- Regras básicas
- Movimentos das peças
- Conceitos fundamentais
- Linguagem muito simples

### 🧒 Intermediate (Intermediário)
- Táticas básicas
- Estratégias simples
- Finais elementares
- Algumas posições complexas

### 🧠 Advanced (Avançado)
- Táticas complexas
- Estratégia profunda
- Finais difíceis
- Análise detalhada

---

## 🔧 Validação de PGN

Para garantir que os movimentos estão corretos:

1. **Teste online**: Cole os movimentos em chess.com ou lichess.org
2. **Use notação simples**: `1.e4 e5 2.Nf3 Nc6`
3. **Evite anotações**: Não use `!`, `?`, `+/-`, etc.
4. **Movimentos válidos**: Certifique-se que cada lance é legal

### Exemplo de PGN Correto:
```
1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O O-O
```

### Exemplo de PGN Incorreto:
```
1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O! O-O?
```

---

## 🚀 Testando Sua Aula

1. **Salve o arquivo** em `themes/minha-aula.json`
2. **Registre** no `ThemeLoader.js`
3. **Abra o navegador**: `ppt.html?theme=minha-aula`
4. **Verifique**:
   - Título aparece corretamente?
   - Slides navegam bem?
   - Tabuleiros carregam?
   - Movimentos funcionam?

---

## 🐛 Problemas Comuns

### "Tema não encontrado"
- Verifique se o arquivo está em `themes/`
- Confirme se registrou no `ThemeLoader.js`
- Verifique o nome do ID

### "Erro de JSON"
- Use um validador JSON online
- Verifique vírgulas e aspas
- Teste a sintaxe

### "Tabuleiro não carrega"
- Verifique se o PGN está correto
- Teste os movimentos em um site de xadrez
- Simplifique a posição se muito complexa

---

## 📋 Template Pronto

Cole este template e modifique conforme necessário:

```json
{
  "metadata": {
    "id": "TROCAR-AQUI",
    "title": "TROCAR-AQUI",
    "description": "TROCAR-AQUI",
    "level": "beginner",
    "author": "TROCAR-AQUI",
    "version": "1.0.0"
  },
  "slides": [
    {
      "title": "Introdução",
      "content": "Bem-vindos à aula sobre **TROCAR-AQUI**! Hoje vamos aprender..."
    },
    {
      "title": "Conceito Principal",
      "content": "O conceito mais importante é...",
      "examples": [
        {
          "name": "Exemplo Básico",
          "moves": "1.e4 e5",
          "description": "Neste exemplo vemos...",
          "pgn": "1.e4 e5"
        }
      ]
    },
    {
      "title": "Resumo",
      "content": "Hoje aprendemos: 1. **Conceito A** 2. **Conceito B** 3. **Conceito C**"
    }
  ]
}
```

---

🎓 **Pronto!** Agora você pode criar quantas aulas quiser para o Chess Assist. Comece simples e vá aumentando a complexidade gradualmente!
