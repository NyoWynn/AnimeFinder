// Configuración de la API
const JIKAN_API_BASE = 'https://api.jikan.moe/v4';

// Sistema de Internacionalización
const i18n = {
    currentLanguage: 'es', // Idioma por defecto
    
    // Detectar idioma del navegador
    detectLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        const langCode = browserLang.split('-')[0];
        return ['es', 'en'].includes(langCode) ? langCode : 'es';
    },
    
    // Inicializar idioma
    init() {
        // Verificar si hay una preferencia guardada
        const savedLanguage = localStorage.getItem('animeFinderLanguage');
        if (savedLanguage && ['es', 'en'].includes(savedLanguage)) {
            this.currentLanguage = savedLanguage;
            console.log(`Idioma cargado desde preferencias: ${this.currentLanguage}`);
        } else {
            this.currentLanguage = this.detectLanguage();
            console.log(`Idioma detectado: ${this.currentLanguage}`);
        }
        
        this.updateUI();
        this.updateLanguageSelector();
    },
    
    // Cambiar idioma
    changeLanguage(lang) {
        this.currentLanguage = lang;
        this.updateUI();
        this.updateLanguageSelector();
        
        // Guardar preferencia en localStorage
        localStorage.setItem('animeFinderLanguage', lang);
        
        // Recargar contenido actual si existe
        this.reloadCurrentContent();
    },
    
    // Actualizar el selector de idioma
    updateLanguageSelector() {
        if (elements.currentLanguage) {
            elements.currentLanguage.textContent = this.currentLanguage.toUpperCase();
        }
        
        // Actualizar opciones activas
        const options = document.querySelectorAll('.language-option');
        options.forEach(option => {
            option.classList.remove('active');
            if (option.dataset.lang === this.currentLanguage) {
                option.classList.add('active');
            }
        });
    },
    
    // Recargar contenido actual
    async reloadCurrentContent() {
        // Si hay resultados de búsqueda, recargarlos
        if (currentSearchResults.length > 0) {
            await renderer.renderAnimeGrid(currentSearchResults, elements.animeGrid, true);
        }
        
        // Si hay recomendaciones, recargarlas
        if (currentRecommendations.length > 0) {
            await renderer.renderAnimeGrid(currentRecommendations, elements.recommendationsGrid, true);
        }
    },
    
    // Actualizar la UI con las traducciones
    updateUI() {
        // Actualizar placeholder del buscador
        if (elements.searchInput) {
            elements.searchInput.placeholder = this.t('searchPlaceholder');
        }
        
        // Actualizar tagline
        if (elements.tagline) {
            elements.tagline.textContent = this.t('tagline');
        }
        
        // Actualizar texto de carga
        if (elements.loadingText) {
            elements.loadingText.textContent = this.t('loading');
        }
        
        // Actualizar títulos de sección
        if (elements.searchResultsTitle) {
            elements.searchResultsTitle.textContent = this.t('searchResults');
        }
        
        if (elements.recommendationsTitle) {
            elements.recommendationsTitle.innerHTML = `
                <i class="fas fa-magic"></i>
                ${this.t('recommendations')}
            `;
        }
        
        // Actualizar footer
        if (elements.creatorText) {
            elements.creatorText.innerHTML = `${this.t('createdBy')} <span class="creator-name">WynnDev</span>`;
        }
    },
    
    // Traducir texto
    t(key, params = {}) {
        const translation = this.translations[this.currentLanguage][key];
        if (!translation) {
            console.warn(`Traducción no encontrada para: ${key}`);
            return key;
        }
        
        // Reemplazar parámetros
        return translation.replace(/\{(\w+)\}/g, (match, param) => {
            return params[param] || match;
        });
    },
    
    // Traducciones
    translations: {
        es: {
            // Títulos de sección
            'searchResults': 'Resultados de búsqueda',
            'recommendations': 'Recomendaciones basadas en géneros',
            'recommendationsFor': 'Recomendaciones para "{title}"',
            'popularAnime': 'Animes Populares',
            'noRecommendations': 'No se encontraron recomendaciones para "{title}"',
            
            // Botones y acciones
            'viewRecommendations': 'Ver Recomendaciones',
            'search': 'Buscar',
            'searchPlaceholder': 'Busca tu anime favorito...',
            'loading': 'Buscando animes...',
            'loadingRecommendations': 'Generando recomendaciones...',
            'rating': 'Clasificación',
        'studios': 'Estudios',
        'genres': 'Géneros',
        'statusFinished': 'Finalizado',
        'statusAiring': 'En Emisión',
        'notAvailable': 'No disponible',
        'unknown': 'Desconocido',
            
            // Mensajes de notificación
            'searchSuccess': 'Se encontraron {count} animes',
            'recommendationsSuccess': 'Se encontraron {count} recomendaciones para "{title}"',
            'noRecommendationsFound': 'No se encontraron recomendaciones para este anime',
            'errorSearch': 'Error al buscar animes. Intenta de nuevo.',
            'errorRecommendations': 'Error al obtener recomendaciones',
            'errorAnimeDetails': 'Error al cargar los detalles del anime',
            'errorUnexpected': 'Error inesperado al obtener recomendaciones',
            'homeSuccess': 'Volviendo a la página principal',
            'homeError': 'Error al cargar la página principal',
            'emptySearch': 'Por favor ingresa un término de búsqueda',
            'noAnimeInfo': 'No se pudo obtener información del anime',
            
            // Estados vacíos
            'noAnimesFound': 'No se encontraron animes',
            'noAnimesFoundDesc': 'Intenta con otros términos de búsqueda',
            'noRecommendationsAvailable': 'No hay recomendaciones disponibles',
            'noRecommendationsDesc': 'Este anime no tiene recomendaciones en la base de datos o no se pudieron generar recomendaciones basadas en géneros.',
            
            // Metadatos
            'episodes': 'episodios',
            'episodesAiring': 'En emisión',
            'episodesCompleted': 'Completado',
            'synopsisNotAvailable': 'Sinopsis no disponible',
            
            // Footer
            'createdBy': 'Creado por',
            'poweredBy': 'Powered by',
            
            // Tagline
            'tagline': 'Descubre tu próximo anime favorito'
        },
        
        en: {
            // Section titles
            'searchResults': 'Search Results',
            'recommendations': 'Genre-based Recommendations',
            'recommendationsFor': 'Recommendations for "{title}"',
            'popularAnime': 'Popular Anime',
            'noRecommendations': 'No recommendations found for "{title}"',
            
            // Buttons and actions
            'viewRecommendations': 'View Recommendations',
            'search': 'Search',
            'searchPlaceholder': 'Search your favorite anime...',
            'loading': 'Searching animes...',
            'loadingRecommendations': 'Generating recommendations...',
             'rating': 'Rating',
        'studios': 'Studios',
        'genres': 'Genres',
        'statusFinished': 'Finished Airing',
        'statusAiring': 'Currently Airing',
        'notAvailable': 'Not available',
        'unknown': 'Unknown',
            
            // Notification messages
            'searchSuccess': 'Found {count} animes',
            'recommendationsSuccess': 'Found {count} recommendations for "{title}"',
            'noRecommendationsFound': 'No recommendations found for this anime',
            'errorSearch': 'Error searching animes. Please try again.',
            'errorRecommendations': 'Error getting recommendations',
            'errorAnimeDetails': 'Error loading anime details',
            'errorUnexpected': 'Unexpected error getting recommendations',
            'homeSuccess': 'Returning to main page',
            'homeError': 'Error loading main page',
            'emptySearch': 'Please enter a search term',
            'noAnimeInfo': 'Could not get anime information',
            
            // Empty states
            'noAnimesFound': 'No animes found',
            'noAnimesFoundDesc': 'Try with other search terms',
            'noRecommendationsAvailable': 'No recommendations available',
            'noRecommendationsDesc': 'This anime has no recommendations in the database or recommendations could not be generated based on genres.',
            
            // Metadata
            'episodes': 'episodes',
            'episodesAiring': 'Airing',
            'episodesCompleted': 'Completed',
            'synopsisNotAvailable': 'Synopsis not available',
            
            // Footer
            'createdBy': 'Created by',
            'poweredBy': 'Powered by',
            
            // Tagline
            'tagline': 'Discover your next favorite anime'
        }
    }
};

// Estado global de la aplicación
let currentSearchResults = [];
let currentRecommendations = [];
let currentSelectedAnime = null;
let searchTimeout = null;
let favorites = [];
let allAnimesCache = new Map(); // Cache para almacenar todos los animes mostrados

// Elementos del DOM
const elements = {
    searchInput: document.getElementById('animeSearch'),
    searchBtn: document.getElementById('searchBtn'),
    searchSuggestions: document.getElementById('searchSuggestions'),
    loading: document.getElementById('loading'),
    loadingText: document.getElementById('loadingText'),
    cuteLoader: document.getElementById('cuteLoader'),
    cuteLoadingText: document.getElementById('cuteLoadingText'),
    cuteLoadingSubtext: document.getElementById('cuteLoadingSubtext'),
    loadingGif: document.getElementById('loadingGif'),
    searchResults: document.getElementById('searchResults'),
    searchResultsTitle: document.getElementById('searchResultsTitle'),
    animeGrid: document.getElementById('animeGrid'),
    recommendations: document.getElementById('recommendations'),
    recommendationsTitle: document.getElementById('recommendationsTitle'),
    recommendationsGrid: document.getElementById('recommendationsGrid'),
    modal: document.getElementById('animeModal'),
    modalBody: document.getElementById('modalBody'),
    closeModal: document.getElementById('closeModal'),
    homeLogo: document.getElementById('homeLogo'),
    tagline: document.querySelector('.tagline'),
    creatorText: document.getElementById('creatorText'),
    languageBtn: document.getElementById('languageBtn'),
    languageDropdown: document.getElementById('languageDropdown'),
    currentLanguage: document.getElementById('currentLanguage'),
    favoritesBtn: document.getElementById('favoritesBtn'),
    favoritesCount: document.getElementById('favoritesCount'),
    favorites: document.getElementById('favorites'),
    favoritesTitle: document.getElementById('favoritesTitle'),
    favoritesGrid: document.getElementById('favoritesGrid')
};


// Sistema de animación de carga
const cuteLoader = {
    gifs: [
        'https://media.giphy.com/media/SFMhnJShQurlmi5StZ/giphy.gif',
        'https://media.giphy.com/media/38QFGlkzPlGKYv1AOD/giphy.gif',
        'https://media.giphy.com/media/NPj5Awodbah0CMgBTS/giphy.gif',
        'https://media.giphy.com/media/OCOinFs9JkwoTDyHGI/giphy.gif',
        'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3Z1aDlleWtkM2UwNWc3dTRoY2cwdDRveXB5NzVrODl0OWtjNmVncyZlcD12MV9naWZzX3NlYXJjaCZjdD1n/fvoFmNuMsI29Rt2GGN/giphy.gif',
        'https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExem4wcG92bWE4YjFzNXM3bmJheDl1ODdtaHJqejU5d2owMXR5eXU1MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rE7zjUvYt0SOiNqUSh/giphy.gif',
         'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExanZtN25oMWNrYzhsMTJubWEzNnk3MXJjMjRlbXNtZzNoMmVsZ2JweSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8E004F9H0R93NXZKhD/giphy.gif',
         'https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNTZ4cDVyOGJudDFsc2x2bjZyMmJsNDFhcTUxc3c1Nm1ua3V0NnEwbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wZpt4EnQ5wUYj2gqfB/giphy.gif'

       
    ],
    messages: [
        'Buscando recomendaciones perfectas',
        'Analizando tus gustos anime',
        'Consultando con los expertos',
        'Preparando sorpresas especiales',
        'Explorando nuevos mundos anime'
    ],
    subMessages: [
        '¡Nuestro asistente anime está trabajando duro!',
        'Encontrando animes que te van a encantar',
        'Revisando miles de opciones para ti',
        'Nuestras monas chinas estan laburando',	
        'Preparando la mejor selección',
        '¡Casi listo con tus recomendaciones!'
    ],

    show() {
        console.log('🎬 Iniciando animación de carga con GIFs...');
        elements.loading.style.display = 'none';
        elements.cuteLoader.style.display = 'flex';
        this.updateGif();
        this.updateMessage();
        this.startMessageRotation();
        this.scrollToLoader();
    },

    scrollToLoader() {
        // Scroll suave hacia la animación de carga
        elements.cuteLoader.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
    },

    hide() {
        console.log('🛑 Deteniendo animación de carga...');
        elements.cuteLoader.style.display = 'none';
        elements.loading.style.display = 'none';
        this.stopMessageRotation();
    },

    updateGif() {
        const randomIndex = Math.floor(Math.random() * this.gifs.length);
        const newGifSrc = this.gifs[randomIndex];
        
        console.log(`🔄 Intentando cargar GIF ${randomIndex + 1}/${this.gifs.length}:`, newGifSrc);
        
        // Crear una nueva imagen para verificar si carga
        const testImg = new Image();
        testImg.onload = () => {
            console.log(`✅ GIF cargado exitosamente:`, newGifSrc);
            elements.loadingGif.src = newGifSrc;
        };
        testImg.onerror = () => {
            console.log(`❌ GIF falló al cargar:`, newGifSrc);
            // Si falla, usar el siguiente GIF
            const nextIndex = (randomIndex + 1) % this.gifs.length;
            const fallbackGif = this.gifs[nextIndex];
            console.log(`🔄 Usando GIF de respaldo ${nextIndex + 1}:`, fallbackGif);
            elements.loadingGif.src = fallbackGif;
        };
        testImg.src = newGifSrc;
    },

    updateMessage() {
        const randomIndex = Math.floor(Math.random() * this.messages.length);
        elements.cuteLoadingText.innerHTML = `${this.messages[randomIndex]}<span class="loading-dots">...</span>`;
        elements.cuteLoadingSubtext.textContent = this.subMessages[randomIndex];
    },

    messageInterval: null,

    startMessageRotation() {
        console.log('⏰ Iniciando rotación de mensajes y GIFs cada 3 segundos...');
        this.messageInterval = setInterval(() => {
            console.log('🔄 Rotando mensaje y GIF...');
            this.updateMessage();
            this.updateGif(); // Cambiar GIF cada vez que cambie el mensaje
        }, 3000);
    },

    stopMessageRotation() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
            this.messageInterval = null;
        }
    }
};

// Sistema de Favoritos
const favoritesSystem = {
    // Cargar favoritos desde localStorage
    loadFavorites() {
        try {
            const savedFavorites = localStorage.getItem('animeFinderFavorites');
            if (savedFavorites) {
                favorites = JSON.parse(savedFavorites);
            }
            this.updateFavoritesCount();
            this.updateFavoritesDisplay();
        } catch (error) {
            console.error('Error loading favorites:', error);
            favorites = [];
        }
    },

    // Guardar favoritos en localStorage
    saveFavorites() {
        try {
            localStorage.setItem('animeFinderFavorites', JSON.stringify(favorites));
        } catch (error) {
            console.error('Error saving favorites:', error);
        }
    },

    // Añadir anime a favoritos
    addToFavorites(anime) {
        if (!this.isFavorite(anime.mal_id)) {
            favorites.push(anime);
            this.saveFavorites();
            this.updateFavoritesCount();
            this.updateFavoritesDisplay();
            utils.showNotification(`${anime.title} añadido a favoritos`, 'success');
        }
    },

    // Quitar anime de favoritos
    removeFromFavorites(animeId) {
        const animeIndex = favorites.findIndex(anime => anime.mal_id === animeId);
        if (animeIndex !== -1) {
            const animeTitle = favorites[animeIndex].title;
            favorites.splice(animeIndex, 1);
            this.saveFavorites();
            this.updateFavoritesCount();
            this.updateFavoritesDisplay();
            utils.showNotification(`${animeTitle} eliminado de favoritos`, 'info');
        }
    },

    // Verificar si un anime está en favoritos
    isFavorite(animeId) {
        return favorites.some(anime => anime.mal_id === animeId);
    },

    // Actualizar contador de favoritos
    updateFavoritesCount() {
        if (elements.favoritesCount) {
            elements.favoritesCount.textContent = favorites.length;
        }
    },

    // Actualizar visualización de favoritos
    async updateFavoritesDisplay() {
        if (elements.favoritesGrid) {
            if (favorites.length === 0) {
                elements.favoritesGrid.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-heart-broken"></i>
                        <h3>No tienes favoritos aún</h3>
                        <p>¡Añade animes a tus favoritos haciendo clic en el corazón!</p>
                    </div>
                `;
            } else {
                await renderer.renderAnimeGrid(favorites, elements.favoritesGrid, false);
            }
        }
    },

    // Mostrar sección de favoritos
    showFavorites() {
        elements.searchResults.style.display = 'none';
        elements.recommendations.style.display = 'none';
        elements.favorites.style.display = 'block';
        
        // Actualizar título
        elements.favoritesTitle.innerHTML = `
            <i class="fas fa-heart"></i>
            Mis Favoritos (${favorites.length})
        `;
        
        // Scroll a la sección
        elements.favorites.scrollIntoView({ behavior: 'smooth' });
    },

    // Obtener todos los favoritos
    getFavorites() {
        return favorites;
    }
};

// Utilidades
const utils = {
    // Debounce para búsquedas
    debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(searchTimeout);
                func(...args);
            };
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(later, wait);
        };
    },

    // Formatear puntuación
    formatScore(score) {
        return score ? score.toFixed(1) : 'N/A';
    },

    // Formatear sinopsis
    formatSynopsis(synopsis, maxLength = 150) {
        if (!synopsis) return 'Sinopsis no disponible';
        return synopsis.length > maxLength 
            ? synopsis.substring(0, maxLength) + '...' 
            : synopsis;
    },

    // Obtener imagen por defecto
    getDefaultImage() {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDI4MCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iNDAwIiBmaWxsPSIjMzM0MTU1Ii8+CjxwYXRoIGQ9Ik0xNDAgMTgwTDE2MCAyMDBMMTQwIDIyMEwxMjAgMjAwTDE0MCAxODBaIiBmaWxsPSIjNjM2NmYxIi8+Cjx0ZXh0IHg9IjE0MCIgeT0iMjQwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTRhM2I4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K';
    },


showNotification(message, type = 'info', options = {}) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;

    // Estilos para la notificación
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'error' ? 'var(--error-color)' : 'var(--success-color)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        boxShadow: 'var(--shadow-lg)',
        zIndex: '3000',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        animation: 'slideIn 0.3s ease-out',
        cursor: 'pointer' 
    });

 
    notification.addEventListener('click', () => {
        // Ocultar con animación
        notification.style.animation = 'fadeOut 0.3s ease-out forwards';
        notification.addEventListener('animationend', () => {
            notification.remove();
        });

     
        if (options.isRecommendation) {
            elements.searchResults.scrollIntoView({ behavior: 'smooth' });
        }
    });

    document.body.appendChild(notification);

    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            notification.addEventListener('animationend', () => {
                notification.remove();
            });
        }
    }, 1500);
}
};

// Servicio de traducción
const translationService = {
    // Traducir texto usando MyMemory API (gratuita)
    async translateText(text, targetLang = 'es') {
        if (!text || text.trim() === '') return text;
        
        // Si el idioma actual es español, no traducir
        if (i18n.currentLanguage === 'es') return text;
        
        try {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=ja|${targetLang}`);
            const data = await response.json();
            
            if (data.responseStatus === 200 && data.responseData) {
                return data.responseData.translatedText;
            }
            return text; // Fallback al texto original
        } catch (error) {
            console.error('Error translating text:', error);
            return text; // Fallback al texto original
        }
    },
    
    // Traducir sinopsis de anime
    async translateSynopsis(synopsis, targetLang = 'es') {
        if (!synopsis || synopsis.trim() === '') return i18n.t('synopsisNotAvailable');
        
        // Si el idioma actual es español, no traducir
        if (i18n.currentLanguage === 'es') return synopsis;
        
        // Limitar la longitud para evitar problemas con la API
        const maxLength = 500;
        const textToTranslate = synopsis.length > maxLength ? synopsis.substring(0, maxLength) + '...' : synopsis;
        
        return await this.translateText(textToTranslate, targetLang);
    }
};

// Rate Limiting
const rateLimiter = {
    requests: [],
    maxRequests: 3, // Máximo 3 requests por segundo
    windowMs: 1000, // Ventana de 1 segundo
    
    async waitIfNeeded() {
        const now = Date.now();
        // Limpiar requests antiguos
        this.requests = this.requests.filter(time => now - time < this.windowMs);
        
        // Si hemos alcanzado el límite, esperar
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = Math.min(...this.requests);
            const waitTime = this.windowMs - (now - oldestRequest);
            if (waitTime > 0) {
                console.log(`Rate limit reached, waiting ${waitTime}ms`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        
        // Registrar este request
        this.requests.push(now);
    }
};

// API Service
const apiService = {
    // Buscar animes
    async searchAnime(query, limit = 20) {
        try {
            await rateLimiter.waitIfNeeded();
            const response = await fetch(`${JIKAN_API_BASE}/anime?q=${encodeURIComponent(query)}&limit=${limit}&sfw=true`);
            if (!response.ok) {
                if (response.status === 429) {
                    console.log('Rate limit hit, waiting 2 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return this.searchAnime(query, limit); // Retry
                }
                throw new Error('Error en la búsqueda');
            }
            return await response.json();
        } catch (error) {
            console.error('Error searching anime:', error);
            throw error;
        }
    },

    // Obtener detalles de un anime
    async getAnimeDetails(id) {
        try {
            await rateLimiter.waitIfNeeded();
            const response = await fetch(`${JIKAN_API_BASE}/anime/${id}`);
            if (!response.ok) {
                if (response.status === 429) {
                    console.log('Rate limit hit, waiting 2 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return this.getAnimeDetails(id); // Retry
                }
                throw new Error('Error obteniendo detalles');
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting anime details:', error);
            throw error;
        }
    },

    // Obtener animes por género
    async getAnimeByGenre(genreId, limit = 20) {
        try {
            await rateLimiter.waitIfNeeded();
            const response = await fetch(`${JIKAN_API_BASE}/anime?genres=${genreId}&limit=${limit}&sfw=true&order_by=score&sort=desc`);
            if (!response.ok) {
                if (response.status === 429) {
                    console.log('Rate limit hit, waiting 2 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return this.getAnimeByGenre(genreId, limit); // Retry
                }
                throw new Error('Error obteniendo animes por género');
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting anime by genre:', error);
            throw error;
        }
    },

    // Obtener animes populares
    async getTopAnime(limit = 20) {
        try {
            await rateLimiter.waitIfNeeded();
            const response = await fetch(`${JIKAN_API_BASE}/top/anime?limit=${limit}&sfw=true`);
            if (!response.ok) {
                if (response.status === 429) {
                    console.log('Rate limit hit, waiting 2 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return this.getTopAnime(limit); // Retry
                }
                throw new Error('Error obteniendo animes populares');
            }
            return await response.json();
        } catch (error) {
            console.error('Error getting top anime:', error);
            throw error;
        }
    }
};

// Sistema de recomendaciones
const recommendationSystem = {
    // Obtener géneros únicos de los resultados de búsqueda
    getUniqueGenres(animes) {
        const genreMap = new Map();
        animes.forEach(anime => {
            if (anime.genres) {
                anime.genres.forEach(genre => {
                    const count = genreMap.get(genre.mal_id) || 0;
                    genreMap.set(genre.mal_id, {
                        id: genre.mal_id,
                        name: genre.name,
                        count: count + 1
                    });
                });
            }
        });
        return Array.from(genreMap.values()).sort((a, b) => b.count - a.count);
    },

    // Generar recomendaciones basadas en géneros de múltiples animes
    async generateRecommendations(searchResults) {
        if (!searchResults || searchResults.length === 0) return [];

        const topGenres = this.getUniqueGenres(searchResults).slice(0, 3);
        const recommendations = new Map();

        for (const genre of topGenres) {
            try {
                const genreAnimes = await apiService.getAnimeByGenre(genre.id, 10);
                if (genreAnimes.data) {
                    genreAnimes.data.forEach(anime => {
                        // Evitar duplicados y animes ya mostrados en búsqueda
                        const isDuplicate = searchResults.some(searchAnime => searchAnime.mal_id === anime.mal_id);
                        if (!isDuplicate && !recommendations.has(anime.mal_id)) {
                            recommendations.set(anime.mal_id, anime);
                        }
                    });
                }
            } catch (error) {
                console.error(`Error getting recommendations for genre ${genre.name}:`, error);
            }
        }

        return Array.from(recommendations.values()).slice(0, 12);
    },

    // Generar recomendaciones basadas en un anime específico
    async generateRecommendationsFromAnime(anime) {
        if (!anime || !anime.genres || anime.genres.length === 0) {
            console.log(`No genres found for anime ${anime?.mal_id || 'unknown'}`);
            return this.getFallbackRecommendations();
        }

        const recommendations = new Map();
        const animeGenres = anime.genres.slice(0, 3); // Reducir a 3 géneros para evitar rate limits

        for (const genre of animeGenres) {
            try {
                // Validar que el genreId existe
                if (!genre.id) {
                    console.log(`Invalid genre ID for ${genre.name}`);
                    continue;
                }

                const genreAnimes = await apiService.getAnimeByGenre(genre.id, 6); // Reducir límite
                if (genreAnimes.data && genreAnimes.data.length > 0) {
                    genreAnimes.data.forEach(recommendedAnime => {
                        // Evitar el anime original y duplicados
                        if (recommendedAnime.mal_id !== anime.mal_id && !recommendations.has(recommendedAnime.mal_id)) {
                            recommendations.set(recommendedAnime.mal_id, recommendedAnime);
                        }
                    });
                } else {
                    console.log(`No animes found for genre ${genre.name}`);
                }
            } catch (error) {
                console.error(`Error getting recommendations for genre ${genre.name}:`, error);
                // Continuar con el siguiente género en lugar de fallar completamente
            }
        }

        const result = Array.from(recommendations.values()).slice(0, 8); // Reducir a 8 recomendaciones
        console.log(`Generated ${result.length} recommendations from genres`);
        
        // Si no hay suficientes recomendaciones, usar fallback
        if (result.length < 4) {
            console.log('Not enough recommendations, using fallback');
            return this.getFallbackRecommendations();
        }
        
        return result;
    },

    // Recomendaciones de fallback cuando la API falla
    async getFallbackRecommendations() {
        try {
            console.log('Using fallback recommendations');
            const topAnime = await apiService.getTopAnime(8);
            return topAnime.data || [];
        } catch (error) {
            console.error('Error getting fallback recommendations:', error);
            return [];
        }
    },

    // Obtener animes similares usando la API de recomendaciones de Jikan
    async getSimilarAnime(animeId) {
        try {
            await rateLimiter.waitIfNeeded();
            const response = await fetch(`${JIKAN_API_BASE}/anime/${animeId}/recommendations`);
            if (!response.ok) {
                if (response.status === 429) {
                    console.log('Rate limit hit, waiting 2 seconds...');
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    return this.getSimilarAnime(animeId); // Retry
                }
                console.log(`No recommendations found for anime ${animeId}`);
                return this.getFallbackRecommendations();
            }
            const data = await response.json();
            
            if (!data.data || data.data.length === 0) {
                console.log(`No recommendation data for anime ${animeId}`);
                return this.getFallbackRecommendations();
            }
            
            // Obtener detalles completos de cada anime recomendado (máximo 6 para evitar rate limits)
            const recommendations = [];
            const animeIds = data.data.slice(0, 6)
                .map(rec => rec.entry?.mal_id)
                .filter(id => id); // Filtrar IDs válidos
            
            if (animeIds.length === 0) {
                console.log(`No valid anime IDs found for recommendations`);
                return this.getFallbackRecommendations();
            }
            
            // Obtener detalles de hasta 2 animes a la vez para evitar sobrecargar la API
            for (let i = 0; i < animeIds.length; i += 2) {
                const batch = animeIds.slice(i, i + 2);
                const promises = batch.map(id => {
                    return apiService.getAnimeDetails(id).catch(error => {
                        console.log(`Failed to get details for anime ${id}:`, error.message);
                        return null; // Retornar null en caso de error
                    });
                });
                
                try {
                    const results = await Promise.all(promises);
                    results.forEach(result => {
                        if (result && result.data) {
                            recommendations.push(result.data);
                        }
                    });
                } catch (error) {
                    console.error('Error processing anime details batch:', error);
                }
            }
            
            // Si no hay suficientes recomendaciones, usar fallback
            if (recommendations.length < 3) {
                console.log('Not enough similar anime, using fallback');
                return this.getFallbackRecommendations();
            }
            
            return recommendations;
        } catch (error) {
            console.error('Error getting similar anime:', error);
            return this.getFallbackRecommendations();
        }
    }
};

// Renderizado de componentes
const renderer = {
    // Renderizar tarjeta de anime
    async renderAnimeCard(anime, showRecommendButton = false) {
        const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || utils.getDefaultImage();
        
        // Traducir sinopsis si es necesario
        const synopsis = await translationService.translateSynopsis(anime.synopsis);
        const formattedSynopsis = utils.formatSynopsis(synopsis);
        
        const score = utils.formatScore(anime.score);
        
        // Mejorar el manejo de episodios con traducciones
        let episodes = i18n.t('episodesAiring');
        if (anime.episodes && anime.episodes !== null) {
            episodes = `${anime.episodes} ${i18n.t('episodes')}`;
        } else if (anime.status) {
            // Usar el estado para determinar si está en emisión
            if (anime.status.toLowerCase().includes('finished') || anime.status.toLowerCase().includes('completed')) {
                episodes = i18n.t('episodesCompleted');
            } else if (anime.status.toLowerCase().includes('airing')) {
                episodes = i18n.t('episodesAiring');
            } else {
                episodes = anime.status;
            }
        }
        
        const genres = anime.genres ? anime.genres.slice(0, 3) : [];

        const isFavorite = favoritesSystem.isFavorite(anime.mal_id);
        
        return `
            <div class="anime-card" data-anime-id="${anime.mal_id}">
                <div class="anime-card-header">
                    <img src="${imageUrl}" alt="${anime.title}" class="anime-image" loading="lazy">
                    <button class="favorite-btn ${isFavorite ? 'favorited' : ''}" data-anime-id="${anime.mal_id}" data-anime-title="${anime.title}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="anime-info">
                    <h3 class="anime-title">${anime.title}</h3>
                    <p class="anime-synopsis">${formattedSynopsis}</p>
                    <div class="anime-meta">
                        <div class="anime-score">
                            <i class="fas fa-star"></i>
                            ${score}
                        </div>
                        <div class="anime-episodes">${episodes}</div>
                    </div>
                    <div class="anime-genres">
                        ${genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                    </div>
                    ${showRecommendButton ? `
                        <div class="anime-actions">
                            <button class="recommend-btn" data-anime-id="${anime.mal_id}" data-anime-title="${anime.title}">
                                <i class="fas fa-magic"></i>
                                ${i18n.t('viewRecommendations')}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    },

    // Renderizar grid de animes
    async renderAnimeGrid(animes, container, showRecommendButtons = false) {
        if (!animes || animes.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>${i18n.t('noAnimesFound')}</h3>
                    <p>${i18n.t('noAnimesFoundDesc')}</p>
                </div>
            `;
            return;
        }

        // Almacenar animes en cache
        animes.forEach(anime => {
            allAnimesCache.set(anime.mal_id, anime);
        });

        // Renderizar tarjetas de forma asíncrona
        const animeCards = await Promise.all(
            animes.map(anime => this.renderAnimeCard(anime, showRecommendButtons))
        );
        
        container.innerHTML = animeCards.join('');
    },

    // Renderizar sugerencias de búsqueda
    renderSearchSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
            elements.searchSuggestions.style.display = 'none';
            return;
        }

        const suggestionsHTML = suggestions.map(anime => {
            const imageUrl = anime.images?.jpg?.small_image_url || utils.getDefaultImage();
            return `
                <div class="suggestion-item" data-anime-id="${anime.mal_id}">
                    <img src="${imageUrl}" alt="${anime.title}" class="suggestion-image">
                    <div class="suggestion-info">
                        <h4>${anime.title}</h4>
                        <p>${anime.year || 'Año no disponible'} • ${anime.score ? utils.formatScore(anime.score) : 'N/A'}</p>
                    </div>
                </div>
            `;
        }).join('');

        elements.searchSuggestions.innerHTML = suggestionsHTML;
        elements.searchSuggestions.style.display = 'block';
    },

    // Renderizar modal de detalles
   
async renderAnimeModal(animeId) {
    try {
        const animeData = await apiService.getAnimeDetails(animeId);
        const anime = animeData.data;

        // --- LÓGICA DE TRADUCCIÓN MEJORADA ---

        const imageUrl = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || utils.getDefaultImage();
        const synopsis = anime.synopsis || i18n.t('synopsisNotAvailable');
        const score = utils.formatScore(anime.score);
        const episodes = anime.episodes || i18n.t('episodesAiring');
        const rating = anime.rating || i18n.t('notAvailable');
        const studios = anime.studios?.map(s => s.name).join(', ') || i18n.t('notAvailable');
        const genres = anime.genres?.map(g => g.name).join(', ') || i18n.t('notAvailable');

        // Función interna para traducir el estado del anime
        const translateStatus = (status) => {
            if (!status) return i18n.t('unknown');
            const lowerCaseStatus = status.toLowerCase();
            if (lowerCaseStatus.includes('finished')) {
                return i18n.t('statusFinished');
            }
            if (lowerCaseStatus.includes('airing')) {
                return i18n.t('statusAiring');
            }
            return status; // Devuelve el original si no coincide
        };

        const status = translateStatus(anime.status);

        // --- HTML CON CLAVES DE TRADUCCIÓN ---

        elements.modalBody.innerHTML = `
            <div class="modal-anime-details">
                <div class="modal-anime-header">
                    <img src="${imageUrl}" alt="${anime.title}" class="modal-anime-image">
                    <div class="modal-anime-info">
                        <h2 class="modal-anime-title">${anime.title}</h2>
                        <div class="modal-anime-meta">
                            <div class="modal-score">
                                <i class="fas fa-star"></i>
                                <span>${score}</span>
                            </div>
                            <div class="modal-episodes">${episodes} ${i18n.t('episodes')}</div>
                            <div class="modal-status">${status}</div>
                        </div>
                        <div class="modal-anime-details-list">
                            <p><strong>${i18n.t('rating')}:</strong> ${rating}</p>
                            <p><strong>${i18n.t('studios')}:</strong> ${studios}</p>
                            <p><strong>${i18n.t('genres')}:</strong> ${genres}</p>
                        </div>
                    </div>
                </div>
                <div class="modal-anime-synopsis">
                    <h3>Sinopsis</h3>
                    <p>${synopsis}</p>
                </div>
            </div>
        `;

        // Añadir estilos para el modal
        const style = document.createElement('style');
        style.textContent = `
            .modal-anime-details {
                color: var(--text-primary);
            }
            .modal-anime-header {
                display: flex;
                gap: 2rem;
                margin-bottom: 2rem;
            }
            .modal-anime-image {
                width: 200px;
                height: 300px;
                object-fit: cover;
                border-radius: 15px;
                box-shadow: var(--shadow-lg);
            }
            .modal-anime-info {
                flex: 1;
            }
            .modal-anime-title {
                font-size: 2rem;
                font-weight: 700;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            .modal-anime-meta {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                flex-wrap: wrap;
            }
            .modal-score {
                background: var(--gradient-secondary);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 25px;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .modal-episodes, .modal-status {
                background: var(--surface-color);
                padding: 0.5rem 1rem;
                border-radius: 25px;
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            }
            .modal-anime-details-list p {
                margin-bottom: 0.5rem;
                color: var(--text-secondary);
            }
            .modal-anime-synopsis h3 {
                font-size: 1.5rem;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            .modal-anime-synopsis p {
                line-height: 1.6;
                color: var(--text-secondary);
            }
            @media (max-width: 768px) {
                .modal-anime-header {
                    flex-direction: column;
                }
                .modal-anime-image {
                    width: 100%;
                    height: 400px;
                }
            }
        `;
        document.head.appendChild(style);

        elements.modal.classList.add('show');
    } catch (error) {
        console.error('Error rendering anime modal:', error);
        utils.showNotification(i18n.t('errorAnimeDetails'), 'error');
    }
},

    // Mostrar recomendaciones específicas de un anime
   // EN: renderer.showAnimeRecommendations
async showAnimeRecommendations(animeId, animeTitle) {
    try {
        cuteLoader.show();
        
        let anime = null;
        try {
            const animeData = await apiService.getAnimeDetails(animeId);
            anime = animeData.data;
        } catch (error) {
            console.error('Error getting anime details:', error);
            utils.showNotification(i18n.t('errorAnimeDetails'), 'error'); // Usando i18n
            cuteLoader.hide();
            return;
        }
        
        if (!anime) {
            utils.showNotification(i18n.t('noAnimeInfo'), 'error'); // Usando i18n
            cuteLoader.hide();
            return;
        }
        
        let recommendations = [];
        try {
            recommendations = await recommendationSystem.getSimilarAnime(animeId);
        } catch (error) {
            console.error('Error getting similar anime:', error);
        }
        
        if (recommendations.length === 0) {
            try {
                recommendations = await recommendationSystem.generateRecommendationsFromAnime(anime);
            } catch (error) {
                console.error('Error generating recommendations from anime:', error);
            }
        }
        
        const searchSectionTitle = elements.searchResults.querySelector('.section-title');
        
        if (recommendations.length > 0) {
            // --- LÍNEA MODIFICADA ---
            // Se usa i18n.t para el título, pasando el título del anime como parámetro.
            searchSectionTitle.innerHTML = `
                <i class="fas fa-magic"></i>
                ${i18n.t('recommendationsFor', { title: animeTitle })}
            `;
            
            elements.searchResults.style.display = 'block';
            renderer.renderAnimeGrid(recommendations, elements.animeGrid, true);
            
            elements.recommendations.style.display = 'none';
            
            // --- LÍNEA MODIFICADA ---
            // Se usa i18n.t para la notificación de éxito.
            utils.showNotification(i18n.t('recommendationsSuccess', { count: recommendations.length, title: animeTitle }), 'success', { isRecommendation: true });
        } else {
            // --- LÍNEA MODIFICADA ---
            // Se usa i18n.t para el título cuando no hay resultados.
            searchSectionTitle.innerHTML = `
                <i class="fas fa-info-circle"></i>
                ${i18n.t('noRecommendations', { title: animeTitle })}
            `;
            
            elements.searchResults.style.display = 'block';
            // --- LÍNEAS MODIFICADAS ---
            // Se usa i18n para el mensaje de estado vacío.
            elements.animeGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>${i18n.t('noRecommendationsAvailable')}</h3>
                    <p>${i18n.t('noRecommendationsDesc')}</p>
                </div>
            `;
            
            elements.recommendations.style.display = 'none';
            
            utils.showNotification(i18n.t('noRecommendationsFound'), 'info');
        }
        
        cuteLoader.hide();
    } catch (error) {
        cuteLoader.hide();
        utils.showNotification(i18n.t('errorUnexpected'), 'error'); // Usando i18n
        console.error('Unexpected error getting anime recommendations:', error);
    }
}
};

// Controladores de eventos
const eventHandlers = {
    // Búsqueda de anime
    async handleSearch(query) {
        if (!query.trim()) {
            utils.showNotification(i18n.t('emptySearch'), 'error');
            return;
        }

        try {
            elements.loading.classList.add('show');
            elements.searchResults.style.display = 'block';
            // Mantener la sección de recomendaciones visible
            elements.recommendations.style.display = 'block';

            const searchData = await apiService.searchAnime(query);
            currentSearchResults = searchData.data || [];

            // Mostrar botones de recomendaciones en los resultados de búsqueda
            await renderer.renderAnimeGrid(currentSearchResults, elements.animeGrid, true);

            // Generar recomendaciones
            if (currentSearchResults.length > 0) {
                const recommendations = await recommendationSystem.generateRecommendations(currentSearchResults);
                currentRecommendations = recommendations;
                
                if (recommendations.length > 0) {
                    // Restaurar el título original de recomendaciones
                    elements.recommendationsTitle.innerHTML = `
                        <i class="fas fa-magic"></i>
                        ${i18n.t('recommendations')}
                    `;
                    await renderer.renderAnimeGrid(recommendations, elements.recommendationsGrid, true);
                }
            }

            elements.loading.classList.remove('show');
            utils.showNotification(i18n.t('searchSuccess', { count: currentSearchResults.length }), 'success');
        } catch (error) {
            elements.loading.classList.remove('show');
            utils.showNotification(i18n.t('errorSearch'), 'error');
            console.error('Search error:', error);
        }
    },

    // Búsqueda con sugerencias
    handleSearchWithSuggestions: utils.debounce(async function(query) {
        if (query.length < 2) {
            elements.searchSuggestions.style.display = 'none';
            return;
        }

        try {
            const searchData = await apiService.searchAnime(query, 5);
            const suggestions = searchData.data || [];
            renderer.renderSearchSuggestions(suggestions);
        } catch (error) {
            console.error('Error getting suggestions:', error);
        }
    }, 300),

    // Cerrar modal
    closeModal() {
        elements.modal.classList.remove('show');
    },

    // Volver a la interfaz inicial
    async goToHome() {
        try {
            elements.loading.classList.add('show');
            
            // Limpiar el campo de búsqueda
            elements.searchInput.value = '';
            elements.searchSuggestions.style.display = 'none';
            
            // Cargar animes populares
            const topAnimeData = await apiService.getTopAnime(12);
            const topAnimes = topAnimeData.data || [];
            
            // Mostrar animes populares
            elements.searchResults.style.display = 'block';
            elements.recommendations.style.display = 'none';
            await renderer.renderAnimeGrid(topAnimes, elements.animeGrid, true);
            
            // Restaurar el título original
            elements.searchResultsTitle.textContent = i18n.t('popularAnime');
            
            elements.loading.classList.remove('show');
            utils.showNotification(i18n.t('homeSuccess'), 'success');
        } catch (error) {
            elements.loading.classList.remove('show');
            utils.showNotification(i18n.t('homeError'), 'error');
            console.error('Error loading home:', error);
        }
    }
};

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar sistema de internacionalización
    i18n.init();
    
    // Inicializar sistema de favoritos
    favoritesSystem.loadFavorites();
    
    // Event listeners
    elements.searchBtn.addEventListener('click', () => {
        const query = elements.searchInput.value.trim();
        if (query) {
            eventHandlers.handleSearch(query);
        } else {
            eventHandlers.goToHome();
        }
    });

    elements.searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        eventHandlers.handleSearchWithSuggestions(query);
    });

    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = elements.searchInput.value.trim();
            if (query) {
                eventHandlers.handleSearch(query);
            } else {
                eventHandlers.goToHome();
            }
        }
    });

    // Event listener para el logo
    elements.homeLogo.addEventListener('click', () => {
        eventHandlers.goToHome();
    });

    // Event listener para el botón de favoritos
    elements.favoritesBtn.addEventListener('click', () => {
        favoritesSystem.showFavorites();
    });


    // Event listeners para el selector de idioma
    elements.languageBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        elements.languageDropdown.classList.toggle('show');
    });

    // Cerrar dropdown al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            elements.languageDropdown.classList.remove('show');
        }
    });

    // Cambiar idioma al seleccionar una opción
    document.addEventListener('click', (e) => {
        const languageOption = e.target.closest('.language-option');
        if (languageOption) {
            const selectedLang = languageOption.dataset.lang;
            i18n.changeLanguage(selectedLang);
            elements.languageDropdown.classList.remove('show');
        }
    });

    // Cerrar sugerencias al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!elements.searchContainer?.contains(e.target)) {
            elements.searchSuggestions.style.display = 'none';
        }
    });

    // Event delegation para tarjetas de anime
    document.addEventListener('click', (e) => {
        // Manejar botón de favoritos PRIMERO
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            e.preventDefault();
            e.stopPropagation();
            const animeId = parseInt(favoriteBtn.dataset.animeId);
            const animeTitle = favoriteBtn.dataset.animeTitle;
            
            if (favoritesSystem.isFavorite(animeId)) {
                favoritesSystem.removeFromFavorites(animeId);
            } else {
                // Buscar el anime en el cache primero
                let anime = allAnimesCache.get(animeId);
                
                if (!anime) {
                    // Si no está en cache, buscar en los arrays actuales
                    anime = [...currentSearchResults, ...currentRecommendations, ...favorites].find(a => a.mal_id === animeId);
                }
                
                if (anime) {
                    favoritesSystem.addToFavorites(anime);
                }
            }
            
            // Actualizar el estado visual del botón
            favoriteBtn.classList.toggle('favorited');
            return; // Salir temprano para evitar otros handlers
        }

        // Manejar botón de recomendaciones
        const recommendBtn = e.target.closest('.recommend-btn');
        if (recommendBtn) {
            e.preventDefault();
            e.stopPropagation();
            const animeId = recommendBtn.dataset.animeId;
            const animeTitle = recommendBtn.dataset.animeTitle;
            renderer.showAnimeRecommendations(animeId, animeTitle);
            return; // Salir temprano para evitar otros handlers
        }

        // Manejar clic en tarjeta de anime (solo si no es un botón)
        const animeCard = e.target.closest('.anime-card');
        if (animeCard && !e.target.closest('button')) {
            const animeId = animeCard.dataset.animeId;
            renderer.renderAnimeModal(animeId);
            return;
        }

        // Manejar sugerencias de búsqueda
        const suggestionItem = e.target.closest('.suggestion-item');
        if (suggestionItem) {
            const animeId = suggestionItem.dataset.animeId;
            elements.searchInput.value = suggestionItem.querySelector('h4').textContent;
            elements.searchSuggestions.style.display = 'none';
            eventHandlers.handleSearch(elements.searchInput.value);
        }
    });

    // Cerrar modal
    elements.closeModal.addEventListener('click', eventHandlers.closeModal);
    elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) {
            eventHandlers.closeModal();
        }
    });

    // Cargar animes populares al inicio
    async function loadTopAnime() {
        try {
            const topAnimeData = await apiService.getTopAnime(12);
            const topAnimes = topAnimeData.data || [];
            
            elements.searchResults.style.display = 'block';
            elements.recommendations.style.display = 'none';
            await renderer.renderAnimeGrid(topAnimes, elements.animeGrid, true); // Mostrar botones de recomendaciones
            
            // Cambiar el título de la sección
            elements.searchResultsTitle.textContent = i18n.t('popularAnime');
        } catch (error) {
            console.error('Error loading top anime:', error);
        }
    }

    loadTopAnime();
});

// Añadir estilos para notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(100%); }
    }
    
    .notification {
        animation: slideIn 0.3s ease-out;
    }
`;
document.head.appendChild(notificationStyles);
