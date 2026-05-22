// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================
// URL oficial generada desde Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbxSL1ufxbvHCXPl9W_C6LQ4KvzB0gyaCEfmiAdXqDp2HQOWIDZoZS4rssoSVVlUxIsI/exec";

// ==========================================
// LÓGICA DE INTERFAZ (UI)
// ==========================================
// Alternar entre pestañas de Login y Registro
function toggleAuth(type) {
    const loginForm = document.getElementById('form-login');
    const registerForm = document.getElementById('form-register');
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');

    if (type === 'login') {
        loginForm.classList.remove('hidden-form');
        loginForm.classList.add('active-form');
        registerForm.classList.remove('active-form');
        registerForm.classList.add('hidden-form');
        
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    } else {
        registerForm.classList.remove('hidden-form');
        registerForm.classList.add('active-form');
        loginForm.classList.remove('active-form');
        loginForm.classList.add('hidden-form');
        
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
    }
}

// Función auxiliar para cambiar el estado del botón durante la carga
function setButtonLoading(button, isLoading, textNormal = "Procesando...") {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.innerText;
        button.innerText = "Cargando...";
        button.style.opacity = "0.7";
        button.style.cursor = "wait";
    } else {
        button.disabled = false;
        button.innerText = button.dataset.originalText || textNormal;
        button.style.opacity = "1";
        button.style.cursor = "pointer";
    }
}

// ==========================================
// LÓGICA DE COMUNICACIÓN CON LA API
// ==========================================

// --- REGISTRO DE USUARIO ---
async function handleRegister(event) {
    event.preventDefault(); // Evita que la página se recargue
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);

    // Capturar los valores del formulario
    const nombres = document.getElementById('reg-nombres').value;
    const apellidos = document.getElementById('reg-apellidos').value;
    const cedula = document.getElementById('reg-cedula').value;
    const celular = document.getElementById('reg-celular').value;

    // Estructurar los datos a enviar
    const requestData = {
        action: "register",
        payload: {
            nombres: nombres,
            apellidos: apellidos,
            cedula: cedula,
            celular: celular
        }
    };

    try {
        // Enviar la petición a la API
        const response = await fetch(API_URL, {
            method: "POST",
            mode: "no-cors", // Requerido por ahora para enviar datos a Apps Script sin bloqueos
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        // Como usamos "no-cors", el navegador envía los datos pero no nos deja leer el texto de respuesta por seguridad.
        // Asumimos envío exitoso para esta prueba.
        alert("Petición enviada. Revisa tu Google Sheets para confirmar si los datos llegaron correctamente.");
        
        // Limpiar el formulario
        event.target.reset();
        
        // Regresar a la pestaña de Login
        toggleAuth('login');

    } catch (error) {
        console.error("Error en la petición:", error);
        alert("Ocurrió un error al intentar conectarse al servidor.");
    } finally {
        setButtonLoading(submitBtn, false, "Completar Registro");
    }
}

// --- INICIO DE SESIÓN ---
async function handleLogin(event) {
    event.preventDefault(); // Evita recargar
    
    const submitBtn = event.target.querySelector('button[type="submit"]');
    setButtonLoading(submitBtn, true);

    const cedula = document.getElementById('login-cedula').value;
    const celular = document.getElementById('login-celular').value;

    const requestData = {
        action: "login",
        payload: {
            cedula: cedula,
            celular: celular
        }
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        alert("Petición de inicio de sesión enviada. (Validación completa en la siguiente fase).");

    } catch (error) {
        console.error("Error en el login:", error);
        alert("Ocurrió un error al intentar iniciar sesión.");
    } finally {
        setButtonLoading(submitBtn, false, "Ingresar a mi Quiniela");
    }
}
