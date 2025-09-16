// Script de Otimização Automática de Tela para Proporção 16:9
// Detecta tipo de dispositivo e ajusta layout dinamicamente

class ScreenOptimizer {
    constructor() {
        this.deviceType = {};
        
        this.init();
    }
    
    init() {
        this.detectScreenType();
        this.forceMobileToDesktop();
        
        // Aplicar forçamento quando a tela for redimensionada
        window.addEventListener('resize', () => {
            this.detectScreenType();
            this.forceMobileToDesktop();
        });
        
        // Aplicar forçamento quando a orientação mudar
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectScreenType();
                this.forceMobileToDesktop();
            }, 100);
        });
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

    forceMobileToDesktop() {
        const { isMobile, isTablet } = this.deviceType;
        
        // Se for dispositivo móvel (mas não tablet), forçar modo desktop
        if (isMobile && !isTablet) {
            // Definir viewport para modo desktop
            this.setDesktopViewport();
            
            // Aplicar estilos para forçar layout desktop
            this.applyDesktopForcing();
            
            // Adicionar classe indicativa
            document.body.classList.add('mobile-forced-desktop');
            
            console.log('Mobile detectado - Forçando modo desktop');
        } else {
            // Remover forçamento se não for mobile
            document.body.classList.remove('mobile-forced-desktop');
            this.removeDesktopForcing();
        }
    }
    
    setDesktopViewport() {
        // Encontrar ou criar meta viewport
        let viewport = document.querySelector('meta[name="viewport"]');
        
        if (!viewport) {
            viewport = document.createElement('meta');
            viewport.name = 'viewport';
            document.head.appendChild(viewport);
        }
        
        // Definir viewport para simular desktop (largura fixa)
        viewport.content = 'width=1024, initial-scale=0.5, maximum-scale=1.0, user-scalable=yes';
    }
    
    applyDesktopForcing() {
        // Criar ou atualizar estilos para forçar desktop
        let styleElement = document.getElementById('desktop-forcing-styles');
        
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'desktop-forcing-styles';
            document.head.appendChild(styleElement);
        }
        
        styleElement.textContent = `
            .mobile-forced-desktop {
                min-width: 1024px !important;
                overflow-x: auto !important;
            }
            
            .mobile-forced-desktop * {
                -webkit-text-size-adjust: none !important;
                text-size-adjust: none !important;
            }
            
            .mobile-forced-desktop .container {
                max-width: 1200px !important;
                margin: 0 auto !important;
                padding: 0 2rem !important;
            }
            
            .mobile-forced-desktop header {
                height: auto !important;
                padding: 1rem 0 !important;
            }
            
            .mobile-forced-desktop nav ul {
                display: flex !important;
                flex-direction: row !important;
            }
            
            .mobile-forced-desktop nav a {
                padding: 0.5rem 1rem !important;
                font-size: 1rem !important;
                margin: 0 0.5rem !important;
                border-radius: 4px !important;
            }
            
            .mobile-forced-desktop .hero {
                min-height: calc(100vh - 80px) !important;
                padding: 4rem 0 !important;
            }
            
            .mobile-forced-desktop .hero h2 {
                font-size: 3rem !important;
                line-height: 1.2 !important;
            }
            
            .mobile-forced-desktop .hero p {
                font-size: 1.2rem !important;
                max-width: 600px !important;
            }
            
            .mobile-forced-desktop .projetos-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
                gap: 2rem !important;
            }
            
            .mobile-forced-desktop .dev-content {
                display: grid !important;
                grid-template-columns: 2fr 1fr !important;
                gap: 3rem !important;
            }
            
            .mobile-forced-desktop .music-player {
                position: sticky !important;
                top: 2rem !important;
            }
        `;
    }
    
    removeDesktopForcing() {
        // Restaurar viewport original
        let viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.content = 'width=device-width, initial-scale=1.0';
        }
        
        // Remover estilos de forçamento
        let styleElement = document.getElementById('desktop-forcing-styles');
        if (styleElement) {
            styleElement.remove();
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