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
const campoTarea  = document.getElementById('campo-tarea');

/** Botón que dispara la acción de agregar una nueva tarea. */
const btnAgregar  = document.getElementById('btn-agregar');

/** Elemento <ul> que contiene el listado visual de tareas. */
const listaTareas = document.getElementById('lista-tareas');

/** Párrafo que muestra el contador de total y pendientes. */
const contador    = document.getElementById('contador');

// ------------------------------------------------------------
//  Funciones principales — se implementarán en los siguientes pasos
// ------------------------------------------------------------
