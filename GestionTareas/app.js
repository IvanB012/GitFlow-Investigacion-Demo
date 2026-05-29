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
