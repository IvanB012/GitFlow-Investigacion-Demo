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

// ------------------------------------------------------------
//  Funciones principales — se implementarán en los siguientes pasos
// ------------------------------------------------------------
