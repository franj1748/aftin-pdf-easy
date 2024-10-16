/**
 * SearchController.js
 *
 * Clase para buscar texto en la página y resaltarlo.
 * Permite al usuario buscar términos específicos y resaltar las coincidencias encontradas.
 *
 * Funcionalidades:
 * - Buscar texto en el contenido de la página
 * - Resaltar todas las coincidencias de la búsqueda
 * - Eliminar el resaltado cuando sea necesario
 *
 * Requiere:
 * - Uso de la API de selección de texto en el navegador
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Clase para realizar una búsqueda en el contenido de la página
 *
 * @class TextSearch
 */
class TextSearch {

    /**
     * Constructor de la clase TextSearch.
     * 
     * @param {String} searchButtonSelector - Selector CSS del botón de búsqueda.
     */
    constructor( searchButtonSelector ) {

        this.searchButton = document.querySelector( searchButtonSelector );
        this.initSearchButton();

    }

    /**
     * Agrega un evento de clic al botón de búsqueda para mostrar el
     * popup de búsqueda cuando se hace clic en él.
     * 
     * @memberof TextSearch
     */
    initSearchButton() {

        this.searchButton.addEventListener( 'click', () => {
            this.showSearchPopup();
        });

    }

    /**
     * Muestra el popup de búsqueda para pedir el término a buscar en el
     * contenido de la página. Si el término de búsqueda se introduce, se
     * llama a performSearch para realizar la búsqueda.
     * 
     * @memberof TextSearch
     */
    async showSearchPopup() {

        const iconSearch = this.searchButton.querySelector( 'i' );
        
        // Verificar si ya está en modo de búsqueda activa
        if ( iconSearch.classList.contains( 'bi-x-square-fill' ) ) {

            // Restablecer los estilos y las clases cuando se cierra la búsqueda
            iconSearch.classList.remove( 'bi-x-square-fill' );
            iconSearch.classList.add( 'bi-search' );

            this.clearHighlightedText();

            this.toggleSearchButtonStyle();

            return;
        }

        // Mostrar el SweetAlert para pedir la palabra de búsqueda
        const { value: searchTerm } = await customSwal.fire({
            title: "Buscar",
            input: "text",
            inputLabel: "Encuentra en el texto",
            showCancelButton: true,
            inputValidator: ( value ) => {
                if ( ! value ) {
                    return "Escribe algo que buscar";
                }
            }
        });

        // Si se introduce un término de búsqueda, realizar la búsqueda
        if ( searchTerm ) {
            this.performSearch( searchTerm.trim().toLowerCase() );
        }

    }

    /**
     * Realiza una búsqueda en el texto de la página y resalta las
     * coincidencias encontradas. Si se encuentra al menos una
     * coincidencia, desplaza el scroll hasta la primera coincidencia.
     * Si no se encuentra ninguna coincidencia, muestra un mensaje
     * de "No se encontraron resultados de búsqueda".
     * 
     * @param {string} searchTerm - Término de búsqueda a realizar.
     * 
     * @memberof TextSearch
     */
    performSearch( searchTerm ) {

        // Limpiar cualquier resaltado previo
        this.clearHighlightedText();

        // Seleccionar todos los elementos del cuerpo, excluyendo ciertos elementos
        const contentElements = Array.from( document.body.querySelectorAll( '*:not(script):not(style):not(head):not(meta):not(title)' ) );
        let firstHighlight = null;

        // Recorrer los elementos y buscar coincidencias en los nodos de texto
        contentElements.forEach( el => {

            const elementText = Array.from( el.childNodes )
            .filter( node => node.nodeType === Node.TEXT_NODE ) // Filtrar solo nodos de texto
            .map( node => node.textContent.toLowerCase() )
            .join( '' );

            const index = elementText.indexOf( searchTerm );

            // Si se encuentra una coincidencia
            if ( index !== -1 ) {
                
                // Resaltar el elemento que contiene la coincidencia
                el.classList.add( 'highlight' );

                // Guardar el primer elemento resaltado para hacer scroll hasta él
                if ( ! firstHighlight ) {
                    firstHighlight = el;
                }
            }
        });

        // Desplazar hasta la primera coincidencia o mostrar mensaje de no encontrado
        if ( firstHighlight ) {
            firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            this.toggleSearchIcon();
            this.toggleSearchButtonStyle();
        } else {
            this.showNoResultsMessage();
        }

    }

    /**
     * Limpia los elementos que estaban resaltados con la clase 'highlight'
     * al hacer una nueva búsqueda.
     * 
     * @memberof TextSearch
     */
    clearHighlightedText() {

        const previouslyHighlighted = Array.from( document.querySelectorAll( '.highlight' ) );
        previouslyHighlighted.forEach( el => {
            el.classList.remove( 'highlight' );
        });

    }

    /**
     * Alterna entre el icono de búsqueda (bi-search) y el icono de cierre (bi-x-square-fill)
     * en el botón de búsqueda.
     * 
     * @memberof TextSearch
     */
    toggleSearchIcon() {

        const iconSearch = this.searchButton.querySelector( 'i' );
        iconSearch.classList.toggle( 'bi-search' );
        iconSearch.classList.toggle( 'bi-x-square-fill' );

    }

    /**
     * Alterna entre los estilos del botón de búsqueda, toggleando:
     *  - btn-info
     *  - opacity-50
     *  - btn-secondary
     * 
     * @memberof TextSearch
     */
    toggleSearchButtonStyle() {

        this.searchButton.classList.toggle( 'btn-info' );
        this.searchButton.classList.toggle( 'opacity-50' );
        this.searchButton.classList.toggle( 'btn-secondary' );

    }

    /**
     * Muestra un mensaje de SweetAlert informando que no se
     * encontraron resultados de búsqueda. El mensaje se cierra
     * automáticamente después de 2 segundos.
     * 
     * @memberof TextSearch
     */
    showNoResultsMessage() {

        let timerInterval;
        customSwal.fire({
            title: "No se encontraron resultados",
            timer: 2000,
            timerProgressBar: true,
            didOpen: () => {
                Swal.showLoading();
                timerInterval = setInterval(() => {
                    const timer = Swal.getPopup().querySelector("b");
                    if ( timer ) {
                        timer.textContent = `${Swal.getTimerLeft()}`;
                    }
                }, 100);
            },
            willClose: () => {
                clearInterval( timerInterval );
            }
        });

    }

}