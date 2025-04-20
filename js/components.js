// Función para cargar componentes HTML
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`Error al cargar el componente: ${response.status}`);
        }
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
        
        // Marcar el enlace activo en la navegación
        markActiveLink();
    } catch (error) {
        console.error('Error al cargar el componente:', error);
        document.getElementById(elementId).innerHTML = `<p>Error al cargar el componente: ${error.message}</p>`;
    }
}

// Función para marcar el enlace activo en la navegación
function markActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        // Remover la clase active de todos los enlaces
        link.classList.remove('active');
        
        // Obtener el nombre del archivo del enlace
        const linkHref = link.getAttribute('href');
        const linkPage = linkHref.split('/').pop().split('#')[0];
        
        // Si el enlace corresponde a la página actual, agregar la clase active
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
}

// Cargar componentes cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Cargar el header
    loadComponent('header-container', 'components/header.html');
    
    // Cargar el footer
    loadComponent('footer-container', 'components/footer.html');
}); 