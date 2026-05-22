// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbxSL1ufxbvHCXPl9W_C6LQ4KvzB0gyaCEfmiAdXqDp2HQOWIDZoZS4rssoSVVlUxIsI/exec";

// Variables globales para almacenar datos
let currentUser = null;
let globalPartidos = [];
let globalPronosticos = {};

// Diccionario de Banderas (Emojis) para darle estética premium y rápida
const flags = {
    "Ecuador": "🇪🇨", "México": "🇲🇽", "Argentina": "🇦🇷", "Brasil": "🇧🇷", "Colombia": "🇨🇴",
    "Uruguay": "🇺🇾", "España": "🇪🇸", "Alemania": "🇩🇪", "Francia": "🇫🇷", "Inglaterra": "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    "EEUU": "🇺🇸", "Canadá": "🇨🇦", "Costa de Marfil": "🇨🇮", "Japón": "🇯🇵", "Corea del Sur": "🇰🇷",
    "Holanda": "🇳🇱", "Portugal": "🇵🇹", "Bélgica": "🇧🇪", "Croacia": "🇭🇷", "Senegal": "🇸🇳",
    "Marruecos": "🇲🇦", "Suiza": "🇨🇭", "Arabia Saudí": "🇸🇦", "Australia": "🇦🇺", "Paraguay": "🇵🇾",
    "Turquía": "🇹🇷", "Catar": "🇶🇦", "Haití": "🇭🇹", "Escocia": "🏴󠁧󠁢󠁳󠁣󠁴󠁿", "Curasao": "🇨🇼",
    "Suecia": "🇸🇪", "Túnez": "🇹🇳", "Cabo Verde": "🇨🇻", "Egipto": "🇪🇬", "Irán": "🇮🇷",
    "Nueva Zelanda": "🇳🇿", "Irak": "🇮🇶", "Noruega": "🇳🇴", "Argelia": "🇩🇿", "Austria": "🇦🇹",
    "Jordania": "🇯🇴", "Congo Democrático": "🇨🇩", "Ghana": "🇬🇭", "Panamá": "🇵🇦", "Uzbekistán": "🇺🇿",
    "República Checa": "🇨🇿", "Sudáfrica": "🇿🇦", "Bosnia y Herzegovina": "🇧🇦"
};

function getFlag(teamName) {
    return flags[teamName] || "🏳️"; // Bandera blanca si no se encuentra
}

function toggleAuth(type) {
    document.getElementById('form-login').classList.toggle('hidden-form', type !== 'login');
    document.getElementById('form-register').classList.toggle('hidden-form', type === 'login');
    document.getElementById('tab-login').classList.toggle('active', type === 'login');
    document.getElementById('tab-register').classList.toggle('active', type === 'register');
}

function setBtnLoading(btn, isLoad) {
    btn.disabled = isLoad;
    btn.innerText = isLoad ? "Cargando..." : (btn.dataset.text || "Aceptar");
}

async function fetchAPI(data) {
    // Usamos text/plain para evitar errores de pre-vuelo de CORS en Google Apps Script
    const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(data)
    });
    return await res.json();
}

// --- REGISTRO ---
async function handleRegister(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.dataset.text = btn.innerText;
    setBtnLoading(btn, true);

    try {
        const res = await fetchAPI({
            action: "register",
            payload: {
                nombres: document.getElementById('reg-nombres').value,
                apellidos: document.getElementById('reg-apellidos').value,
                cedula: document.getElementById('reg-cedula').value,
                celular: document.getElementById('reg-celular').value
            }
        });
        alert(res.message);
        if(res.success) {
            e.target.reset();
            toggleAuth('login');
        }
    } catch (err) { alert("Error de conexión."); }
    setBtnLoading(btn, false);
}

// --- LOGIN Y CARGA DEL DASHBOARD ---
async function handleLogin(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.dataset.text = btn.innerText;
    setBtnLoading(btn, true);

    try {
        const res = await fetchAPI({
            action: "login",
            payload: {
                cedula: document.getElementById('login-cedula').value,
                celular: document.getElementById('login-celular').value
            }
        });

        if(res.success) {
            currentUser = res.user;
            globalPartidos = res.partidos;
            globalPronosticos = res.pronosticos || {};
            
            // Ocultar login, mostrar dashboard
            document.getElementById('auth-view').classList.add('hidden-view');
            document.getElementById('dashboard-view').classList.remove('hidden-view');
            
            document.getElementById('lbl-username').innerText = currentUser.nombres;
            renderMatches(); // Dibujar partidos
        } else {
            alert(res.message);
        }
    } catch (err) { alert("Error al cargar los datos."); }
    setBtnLoading(btn, false);
}

// --- RENDERIZAR PARTIDOS ---
function renderMatches() {
    const container = document.getElementById('matches-container');
    const faseFiltro = document.getElementById('select-fase').value;
    container.innerHTML = "";

    // Filtrar partidos por la fase seleccionada
    const partidosFase = globalPartidos.filter(p => p.fase === faseFiltro);
    
    // Agrupar por Grupo (Ej: A, B, C)
    const grupos = {};
    partidosFase.forEach(p => {
        if (!grupos[p.grupo]) grupos[p.grupo] = [];
        grupos[p.grupo].push(p);
    });

    let html = "";
    
    // Ordenar los grupos alfabéticamente
    Object.keys(grupos).sort().forEach(grupoKey => {
        html += `<h3 class="grupo-title">Grupo ${grupoKey !== '-' ? grupoKey : faseFiltro}</h3>`;
        
        grupos[grupoKey].forEach(p => {
            // Verificar si hay pronóstico previo
            let miPronoL = globalPronosticos[p.id] ? globalPronosticos[p.id].local : "";
            let miPronoV = globalPronosticos[p.id] ? globalPronosticos[p.id].visita : "";
            
            let dateObj = new Date(p.fecha);
            let fechaStr = dateObj.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
            let isOpen = p.estado === "ABIERTO";

            html += `
            <div class="match-card">
                <div class="match-header">
                    <span>📅 ${fechaStr} - ⏰ ${p.hora}</span>
                    <span class="match-status ${isOpen ? 'abierto' : 'cerrado'}">
                        ${isOpen ? '● Abierto' : 'Bloqueado'}
                    </span>
                </div>
                
                <div class="teams-row">
                    <div class="team local">
                        <span class="flag">${getFlag(p.local)}</span> ${p.local}
                    </div>
                    
                    <div class="score-inputs">
                        <input type="number" id="l-${p.id}" class="score-input" value="${miPronoL}" ${!isOpen ? 'disabled' : ''} min="0">
                        <span style="font-weight:bold; color:#94A3B8;">-</span>
                        <input type="number" id="v-${p.id}" class="score-input" value="${miPronoV}" ${!isOpen ? 'disabled' : ''} min="0">
                    </div>

                    <div class="team visita">
                        <span class="flag">${getFlag(p.visita)}</span> ${p.visita}
                    </div>
                </div>
                
                ${isOpen ? `<button class="btn-save-match" onclick="saveMatch(${p.id}, this)">Guardar Pronóstico</button>` : ''}
            </div>
            `;
        });
    });

    container.innerHTML = html;
    updateStats();
}

// --- GUARDAR PRONÓSTICO INDIVIDUAL ---
async function saveMatch(id_partido, btnElement) {
    const localVal = document.getElementById(`l-${id_partido}`).value;
    const visitaVal = document.getElementById(`v-${id_partido}`).value;

    if (localVal === "" || visitaVal === "") {
        alert("Debes ingresar ambos goles.");
        return;
    }

    const btnText = btnElement.innerText;
    btnElement.innerText = "Guardando...";
    btnElement.disabled = true;

    try {
        const res = await fetchAPI({
            action: "save_pronostico",
            payload: {
                codigo: currentUser.codigo,
                id_partido: id_partido,
                goles_local: localVal,
                goles_visita: visitaVal
            }
        });

        if(res.success) {
            btnElement.innerText = "¡Guardado ✔!";
            btnElement.style.background = "#10B981";
            btnElement.style.color = "white";
            
            // Actualizar memoria local
            globalPronosticos[id_partido] = { local: localVal, visita: visitaVal };
            updateStats();

            setTimeout(() => {
                btnElement.innerText = "Actualizar Pronóstico";
                btnElement.style.background = "#f1f5f9";
                btnElement.style.color = "var(--primary-blue)";
                btnElement.disabled = false;
            }, 2000);
        }
    } catch (err) {
        alert("Error al guardar.");
        btnElement.innerText = btnText;
        btnElement.disabled = false;
    }
}

// --- ACTUALIZAR CONTADOR ---
function updateStats() {
    const totalProno = Object.keys(globalPronosticos).length;
    document.getElementById('lbl-stats').innerText = `${totalProno}/104`;
}

function logout() {
    currentUser = null;
    document.getElementById('auth-view').classList.remove('hidden-view');
    document.getElementById('dashboard-view').classList.add('hidden-view');
    document.getElementById('form-login').reset();
}
