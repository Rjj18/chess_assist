/**
 * Chess Opening Slides Data
 * Contains educational content about chess openings
 * @module OpeningSlidesData
 */

import { ChessExample } from './PresentationManager.js';

/**
 * Data for chess opening presentation slides
 */
export const openingSlidesData = [
    {
        title: "A Abertura: Dando o Pontapé Inicial!",
        text: "Olá, pessoal! Bem-vindos à nossa aventura no tabuleiro de xadrez. Imaginem que cada partida de xadrez é como uma viagem de carro. A **abertura** é o momento em que a gente liga o carro, arruma o cinto de segurança e decide para onde vamos. É o começo de tudo! Se a gente começa bem, a viagem será mais tranquila.",
        examples: []
    },
    {
        title: "1º Princípio: Controle o Centro!",
        text: "Na abertura, nossa primeira missão é dominar o centro do tabuleiro. Pensem no centro como a parte mais alta de uma montanha russa. Quem chega lá primeiro tem a melhor vista e o melhor controle do brinquedo inteiro! A gente faz isso movendo os peões que estão bem no meio.",
        examples: [
            new ChessExample({
                name: "Abertura Italiana",
                moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4",
                description: "As brancas controlam o centro com e4 e desenvolvem o cavalo e bispo rapidamente.",
                pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4"
            }),
            new ChessExample({
                name: "Defesa Francesa",
                moves: "1.e4 e6 2.d4 d5",
                description: "As pretas respondem ao controle central das brancas com seus próprios peões centrais.",
                pgn: "1.e4 e6 2.d4 d5"
            })
        ]
    },
    {
        title: "2º Princípio: Desenvolva suas Peças!",
        text: "Depois de cuidar do centro, é hora de acordar nossos amigos. Os **cavalos** e os **bispos** são como amigos que estavam dormindo. A gente precisa movê-los para que eles ajudem a controlar o tabuleiro. Se a gente deixa eles presos lá atrás, eles não fazem nada!",
        examples: [
            new ChessExample({
                name: "Abertura Espanhola",
                moves: "1.e4 e5 2.Nf3 Nc6 3.Bb5",
                description: "Desenvolvimento rápido: cavalo para f3 ataca o peão e5, bispo para b5 pressiona o cavalo.",
                pgn: "1.e4 e5 2.Nf3 Nc6 3.Bb5"
            }),
            new ChessExample({
                name: "Gambito da Dama",
                moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6",
                description: "Ambos os lados desenvolvem cavalos rapidamente após a luta central.",
                pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6"
            })
        ]
    },
    {
        title: "3º Princípio: Proteja o Rei!",
        text: "Nosso rei é como o tesouro mais valioso da nossa equipe. A gente precisa protegê-lo para que ele não seja capturado. A melhor maneira de fazer isso na abertura é o **roque**. O roque é como construir um castelo para o nosso rei, movendo-o para um lugar seguro e trazendo uma torre para protegê-lo.",
        examples: [
            new ChessExample({
                name: "Roque Curto",
                moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O O-O",
                description: "Ambos os lados fazem roque curto, colocando o rei em segurança.",
                pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O O-O"
            }),
            new ChessExample({
                name: "Preparando o Roque",
                moves: "1.d4 Nf6 2.c4 e6 3.Nf3 Be7 4.Bg5 O-O",
                description: "As pretas desenvolvem o bispo e fazem roque rapidamente para segurança.",
                pgn: "1.d4 Nf6 2.c4 e6 3.Nf3 Be7 4.Bg5 O-O"
            })
        ]
    },
    {
        title: "Resumo: Os 5 Super Poderes da Abertura!",
        text: "Agora vocês conhecem os 5 super poderes das aberturas: 1. **Controle o Centro!** 2. **Desenvolva as Peças!** 3. **Proteja o Rei!** 4. **Não Mova a Mesma Peça Duas Vezes!** 5. **Não Saia com a Dama Muito Cedo!** Com esses princípios, vocês vão fazer aberturas incríveis!",
        examples: [
            new ChessExample({
                name: "Abertura Perfeita - Exemplo 1",
                moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O O-O",
                description: "Centro controlado, peças desenvolvidas, reis seguros!",
                pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.O-O O-O"
            }),
            new ChessExample({
                name: "Abertura Perfeita - Exemplo 2",
                moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O",
                description: "Todos os princípios aplicados: centro, desenvolvimento e segurança do rei!",
                pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Be7 5.e3 O-O"
            })
        ]
    },
    {
        title: "⚠️ Erro Comum: Não Mova a Mesma Peça Duas Vezes!",
        text: "Na abertura, cada movimento é precioso! Imaginem que vocês têm apenas algumas jogadas para organizar todo o exército. Se ficarem movendo a mesma peça várias vezes, as outras peças ficam dormindo e vocês perdem tempo valioso. O adversário vai desenvolver mais peças e ter vantagem!",
        examples: [
            new ChessExample({
                name: "❌ Exemplo Ruim - Cavalinho Perdido",
                moves: "1.e4 e5 2.Nf3 Nc6 3.Ng5 d6 4.Nf3 Nf6 5.Bc4 Be7",
                description: "As brancas moveram o cavalo 3 vezes! Perderam tempo e as pretas se desenvolveram melhor.",
                pgn: "1.e4 e5 2.Nf3 Nc6 3.Ng5 d6 4.Nf3 Nf6 5.Bc4 Be7"
            }),
            new ChessExample({
                name: "✅ Exemplo Bom - Desenvolvimento Eficiente",
                moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.Nc3 d6 5.d3 Nf6",
                description: "Cada movimento desenvolve uma peça nova. Muito mais eficiente!",
                pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.Nc3 d6 5.d3 Nf6"
            })
        ]
    },
    {
        title: "👑 Erro Comum: Não Saia com a Dama Muito Cedo!",
        text: "A dama é nossa peça mais poderosa, mas na abertura ela é como uma princesa em perigo! Se ela sair muito cedo, pode ser atacada pelas peças pequenas do adversário e ter que ficar fugindo. Enquanto ela foge, o adversário desenvolve suas peças e ganha tempo. Deixe a dama em casa no início!",
        examples: [
            new ChessExample({
                name: "❌ Exemplo Ruim - Dama Aventureira",
                moves: "1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6 4.Qf3 d6 5.Qg3 Be7",
                description: "A dama saiu cedo e agora está sendo atacada! Tem que fugir e perde tempo.",
                pgn: "1.e4 e5 2.Qh5 Nc6 3.Bc4 Nf6 4.Qf3 d6 5.Qg3 Be7"
            }),
            new ChessExample({
                name: "✅ Exemplo Bom - Dama Paciente",
                moves: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.d3 d6 5.Nc3 Nf6",
                description: "A dama ficou em casa enquanto as outras peças se desenvolveram. Muito melhor!",
                pgn: "1.e4 e5 2.Nf3 Nc6 3.Bc4 Bc5 4.d3 d6 5.Nc3 Nf6"
            })
        ]
    },
    {
        title: "🎯 Truques e Armadilhas Famosas!",
        text: "Agora que vocês conhecem os princípios básicos, vamos ver alguns truques famosos que podem surpreender o adversário! Mas cuidado: se você conhece essas armadilhas, também pode evitá-las quando alguém tentar usar contra você!",
        examples: [
            new ChessExample({
                name: "Armadilha do Pastor (Scholar's Mate)",
                moves: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6?? 4.Qxf7#",
                description: "Um mate rápido em 4 lances! Funciona apenas contra iniciantes que não protegem o ponto f7.",
                pgn: "1.e4 e5 2.Bc4 Nc6 3.Qh5 Nf6 4.Qxf7"
            }),
            new ChessExample({
                name: "Armadilha da Dama Legal",
                moves: "1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1 6.Bxf7+ Ke7 7.Nd5#",
                description: "Uma combinação brilhante que sacrifica a dama para dar mate!",
                pgn: "1.e4 e5 2.Nf3 d6 3.Bc4 Bg4 4.Nc3 g6 5.Nxe5 Bxd1 6.Bxf7+ Ke7 7.Nd5"
            })
        ]
    },
    {
        title: "🕳️ Mais Armadilhas Perigosas!",
        text: "Continuando com nossas armadilhas, aqui estão mais algumas que todo jogador de xadrez deve conhecer. Lembrem-se: o melhor jeito de não cair em uma armadilha é conhecê-la!",
        examples: [
            new ChessExample({
                name: "Armadilha de Blackburne",
                moves: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5 Nxd5 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8",
                description: "No Gambito da Dama, as pretas podem trocar damas e ficar com posição igual!",
                pgn: "1.d4 d5 2.c4 e6 3.Nc3 Nf6 4.Bg5 Nbd7 5.cxd5 exd5 6.Nxd5 Nxd5 7.Bxd8 Bb4+ 8.Qd2 Bxd2+ 9.Kxd2 Kxd8"
            }),
            new ChessExample({
                name: "Armadilha na Defesa Francesa",
                moves: "1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7 7.Qg4 Qc7 8.Qxg7 Rg8 9.Qxh7 cxd4",
                description: "As brancas ganham peões mas as pretas conseguem contra-jogo no centro!",
                pgn: "1.e4 e6 2.d4 d5 3.Nc3 Bb4 4.e5 c5 5.a3 Bxc3+ 6.bxc3 Ne7 7.Qg4 Qc7 8.Qxg7 Rg8 9.Qxh7 cxd4"
            })
        ]
    },
    {
        title: "⚡ Último Truque: O Gambito Budapest!",
        text: "Para terminar nossa aventura, vamos ver uma abertura muito divertida e traiçoeira! O Gambito Budapest pode surpreender jogadores que não a conhecem, mas é uma arma de dois gumes.",
        examples: [
            new ChessExample({
                name: "Gambito Budapest - Linha Principal",
                moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7",
                description: "As pretas sacrificam um peão para desenvolvimento rápido e ataque ao rei branco!",
                pgn: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.Bf4 Nc6 5.Nf3 Bb4+ 6.Nbd2 Qe7"
            }),
            new ChessExample({
                name: "Armadilha do Budapest",
                moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.e4 Nxe5 5.f4 Ng6 6.Nf3 Bb4+ 7.Nc3 Qe7",
                description: "Se as brancas ficam gananciosas, as pretas conseguem compensação com jogo ativo!",
                pgn: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.e4 Nxe5 5.f4 Ng6 6.Nf3 Bb4+ 7.Nc3 Qe7"
            })
        ]
    }
];
