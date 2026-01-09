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
        result_best: "Melhor Rota",
        wallet_title: "Carteira Digital",
        card_balance: "Saldo",
        card_holder: "Nome do Titular",
        add_funds: "Adicionar Fundos",
        input_pix: "Chave Pix",
        input_card: "Cartão de Crédito",
        btn_save_payment: "Salvar Método",
        error_payment_blocked: "Informações de pagamento não podem ser inseridas. Este ambiente não está conectado a um processador de pagamento.",

        // Dynamic Logic Text
        comp_title: "Por que mudar?",
        comp_transit: "Ônibus",
        comp_car: "Carro",
        comp_traffic: "(+trânsito)",
        comp_saved: "🎉 Você economizou",
        comp_and: "e",
        comp_source: "Fonte: Prefeitura de Curitiba (2022)",

        // Auth
        auth_login_title: "Login",
        auth_email: "Email",
        auth_password: "Senha",
        auth_toggle_register: "Criar conta",
        auth_toggle_login: "Já tem conta? Entrar",
        btn_login: "Entrar",

        reg_title: "Crie sua Conta",
        reg_name: "Nome Completo",
        reg_home: "Endereço Residencial (Opcional)",
        reg_work: "Endereço Comercial (Opcional)",
        btn_register: "Registrar"
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
        result_best: "Mejor Ruta",
        wallet_title: "Billetera Digital",
        card_balance: "Saldo",
        card_holder: "Titular",
        add_funds: "Añadir Fondos",
        input_pix: "Llave Pix",
        input_card: "Tarjeta de Crédito",
        btn_save_payment: "Guardar Método",
        error_payment_blocked: "No se puede ingresar información de pago. Este entorno no está conectado a un procesador de pagos.",

        // Dynamic Logic Text
        comp_title: "¿Por qué cambiar?",
        comp_transit: "Tránsito",
        comp_car: "Coche",
        comp_traffic: "(+tráfico)",
        comp_saved: "🎉 Ahorraste",
        comp_and: "y",
        comp_source: "Fuente: Ayuntamiento de Curitiba (2022)",

        // Auth
        auth_login_title: "Iniciar Sesión",
        auth_email: "Correo Electrónico",
        auth_password: "Contraseña",
        auth_toggle_register: "Crear Cuenta",
        auth_toggle_login: "¿Ya tienes cuenta? Entrar",
        btn_login: "Entrar",

        reg_title: "Crea tu Cuenta",
        reg_name: "Nombre Completo",
        reg_home: "Dirección Residencial (Opcional)",
        reg_work: "Dirección Comercial (Opcional)",
        btn_register: "Registrar"
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
        result_best: "Best Route",
        wallet_title: "Digital Wallet",
        card_balance: "Balance",
        card_holder: "Card Holder",
        add_funds: "Add Funds",
        input_pix: "Pix Key",
        input_card: "Credit Card",
        btn_save_payment: "Save Method",
        error_payment_blocked: "Payment information cannot be entered. This environment is not connected to a payment processor.",

        // Dynamic Logic Text
        comp_title: "Why Switch?",
        comp_transit: "Transit",
        comp_car: "Car",
        comp_traffic: "(+traffic)",
        comp_saved: "🎉 You save",
        comp_and: "and",
        comp_source: "Source: Curitiba City Hall (2022)",

        // Auth
        auth_login_title: "Login",
        auth_email: "Email",
        auth_password: "Password",
        auth_toggle_register: "Create Account",
        auth_toggle_login: "Have an account? Login",
        btn_login: "Login",

        reg_title: "Create Account",
        reg_name: "Full Name",
        reg_home: "Home Address (Optional)",
        reg_work: "Work Address (Optional)",
        btn_register: "Register"
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

    // --- Payment Logic ---
    document.getElementById('btn-save-payment').addEventListener('click', () => {
        const cardInput = document.getElementById('wallet-card').value;
        const pixInput = document.getElementById('wallet-pix').value;

        if (cardInput && cardInput.trim() !== "") {
            // ERROR: Financial Info Blocked
            alert(translations[currentLang].error_payment_blocked);
            document.getElementById('wallet-card').value = ''; // Clear it for safety
            return;
        }

        if (pixInput && pixInput.trim() !== "") {
            // Pix is allowed (simulate save)
            alert(`Pix Key '${pixInput}' saved temporarily.`);
            // Update Wallet UI to mock funds
            document.querySelector('.card-balance .amount').innerText = "R$ 50,00";
        }
    });

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

    // Normalize Scale (Relative to the longest time)
    const maxTime = Math.max(tTime, cTime);
    const tWidth = (tTime / maxTime) * 100;
    const cWidth = (cTime / maxTime) * 100;

    const t = translations[currentLang]; // Get current dictionary

    // Update HTML content dynamically
    container.innerHTML = `
        <h4 data-i18n="comp_title">${t.comp_title}</h4>
        <div class="comp-grid">
            <div class="comp-item transit">
                <span class="label" data-i18n="comp_transit">${t.comp_transit}</span>
                <div class="bar-container">
                    <div class="bar" style="width: ${tWidth}%">${tTime}m</div>
                </div>
                <span class="cost">R$ ${tCost.toFixed(2).replace('.', ',')}</span>
            </div>
            <div class="comp-item car">
                <span class="label" data-i18n="comp_car">${t.comp_car}</span>
                <div class="bar-container">
                    <div class="bar warning" style="width: ${cWidth}%">${cTime}m ${t.comp_traffic}</div>
                </div>
                <span class="cost">~R$ ${cCost.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
        <div class="savings-alert">
            <span data-i18n="comp_saved">${t.comp_saved}</span> <strong>R$ ${savedMoney.replace('.', ',')}</strong>${savedTime > 0 ? ` <span data-i18n="comp_and">${t.comp_and}</span> <strong>${savedTime} min</strong>` : ''}!
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

// --- Auth Logic ---
let isLoginMode = true;

document.querySelector('.user-pill').addEventListener('click', () => {
    document.getElementById('auth-modal').style.display = 'flex';
    resetAuthForm();
});

document.querySelectorAll('.close-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.modal-overlay').style.display = 'none';
    });
});

document.getElementById('toggle-auth').addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    updateAuthUI();
});

function resetAuthForm() {
    isLoginMode = true;
    updateAuthUI();
    document.getElementById('auth-form').reset();
}

function updateAuthUI() {
    const title = document.getElementById('auth-title');
    const regFields = document.getElementById('register-fields');
    const toggleBtn = document.getElementById('toggle-auth');
    const submitBtn = document.getElementById('btn-auth-submit');

    // Get translations for current lang
    const t = translations[currentLang];

    if (isLoginMode) {
        title.innerText = t.auth_login_title;
        regFields.style.display = 'none';
        submitBtn.innerText = t.btn_login;
        toggleBtn.innerText = t.auth_toggle_register;
    } else {
        title.innerText = t.reg_title;
        regFields.style.display = 'block';
        submitBtn.innerText = t.btn_register;
        toggleBtn.innerText = t.auth_toggle_login;
    }
}

document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (isLoginMode) {
        // LOGIN
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                handleLoginSuccess(data.user);
            } else {
                alert('Login failed. Check credentials.');
            }
        } catch (err) {
            console.error(err);
            alert('Login error');
        }
    } else {
        // REGISTER
        const name = document.getElementById('reg-name').value;
        const homeAddress = document.getElementById('reg-home').value;
        const workAddress = document.getElementById('reg-work').value;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, homeAddress, workAddress })
            });

            if (response.ok) {
                alert('Account created! Please login.');
                isLoginMode = true;
                updateAuthUI();
            } else {
                alert('Registration failed.');
            }
        } catch (err) {
            console.error(err);
            alert('Registration error');
        }
    }
});

function handleLoginSuccess(user) {
    document.getElementById('auth-modal').style.display = 'none';

    // Update UI
    document.querySelector('.welcome-text h1').innerText = `Hello, ${user.name.split(' ')[0]}`;
    document.querySelector('.user-pill .avatar').innerText = user.name.substring(0, 2).toUpperCase();

    // Persist (simple)
    localStorage.setItem('motus_user', JSON.stringify(user));
}

// Check session on load
const savedUser = localStorage.getItem('motus_user');
if (savedUser) {
    handleLoginSuccess(JSON.parse(savedUser));
}
