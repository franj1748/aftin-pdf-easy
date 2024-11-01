/**
 * PDFGenerator.js
 *
 * Clase para gestionar la generación de archivos PDF desde contenido HTML utilizando html2pdf.
 * Permite personalizar el formato, la orientación, los márgenes y la calidad de las imágenes antes de generar el PDF.
 *
 * Funcionalidades:
 * - Configuración personalizada para el formato y orientación del PDF
 * - Ajuste de márgenes e imagen de calidad
 * - Popup para permitir que el usuario seleccione las opciones de configuración
 *
 * Requiere:
 * - html2pdf.js para generar el PDF
 * - SweetAlert2 para el popup de configuración
 *
 * Autor: [Francisco Elis]
 * Fecha: [12/10/2024]
 */

/**
 * Descarga el contenido de la página como PDF
 *
 * @class toPdf
 */
class toPdf {
    /**
     * Constructor de la clase toPdf.
     * 
     * @param {String} headerSelector - Selector CSS del encabezado de la página.
     * @param {String} imagesSelector - Selector CSS de la fila de imágenes de la página.
     * @param {String} contentSelector - Selector CSS del contenido de la página.
     * @param {String} titleSelector - Selector CSS del título de la página.
     * @param {String} spinnerSelector - Selector CSS del spinner de carga.
     * @param {String} pdfButtonSelector - Selector CSS del botón de descargar como PDF.
     */
    constructor( headerSelector, imagesSelector, contentSelector, titleSelector, spinnerSelector, pdfButtonSelector ) {
        this.header = document.querySelector( headerSelector );
        this.images = document.querySelector( imagesSelector );
        this.content = document.querySelector( contentSelector );
        this.title = document.querySelector( titleSelector ).innerText;
        this.spinner = document.querySelector( spinnerSelector );
        this.pdfButton = document.querySelector( pdfButtonSelector );
        
        this.addDownloadEvent();
    }

    /**
     * Agrega un evento de clic al botón de descargar como PDF
     * para que llame al método downloadPdf cuando se hace clic en él.
     * 
     * @memberof toPdf
     */
    addDownloadEvent() {
        if ( this.pdfButton ) {

            this.pdfButton.addEventListener( 'click', () => {
                this.addPopuoEvents();
            });
        }
    }

    /**
     * Guarda las configuraciones actuales en localStorage.
     *
     * Guarda el valor seleccionado en el cuadro de dialogo de la configuración
     * del PDF y lo serializa en JSON y lo guarda en 
     * localStorage con la clave 'pdfSettings'.
     * 
     * @memberof toPDF
     */
    saveSettings() {

        const formatSelect = document.querySelector( '#format' );
        const orientationSelect = document.querySelector( '#orientation' );
        const marginInput = document.querySelector( '#margin' );
        const qualityInput = document.querySelector( '#quality' );

        const settings = {
            format: formatSelect.value,
            orientation: orientationSelect.value,
            margin: marginInput.value,
            quality: qualityInput.value
        };

        localStorage.setItem( 'pdfSettings', JSON.stringify( settings ) );
    }

    /**
     * Carga las configuraciones guardadas en localStorage.
     *
     * Si en localStorage hay un objeto guardado con la clave
     * 'speechSettings', lo deserializa en un objeto y carga los
     * valores en los inputs de rango de velocidad, tono y volumen y en
     * el select de voz.
     * 
     * @memberof VoiceReader
     */
    loadSettings() {
        const savedSettings = JSON.parse( localStorage.getItem( 'pdfSettings' ) );

        if ( savedSettings ) {

            const formatSelect = document.querySelector( '#format' );
            const orientationSelect = document.querySelector( '#orientation' );
            const marginInput = document.querySelector( '#margin' );
            const qualityInput = document.querySelector( '#quality' );

            formatSelect.value = savedSettings.format;
            orientationSelect.value   = savedSettings.orientation;
            marginInput.value  = savedSettings.margin;
            qualityInput.value = savedSettings.quality;
        }
    }

    addPopuoEvents(){

        let htmlContent = `
            <div class="d-flex flex-column justify-content-center align-items-center">
                <label class="mb-1" for="format">Formato de página:</label>
                <select id="format" class="form-select mb-4 text-center text-light bg-dark">
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="letter">Letter</option>
                </select>
        
                <label class="mb-1" for="orientation">Orientación:</label>
                <select id="orientation" class="form-select mb-4 text-center text-light bg-dark">
                    <option value="portrait">Vertical</option>
                    <option value="landscape">Horizontal</option>
                </select>
        
                <label class="mb-1" for="margin">Márgenes:</label>
                <input type="number" id="margin" class="form-select mb-4 text-center text-light bg-dark" value="10">
        
                <label class="mb-1" for="quality">Calidad de imagen:</label>
                <input type="range" id="quality" class="form-range text-center text-light bg-dark" min="0.1" max="1" step="0.01" value="0.98">
            </div>
        `;

        customSwal.fire({
            title: 'Configura el PDF',
            html: htmlContent,
            confirmButtonText: 'Generar PDF',
            preConfirm: () => {
                const format = document.querySelector( '#format' ).value;
                const orientation = document.querySelector( '#orientation' ).value;
                const margin = parseInt( document.querySelector( '#margin' ).value, 10 );
                const quality = parseFloat( document.querySelector( '#quality' ).value );
        
                return { format, orientation, margin, quality };
            }
        }).then((result) => {

            if ( result.isConfirmed ) {
                const { format, orientation, margin, quality } = result.value;
        
                // Generar PDF con las configuraciones seleccionadas
                this.downloadPdf( format, orientation, margin, quality );
            }
        });
        
        const formatSelect = document.querySelector( '#format' );
        const orientationSelect = document.querySelector( '#orientation' );
        const marginInput = document.querySelector( '#margin' );
        const qualityInput = document.querySelector( '#quality' );

        this.loadSettings();

        formatSelect.addEventListener( 'change', () => this.saveSettings() );
        orientationSelect.addEventListener( 'change', () => this.saveSettings() );
        marginInput.addEventListener( 'input', () => this.saveSettings() );
        qualityInput.addEventListener( 'input', () => this.saveSettings() );
    }

    /**
     * Descarga el contenido de la página como un archivo PDF.
     * 
     * Este método crea un nuevo elemento HTML que contiene el encabezado, las imágenes y el contenido de la página.
     * Luego, utiliza la librería html2pdf para convertir el elemento HTML a un archivo PDF y descargue el archivo con el nombre
     * del título de la página.
     * 
     * @param {String} [format] - Formato de página del PDF (a4, a3, letter)
     * @param {String} [orientation] - Orientación del PDF (portrait, landscape)
     * @param {Number} [margin] - Margen del PDF en mm
     * @param {Number} [quality] - Calidad de las imágenes en el PDF (0.01 a 1)
     * 
     * @memberof toPdf
     */
    downloadPdf( format, orientation, margin, quality ) {

        // Mostrar el spinner
        this.showSpinner();
        
        // Crear un nuevo elemento para contener los elementos combinados
        const combinedElement = document.createElement( 'div' );
        combinedElement.appendChild( this.header.cloneNode( true ) );  // Clonar el elemento para evitar que se quite del DOM
        combinedElement.appendChild( this.images.cloneNode( true ) );  // Clonar el elemento
        combinedElement.appendChild( this.content.cloneNode( true ) ); // Clonar el elemento

        // Opciones para el PDF
        const options = {
            filename: this.title,
            margin: [margin, margin, margin, margin],
            image: { type: 'jpeg', quality: quality },
            html2canvas: { scale: 1,  scrollX: 0, scrollY: 0, },
            jsPDF: { unit: 'mm', format: format, orientation: orientation },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        // Convertir el elemento HTML a PDF
        html2pdf()
            .from( combinedElement )
            .set( options )
            .save()
            .then(() => {
                this.hideSpinner();
                console.log( "PDF generado y descargado" );
            })
            .catch(( error ) => {
                this.hideSpinner();
                console.error( "Error al generar el PDF: ", error );
            });
    }

    /**
     * Muestra el spinner de carga mientras se descarga el PDF.
     * 
     * @memberof toPdf
     */
    showSpinner() {
        this.spinner.classList.remove( 'd-none' );
        this.spinner.classList.add( 'd-block' );
        this.pdfButton.querySelector( 'i' ).style.display = 'none'; // Suponiendo que el icono está dentro del botón
        this.pdfButton.style.height = '38px';
    }

    /**
     * Oculta el spinner de carga.
     * 
     * @memberof toPdf
     */
    hideSpinner() {
        this.spinner.classList.add( 'd-none' );
        this.spinner.classList.remove( 'd-block' );
        this.pdfButton.querySelector( 'i' ).style.display = 'block'; // Mostrar el icono nuevamente
    }
}

// Exportar la clase para que pueda ser utilizada globalmente
window.toPdf = toPdf;

