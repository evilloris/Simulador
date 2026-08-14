// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Toggle faculty menu
function toggleFacultyMenu(key) {
    const menu = document.getElementById(`menu-${key}`);
    const button = document.querySelector(`[data-faculty="${key}"]`);
    const allMenus = document.querySelectorAll('.faculty-menu');
    const allButtons = document.querySelectorAll('.faculty-data-btn');

    allMenus.forEach(item => {
        if (item !== menu) item.classList.remove('active');
    });

    allButtons.forEach(item => {
        if (item !== button) item.classList.remove('active');
    });

    if (menu) {
        const shouldOpen = !menu.classList.contains('active');
        menu.classList.toggle('active', shouldOpen);
    }

    if (button) {
        const shouldHighlight = menu && menu.classList.contains('active');
        button.classList.toggle('active', shouldHighlight);
    }
}

// Search functionality
function searchCarreras() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (searchTerm.trim() === '') {
        results.innerHTML = '';
        return;
    }
    
    let html = '<div class="search-results-list">';
    let found = false;
    
    for (const [key, facultad] of Object.entries(facultades)) {
        const carrerasMatch = facultad.carreras.filter(carrera => 
            carrera.toLowerCase().includes(searchTerm)
        );
        
        if (carrerasMatch.length > 0 || facultad.nombre.toLowerCase().includes(searchTerm)) {
            found = true;
            html += `
                <div class="search-result-item">
                    <h4>${facultad.nombre}</h4>
                    ${carrerasMatch.length > 0 ? `<p>${carrerasMatch.join(', ')}</p>` : ''}
                </div>
            `;
        }
    }
    
    if (!found) {
        html += '<p style="padding: 10px; color: #999;">No se encontraron resultados</p>';
    }
    
    html += '</div>';
    results.innerHTML = html;
}

function getCurrentFacultyKey() {
    const bodyKey = document.body && document.body.dataset && document.body.dataset.facultyKey;
    if (bodyKey && facultades[bodyKey]) return bodyKey;

    const path = window.location.pathname.split('/').pop() || 'index.html';
    if (!path || path === 'index.html') return null;

    return Object.keys(facultades).find(key => `${key}.html` === path) || null;
}

function renderFacultyPage() {
    const facultyKey = getCurrentFacultyKey();
    const content = document.getElementById('faculty-page-content') || document.querySelector('.content');

    if (!facultyKey || !content || !facultades[facultyKey]) {
        if (content) {
            content.innerHTML = '<p>No se pudo cargar la información de esta facultad.</p>';
        }
        return;
    }

    const facultad = facultades[facultyKey];
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view') || 'simulador';
    const isInfoView = view === 'info';

    if (isInfoView) {
        content.innerHTML = `
            <div class="faculty-info-container">
                <div class="faculty-header-row">
                    <span class="faculty-badge">${facultad.sigla}</span>
                </div>
                <h2>${facultad.nombre}</h2>

                <section>
                    <h3>Carreras disponibles</h3>
                    <ul class="carreras-list">
                        ${facultad.carreras.map(carrera => `<li>${carrera}</li>`).join('')}
                    </ul>
                </section>

                <section>
                    <h3>Ubicación</h3>
                    <div id="map" class="map-container"></div>
                    <p class="map-coords">Coordenadas: ${facultad.coordenadas.lat}, ${facultad.coordenadas.lng}</p>
                </section>

                <section>
                    <h3>Materias</h3>
                    <div class="materias-empty">
                        <p>Próximamente se cargarán las materias desde la base de datos.</p>
                    </div>
                </section>
            </div>
        `;

        initMap(facultad.coordenadas);
        return;
    }

    content.innerHTML = `
        <div class="simulator-container">
            <h2>Simulador de examen - ${facultad.nombre}</h2>
            <p>Contenido del simulador de examen para la Facultad de ${facultad.nombre}.</p>
            <p>Este espacio está reservado para las preguntas y actividades de práctica.</p>
            <div class="faculty-page-actions">
                <a href="${facultyKey}.html?view=info" class="facultad-action">Información</a>
                <a href="${facultyKey}.html?view=simulador" class="facultad-action">Simulador</a>
            </div>
        </div>
    `;
}

// Show faculty data
function showFacultyData(facultyKey) {
    const facultad = facultades[facultyKey];
    if (!facultad) return;
    
    const content = document.getElementById('facultyData');
    
    let html = `
        <div class="faculty-info-container">
            <h3>${facultad.nombre}</h3>
            <p><strong>Sigla:</strong> ${facultad.sigla}</p>
            <p><strong>Ciudad:</strong> ${facultad.ciudad}</p>
            
            <h4>Carreras Disponibles:</h4>
            <ul class="carreras-list">
    `;
    
    facultad.carreras.forEach(carrera => {
        html += `<li>${carrera}</li>`;
    });
    
    html += `
            </ul>
            
            <h4>Ubicación:</h4>
            <div id="map" class="map-container"></div>
            <p class="map-coords">Coordenadas: ${facultad.coordenadas.lat}, ${facultad.coordenadas.lng}</p>
        </div>
    `;
    
    content.innerHTML = html;
    initMap(facultad.coordenadas);
}

// Initialize map
function initMap(coordenadas) {
    const mapDiv = document.getElementById('map');
    if (!mapDiv) return;

    if (typeof L === 'undefined') {
        mapDiv.innerHTML = `
            <div class="map-fallback">
                <p>El mapa no está disponible en este momento.</p>
                <p>Coordenadas: ${coordenadas.lat}, ${coordenadas.lng}</p>
            </div>
        `;
        return;
    }

    const map = L.map(mapDiv, {
        zoomControl: true,
        scrollWheelZoom: true
    }).setView([coordenadas.lat, coordenadas.lng], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([coordenadas.lat, coordenadas.lng]).addTo(map);
}

// Load últimos intentos
function loadUltimosIntentos() {
    const container = document.getElementById('ultimosIntentos');
    if (!container) return;

    if (!Array.isArray(ultimosIntentos) || ultimosIntentos.length === 0) {
        container.innerHTML = '<div class="intentos-vacios">No hay intentos recientes.</div>';
        return;
    }
    
    let html = '<div class="intentos-grid">';
    ultimosIntentos.forEach(intento => {
        html += `
            <div class="intento-card" onclick="verIntento(${intento.id})">
                <div class="intento-header">
                    <h4>${intento.facultad}</h4>
                    <span class="estado-badge">${intento.estado}</span>
                </div>
                <div class="intento-body">
                    <p><strong>Fecha:</strong> ${intento.fecha}</p>
                    <p><strong>Hora:</strong> ${intento.hora}</p>
                    <p><strong>Puntaje:</strong> <span class="puntaje">${intento.puntaje}</span></p>
                </div>
                <div class="intento-footer">
                    <button class="btn-ver">Ver Detalles →</button>
                </div>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

// Handle intento click
function verIntento(id) {
    const intento = ultimosIntentos.find(i => i.id === id);
    if (intento) {
        // TODO: Implementar navegación a página de detalles del intento
        console.log('Viendo intento:', intento);
        alert(`Intento ${id} - Facultad: ${intento.facultad}\nPuntaje: ${intento.puntaje}\n\nPágina de detalles en construcción...`);
    }
}

// Load últimos intentos
function loadUltimosIntentos() {
    const container = document.getElementById('ultimosIntentos');
    if (!container) return;
    
    let html = '<div class="intentos-grid">';
    
    ultimosIntentos.forEach(intento => {
        html += `
            <div class="intento-card" onclick="verIntento(${intento.id})">
                <div class="intento-header">
                    <h4>${intento.facultad}</h4>
                    <span class="estado-badge">${intento.estado}</span>
                </div>
                <div class="intento-body">
                    <p><strong>Fecha:</strong> ${intento.fecha}</p>
                    <p><strong>Hora:</strong> ${intento.hora}</p>
                    <p><strong>Puntaje:</strong> <span class="puntaje">${intento.puntaje}</span></p>
                </div>
                <div class="intento-footer">
                    <button class="btn-ver">Ver Detalles →</button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

// Ver intento realizado
function verIntento(id) {
    const intento = ultimosIntentos.find(i => i.id === id);
    if (intento) {
        alert(`Abriendo detalles del intento #${id}\nFacultad: ${intento.facultad}\nPuntaje: ${intento.puntaje}`);
        // Aquí irías a una página de detalles del intento
    }
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchCarreras);
    }

    renderFacultyPage();
    
    // Load ultimos intentos
    loadUltimosIntentos();
});
