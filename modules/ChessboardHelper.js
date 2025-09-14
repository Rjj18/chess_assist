/**
 * Helper para obter o caminho correto dos assets do chessboard
 * dependendo de onde o script está sendo executado
 */
export function getChessboardAssetsPath() {
    const currentPath = window.location.pathname;
    const isInSubfolder = currentPath.includes('/games/');
    return isInSubfolder ? "../cm-chessboard-master/assets/" : "cm-chessboard-master/assets/";
}

/**
 * Helper para obter configuração padrão do chessboard com o caminho correto
 */
export function getDefaultChessboardConfig(customConfig = {}) {
    const baseConfig = {
        assetsUrl: getChessboardAssetsPath(),
        style: {
            pieces: { file: "pieces/staunty.svg" },
            animationDuration: 300
        },
        responsive: true
    };

    return { ...baseConfig, ...customConfig };
}
