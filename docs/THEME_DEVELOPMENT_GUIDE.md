# 📚 Guia de Desenvolvimento - Sistema de Temas

## 🎯 Visão Geral

O Chess Assist agora possui um sistema dinâmico de temas que permite carregar diferentes lições de xadrez através de arquivos JSON. Isso torna extremamente fácil criar e customizar novas lições sem modificar código.

## 🔧 Como Criar um Novo Tema

### 1. Estrutura do Arquivo JSON

Crie um novo arquivo na pasta `themes/` seguindo esta estrutura:

```json
{
  "metadata": {
    "id": "meu-tema",
    "title": "Título da Lição",
    "description": "Breve descrição do conteúdo",
    "level": "beginner|intermediate|advanced",
    "author": "Seu Nome",
    "version": "1.0.0",
    "tags": ["tag1", "tag2"]
  },
  "slides": [
    {
      "title": "Título do Slide",
      "content": "Texto explicativo com **formatação** em markdown",
      "examples": [
        {
          "name": "Nome do Exemplo",
          "moves": "1.e4 e5 2.Nf3",
          "description": "Explicação do que acontece",
          "pgn": "1.e4 e5 2.Nf3",
          "difficulty": "easy|medium|hard"
        }
      ],
      "notes": "Notas adicionais para instrutores (opcional)"
    }
  ],
  "settings": {
    "autoAdvance": false,
    "showMoveNumbers": true,
    "boardTheme": "standard"
  }
}
```

### 2. Campos Obrigatórios

#### Metadata
- `id`: Identificador único (apenas letras minúsculas, números e hífens)
- `title`: Título que aparece na interface
- `description`: Descrição breve do tema
- `level`: `"beginner"`, `"intermediate"` ou `"advanced"`
- `version`: Versão no formato semver (ex: "1.0.0")

#### Slides
- `title`: Título do slide
- `content`: Texto principal (suporta **negrito** com asteriscos duplos)

#### Examples (opcional, até 4 por slide)
- `name`: Nome do exemplo
- `moves`: Notação dos movimentos para exibição
- `description`: Explicação do exemplo
- `pgn`: Notação PGN válida para o tabuleiro

### 3. Registrar o Novo Tema

Edite o arquivo `modules/ThemeLoader.js` e adicione seu tema no método `#initializeThemeRegistry()`:

```javascript
this.#themeRegistry.set('meu-tema', {
    id: 'meu-tema',
    name: 'Título da Lição',
    description: 'Breve descrição',
    level: 'beginner',
    file: 'themes/meu-tema.json'
});
```

## 🎨 Exemplos de Temas

### Tema Básico (só texto)
```json
{
  "metadata": {
    "id": "regras-basicas",
    "title": "Regras Básicas do Xadrez",
    "description": "Aprenda as regras fundamentais",
    "level": "beginner",
    "version": "1.0.0"
  },
  "slides": [
    {
      "title": "Como as Peças se Movem",
      "content": "Cada peça do xadrez tem uma forma única de se mover. O **peão** move-se uma casa para frente, mas captura na diagonal..."
    }
  ]
}
```

### Tema com Exemplos
```json
{
  "metadata": {
    "id": "xeque-mate",
    "title": "Padrões de Xeque-Mate",
    "description": "Aprenda os mates básicos",
    "level": "intermediate",
    "version": "1.0.0"
  },
  "slides": [
    {
      "title": "Mate do Pastor",
      "content": "O **mate do pastor** é um dos mates mais rápidos possíveis, acontecendo em apenas 4 lances!",
      "examples": [
        {
          "name": "Mate em 4 Lances",
          "moves": "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#",
          "description": "As brancas atacam o ponto fraco f7 e dão mate rapidamente.",
          "pgn": "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7",
          "difficulty": "easy"
        }
      ]
    }
  ]
}
```

## 🔍 Validação de Temas

O sistema valida automaticamente:
- ✅ Campos obrigatórios presentes
- ✅ Estrutura correta dos slides
- ✅ PGN válido nos exemplos
- ✅ Metadados completos

Se houver erro, será exibido no console do navegador.

## 🌐 Como Usar os Temas

### Via URL
```
ppt.html?theme=meu-tema
```

### Via Interface
Use o dropdown no cabeçalho da página para trocar entre temas disponíveis.

### Via JavaScript
```javascript
// Trocar tema programaticamente
await window.app.switchTheme('meu-tema');

// Listar temas disponíveis
const themes = window.app.getAvailableThemes();
```

## 🎯 Dicas de Desenvolvimento

### 1. PGN Válido
- Use notação algébrica padrão
- Teste os movimentos em um tabuleiro antes de incluir
- Evite posições muito complexas para iniciantes

### 2. Texto Claro
- Use linguagem apropriada para o nível
- Inclua analogias e metáforas para conceitos complexos
- Mantenha slides com 2-4 exemplos no máximo

### 3. Estrutura Progressiva
- Comece com conceitos simples
- Construa gradualmente a complexidade
- Inclua slides de resumo

### 4. Formatação
- Use **negrito** para destacar termos importantes
- Mantenha parágrafos curtos
- Inclua emojis para tornar mais visual (⚠️, ✅, ❌, 🎯)

## 🐛 Solução de Problemas

### Tema não carrega
1. Verifique se o arquivo JSON está na pasta `themes/`
2. Valide a sintaxe JSON em um validador online
3. Confira se todos os campos obrigatórios estão presentes
4. Verifique se o tema foi registrado no `ThemeLoader.js`

### PGN inválido
1. Teste os movimentos em chess.com ou lichess.org
2. Use apenas notação algébrica padrão
3. Evite anotações especiais como !?, +/-, etc.

### Performance
- Mantenha arquivos JSON pequenos (< 100KB)
- Use no máximo 10-12 slides por tema
- Limite exemplos a 2-4 por slide

## 🚀 Recursos Avançados

### Auto-avançar slides
```json
"settings": {
  "autoAdvance": true,
  "timePerSlide": 30
}
```

### Temas de tabuleiro
```json
"settings": {
  "boardTheme": "wood|marble|standard"
}
```

### Metadados estendidos
```json
"metadata": {
  "tags": ["tática", "final", "abertura"],
  "prerequisites": ["regras-basicas"],
  "estimatedTime": "15 minutes",
  "targetAudience": "Crianças 8-12 anos"
}
```

## 📖 Exemplos Completos

Veja os arquivos existentes em `themes/` para referência:
- `abertura-magica.json` - Tema para iniciantes
- `ataque-duplo.json` - Tema intermediário com táticas

---

🎓 **Dica**: Comece criando um tema simples e vá adicionando complexidade gradualmente. O sistema é flexível e permite experimentação!
