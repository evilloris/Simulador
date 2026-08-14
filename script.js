// =====================================================
// SIDEBAR
// =====================================================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');

    if (!sidebar) return;

    sidebar.classList.toggle('active');
}


// =====================================================
// MENÚ DE FACULTADES
// =====================================================

function toggleFacultyMenu(key) {

    const menu = document.getElementById(`menu-${key}`);

    const button = document.querySelector(
        `[data-faculty="${key}"]`
    );

    const allMenus =
        document.querySelectorAll('.faculty-menu');

    const allButtons =
        document.querySelectorAll('.faculty-data-btn');


    // Cerrar otros menús
    allMenus.forEach(item => {

        if (item !== menu) {
            item.classList.remove('active');
        }

    });


    // Quitar selección de otros botones
    allButtons.forEach(item => {

        if (item !== button) {
            item.classList.remove('active');
        }

    });


    // Abrir/cerrar menú seleccionado
    if (menu) {

        const shouldOpen =
            !menu.classList.contains('active');

        menu.classList.toggle(
            'active',
            shouldOpen
        );

    }


    // Marcar botón seleccionado
    if (button) {

        const shouldHighlight =
            menu &&
            menu.classList.contains('active');

        button.classList.toggle(
            'active',
            shouldHighlight
        );

    }
}


// =====================================================
// BUSCADOR DE CARRERAS
// =====================================================

function searchCarreras() {

    const searchInput =
        document.getElementById('searchInput');

    const results =
        document.getElementById('searchResults');


    if (!searchInput || !results) {
        return;
    }


    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    // Si está vacío
    if (searchTerm === '') {

        results.innerHTML = '';

        return;
    }


    let html =
        '<div class="search-results-list">';

    let found = false;


    for (
        const [key, facultad]
        of Object.entries(facultades)
    ) {

        const carrerasMatch =
            facultad.carreras.filter(
                carrera =>
                    carrera
                        .toLowerCase()
                        .includes(searchTerm)
            );


        const facultadMatch =
            facultad.nombre
                .toLowerCase()
                .includes(searchTerm);


        if (
            carrerasMatch.length > 0 ||
            facultadMatch
        ) {

            found = true;


            html += `
                <div class="search-result-item">

                    <h4>
                        ${facultad.nombre}
                    </h4>

                    ${
                        carrerasMatch.length > 0
                            ?
                            `<p>
                                ${carrerasMatch.join(', ')}
                            </p>`
                            :
                            ''
                    }

                    <p>
                        <strong>
                            Ubicación:
                        </strong>

                        ${facultad.coordenadas.lat},
                        ${facultad.coordenadas.lng}
                    </p>

                    <a href="${key}.html?view=info">
                        Ver facultad
                    </a>

                </div>
            `;

        }
    }


    if (!found) {

        html += `
            <p style="
                padding: 10px;
                color: #999;
            ">
                No se encontraron resultados
            </p>
        `;

    }


    html += '</div>';

    results.innerHTML = html;
}


// =====================================================
// DETECTAR FACULTAD ACTUAL
// =====================================================

function getCurrentFacultyKey() {

    // Primero comprobar data-faculty-key
    const bodyKey =
        document.body &&
        document.body.dataset &&
        document.body.dataset.facultyKey;


    if (
        bodyKey &&
        facultades[bodyKey]
    ) {

        return bodyKey;

    }


    // Obtener nombre del HTML
    const path =
        window.location.pathname
            .split('/')
            .pop() ||
        'index.html';


    // Estamos en inicio
    if (
        !path ||
        path === 'index.html'
    ) {

        return null;

    }


    // Buscar facultad correspondiente
    return Object.keys(facultades)
        .find(
            key =>
                `${key}.html` === path
        ) || null;
}


// =====================================================
// MOSTRAR PÁGINA DE FACULTAD
// =====================================================

function renderFacultyPage() {

    const facultyKey =
        getCurrentFacultyKey();


    // Si estamos en index.html no hacemos nada
    if (!facultyKey) {
        return;
    }


    const content =
        document.getElementById(
            'faculty-page-content'
        ) ||
        document.querySelector(
            '.content'
        );


    if (!content) {
        return;
    }


    if (!facultades[facultyKey]) {

        content.innerHTML = `
            <p>
                No se pudo cargar la información
                de esta facultad.
            </p>
        `;

        return;
    }


    const facultad =
        facultades[facultyKey];


    const params =
        new URLSearchParams(
            window.location.search
        );


    const view =
        params.get('view') ||
        'simulador';


    const isInfoView =
        view === 'info';


    // =================================================
    // VISTA INFORMACIÓN
    // =================================================

    if (isInfoView) {

        content.innerHTML = `

            <div class="faculty-info-container">

                <div class="faculty-header-row">

                    <span class="faculty-badge">
                        ${facultad.sigla}
                    </span>

                </div>


                <h2>
                    ${facultad.nombre}
                </h2>


                <section>

                    <h3>
                        Carreras disponibles
                    </h3>

                    <ul class="carreras-list">

                        ${
                            facultad.carreras
                                .map(
                                    carrera =>
                                        `<li>${carrera}</li>`
                                )
                                .join('')
                        }

                    </ul>

                </section>


                <section>

                    <h3>
                        Ubicación
                    </h3>

                    <div
                        id="map"
                        class="map-container"
                    ></div>

                    <p class="map-coords">

                        Coordenadas:

                        ${facultad.coordenadas.lat},

                        ${facultad.coordenadas.lng}

                    </p>

                </section>


                <section>

                    <h3>
                        Materias
                    </h3>

                    <div class="materias-empty">

                        <p>
                            Próximamente se cargarán
                            las materias desde la
                            base de datos.
                        </p>

                    </div>

                </section>


                <div class="faculty-page-actions">

                    <a
                        href="${facultyKey}.html?view=simulador"
                        class="facultad-action"
                    >
                        Ir al simulador
                    </a>

                </div>

            </div>
        `;


        // Crear mapa
        initMap(
            facultad.coordenadas,
            facultad.nombre
        );


        return;
    }


    // =================================================
    // VISTA SIMULADOR
    // =================================================

    content.innerHTML = `

        <div class="simulator-container">

            <h2>
                Simulador de examen -
                ${facultad.nombre}
            </h2>


            <p>
                Contenido del simulador de examen
                para la Facultad de
                ${facultad.nombre}.
            </p>


            <p>
                Este espacio está reservado
                para las preguntas y actividades
                de práctica.
            </p>


            <div class="faculty-page-actions">

                <a
                    href="${facultyKey}.html?view=info"
                    class="facultad-action"
                >
                    Información
                </a>


                <a
                    href="${facultyKey}.html?view=simulador"
                    class="facultad-action"
                >
                    Simulador
                </a>

            </div>

        </div>
    `;
}


// =====================================================
// MOSTRAR INFORMACIÓN DE UNA FACULTAD
// =====================================================

function showFacultyData(facultyKey) {

    const facultad =
        facultades[facultyKey];


    if (!facultad) {
        return;
    }


    const content =
        document.getElementById(
            'facultyData'
        );


    if (!content) {
        return;
    }


    let html = `

        <div class="faculty-info-container">

            <h3>
                ${facultad.nombre}
            </h3>


            <p>
                <strong>Sigla:</strong>
                ${facultad.sigla}
            </p>


            <h4>
                Carreras disponibles:
            </h4>


            <ul class="carreras-list">
    `;


    facultad.carreras.forEach(
        carrera => {

            html += `
                <li>
                    ${carrera}
                </li>
            `;

        }
    );


    html += `

            </ul>


            <h4>
                Ubicación:
            </h4>


            <div
                id="map"
                class="map-container"
            ></div>


            <p class="map-coords">

                Coordenadas:

                ${facultad.coordenadas.lat},

                ${facultad.coordenadas.lng}

            </p>

        </div>
    `;


    content.innerHTML = html;


    initMap(
        facultad.coordenadas,
        facultad.nombre
    );
}


// =====================================================
// CARGAR LEAFLET
// =====================================================

function loadLeaflet() {

    return new Promise(
        (resolve, reject) => {


            // Si ya está cargado
            if (
                typeof L !== 'undefined'
            ) {

                resolve();

                return;
            }


            // =========================================
            // CARGAR CSS DE LEAFLET
            // =========================================

            if (
                !document.querySelector(
                    'link[data-leaflet-css]'
                )
            ) {

                const link =
                    document.createElement(
                        'link'
                    );


                link.rel =
                    'stylesheet';


                link.href =
                    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';


                link.dataset.leafletCss =
                    'true';


                document.head.appendChild(
                    link
                );
            }


            // =========================================
            // COMPROBAR SI YA SE ESTÁ CARGANDO
            // =========================================

            const existingScript =
                document.querySelector(
                    'script[data-leaflet-js]'
                );


            if (existingScript) {

                existingScript.addEventListener(
                    'load',
                    resolve,
                    {
                        once: true
                    }
                );


                existingScript.addEventListener(
                    'error',
                    reject,
                    {
                        once: true
                    }
                );


                return;
            }


            // =========================================
            // CARGAR JAVASCRIPT DE LEAFLET
            // =========================================

            const script =
                document.createElement(
                    'script'
                );


            script.src =
                'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';


            script.dataset.leafletJs =
                'true';


            script.onload =
                resolve;


            script.onerror =
                reject;


            document.head.appendChild(
                script
            );
        }
    );
}


// =====================================================
// CREAR MAPA
// =====================================================

async function initMap(
    coordenadas,
    nombreFacultad = 'Facultad'
) {

    const mapDiv =
        document.getElementById(
            'map'
        );


    if (!mapDiv) {
        return;
    }


    // =============================================
    // TAMAÑO DEL MAPA
    // =============================================

    mapDiv.style.height =
        '400px';

    mapDiv.style.width =
        '100%';

    mapDiv.style.borderRadius =
        '12px';

    mapDiv.style.overflow =
        'hidden';


    // =============================================
    // CARGAR LEAFLET
    // =============================================

    try {

        await loadLeaflet();

    }

    catch (error) {

        console.error(
            'No se pudo cargar Leaflet:',
            error
        );


        mapDiv.innerHTML = `

            <div class="map-fallback">

                <p>
                    El mapa no está disponible
                    en este momento.
                </p>

                <p>
                    Coordenadas:

                    ${coordenadas.lat},

                    ${coordenadas.lng}
                </p>

            </div>
        `;


        return;
    }


    // =============================================
    // CREAR MAPA
    // =============================================

    const map =
        L.map(
            mapDiv,
            {

                zoomControl: true,

                scrollWheelZoom: true

            }
        );


    map.setView(
        [
            coordenadas.lat,
            coordenadas.lng
        ],
        16
    );


    // =============================================
    // OPENSTREETMAP
    // =============================================

    L.tileLayer(

        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

        {

            maxZoom: 19,

            attribution:
                '&copy; OpenStreetMap contributors'

        }

    ).addTo(map);


    // =============================================
    // ENLACE A GOOGLE MAPS
    // =============================================

    const googleMapsUrl =

        `https://www.google.com/maps/search/?api=1&query=${coordenadas.lat},${coordenadas.lng}`;


    // =============================================
    // MARCADOR
    // =============================================

    const marker =
        L.marker(
            [
                coordenadas.lat,
                coordenadas.lng
            ]
        );


    marker.addTo(map);


    marker.bindPopup(`

        <div style="
            min-width: 180px;
        ">

            <strong>
                ${nombreFacultad}
            </strong>

            <br><br>

            📍
            ${coordenadas.lat},
            ${coordenadas.lng}

            <br><br>

            <a
                href="${googleMapsUrl}"
                target="_blank"
                rel="noopener noreferrer"
            >
                Abrir en Google Maps
            </a>

        </div>
    `);


    marker.openPopup();


    // =============================================
    // CORREGIR TAMAÑO DEL MAPA
    // =============================================

    setTimeout(
        () => {

            map.invalidateSize();

        },
        150
    );
}


// =====================================================
// ÚLTIMOS INTENTOS
// =====================================================

function loadUltimosIntentos() {

    const container =
        document.getElementById(
            'ultimosIntentos'
        );


    if (!container) {
        return;
    }


    // Sin intentos
    if (
        !Array.isArray(
            ultimosIntentos
        ) ||
        ultimosIntentos.length === 0
    ) {

        container.innerHTML = `

            <div class="intentos-vacios">

                No hay intentos recientes.

            </div>
        `;


        return;
    }


    let html =
        '<div class="intentos-grid">';


    ultimosIntentos.forEach(
        intento => {

            html += `

                <div
                    class="intento-card"
                    onclick="verIntento(${intento.id})"
                >

                    <div class="intento-header">

                        <h4>
                            ${intento.facultad}
                        </h4>

                        <span class="estado-badge">

                            ${intento.estado}

                        </span>

                    </div>


                    <div class="intento-body">

                        <p>

                            <strong>
                                Fecha:
                            </strong>

                            ${intento.fecha}

                        </p>


                        <p>

                            <strong>
                                Hora:
                            </strong>

                            ${intento.hora}

                        </p>


                        <p>

                            <strong>
                                Puntaje:
                            </strong>

                            <span class="puntaje">

                                ${intento.puntaje}

                            </span>

                        </p>

                    </div>


                    <div class="intento-footer">

                        <button class="btn-ver">

                            Ver detalles →

                        </button>

                    </div>

                </div>
            `;

        }
    );


    html += '</div>';


    container.innerHTML =
        html;
}


// =====================================================
// VER INTENTO
// =====================================================

function verIntento(id) {

    const intento =
        ultimosIntentos.find(
            i =>
                i.id === id
        );


    if (!intento) {
        return;
    }


    alert(

        `Intento #${id}

Facultad: ${intento.facultad}

Puntaje: ${intento.puntaje}

Página de detalles en construcción...`

    );
}


// =====================================================
// CUANDO CARGA LA PÁGINA
// =====================================================

document.addEventListener(
    'DOMContentLoaded',
    function () {


        // =========================================
        // BUSCADOR
        // =========================================

        const searchInput =
            document.getElementById(
                'searchInput'
            );


        if (searchInput) {

            searchInput.addEventListener(
                'input',
                searchCarreras
            );

        }


        // =========================================
        // PÁGINA DE FACULTAD
        // =========================================

        renderFacultyPage();


        // =========================================
        // ÚLTIMOS INTENTOS
        // =========================================

        loadUltimosIntentos();

    }
);