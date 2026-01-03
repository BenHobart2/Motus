console.log('Motus Transit App Loaded');

const STORAGE_KEY_PRIVACY = 'motus_privacy_consent';
const STORAGE_KEY_FAVS = 'motus_favorites';

let map;
let routeLayer;
let trafficLayer;



// --- Internationalization (i18n) ---
const translations = {
    pt: {
        nav_dashboard: "Dashboard",
        nav_planner: "Planejador",
        nav_wallet: "Carteira",
        nav_favorites: "Favoritos",
        header_welcome: "Bom dia, Viajante",
        header_city: "Cidade Atual:",
        map_title: "Tráfego e Rede de Transporte",
        legend_bus: "Ônibus Expresso (Fluindo)",
        legend_traffic: "Trânsito em Tempo Real",
        planner_title: "Planeje sua Jornada",
        mode_bus: "Ônibus",
        mode_walk: "A pé",
        mode_bike: "Bike",
        input_from: "Localização Atual",
        input_to: "Para onde?",
        btn_find: "Buscar Rota",
        result_best: "Melhor Rota",
        wallet_title: "Carteira Digital",
        card_balance: "Saldo",
        btn_reload: "Recarregar",
        btn_tap: "Pagar (Tap)",

        // Dynamic Logic Text
        comp_title: "Por que mudar?",
        comp_transit: "Ônibus",
        comp_car: "Carro",
        comp_traffic: "(+trânsito)",
        comp_saved: "🎉 Você economizou",
        comp_and: "e"
    },
    es: {
        nav_dashboard: "Tablero",
        nav_planner: "Planificador",
        nav_wallet: "Billetera",
        nav_favorites: "Favoritos",
        header_welcome: "Buenos días, Viajero",
        header_city: "Ciudad Actual:",
        map_title: "Tráfico y Red de Transporte",
        legend_bus: "Bus Expreso (Fluido)",
        legend_traffic: "Tráfico en Tiempo Real",
        planner_title: "Planifica tu Viaje",
        mode_bus: "Bus",
        mode_walk: "Caminar",
        mode_bike: "Bici",
        input_from: "Ubicación Actual",
        input_to: "¿A dónde vas?",
        btn_find: "Buscar Ruta",
        result_best: "Mejor Ruta",
        wallet_title: "Billetera Digital",
        card_balance: "Saldo",
        btn_reload: "Recargar",
        btn_tap: "Pagar (Tap)",

        // Dynamic Logic Text
        comp_title: "¿Por qué cambiar?",
        comp_transit: "Tránsito",
        comp_car: "Coche",
        comp_traffic: "(+tráfico)",
        comp_saved: "🎉 Ahorraste",
        comp_and: "y"
    },
    en: {
        nav_dashboard: "Dashboard",
        nav_planner: "Planner",
        nav_wallet: "Wallet",
        nav_favorites: "Favorites",
        header_welcome: "Good Morning, Traveler",
        header_city: "Current City:",
        map_title: "Traffic & Transit Network",
        legend_bus: "Bus Express (Flowing)",
        legend_traffic: "Real-Time Traffic",
        planner_title: "Plan Your Journey",
        mode_bus: "Bus",
        mode_walk: "Walk",
        mode_bike: "Bike",
        input_from: "Current Location",
        input_to: "Where to?",
        btn_find: "Find Route",
        result_best: "Best Route",
        wallet_title: "Digital Wallet",
        card_balance: "Balance",
        btn_reload: "Auto-Reload",
        btn_tap: "Tap to Pay",

        // Dynamic Logic Text
        comp_title: "Why Switch?",
        comp_transit: "Transit",
        comp_car: "Car",
        comp_traffic: "(+traffic)",
        comp_saved: "🎉 You save",
        comp_and: "and"
    }
};

let currentLang = 'pt'; // Default to Portuguese

document.addEventListener('DOMContentLoaded', () => {
    handlePrivacyModal();
    setupNavigation();
    setupMap();
    setupPlanner();
    loadFavorites();
    setupLanguage(); // Init Language
});

function setupLanguage() {
    const selector = document.getElementById('lang-selector');

    // Set initial
    changeLanguage('pt');

    selector.addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });
}

function changeLanguage(lang) {
    currentLang = lang;
    const t = translations[lang];

    // Update Text Content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) el.innerText = t[key];
    });

    // Update Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        if (t[key]) el.placeholder = t[key];
    });
}

// --- Privacy ---
function handlePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    const acceptBtn = document.getElementById('accept-privacy');

    if (localStorage.getItem(STORAGE_KEY_PRIVACY)) {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'flex';
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem(STORAGE_KEY_PRIVACY, 'true');
        modal.style.opacity = '0';
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    });
}

// --- Navigation ---
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

// --- Map (Curitiba, Brazil) ---
function setupMap() {
    // Curitiba Coordinates
    const CITY_CENTER = [-25.4284, -49.2733];

    // Init Map
    map = L.map('map').setView(CITY_CENTER, 13);

    // Tiles (CartoDB Voyager - Clean look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Real-Time Traffic Layer (Google Maps Traffic)
    const trafficLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        opacity: 0.7
    });

    trafficLayer.addTo(map);

    // Transit Layer (BRT Corridors - Keeping these as they are specific to the Curitiba "Bus vs Car" story)
    const busLanes = [
        [[-25.4385, -49.2705], [-25.4455, -49.2805], [-25.4505, -49.2905]], // Parallel to car traffic
        [[-25.410, -49.25], [-25.450, -49.30]] // North-South Corridor
    ];
    L.polyline(busLanes, { color: '#10b981', weight: 6, opacity: 0.9, dashArray: '10, 5' }).addTo(map);
}
// Removed simulateTrafficOverlay as we now use real tiles

// --- Route Planner & Modes ---
function setupPlanner() {
    const searchBtn = document.querySelector('.btn-search');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const btnSaveFav = document.getElementById('btn-save-fav');

    let currentMode = 'bus';

    // Mode Toggle Logic
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMode = btn.dataset.mode;
        });
    });

    searchBtn.addEventListener('click', () => {
        // Mock Routing (Praça Tiradentes -> Jardim Botânico)
        const start = [-25.4284, -49.2733];
        const end = [-25.4429, -49.2405]; // Botanical Garden

        // Draw Route
        drawRoute(start, end, currentMode);

        // Show Results Pane
        const results = document.getElementById('route-results');
        const text = document.getElementById('result-text');
        const eta = document.getElementById('result-eta');
        const compContainer = document.getElementById('dynamic-comparison'); // Container to update

        results.style.display = 'block';

        // --- Dynamic Comparison Logic ---
        let transitTime = 22; // Base (Mock)
        let carTime = 45;     // Base (Mock)
        let transitCost = 2.50;
        let carCost = 9.50;

        if (currentMode === 'bus') {
            text.innerText = "Taking Line 303 (Centenário) -> Walk 5m";
            eta.innerText = "ETA: 22 min";
            transitTime = 22;
        } else if (currentMode === 'bike') {
            text.innerText = "Dedicated Bike Lane available";
            eta.innerText = "ETA: 35 min";
            transitTime = 35;
            transitCost = 0; // Free
        } else {
            text.innerText = "Scenic route via parks";
            eta.innerText = "ETA: 1h 10m";
            transitTime = 70;
            transitCost = 0;
        }

        // Update Comparison UI
        updateComparisonUI(transitTime, transitCost, carTime, carCost);

        // Auto-zoom to route
        map.fitBounds([start, end], { padding: [50, 50] });
    });

    btnSaveFav.addEventListener('click', () => {
        const routeName = document.querySelector('.input-group input[placeholder="Where to?"]').value;
        const mode = currentMode;
        saveFavorite(routeName, mode);
    });
}

function updateComparisonUI(tTime, tCost, cTime, cCost) {
    const container = document.getElementById('dynamic-comparison');
    if (!container) return;

    // Calculate Savings
    const savedMoney = (cCost - tCost).toFixed(2);
    const savedTime = Math.max(0, cTime - tTime);

    const t = translations[currentLang]; // Get current dictionary

    // Update HTML content dynamically
    container.innerHTML = `
        <h4>${t.comp_title}</h4>
        <div class="comp-grid">
            <div class="comp-item transit">
                <span class="label">${t.comp_transit}</span>
                <div class="bar-container">
                    <div class="bar" style="width: ${Math.min(100, (tTime / cTime) * 100)}%">${tTime}m</div>
                </div>
                <span class="cost">$${tCost.toFixed(2)}</span>
            </div>
            <div class="comp-item car">
                <span class="label">${t.comp_car}</span>
                <div class="bar-container">
                    <div class="bar warning" style="width: 100%">${cTime}m ${t.comp_traffic}</div>
                </div>
                <span class="cost">~$${cCost.toFixed(2)}</span>
            </div>
        </div>
        <div class="savings-alert">
            ${t.comp_saved} <strong>$${savedMoney}</strong>${savedTime > 0 ? ` ${t.comp_and} <strong>${savedTime} min</strong>` : ''}!
        </div>
    `;
}

function drawRoute(start, end, mode) {
    if (routeLayer) map.removeLayer(routeLayer);

    let color = '#3b82f6'; // Blue default
    let dashArray = null;

    if (mode === 'walk') {
        color = '#f59e0b';
        dashArray = '5, 10'; // Dotted
    } else if (mode === 'bike') {
        color = '#8b5cf6';
        dashArray = '5, 5';
    }

    // Mock Waypoints (simple curve)
    const mid = [
        (start[0] + end[0]) / 2 + 0.005,
        (start[1] + end[1]) / 2 - 0.005
    ];

    routeLayer = L.polyline([start, mid, end], {
        color: color,
        weight: 5,
        dashArray: dashArray
    }).addTo(map);

    // Add markers
    L.circleMarker(start, { radius: 6, color: 'green' }).addTo(map);
    L.marker(end).addTo(map).bindPopup("Destination").openPopup();
}

// --- Favorites ---
function loadFavorites() {
    const list = document.getElementById('favorites-list');
    const favs = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS) || '[]');

    list.innerHTML = '';
    favs.forEach(fav => {
        const item = document.createElement('div');
        item.className = 'fav-item';
        item.innerHTML = `<span>${getModeIcon(fav.mode)} ${fav.name}</span> <span class="delete-fav">×</span>`;
        list.appendChild(item);

        item.querySelector('.delete-fav').addEventListener('click', (e) => {
            e.stopPropagation();
            removeFavorite(fav.id);
        });

        item.addEventListener('click', () => {
            // Quick load logic here
            alert(`Loading favorite route to: ${fav.name}`);
        });
    });
}

function saveFavorite(name, mode) {
    const favs = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS) || '[]');
    favs.push({ id: Date.now(), name, mode });
    localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favs));
    loadFavorites();
}

function removeFavorite(id) {
    let favs = JSON.parse(localStorage.getItem(STORAGE_KEY_FAVS) || '[]');
    favs = favs.filter(f => f.id !== id);
    localStorage.setItem(STORAGE_KEY_FAVS, JSON.stringify(favs));
    loadFavorites();
}

function getModeIcon(mode) {
    if (mode === 'walk') return '🚶';
    if (mode === 'bike') return '🚲';
    return '🚌';
}
