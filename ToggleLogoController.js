/**
 * ToggleLogoController.js
 *
 * Clase para gestionar la visibilidad del logo de la marca en la página.
 * Permite al usuario ocultar o mostrar el logo de la marca con un clic.
 *
 * Funcionalidades:
 * - Ocultar el logo de la marca
 * - Mostrar el logo de la marca nuevamente
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Muestra u oculta la columna del logo de la marca 
 *
 * @class LogoToggle
 */
class LogoToggle {

    /**
     * Constructor de la clase LogoToggle.
     * 
     * @param {String} buttonSelector - Selector CSS del botón que togglea la visibilidad del logo.
     * @param {String} logoColSelector - Selector CSS de la columna que contiene el logo.
     * @param {String} titleColSelector - Selector CSS de la columna que contiene el título.
     */
    constructor( buttonSelector, logoColSelector, titleColSelector ) {

        this.companyButton = document.querySelector( buttonSelector );
        this.logoCol = document.querySelector( logoColSelector );
        this.titleCol = document.querySelector( titleColSelector );

        // Agregar evento al botón
        this.addToggleEvent();

    }

    /**
     * Muestra u oculta la columna del logo de la marca
     * 
     * Togglea la visibilidad de la columna del logo y ajusta el ancho
     * de la columna del título según sea necesario.
     */
    toggleLogo() {

        this.companyButton.classList.toggle( 'btn-danger' );
        this.companyButton.classList.toggle( 'opacity-50' );
        this.companyButton.classList.toggle( 'btn-secondary' );

        // Verificar si la columna del logo está oculta
        if ( this.logoCol.style.display === 'none' ) {
            // Si está oculta, mostrarla
            this.logoCol.style.display = 'flex';
            this.logoCol.style.flexDirection = 'column';
            this.titleCol.classList.remove( 'col-sm-12' );
            this.titleCol.classList.add( 'col-sm-6' );
        } else {
            // Agregar clases de animación y ocultar después de la animación
            this.logoCol.classList.add( 'animate__animated', 'animate__zoomOut', 'animate__faster' );
            this.logoCol.addEventListener( 'animationend', () => {
                this.logoCol.classList.remove( 'animate__animated', 'animate__zoomOut', 'animate__faster' );
                this.logoCol.style.display = 'none';
                this.titleCol.classList.add( 'col-sm-12' );
                this.titleCol.classList.remove( 'col-sm-6' );
            }, { once: true } );  // Elimina el listener después de la primera ejecución
        }

    }

    /**
     * Agrega un evento de clic al botón de toggleo del logo
     * 
     * Llama a toggleLogo() cuando se produce el evento de clic.
     */
    addToggleEvent() {

        this.companyButton.addEventListener( 'click', e => {
            this.toggleLogo();
        });

    }
}

