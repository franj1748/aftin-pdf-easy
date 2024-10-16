/**
 * ScrollToTopController.js
 *
 * Clase para gestionar el botón de desplazamiento al inicio de la página.
 * Permite al usuario regresar rápidamente al comienzo del documento.
 *
 * Funcionalidades:
 * - Mostrar un botón cuando el usuario ha hecho scroll hacia abajo
 * - Desplazar la página hacia arriba con un clic
 *
 * Autor: [Francisco ELis]
 * Fecha: [03/10/2024]
 */

/**
 * Muestra u oculta el botón de scroll a la parte superior
 *
 * @class ScrollToTop
 */
class ScrollToTop {

    /**
     * Constructor de la clase ScrollToTop.
     * 
     * @param {String} buttonSelector - Selector CSS del botón de scroll a la parte superior.
     */
    constructor( buttonSelector ) {

        this.scrollToTopButton = document.querySelector( buttonSelector );

        // Agregar eventos de scroll y clic
        this.addScrollEvent();
        this.addClickEvent();

    }

    /**
     * Muestra u oculta el botón de scroll a la parte superior en
     * función de la posición de scroll actual en la página.
     * 
     * Si la posición de scroll actual es mayor a 20 píxeles,
     * muestra el botón de scroll a la parte superior. En caso
     * contrario, lo oculta.
     * 
     * @memberof ScrollToTop
     * 
     * @example
     * const scrollToTopButton = new ScrollToTop( '#scroll-to-top' );
     * scrollToTopButton.toggleScrollButton();
     */
    toggleScrollButton() {

        if ( document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 ) {
            this.scrollToTopButton.style.display = 'block';
        } else {
            this.scrollToTopButton.style.display = 'none';
        }

    }

    /**
     * Establece el scroll en la parte superior de la página.
     * 
     * @memberof ScrollToTop
     * 
     * @example
     * const scrollToTopButton = new ScrollToTop( '#scroll-to-top' );
     * scrollToTopButton.scrollToTop();
     */
    scrollToTop() {

        document.body.scrollTop = 0;             // Para Safari
        document.documentElement.scrollTop = 0;  // Para Chrome, Firefox, IE y Opera

    }

    /**
     * Agrega el evento de scroll para mostrar u ocultar el botón de scroll
     * a la parte superior en función de la posición de scroll actual en la
     * página.
     * 
     * @memberof ScrollToTop
     * 
     * @example
     * const scrollToTopButton = new ScrollToTop( '#scroll-to-top' );
     * scrollToTopButton.addScrollEvent();
     */
    addScrollEvent() {

        window.addEventListener( 'scroll', () => {
            this.toggleScrollButton();
        });

    }

    /**
     * Agrega el evento de clic al botón de scroll a la parte superior
     * para llamar al método scrollToTop() cuando se hace clic en él.
     * 
     * @memberof ScrollToTop
     * 
     * @example
     * const scrollToTopButton = new ScrollToTop( '#scroll-to-top' );
     * scrollToTopButton.addClickEvent();
     */

    addClickEvent() {

        this.scrollToTopButton.addEventListener( 'click', e => {
            this.scrollToTop();
        });

    }

}
