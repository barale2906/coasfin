// Contraseña para acceder al panel de administración
// En un entorno real, esto debería estar en el servidor
const ADMIN_PASSWORD = 'coasfin2024';

// Elementos del DOM
const loginSection = document.getElementById('login-section');
const adminPanel = document.getElementById('admin-panel');
const loginForm = document.getElementById('login-form');
const logoutButton = document.getElementById('logout-button');
const newsForm = document.getElementById('news-form');

// Verificar si ya hay una sesión activa
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si hay una sesión activa en localStorage
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // Si hay una sesión activa, mostrar el panel de administración
        showAdminPanel();
    } else {
        // Si no hay sesión activa, mostrar el formulario de login
        showLoginForm();
    }
    
    // Configurar eventos
    setupEventListeners();
});

// Configurar eventos
function setupEventListeners() {
    // Evento para el formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Evento para el botón de logout
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    
    // Evento para el formulario de noticias
    if (newsForm) {
        newsForm.addEventListener('submit', addNews);
    }
}

// Manejar el inicio de sesión
function handleLogin(event) {
    event.preventDefault();
    
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        // Contraseña correcta, iniciar sesión
        localStorage.setItem('adminLoggedIn', 'true');
        showAdminPanel();
    } else {
        // Contraseña incorrecta, mostrar error
        alert('Contraseña incorrecta. Por favor, intente nuevamente.');
    }
}

// Manejar el cierre de sesión
function handleLogout() {
    // Eliminar la sesión
    localStorage.removeItem('adminLoggedIn');
    showLoginForm();
}

// Mostrar el formulario de login
function showLoginForm() {
    loginSection.style.display = 'block';
    adminPanel.style.display = 'none';
}

// Mostrar el panel de administración
function showAdminPanel() {
    loginSection.style.display = 'none';
    adminPanel.style.display = 'block';
}

// Función para agregar una nueva noticia
async function addNews(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    const newArticle = {
        title: formData.get('title'),
        date: formData.get('date'),
        image: formData.get('image'),
        summary: formData.get('summary'),
        content: formData.get('content'),
        author: formData.get('author')
    };

    try {
        // Mostrar indicador de carga
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i><p>Publicando noticia...</p>';
        form.appendChild(loadingIndicator);
        
        // Deshabilitar el formulario mientras se procesa
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        
        // Enviar datos al servidor
        const response = await fetch('api/add-news.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArticle)
        });
        
        const result = await response.json();
        
        // Eliminar indicador de carga
        loadingIndicator.remove();
        
        // Habilitar el botón de envío
        submitButton.disabled = false;
        
        if (result.success) {
            // Mostrar mensaje de éxito
            const messageContainer = document.createElement('div');
            messageContainer.className = 'admin-message success';
            messageContainer.innerHTML = `
                <div class="message-content">
                    <h3>¡Noticia publicada con éxito!</h3>
                    <p>La noticia ha sido agregada correctamente al sistema.</p>
                    <div class="message-details">
                        <strong>Título:</strong> ${newArticle.title}<br>
                        <strong>Fecha:</strong> ${newArticle.date}<br>
                        <strong>Autor:</strong> ${newArticle.author}
                    </div>
                    <div class="message-actions">
                        <a href="noticias.html" class="view-news-button">Ver todas las noticias</a>
                        <button class="close-message">Cerrar</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(messageContainer);
            
            // Agregar evento para cerrar el mensaje
            messageContainer.querySelector('.close-message').addEventListener('click', () => {
                messageContainer.remove();
            });
            
            // Limpiar el formulario
            form.reset();
        } else {
            // Mostrar mensaje de error
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error('Error al publicar la noticia:', error);
        alert('Error al publicar la noticia. Por favor, intente nuevamente.');
        
        // Eliminar indicador de carga si existe
        const loadingIndicator = form.querySelector('.loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
        
        // Habilitar el botón de envío
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
        }
    }
} 