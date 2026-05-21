// ==========================================
// CONFIGURACIÓN DE LA API
// ==========================================
// URL generada desde Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbzdSZSefABCbw1Yu2WxkLZgQVtMvx2ZopR16C5qvvypbOxoQM9FagWvWn6M7vXLv0de/exec";

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
            mode: "no-cors", // Requerido para evitar bloqueos del navegador en Apps Script inicialmente
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        // Como usamos "no-cors", fetch no nos devuelve el JSON directamente para leerlo.
        // Debido a las restricciones de Google Apps Script, la forma más limpia de leer la respuesta 
        // desde un front estático (sin servidor) y en modo no-cors es asumiendo que si la petición
        // se envió sin errores de red, la procesamos.
        // *NOTA TÉCNICA: En el siguiente paso optimizaremos Apps Script para permitir CORS total y leer el JSON de respuesta.
        // Por ahora, mostraremos una alerta asumiendo envío exitoso o que el script validará y nos obligará a recargar.*
        
        alert("Petición enviada. Si tus datos son correctos, has sido registrado. (Optimizaremos las alertas en el próximo paso).");
        
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

        alert("Petición de inicio de sesión enviada.");

    } catch (error) {
        console.error("Error en el login:", error);
        alert("Ocurrió un error al intentar iniciar sesión.");
    } finally {
        setButtonLoading(submitBtn, false, "Ingresar a mi Quiniela");
    }
}
