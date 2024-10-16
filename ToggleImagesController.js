/**
 * ToggleImagesController.js
 *
 * Clase para gestionar la visibilidad de las imágenes en la página.
 * Permite al usuario ocultar o mostrar todas las imágenes del contenido.
 *
 * Funcionalidades:
 * - Ocultar todas las imágenes del documento
 * - Mostrar todas las imágenes nuevamente
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Muestra u oculta la fila de imágenes
 *
 * @class ImageToggle
 */
class ImageToggle {

    /**
     * Constructor de la clase ImageToggle.
     * 
     * @param {String} buttonSelector - Selector CSS del botón que togglea la visibilidad de la fila de imágenes.
     * @param {String} imageRowSelector - Selector CSS de la fila que contiene las imágenes.
     */
    constructor( buttonSelector, imageRowSelector ) {

        this.imageButton = document.querySelector( buttonSelector );
        this.imageRow = document.querySelector( imageRowSelector );

        // Agregar evento al botón
        this.addToggleEvent();

    }

    
    /**
     * Muestra u oculta la fila de imágenes con animación
     *
     * El botón que llama a este método se encarga de togglear
     * la visibilidad de la fila de imágenes. La fila de imágenes
     * se muestra o se oculta con una animación de zoom out.
     */
    toggleImages() {

        this.imageButton.classList.toggle( 'btn-danger' );
        this.imageButton.classList.toggle( 'opacity-50' );
        this.imageButton.classList.toggle( 'btn-secondary' );

        // Verificar si la fila de imágenes está visible
        if ( this.imageRow.style.display === 'none' ) {
            // Si está oculta, mostrarla
            this.imageRow.style.display = 'flex';
        } else {
            // Agregar clases de animación y ocultar después de la animación
            this.imageRow.classList.add( 'animate__animated', 'animate__zoomOut', 'animate__faster' );
            this.imageRow.addEventListener( 'animationend', () => {
                this.imageRow.classList.remove( 'animate__animated', 'animate__zoomOut', 'animate__faster' );
                this.imageRow.style.display = 'none';
            }, { once: true } );  // Elimina el listener después de la primera ejecución
        }

    }

    
    /**
     * Agrega el evento de clic al botón para mostrar/ocultar imágenes
     *
     * Este método agrega un evento de clic al botón que se encarga
     * de mostrar u ocultar la fila de imágenes. Llama a toggleImages
     * cuando se produce el evento de clic.
     */
    addToggleEvent() {

        this.imageButton.addEventListener( 'click', e => {
            this.toggleImages();
        });

    }
}

