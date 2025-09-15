// Script de Otimização Automática de Tela para Proporção 16:9
// Detecta tipo de dispositivo e ajusta layout dinamicamente

class ScreenOptimizer {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        this.detectScreenType();
        this.optimizeFor16x9();
        this.applyDynamicStyles();
    }

    detectScreenType() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const ratio = width / height;
        const userAgent = navigator.userAgent;

        // Detectar tipo de dispositivo
        this.deviceType = {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android/i.test(userAgent) && width >= 768,
            isDesktop: width >= 1024,
            isUltrawide: ratio > 2.1,
            is16x9: Math.abs(ratio - (16/9)) < 0.1,
            is9x16: Math.abs(ratio - (9/16)) < 0.1, // Proporção 9:16 para telefones
            isPortrait: height > width,
            isLandscape: width > height,
            currentRatio: ratio,
            width: width,
            height: height
        };

        // Adicionar classe ao body baseada no tipo de tela
        document.body.className = document.body.className.replace(/screen-\w+/g, '');
        
        if (this.deviceType.is9x16 && this.deviceType.isMobile) {
            document.body.classList.add('screen-9x16');
        } else if (this.deviceType.isMobile && !this.deviceType.isTablet) {
            document.body.classList.add('screen-mobile');
        } else if (this.deviceType.isTablet) {
            document.body.classList.add('screen-tablet');
        } else if (this.deviceType.isUltrawide) {
            document.body.classList.add('screen-ultrawide');
        } else if (this.deviceType.is16x9) {
            document.body.classList.add('screen-16x9');
        } else {
            document.body.classList.add('screen-desktop');
        }

        console.log('Tipo de tela detectado:', this.deviceType);
    }

    optimizeFor16x9() {
        const { width, height, currentRatio, is9x16, isMobile } = this.deviceType;
        
        // Se for 9:16 mobile, otimizar para essa proporção
        if (is9x16 && isMobile) {
            const ideal9x16Ratio = 9 / 16;
            let optimizedWidth, optimizedHeight;

            if (currentRatio > ideal9x16Ratio) {
                // Tela muito larga para 9:16 - ajustar baseado na altura
                optimizedHeight = height;
                optimizedWidth = height * ideal9x16Ratio;
            } else {
                // Tela muito alta para 9:16 - ajustar baseado na largura
                optimizedWidth = width;
                optimizedHeight = width / ideal9x16Ratio;
            }

            this.optimizedDimensions = {
                width: optimizedWidth,
                height: optimizedHeight,
                marginX: Math.max(0, (width - optimizedWidth) / 2),
                marginY: Math.max(0, (height - optimizedHeight) / 2),
                ratio: '9:16'
            };
        } else {
            // Calcular dimensões ideais para 16:9
            const ideal16x9Ratio = 16 / 9;
            let optimizedWidth, optimizedHeight;

            if (currentRatio > ideal16x9Ratio) {
                // Tela muito larga - ajustar baseado na altura
                optimizedHeight = height;
                optimizedWidth = height * ideal16x9Ratio;
            } else {
                // Tela muito alta - ajustar baseado na largura
                optimizedWidth = width;
                optimizedHeight = width / ideal16x9Ratio;
            }

            this.optimizedDimensions = {
                width: optimizedWidth,
                height: optimizedHeight,
                marginX: Math.max(0, (width - optimizedWidth) / 2),
                marginY: Math.max(0, (height - optimizedHeight) / 2),
                ratio: '16:9'
            };
        }
    }

    applyDynamicStyles() {
        // Remover estilos anteriores se existirem
        const existingStyle = document.getElementById('screen-optimizer-styles');
        if (existingStyle) {
            existingStyle.remove();
        }

        // Criar novo elemento de estilo
        const style = document.createElement('style');
        style.id = 'screen-optimizer-styles';
        
        let css = this.generateResponsiveCSS();
        style.textContent = css;
        
        document.head.appendChild(style);
    }

    generateResponsiveCSS() {
        const { deviceType, optimizedDimensions } = this;
        let css = '';

        // Estilos base para otimização 16:9
        css += `
            /* Otimização Automática 16:9 */
            .screen-16x9 .hero {
                min-height: 100vh;
                padding: 4rem 2rem;
            }
            
            .screen-16x9 .hero h2 {
                font-size: clamp(2.5rem, 8vw, 5rem);
                line-height: 1.1;
            }
            
            .screen-16x9 .hero p {
                font-size: clamp(1.2rem, 3vw, 1.8rem);
                max-width: 60%;
            }
        `;

        // Estilos para proporção 9:16 (telefones)
        css += `
            .screen-9x16 .hero {
                min-height: 100vh;
                padding: 3rem 1.5rem;
                justify-content: center;
                text-align: center;
            }
            
            .screen-9x16 .hero h2 {
                font-size: clamp(2.2rem, 12vw, 3.5rem);
                line-height: 1.1;
                margin-bottom: 2rem;
                font-weight: 700;
            }
            
            .screen-9x16 .hero p {
                font-size: clamp(1.2rem, 6vw, 1.6rem);
                line-height: 1.5;
                margin-bottom: 2rem;
                max-width: 85%;
                margin-left: auto;
                margin-right: auto;
            }
            
            .screen-9x16 nav a {
                 padding: 0.6rem 0.8rem;
                 font-size: 0.75rem;
                 margin-bottom: 0.2rem;
                 border-radius: 6px;
                 font-weight: 500;
             }
             
             .screen-9x16 header {
                 padding: 0.5rem 0;
                 height: 50px;
             }
             
             .screen-9x16 .logo {
                 font-size: 1.2rem;
             }
            
            .screen-9x16 body {
                 margin-top: 50px;
             }
        `;

        // Estilos para mobile otimizado (outros mobiles)
        css += `
            .screen-mobile .hero {
                min-height: 100vh;
                padding: 2rem 1rem;
                justify-content: center;
            }
            
            .screen-mobile .hero h2 {
                font-size: clamp(2rem, 10vw, 3rem);
                margin-bottom: 1.5rem;
            }
            
            .screen-mobile .hero p {
                font-size: clamp(1.1rem, 5vw, 1.4rem);
                line-height: 1.6;
            }
            
            .screen-mobile nav a {
                padding: 1rem;
                font-size: 1rem;
                margin-bottom: 0.3rem;
            }
        `;

        // Estilos para tablet
        css += `
            .screen-tablet .hero {
                min-height: 90vh;
                padding: 3rem 2rem;
            }
            
            .screen-tablet .hero h2 {
                font-size: clamp(2.2rem, 7vw, 4rem);
            }
            
            .screen-tablet .hero p {
                font-size: clamp(1.1rem, 4vw, 1.5rem);
                max-width: 70%;
            }
        `;

        // Estilos para ultrawide
        css += `
            .screen-ultrawide .hero {
                min-height: 80vh;
                padding: 5rem 10%;
            }
            
            .screen-ultrawide .hero .container {
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .screen-ultrawide .hero h2 {
                font-size: clamp(3rem, 6vw, 6rem);
            }
            
            .screen-ultrawide .hero p {
                font-size: clamp(1.3rem, 2.5vw, 2rem);
                max-width: 50%;
            }
        `;

        // Ajustes dinâmicos baseados na proporção atual
        if (!deviceType.is16x9 && !deviceType.isMobile) {
            const { marginX, marginY } = optimizedDimensions;
            
            css += `
                .hero {
                    margin-left: ${marginX}px;
                    margin-right: ${marginX}px;
                    margin-top: ${marginY}px;
                    margin-bottom: ${marginY}px;
                }
            `;
        }

        return css;
    }

    bindEvents() {
        // Reotimizar quando a tela for redimensionada
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.init();
            }, 250);
        });

        // Reotimizar quando a orientação mudar
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.init();
            }, 500);
        });
    }

    // Método público para forçar reotimização
    reoptimize() {
        this.init();
    }

    // Método para obter informações da tela atual
    getScreenInfo() {
        return {
            deviceType: this.deviceType,
            optimizedDimensions: this.optimizedDimensions
        };
    }
}

// Inicializar quando o DOM estiver carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.screenOptimizer = new ScreenOptimizer();
    });
} else {
    window.screenOptimizer = new ScreenOptimizer();
}

// Exportar para uso global
window.ScreenOptimizer = ScreenOptimizer;