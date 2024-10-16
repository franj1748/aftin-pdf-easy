/**
 * ProgressBarController.js
 *
 * Clase para gestionar y actualizar una barra de progreso basada en el porcentaje de desplazamiento (scroll)
 * de la página. Actualiza el ancho de la barra en función de la cantidad de contenido visto.
 *
 * Funcionalidades:
 * - Calcular porcentaje de scroll
 * - Actualizar dinámicamente el ancho de la barra de progreso
 *
 * Autor: [Francisco Elis]
 * Fecha: [12/10/2024]
 */

/**
 * Clase ProgressBar
 *
 * @class ProgressBar
 */
class ProgressBar {

    /**
     * Constructor de la clase ProgressBar.
     * 
     * @param {String} progressBarSelector - Selector CSS del elemento que 
     * contiene la barra de progreso.
     */
    constructor( progressBarSelector ) {
        this.progressBarElement = document.querySelector(progressBarSelector );
        this.init();
    }

    init() {
        // Escuchar el evento scroll y actualizar la barra de progreso
        window.addEventListener( 'scroll', () => this.updateProgressBar() );
    }

    updateProgressBar() {
        const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

        // Calcular el porcentaje de scroll
        const scrollPercentage = ( scrollTop / ( scrollHeight - clientHeight ) ) * 100;

        // Actualizar el ancho de la barra de progreso
        this.progressBarElement.style.width = scrollPercentage + '%';
    }
}

