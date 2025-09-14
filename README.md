# Chess Assist 🏆

Uma aplicação web completa para aprendizado e prática de xadrez com recursos interativos e acessibilidade.

## 📁 Estrutura do Projeto

```
chess_assist/
├── 📄 index.html                    # Página principal
├── 📄 ppt.html                      # Sistema de apresentações interativas
├── 📄 package.json                  # Configurações do projeto
├── 📄 LICENSE                       # Licença do projeto
├── 
├── 📁 docs/                         # Documentação
│   ├── 📄 README.md                 # Este arquivo
│   ├── 📄 COMO_CRIAR_AULA.md        # Guia para criar aulas
│   ├── 📄 THEME_DEVELOPMENT_GUIDE.md # Guia técnico de desenvolvimento
│   ├── 📄 class-diagram.md          # Diagrama de classes
│   ├── 📄 IMPROVEMENTS_AND_STOCKFISH_PLAN.md
│   └── 📄 STOCKFISH_INTEGRATION_GUIDE.md
│
├── 📁 games/                        # Jogos e modos específicos
│   ├── 📄 play.html                 # Jogo contra IA
│   ├── 📄 setup.html                # Configuração de posições
│   ├── 📄 escape.html               # Modo King Escape
│   ├── 📄 pawn-race.html            # Corrida de peões
│   └── 📄 lone-knight.html          # Cavalo solitário
│
├── 📁 modules/                      # Módulos JavaScript (ES2024)
│   ├── 📄 AccessibilityController.js # Recursos de acessibilidade
│   ├── 📄 ThemeLoader.js            # Sistema de carregamento de temas
│   ├── 📄 ThemeSelectorUI.js        # Interface de seleção de temas
│   ├── 📄 PresentationManager.js    # Gerenciador de apresentações
│   ├── 📄 PresentationApp.js        # Aplicação principal de apresentações
│   ├── 📄 BoardManager.js           # Gerenciamento do tabuleiro
│   ├── 📄 GameController.js         # Controlador principal de jogos
│   ├── 📄 ThemeManager.js           # Gerenciamento de temas visuais
│   ├── 📄 UIController.js           # Controle da interface
│   ├── 📄 home-script.js            # Script da página inicial
│   └── [outros controladores específicos de jogos...]
│
├── 📁 themes/                       # Temas de aulas em JSON
│   ├── 📄 abertura-magica.json      # Aula sobre aberturas
│   └── 📄 ataque-duplo.json         # Aula sobre ataques duplos
│
├── 📁 styles/                       # Folhas de estilo CSS
│   ├── 📄 styles.css                # Estilos principais
│   └── 📄 presentation.css          # Estilos das apresentações
│
├── 📁 assets/                       # Recursos visuais
│   └── 📄 demo.gif                  # Demonstração
│
└── 📁 cm-chessboard-master/         # Biblioteca do tabuleiro
    ├── 📁 src/                      # Código fonte
    ├── 📁 assets/                   # Recursos visuais
    └── 📁 test/                     # Testes
```

## 🚀 Recursos Principais

### 🎯 Modos de Jogo
- **Play Against AI**: Jogue contra a inteligência artificial
- **Set Up Custom Position**: Configure posições personalizadas
- **King Escape Mode**: Modo especial de fuga do rei
- **Pawn Race**: Corrida estratégica de peões
- **Lone Knight**: Desafio do cavalo solitário

### 📚 Sistema de Aulas Interativas
- **Temas JSON**: Sistema modular de aulas carregadas dinamicamente
- **Apresentações Visuais**: Slides interativos com tabuleiros
- **Múltiplas Aulas**: Abertura Mágica, Ataque Duplo, e mais
- **Seletor Dinâmico**: Troca de temas em tempo real

### ♿ Recursos de Acessibilidade
- **🔤 Texto em Caixa Alta**: Converte todo o texto para maiúsculas
- **🎨 Alto Contraste**: Modo de alto contraste para melhor visibilidade
- **📏 Ajuste de Fonte**: Controle deslizante para tamanho da fonte (80-150%)
- **⌨️ Atalhos de Teclado**: Alt + A para abrir painel de acessibilidade
- **💾 Persistência**: Configurações salvas no localStorage
- **🔄 Reset Rápido**: Botão para restaurar configurações padrão

### 🎨 Interface Responsiva
- **Tema Claro/Escuro**: Alternância de temas visuais
- **Design Responsivo**: Adaptável a diferentes tamanhos de tela
- **Navegação Intuitiva**: Interface limpa e organizada

## 🛠️ Tecnologias Utilizadas

- **ES2024 Modules**: JavaScript moderno com classes e módulos
- **cm-chessboard**: Biblioteca para renderização do tabuleiro
- **CSS Grid/Flexbox**: Layout responsivo moderno
- **LocalStorage**: Persistência de configurações
- **JSON Schema**: Validação de temas de aulas

## ⚡ Como Usar

### Iniciando o Servidor
```bash
python -m http.server 8000
```

### Acessando a Aplicação
1. Abra seu navegador
2. Vá para `http://localhost:8000`
3. Escolha um modo de jogo ou acesse as aulas interativas

### Recursos de Acessibilidade
1. Pressione `Alt + A` ou clique no ícone ♿ no canto superior direito
2. Ative as opções conforme necessário:
   - ✅ Texto em Caixa Alta
   - ✅ Alto Contraste  
   - 🎚️ Ajuste do tamanho da fonte
3. As configurações são salvas automaticamente

### Criando Novas Aulas
Consulte o guia completo em `docs/COMO_CRIAR_AULA.md` para aprender como criar seus próprios temas de aula em formato JSON.

## 🔧 Arquitetura Técnica

### Padrões de Design
- **MVC Pattern**: Separação clara de responsabilidades
- **Module Pattern**: Encapsulamento de funcionalidades
- **Observer Pattern**: Sistema de eventos e notificações
- **Strategy Pattern**: Diferentes estratégias de jogo

### Modularização
- **Controle de Estado**: Gerenciamento centralizado de estado
- **Event Handling**: Sistema robusto de eventos
- **Lazy Loading**: Carregamento dinâmico de recursos
- **Error Handling**: Tratamento adequado de erros

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:
- Consulte a documentação em `docs/`
- Abra uma issue no GitHub
- Verifique os exemplos de temas em `themes/`

---

**Chess Assist** - Tornando o aprendizado de xadrez mais acessível e interativo! ♟️✨
