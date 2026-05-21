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

// Funciones temporales para evitar recargas al enviar el formulario
function handleLogin(event) {
    event.preventDefault();
    console.log("Intentando iniciar sesión...");
    // Aquí conectaremos la API de Google Sheets en el siguiente paso
}

function handleRegister(event) {
    event.preventDefault();
    console.log("Intentando registrar usuario...");
    // Aquí conectaremos la API de Google Sheets en el siguiente paso
}
