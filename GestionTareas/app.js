// ============================================================
//  AGENDA DE TAREAS — app.js
//  Punto de entrada principal de la aplicación.
//  Se carga al final del <body> (ver index.html).
// ============================================================

// ------------------------------------------------------------
//  ESTADO GLOBAL
//  Arreglo que contendrá todos los objetos de tarea durante
//  la sesión. Cada objeto tendrá la forma:
//    { id: number, texto: string, completada: boolean }
// ------------------------------------------------------------
let tareas = [];

// ------------------------------------------------------------
//  CLAVE DE ALMACENAMIENTO LOCAL
//  Constante usada como clave en localStorage para persistir
//  el arreglo `tareas` entre recargas de página.
// ------------------------------------------------------------
const CLAVE_STORAGE = 'tareas';

// ------------------------------------------------------------
//  REFERENCIAS AL DOM
//  Se obtienen una sola vez al cargar el script y se reutilizan
//  en todas las funciones, evitando búsquedas repetidas.
// ------------------------------------------------------------

/** Campo de texto donde el usuario escribe la nueva tarea. */
const campoTarea = document.getElementById('campo-tarea');

/** Botón que dispara la acción de agregar una nueva tarea. */
const btnAgregar = document.getElementById('btn-agregar');

/** Elemento <ul> que contiene el listado visual de tareas. */
const listaTareas = document.getElementById('lista-tareas');

/** Párrafo que muestra el contador de total y pendientes. */
const contador = document.getElementById('contador');

// ============================================================
//  PERSISTENCIA — localStorage
// ============================================================

/**
 * Guarda el estado actual del arreglo `tareas` en localStorage.
 *
 * Convierte el arreglo a una cadena JSON antes de almacenarlo,
 * ya que localStorage solo acepta strings como valores.
 * Se debe llamar cada vez que el arreglo cambie (agregar,
 * completar o eliminar una tarea).
 */
function guardarEnStorage() {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(tareas));
}

/**
 * Lee y restaura el arreglo `tareas` desde localStorage.
 *
 * Si existe un valor guardado bajo CLAVE_STORAGE, lo parsea con
 * JSON.parse y lo asigna a `tareas`. Si la clave no existe o el
 * JSON está corrupto, deja `tareas` como arreglo vacío para que
 * la app arranque en un estado válido sin lanzar excepciones.
 * Se debe llamar una sola vez al iniciar la aplicación.
 */
function cargarDesdeStorage() {
    try {
        const datos = localStorage.getItem(CLAVE_STORAGE);

        // Solo intentar parsear si realmente hay algo guardado
        if (datos !== null) {
            tareas = JSON.parse(datos);
        }
    } catch (error) {
        // JSON inválido u otro error de acceso al storage:
        // se descarta el valor corrupto y se parte de cero.
        console.warn('No se pudo cargar tareas desde localStorage:', error);
        tareas = [];
    }
}

// ============================================================
//  INTERFAZ — Renderizado y contador
// ============================================================

/**
 * Actualiza el texto del elemento `contador` en el DOM.
 *
 * Calcula el total de tareas del arreglo y cuántas siguen
 * pendientes (completada === false), luego escribe el resultado
 * con el formato "Total: X | Pendientes: Y".
 * Se llama automáticamente al final de renderizarLista() para
 * mantener el contador siempre sincronizado con la lista.
 */
function actualizarContador() {
    const total      = tareas.length;
    const pendientes = tareas.filter(t => !t.completada).length;

    contador.textContent = `Total: ${total} | Pendientes: ${pendientes}`;
}

/**
 * Reconstruye por completo la lista visual de tareas en el DOM.
 *
 * Estrategia: vaciado + recreación desde cero (simple y predecible).
 * Por cada objeto del arreglo `tareas` crea un <li> que contiene:
 *   - Un <span> con el texto; al hacer clic llama a toggleCompletar()
 *     para alternar el estado completada/pendiente.
 *   - Un <button class="btn-eliminar"> que llama a eliminarTarea()
 *     para quitar la tarea del arreglo y del DOM.
 * El <li> recibe la clase CSS correcta según el estado de la tarea.
 * Al finalizar el bucle invoca actualizarContador().
 *
 * Nota: toggleCompletar() y eliminarTarea() se implementarán
 * en los siguientes pasos; están referenciadas aquí para
 * establecer el contrato de la interfaz desde ya.
 */
function renderizarLista() {
    // Vaciar el contenido actual para evitar duplicados
    listaTareas.innerHTML = '';

    tareas.forEach(tarea => {
        // --- Crear el elemento raíz de la tarjeta ---
        const li = document.createElement('li');
        li.classList.add(tarea.completada ? 'tarea-completada' : 'tarea-pendiente');

        // --- Span con el texto de la tarea ---
        const span = document.createElement('span');
        span.textContent = tarea.texto;

        // Al hacer clic en el texto se alterna el estado de la tarea.
        // toggleCompletar se implementará en el siguiente paso.
        span.addEventListener('click', () => toggleCompletar(tarea.id));

        // --- Botón para eliminar la tarea ---
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.classList.add('btn-eliminar');

        // Al hacer clic se elimina la tarea del arreglo y del DOM.
        // eliminarTarea se implementará en el siguiente paso.
        btnEliminar.addEventListener('click', () => eliminarTarea(tarea.id));

        // --- Ensamblar y añadir al DOM ---
        li.appendChild(span);
        li.appendChild(btnEliminar);
        listaTareas.appendChild(li);
    });

    // Mantener el contador sincronizado tras cada renderizado
    actualizarContador();
}

// ============================================================
//  LÓGICA PRINCIPAL — Operaciones sobre el arreglo de tareas
// ============================================================

/**
 * Lee el campo de texto, valida que no esté vacío y agrega
 * una nueva tarea al arreglo `tareas`.
 *
 * Cada tarea es un objeto con:
 *   - id        : timestamp único generado con Date.now()
 *   - texto     : el valor ingresado por el usuario (sin espacios extra)
 *   - completada: false por defecto (toda tarea nueva está pendiente)
 *
 * Tras modificar el arreglo, persiste los cambios en localStorage,
 * limpia el campo de texto y actualiza la lista visible en el DOM.
 * Si el campo está vacío, la función retorna sin hacer nada.
 */
function agregarTarea() {
    const texto = campoTarea.value.trim();

    // Guardia: ignorar entradas vacías o de solo espacios en blanco
    if (texto === '') return;

    // Construir el objeto de tarea y añadirlo al arreglo
    const nuevaTarea = {
        id:         Date.now(), // Identificador único basado en el tiempo
        texto:      texto,
        completada: false
    };
    tareas.push(nuevaTarea);

    // Persistir, limpiar el input y refrescar la lista
    guardarEnStorage();
    campoTarea.value = '';
    renderizarLista();
}

/**
 * Alterna el estado completada/pendiente de la tarea con el id dado.
 *
 * Busca en el arreglo `tareas` la tarea cuyo id coincida y niega
 * su propiedad `completada` (true → false, false → true).
 * Si no se encuentra ninguna tarea con ese id, no hace nada.
 * Tras el cambio persiste el estado y reconstruye el DOM.
 *
 * @param {number} id - El id único de la tarea a alternar.
 */
function toggleCompletar(id) {
    const tarea = tareas.find(t => t.id === id);

    // Guardia: si el id no corresponde a ninguna tarea, salir
    if (!tarea) return;

    // Invertir el estado actual
    tarea.completada = !tarea.completada;

    guardarEnStorage();
    renderizarLista();
}

/**
 * Elimina permanentemente la tarea con el id dado del arreglo.
 *
 * Usa Array.filter para crear un nuevo arreglo que excluye la tarea
 * con el id recibido y reasigna el resultado a `tareas`.
 * Este enfoque es inmutable: no muta la posición original, sino que
 * reemplaza la referencia, lo que evita errores de índice en el bucle.
 * Tras la eliminación persiste el estado y reconstruye el DOM.
 *
 * @param {number} id - El id único de la tarea a eliminar.
 */
function eliminarTarea(id) {
    // Conservar todas las tareas excepto la que tiene el id indicado
    tareas = tareas.filter(t => t.id !== id);

    guardarEnStorage();
    renderizarLista();
}

// ============================================================
//  EVENT LISTENERS — Conexión entre el DOM y la lógica
// ============================================================

/**
 * Clic en el botón "Agregar":
 * Dispara agregarTarea() cada vez que el usuario presiona el botón.
 */
btnAgregar.addEventListener('click', agregarTarea);

/**
 * Tecla Enter en el campo de texto:
 * Permite agregar una tarea sin usar el ratón, mejorando la
 * accesibilidad y la experiencia de usuario en teclado.
 * Se verifica event.key en lugar de keyCode (obsoleto).
 */
campoTarea.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        agregarTarea();
    }
});

// ============================================================
//  INICIALIZACIÓN — Punto de entrada al cargar el script
// ============================================================

/**
 * Secuencia de arranque de la aplicación.
 *
 * 1. cargarDesdeStorage(): restaura el arreglo `tareas` con los
 *    datos guardados en localStorage (si los hay).
 * 2. renderizarLista(): construye la lista visual en el DOM y
 *    actualiza el contador, mostrando el estado persistido.
 *
 * Este bloque se ejecuta de forma síncrona al terminar de
 * parsear el script (ubicado al final del <body>), garantizando
 * que todos los elementos del DOM ya existen en ese momento.
 */
cargarDesdeStorage();
renderizarLista();
