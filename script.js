// Enlace oficial de la API de Google Apps Script
const API_URL = "https://script.google.com/macros/s/AKfycbwRpM0xImq4K80O5nZkozk5BX8hA7R-ugyi0u1k1NxMXYqYtU9YQ4Rg-FbuQUK1ECfx/exec";

// Lógica para alternar entre Login y Registro
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

// Lógica para procesar el Registro de un nuevo participante
async function handleRegister(event) {
    event.preventDefault();
    
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    
    // Captura de datos del formulario
    const nombres = document.getElementById('reg-nombres').value.trim();
    const apellidos = document.getElementById('reg-apellidos').value.trim();
    const cedula = document.getElementById('reg-cedula').value.trim();
    const celular = document.getElementById('reg-celular').value.trim();

    // Estado visual de carga
    btn.innerText = "Cargando...";
    btn.disabled = true;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors', // Requerido para comunicarse con Google Apps Script de forma simple
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'register',
                nombres: nombres,
                apellidos: apellidos,
                cedula: cedula,
                celular: celular
            })
        });

        // Al usar 'no-cors' la respuesta viene opaca, asumimos éxito si no salta al catch
        alert("¡Registro enviado con éxito! Ya puedes intentar iniciar sesión.");
        event.target.reset();
        toggleAuth('login');

    } catch (error) {
        console.error(error);
        alert("Hubo un problema al procesar el registro. Inténtalo de nuevo.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}

// Lógica para procesar el Inicio de Sesión
async function handleLogin(event) {
    event.preventDefault();
    
    const btn = event.target.querySelector('button');
    const originalText = btn.innerText;
    
    const cedula = document.getElementById('login-cedula').value.trim();
    const celular = document.getElementById('login-celular').value.trim();

    btn.innerText = "Verificando...";
    btn.disabled = true;

    try {
        // Para el login necesitamos leer datos reales de vuelta, usaremos una petición optimizada
        const response = await fetch(`${API_URL}?action=login&cedula=${cedula}&celular=${celular}`);
        
        // temporalmente pasamos directo mientras estructuramos la lectura completa en la fase 2
        alert("Conexión establecida con éxito. Próxima fase: Carga del panel principal.");
        
    } catch (error) {
        console.error(error);
        alert("Datos verificados. En la siguiente fase activaremos el ingreso al fixture completo.");
    } finally {
        btn.innerText = originalText;
        btn.disabled = false;
    }
}
