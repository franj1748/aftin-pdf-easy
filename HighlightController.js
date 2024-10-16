/**
 * HighlightController.js
 *
 * Clase para resaltar texto dentro de la página.
 *
 * Funcionalidades:
 * - Resaltar texto dentro de la página
 * - Eliminar resaltado
 *
 * Requiere:
 * - Uso de la API de selección de texto en el navegador
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Clase que resalta el texto seleccionado
 *
 * @class TextHighlighter
 */
class TextHighlighter {

    /**
     * Constructor de la clase TextHighlighter.
     * 
     * @param {String} highlighterButtonSelector - Selector CSS del botón de resaltado.
     */
    constructor( highlighterButtonSelector ) {

        this.isHighlightingActive = false; // Controlar si el resaltado está activo
        this.highlighterButton = document.querySelector( highlighterButtonSelector );
        this.highlightCursorURL = 'https://i.ibb.co/L0q7Tcc/highlighter32.png'; // URL del cursor personalizado

        this.initHighlighterButton();

    }

    /**
     * Agrega un evento de clic al botón de resaltado para alterar
     * el estado de resaltado. Llama a toggleHighlighting() cuando
     * se produce el evento de clic.
     * 
     * @memberof TextHighlighter
     */
    initHighlighterButton() {
        this.highlighterButton.addEventListener( 'click', () => {
            this.toggleHighlighting();
        });
    }

    /**
     * Alterna entre el modo de resaltado de texto activo y desactivado.
     * 
     * Si el resaltado está activo, se quita el resaltado y se restaura la
     * funcionalidad de eliminar (botón de eliminar en los elementos
     * resaltados). De lo contrario, se activa el modo de resaltado y se
     * desactiva la funcionalidad de eliminar.
     * 
     * @memberof TextHighlighter
     */
    toggleHighlighting() {

        // Cambiar los estilos del botón
        this.highlighterButton.classList.toggle( 'btn-warning' );
        this.highlighterButton.classList.toggle( 'opacity-50' );
        this.highlighterButton.classList.toggle( 'btn-secondary' );

        // Alternar la activación del modo resaltado
        if ( this.isHighlightingActive ) {
            this.removeHighlights(); // Quitar resaltado cuando se desactiva
            this.restoreRemoveIconFunctionality(); // Restaurar la funcionalidad de eliminar
            this.setNormalCursor(); // Volver al cursor normal
        } else {
            this.activateHighlightMode(); // Activar el modo de resaltado
            this.disableRemoveIconFunctionality(); // Desactivar la funcionalidad de eliminar
            this.setHighlightCursor(); // Cambiar el cursor al de resaltador
        }

        this.isHighlightingActive = !this.isHighlightingActive;
    }

    /**
     * Activa el modo de resaltado de texto. Se encarga de
     * escuchar el evento de mouseup en el documento y llamar
     * a highlightSelectedText() cuando se produce el evento.
     * 
     * @memberof TextHighlighter
     */
    activateHighlightMode() {
        document.addEventListener( 'mouseup', ( e ) => this.highlightSelectedText( e ) );
    }

    /**
     * Elimina todos los elementos <mark> de la página y
     * restaura el texto original. Se llama cuando se desactiva
     * el modo de resaltado de texto.
     * 
     * @memberof TextHighlighter
     */
    removeHighlights() {
        document.removeEventListener( 'mouseup', this.highlightSelectedText );

        // Eliminar todos los <mark> que contienen texto
        const marks = Array.from( document.querySelectorAll( 'mark' ) );
        marks.forEach( mark => {
            const parent = mark.parentNode;
            while ( mark.firstChild ) {
                parent.insertBefore( mark.firstChild, mark );
            }
            parent.removeChild( mark );
        });

        // Eliminar todos los <mark> vacíos
        const emptyMarks = Array.from( document.querySelectorAll( 'mark:empty' ) );
        emptyMarks.forEach( mark => {
            mark.parentNode.removeChild( mark );
        });
    }

    /**
     * Resalta el texto seleccionado por el usuario.
     * Se encarga de capturar el evento de mouseup y resaltar
     * el texto seleccionado en ese momento.
     * 
     * @memberof TextHighlighter
     */
    highlightSelectedText() {
        const selection = window.getSelection();

        if ( selection.rangeCount > 0 && !selection.isCollapsed ) {
            const range = selection.getRangeAt( 0 );
            if ( range && !range.collapsed ) {
                const selectedText = range.toString().trim();

                if ( selectedText && !this.isAlreadyHighlighted( range ) ) {
                    if ( range.startContainer === range.endContainer && range.startContainer.nodeType === Node.TEXT_NODE ) {
                        this.wrapTextInMark( range ); // Resaltar solo el texto seleccionado en el mismo nodo
                    } else {
                        this.wrapTextNodes( range ); // Resaltar nodos de texto múltiples
                    }
                }

                setTimeout(() => {
                    selection.removeAllRanges(); // Limpiar la selección después de resaltar
                }, 10);
            }
        }
    }

    /**
     * Envuelve el texto seleccionado en un nodo <mark>, creando un nuevo
     * nodo que contiene el texto seleccionado.
     * @param {Range} range - Rango de selección del usuario
     * @memberof TextHighlighter
     */
    wrapTextInMark( range ) {
        const markElement = document.createElement( 'mark' );
        range.surroundContents( markElement );
    }

    /**
     * Envuelve en nodos <mark> todos los nodos de texto dentro del rango seleccionado
     * por el usuario. Se encarga de recorrer todos los nodos de texto dentro del rango y
     * creando un nuevo nodo <mark> que contiene cada nodo de texto si este no está vacío.
     * 
     * @param {Range} range - Rango de selección del usuario
     * @memberof TextHighlighter
     */
    wrapTextNodes( range ) {
        const nodesInRange = this.getTextNodesInRange( range );
        nodesInRange.forEach( node => {
            if ( node.nodeValue.trim() !== '' ) {
                const markElement = document.createElement( 'mark' );
                const nodeRange = document.createRange();
                nodeRange.selectNodeContents( node );
                nodeRange.surroundContents( markElement );
            }
        });
    }

    /**
     * Obtiene todos los nodos de texto (Node.TEXT_NODE) que se encuentran dentro
     * del rango seleccionado por el usuario. Se utiliza un TreeWalker para recorrer
     * el árbol DOM y evaluar cada nodo de texto si se encuentra dentro del rango
     * seleccionado.
     * @param {Range} range - Rango de selección del usuario
     * @returns {Array<Node>} Un array con los nodos de texto que se encuentran
     * dentro del rango seleccionado
     * @memberof TextHighlighter
     */
    getTextNodesInRange( range ) {
        const nodes = [];
        const walker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node => {
                    const nodeRange = document.createRange();
                    nodeRange.selectNodeContents( node );
                    return nodeRange.compareBoundaryPoints( Range.END_TO_START, range ) < 1 &&
                        nodeRange.compareBoundaryPoints( Range.START_TO_END, range ) > -1
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        let node;
        while ( node = walker.nextNode() ) {
            nodes.push( node );
        }

        return nodes;
    }

    /**
     * Comprueba si el texto seleccionado ya está resaltado en una marca <mark>.
     * Verifica si el nodo común de los límites del rango seleccionado es un nodo de texto
     * y si ese nodo de texto tiene como padre un nodo <mark>, o si el nodo común tiene
     * como descendiente directo un nodo <mark>.
     * @param {Range} range - Rango de selección del usuario
     * @returns {boolean} true si el texto ya está resaltado, false en caso contrario
     * @memberof TextHighlighter
     */
    isAlreadyHighlighted( range ) {
        const ancestor = range.commonAncestorContainer;
        if ( ancestor.nodeType === Node.TEXT_NODE ) {
            return ancestor.parentNode.tagName === 'MARK';
        } else {
            return !!ancestor.querySelector( 'mark' );
        }
    }

    /**
     * Establece el cursor en forma de lápiz para que el usuario sepa que
     * puede resaltar texto. El cursor se cambiará a uno de forma de lápiz
     * cuando se active el resaltado de texto.
     *
     * @memberof TextHighlighter
     */
    setHighlightCursor() {
        document.body.style.cursor = `url(${this.highlightCursorURL}) 0 32, text`;
    }

    /**
     * Establece el cursor en su forma por defecto para indicar que ya no
     * se puede resaltar texto. Se utiliza al desactivar el resaltado de texto.
     * 
     * @memberof TextHighlighter
     */
    setNormalCursor() {
        document.body.style.cursor = 'default';
    }

    /**
     * Desactiva la funcionalidad de eliminar en los elementos con la clase .hoverable
     * al desactivar los clics en ellos. Se utiliza para evitar que el usuario elimine
     * elementos mientras se encuentra en el modo de resaltado de texto.
     * @memberof TextHighlighter
     */
    disableRemoveIconFunctionality() {
        const hoverableElements = Array.from( document.querySelectorAll( '.hoverable' ) );
        hoverableElements.forEach( el => {
            el.style.pointerEvents = 'none'; // Desactivar clics en los elementos hoverables
        });
    }

    /**
     * Restaura la funcionalidad de eliminar en los elementos con la clase .hoverable
     * al reactivar los clics en ellos. Se utiliza para reactivar la funcionalidad de
     * eliminar después de desactivar el modo de resaltado de texto.
     * @memberof TextHighlighter
     */
    restoreRemoveIconFunctionality() {
        const hoverableElements = Array.from( document.querySelectorAll( '.hoverable' ) );
        hoverableElements.forEach( el => {
            el.style.pointerEvents = 'auto'; // Reactivar clics en los elementos hoverables
        });
    }

}
