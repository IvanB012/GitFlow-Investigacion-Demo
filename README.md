# Agenda de Tareas

**Tema:** GitFlow

## Descripción Técnica
Esta aplicación web es una "Agenda de Tareas" de una sola página (SPA mínima) desarrollada exclusivamente con HTML, CSS y JavaScript puro. Utiliza la API de `localStorage` del navegador para lograr la persistencia de datos sin necesidad de implementar una base de datos o un servidor backend.

El verdadero propósito de este repositorio es servir como demostración técnica en vivo para explicar y aplicar el flujo de trabajo de **GitFlow** en el curso de ISW-521 Programación en Ambiente Web I de la Universidad Técnica Nacional (UTN) Sede San Carlos. A través de este proyecto, se demuestra la correcta integración y gestión de las diferentes ramas que propone GitFlow:
- `main` (producción)
- `develop` (desarrollo activo)
- `feature` (nuevas características)
- `release` (preparación para lanzamiento)
- `hotfix` (parches rápidos en producción)

## Instrucciones de instalación y ejecución
Dado que el proyecto no requiere de un servidor o dependencias externas, su ejecución es completamente local y muy sencilla. 

Sigue estos pasos:

1. **Clona este repositorio** en tu máquina local ejecutando el siguiente comando en tu terminal:
   ```bash
   git clone https://github.com/IvanB012/GitFlow-Investigacion-Demo.git
   ```

2. **Abre el archivo principal:**
   Navega a la carpeta del proyecto clonado y abre directamente el archivo `index.html` en cualquier navegador web. Puedes hacerlo dando doble clic en el archivo o usando la terminal:
   ```bash
   cd GitFlow-Investigacion-Demo/GestionTareas
   open index.html
   ```
   *(Nota: El comando `open` funciona en macOS, en Windows puedes usar `start index.html`)*

## Versión
El proyecto se encuentra en la versión estable **1.0.0**

## Equipo de desarrollo
* Iván Barboza Blanco
* Danabeth Gutierrez Fallas