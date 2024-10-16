/**
 * UndoDeleteController.js
 *
 * Clase para gestionar la acción de deshacer la eliminación de elementos.
 * Permite restaurar el último elemento eliminado por el usuario.
 * Además, agrega iconos a los elementos para permitir su eliminación
 *
 * Funcionalidades:
 * - Restaurar el último elemento eliminado de la página
 * - Implementación de deshacer mediante almacenamiento temporal
 *
 * Requiere:
 * - SweetAlert2 para notificaciones visuales
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Agrega íconos de eliminación a todos los elementos
 * del DOM y deshace los elementos eliminados
 *
 * @class Undo
 */
class Undo {
    /**
     * Constructor de la clase Undo
     * @param {String} selector - Selector del botón de deshacer
     */
    constructor( selector ) {

        this.undoButton = document.querySelector( selector );
        this.removedElementsStack = [];

        // Iniciar la funcionalidad si existe el botón de deshacer
        if ( this.undoButton ) {
            this.undoButton.addEventListener( 'click', () => this.restoreLastRemovedElement() );
        }

        // Agregar íconos de eliminación a todos los elementos
        this.addRemoveIconToAllElements();
        // Actualizar el estado del botón de deshacer
        this.updateUndoButton();
    }

    
    /**
     * Agrega íconos de eliminación a todos los elementos
     * del DOM. Para excluir elementos de tener este ícono,
     * se debe asignar la clase 'no-remove'.
     */
    addRemoveIconToAllElements() {
        const allElements = document.querySelectorAll( '*' );

        allElements.forEach( element => {
            const classList = Array.from( element.classList );
            if ( ! this.shouldExcludeElement( element, classList ) ) {

                this.makeElementRemovable( element );
            }
        });
    }

    /**
     * Determina si un elemento debe ser excluido de tener el ícono de eliminación.
     * Un elemento se excluye si:
     * - Es un elemento <html>, <body>, <script>, <style>, <head>
     * - Tiene la clase 'container', 'row', 'col-sm-12' o 'no-remove'
     * - Tiene una clase que comienza con 'introjs-'
     * - Está contenido en un elemento con una clase que comienza con 'introjs-'
     * @param {Element} element - Elemento a evaluar
     * @param {Array<String>} classList - Lista de clases CSS del elemento
     * @returns {Boolean} Verdadero si el elemento debe ser excluido, falso en caso contrario
     */
    shouldExcludeElement( element, classList ) {
        return ['HTML', 'BODY', 'SCRIPT', 'STYLE', 'HEAD', 'BUTTON', 'I', 'IMG'].includes( element.tagName ) ||
            classList.includes( 'container' ) ||
            classList.includes( 'row' ) ||
            classList.includes( 'col-sm-12' ) ||
            classList.includes( 'no-remove' ) ||
            classList.some( className => className.startsWith( 'introjs-' ) ) ||
            element.closest( '[class*="introjs-"]' );
    }
    
    /**
     * Agrega la funcionalidad para eliminar un elemento del DOM
     * cuando se hace clic en el mismo. El elemento se vuelve
     * "removable" y se le agrega un ícono de eliminación.
     * @param {Element} element - Elemento que se va a hacer removable
     */
    makeElementRemovable( element ) {

        element.style.cursor = 'pointer';
        element.classList.add( 'hoverable' );

        // Crear el ícono de eliminación
        const removeIcon = document.createElement( 'i' );
        removeIcon.classList.add( 'bi', 'bi-x-circle', 'remove-icon' );
        element.appendChild( removeIcon );

        // Agregar eventos para eliminar el elemento desde el icono
        removeIcon.addEventListener( 'click', e => {
            e.stopPropagation(); // Evitar que se dispare el clic del elemento
            this.removeElement( element );
        });

        // Agregar eventos para eliminar el elemento desde el elemento
        element.addEventListener( 'click', e => {
            e.stopPropagation(); // Evitar la propagación del clic a los padres
            this.removeElement( element );
        });
    }

    /**
     * Elimina un elemento del DOM y lo agrega a la pila de elementos eliminados.
     * @param {Element} element - Elemento a eliminar
     */
    removeElement( element ) {
        this.removedElementsStack.push({
            element,
            parent: element.parentNode,
            nextSibling: element.nextSibling
        });

        // Animar y eliminar el elemento
        element.classList.add('animate__animated', 'animate__zoomOut', 'animate__faster');
        element.addEventListener('animationend', () => {
            element.classList.remove('animate__animated', 'animate__zoomOut', 'animate__faster');
            element.remove();
        });

        this.updateUndoButton();
    }
    
    /**
     * Restaura el ultimo elemento eliminado desde la pila de elementos eliminados
     * y lo vuelve a agregar al DOM en su posición original
     */
    restoreLastRemovedElement() {
        const lastRemoved = this.removedElementsStack.pop();
        if ( lastRemoved ) {
            lastRemoved.parent.insertBefore( lastRemoved.element, lastRemoved.nextSibling );
            this.updateUndoButton();
        }
    }

    /**
     * Actualiza el estado del botón de deshacer según la cantidad de elementos
     * eliminados en la pila. Si no hay elementos en la pila, el botón se
     * deshabilita, de lo contrario, se habilita.
     */
    updateUndoButton() {
        if ( this.removedElementsStack.length === 0 ) {
            this.undoButton.setAttribute( 'disabled', 'disabled' );
        } else {
            this.undoButton.removeAttribute( 'disabled' );
        }
    }
}

// Exportar la clase a nivel global para que esté disponible
window.Undo = Undo;