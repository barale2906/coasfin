// Función para cargar las noticias desde el archivo JSON
async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        const news = await response.json();
        displayNews(news);
    } catch (error) {
        console.error('Error al cargar las noticias:', error);
        document.querySelector('.news-grid').innerHTML = '<p class="error">Error al cargar las noticias. Por favor, intente más tarde.</p>';
    }
}

// Función para mostrar las noticias en la página
function displayNews(news) {
    const newsGrid = document.querySelector('.news-grid');
    newsGrid.innerHTML = '';

    news.forEach(article => {
        const articleElement = document.createElement('article');
        articleElement.className = 'news-card';
        articleElement.innerHTML = `
            <div class="news-image">
                <img src="${article.image}" alt="${article.title}">
            </div>
            <div class="news-details">
                <div class="news-date">${article.date}</div>
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${article.summary}</p>
                <div class="news-meta">
                    <span class="news-author">Por ${article.author}</span>
                    <a href="noticia.html?id=${article.id}" class="read-more">Leer más</a>
                </div>
            </div>
        `;
        newsGrid.appendChild(articleElement);
    });
}

// Función para cargar una noticia individual
async function loadSingleNews() {
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get('id');

    if (!newsId) {
        window.location.href = 'noticias.html';
        return;
    }

    try {
        const response = await fetch('data/news.json');
        const news = await response.json();
        const article = news.find(n => n.id === newsId);

        if (!article) {
            throw new Error('Noticia no encontrada');
        }

        displaySingleNews(article);
    } catch (error) {
        console.error('Error al cargar la noticia:', error);
        document.querySelector('.news-single').innerHTML = '<p class="error">Error al cargar la noticia. Por favor, intente más tarde.</p>';
    }
}

// Función para mostrar una noticia individual
function displaySingleNews(article) {
    const newsSingle = document.querySelector('.news-single');
    newsSingle.innerHTML = `
        <div class="news-single-header">
            <h1 class="news-single-title">${article.title}</h1>
            <div class="news-single-meta">
                <span>${article.date}</span>
                <span>Por ${article.author}</span>
            </div>
        </div>
        <div class="news-single-image">
            <img src="${article.image}" alt="${article.title}">
        </div>
        <div class="news-single-content">
            ${article.content}
        </div>
    `;
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
            
            // Recargar la página de noticias si estamos en ella
            if (document.querySelector('.news-grid')) {
                loadNews();
            }
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

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Cargar noticias en la página principal
    if (document.querySelector('.news-grid')) {
        loadNews();
    }

    // Cargar noticia individual
    if (document.querySelector('.news-single')) {
        loadSingleNews();
    }

    // Manejar el formulario de administración
    const newsForm = document.getElementById('news-form');
    if (newsForm) {
        newsForm.addEventListener('submit', addNews);
    }
}); 