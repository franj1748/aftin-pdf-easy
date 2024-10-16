/**
 * FontSizeController.js
 *
 * Clase para gestionar el cambio de tamaño de la fuente en la página.
 * Permite aumentar o disminuir el tamaño de la letra en el contenido de la página.
 *
 * Funcionalidades:
 * - Incrementar el tamaño de la fuente
 * - Disminuir el tamaño de la fuente
 * - Guardar la preferencia de tamaño de letra en localStorage
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Cambiar el tamaño de la fuente en el body.
 *
 * @class FontSizeChanger
 */
class FontSizeChanger {

    /**
     * Constructor de la clase FontSizeChanger.
     * 
     * @param {number} [minFontSize=12] - Tamaño mínimo de la fuente.
     * @param {number} [maxFontSize=24] - Tamaño máximo de la fuente.
     * @param {number} [currentFontSize=16] - Tamaño actual de la fuente.
     */
    constructor( minFontSize = 12, maxFontSize = 24, currentFontSize = 16 ) {

        this.bodyElement = document.querySelector( 'body' );
        this.minFontSize = minFontSize;
        this.maxFontSize = maxFontSize;
        this.currentFontSize = currentFontSize;

    }

    /**
     * Cambia el tamaño de la fuente en el body.
     * 
     * @param {number} factor - Factor de cambio del tamaño de la fuente. Si es positivo, aumenta el tamaño, si es negativo, disminuye.
     * 
     * @memberof FontSizeChanger
     * 
     * @example
     * const fontChanger = new FontSizeChanger();
     * fontChanger.changeFontSize( 2 );
     * El tamaño de la fuente se ha aumentado en 2px
     */
    changeFontSize( factor ) {

        // Calcular el nuevo tamaño de la fuente
        this.currentFontSize += factor;

        // Restringir el tamaño de la fuente dentro de los límites establecidos
        if ( this.currentFontSize < this.minFontSize ) {
            this.currentFontSize = this.minFontSize;
        } else if ( this.currentFontSize > this.maxFontSize ) {
            this.currentFontSize = this.maxFontSize;
        }

        // Aplicar el nuevo tamaño de la fuente al body
        this.bodyElement.style.fontSize = this.currentFontSize + 'px';

    }

    /**
     * Agrega eventos de clic a los botones de disminuir y aumentar tamaño de letra
     * para cambiar el tamaño de la fuente en el body.
     * 
     * @param {string} selectorLess - Selector del botón de disminuir tamaño de letra.
     * @param {string} selectorMore - Selector del botón de aumentar tamaño de letra.
     * 
     * @memberof FontSizeChanger
     * 
     * @example
     * const fontSizeChanger = new FontSizeChanger();
     * fontSizeChanger.addFontSizeControlEvents( '#fontSizeLess', '#fontSizeMore' );
     * Agrega eventos a los botones con los selectores #fontSizeLess y #fontSizeMore
     */
    addFontSizeControlEvents( selectorLess, selectorMore ) {

        const fontSizeLess = document.querySelector( selectorLess );
        const fontSizeMore = document.querySelector( selectorMore );

        // Botón de disminuir tamaño de letra
        fontSizeLess.addEventListener( 'click', e => {
            this.changeFontSize( -2 ); // Disminuye el tamaño de la fuente en 2px
        });

        // Botón de aumentar tamaño de letra
        fontSizeMore.addEventListener( 'click', e => {
            this.changeFontSize( 2 ); // Aumenta el tamaño de la fuente en 2px
        });

    }
}

