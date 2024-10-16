/**
 * PrintDialogController.js
 *
 * Clase para gestionar la impresión de la página utilizando el cuadro de diálogo de impresión del navegador.
 * Muestra opciones de impresión del navegador al usuario.
 *
 * Funcionalidades:
 * - Iniciar el cuadro de diálogo de impresión
 * - Personalizar el contenido que se imprimirá (opcional)
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Agrega un evento de clic al botón de imprimir (selector)
 * para imprimir la página, eliminar resaltados y cambiar el
 * icono y el color del botón de búsqueda.
 */
class Print {
    /**
     * Constructor de la clase Print
     * @param {String} selector - Selector del botón de imprimir
     */
    constructor( selector ) {
        this.printButton  = document.querySelector( selector );
        this.searchButton = document.querySelector( '#search' ); 
        this.addPrintEvent();
    }

    /**
     * Agrega un evento de clic al botón de imprimir (selector)
     * para imprimir la página, eliminar resaltados y cambiar el
     * icono y el color del botón de búsqueda.
     * 
     * @memberof Print
     */
    addPrintEvent() {

        if ( this.printButton ) {

            this.printButton.addEventListener( 'click', e => {
                this.removeHighlights();
                this.resetSearchButton();
                this.printPage();
            });
        }
    }

    /**
     * Elimina los resaltados generados por la búsqueda
     *
     * @memberof Print
     */
    removeHighlights() {
        const highlightedElements = Array.from( document.querySelectorAll( '.highlight' ) );
        highlightedElements.forEach( el => {
            el.classList.remove( 'highlight' );
        });
    }

    /**
     * Devuelve el icono de búsqueda a su estado original
     *
     * @memberof Print
     */
    resetSearchButton() {
        if ( this.searchButton ) {

            const iconSearch = this.searchButton.querySelector( 'i' );

            if ( iconSearch && iconSearch.classList.contains( 'bi-x-square-fill' ) ) {
                iconSearch.classList.remove( 'bi-x-square-fill' );
                iconSearch.classList.add( 'bi-search' );
    
                this.searchButton.classList.toggle( 'btn-info' );
                this.searchButton.classList.toggle( 'opacity-50' );
                this.searchButton.classList.toggle( 'btn-secondary' );
            }
        }
    }

    
    /**
     * Imprime la página
     *
     * @memberof Print
     */
    printPage() {
        window.print();
    }
}

// Exportar la clase para que pueda ser utilizada globalmente
window.Print = Print;