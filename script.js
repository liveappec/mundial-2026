// ==========================================
// CONFIGURACIÓN DE LA API (GOOGLE SHEETS)
// ==========================================
const API_URL = "https://script.google.com/macros/s/AKfycbxSl1ufxbvHCXP19W_C6LQ4KvzB0gyaCEfmiAdXqDp2HQOWIDZoZS4rssoSWV1UxIsI/exec";

// Variables globales del sistema
let actualUser = null;

// Lógica para alternar entre pantallas de Login y Registro
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

// Lógica para procesar el Registro de un nuevo usuario
async function handleRegister(event) {
    event.preventDefault();
    
    const nombres = document.getElementById('reg-nombres').value.trim();
    const apellidos = document.getElementById('reg-apellidos').value.trim();
    const cedula = document.getElementById('reg-cedula').value.trim();
    const celular = document.getElementById('reg-celular').value.trim();

    // Cambiar el botón a estado de carga
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Cargando...";
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                action: "register",
                nombres: nombres,
                apellidos: apellidos,
                cedula: cedula,
                celular: celular
            })
        });

        const data = await response.json();
        
        if (data.status === "success") {
            alert("¡Registro Exitoso! Tu código de participante es: " + data.codigo);
            toggleAuth('login'); // Lo mandamos a loguearse
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor. Verifica la configuración de la API.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Lógica para procesar el Inicio de Sesión
async function handleLogin(event) {
    event.preventDefault();
    
    const cedula = document.getElementById('login-cedula').value.trim();
    const celular = document.getElementById('login-celular').value.trim();

    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    btn.innerText = "Ingresando...";
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify({
                action: "login",
                cedula: cedula,
                celular: celular
            })
        });

        const data = await response.json();
        
        if (data.status === "success") {
            actualUser = data.user;
            alert("¡Bienvenido/a " + actualUser.nombres + "!");
            // Aquí cargaremos el dashboard en los siguientes pasos
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión. Verifica las credenciales o la API.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
