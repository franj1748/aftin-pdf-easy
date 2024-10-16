/**
 * DownloadFormatsController.js
 *
 * Clase para gestionar la descarga del contenido en varios formatos (Word, TXT, Markdown).
 * Permite al usuario elegir el formato deseado y descargar el contenido en dicho formato.
 *
 * Funcionalidades:
 * - Descargar el contenido en formato Word (.docx)
 * - Descargar el contenido en formato de texto (.txt)
 * - Descargar el contenido en formato Markdown (.md)
 *
 * Requiere:
 * - Librerías como FileSaver.js para la descarga de archivos
 * - docx.js para la creación de archivos Word
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

class ExportToFormat {

    /**
     * Constructor de la clase ExportToFormat.
     * 
     * @param {String} selector - Selector CSS del botón de descarga.
     */
    constructor( selector ) {
        this.downloadButton = document.querySelector( selector );
        this.initialize();
    }

    /**
     * Inicializa la funcionalidad de la clase ExportToFormat.
     * 
     * Agrega un evento de clic al botón de descarga para mostrar
     * un popup con tres íconos: Word, Texto plano y Markdown.
     * 
     * @memberof ExportToFormat
     */
    initialize() {
        if ( this.downloadButton ) {
            this.downloadButton.addEventListener( 'click', () => {
                this.showPopup();
            });
        }
    }

    /**
     * Muestra un popup con tres íconos: Word, Texto plano y Markdown.
     * Cada ícono tiene un cursor de puntero y un tamaño de fuente de 40px.
     * Al hacer clic en cada ícono, se llama al método correspondiente para
     * descargar el contenido en el formato seleccionado.
     * 
     * @memberof ExportToFormat
     */
    showPopup() {

        let footerContent = `
            <div class="d-flex w-100 justify-content-evenly">
                <div class="d-flex flex-column mx-5 fw-bold">
                    <i class="bi bi-file-earmark-word"></i>
                    <label>Word</label>
                </div>
                <div class="d-flex flex-column mx-5 fw-bold">
                    <i class="bi bi-filetype-txt"></i> 
                    <label>Texto</label>
                </div>
                <div class="d-flex flex-column mx-5 fw-bold">
                    <i class="bi bi-filetype-md"></i>
                    <label>Markdown</label>
                </div>
            </div>
        `;

        customSwal.fire({
            title: "Descargar",
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true,
            footer: footerContent,
            customClass: {
                title: 'text-light',
                popup: 'bg-dark',
                container: 'text-center text-light',
                htmlContainer: 'text-center text-light',
                footer: 'd-flex justify-content-evenly text-light'
            }
        });

        // Asignar eventos a los íconos
        this.setupIconEvents();
    }

    
    /**
     * Asigna eventos a los íconos del popup.
     * A cada ícono se le asigna un estilo de cursor de puntero y un tamaño de fuente de 40px.
     * Luego, se asigna un evento de clic a cada ícono para llamar al método correspondiente
     * para descargar el contenido en el formato seleccionado.
     * 
     * @memberof ExportToFormat
     */
    setupIconEvents() {
        const docxIcon = document.querySelector( 'i.bi-file-earmark-word' );
        const txtIcon  = document.querySelector( 'i.bi-filetype-txt' );
        const mdIcon   = document.querySelector( 'i.bi-filetype-md' );

        [docxIcon, txtIcon, mdIcon].forEach( icon => {
            if ( icon ) {
                icon.style.cursor = 'pointer';
                icon.style.fontSize = '40px';
            }
        });

        if ( docxIcon ) docxIcon.addEventListener( 'click', () => this.exportToWord() );
        if ( txtIcon ) txtIcon.addEventListener( 'click', () => this.exportToTxt() );
        if ( mdIcon ) mdIcon.addEventListener( 'click', () => this.exportToMarkdown() );
    }

    /**
     * Descarga el contenido de la página como un archivo de texto plano (.txt).
     * 
     * Obtiene el título y el contenido de la página y crea un objeto Blob con
     * el contenido del título y el contenido como texto plano.
     * Luego, crea un enlace temporal en el DOM y lo hace clic para descargar
     * el archivo con el nombre "contenido.txt" y muestra un mensaje de éxito
     * con Toastify.
     * 
     * @memberof ExportToFormat
     */
    exportToTxt() {
        const title = document.querySelector( '.title' ).innerText;
        const content = document.querySelector( '.content' ).innerText;
        const blob = new Blob( [`${title}\n\n${content}`], { type: 'text/plain' } );

        const link = document.createElement( 'a' );
        link.href = URL.createObjectURL( blob );
        link.download = 'contenido.txt';
        link.click();
        URL.revokeObjectURL( link.href );

        this.showToast();
    }

    /**
     * Descarga el contenido de la página como un archivo Word (.docx).
     * 
     * Obtiene el título y el contenido de la página y crea un objeto Documento
     * de docx con el título como título principal y el contenido como párrafos.
     * Luego, utiliza la clase Packer de docx para convertir el objeto Documento
     * a un blob y lo descarga con el nombre "contenido.docx" y muestra un
     * mensaje de éxito con Toastify.
     * 
     * @memberof ExportToFormat
     */
    exportToWord() {
        const title = document.querySelector( '.title' ).innerText;
        const contentElements = document.querySelector( '.content > .col-sm-12' ).children;

        const doc = new docx.Document({
            creator: "Viajes Aftin",
            title: title,
            description: "Documento de descripción de viaje",
            styles: {
                paragraphStyles: [{
                    id: "Heading1",
                    name: "Heading 1",
                    basedOn: "Normal",
                    next: "Normal",
                    quickFormat: true,
                    run: {
                        size: 28,
                        bold: true,
                        italics: true,
                        color: "#01cfb2"
                    },
                    paragraph: {
                        spacing: {
                            after: 120
                        }
                    }
                }]
            },
            sections: [{
                children: [
                    new docx.Paragraph( {
                        text: title,
                        heading: docx.HeadingLevel.HEADING_1,
                        alignment: docx.AlignmentType.CENTER
                    } ),
                    ...Array.from( contentElements ).map( element => this.createParagraphFromElement( element ) )
                ]
            }]
        });

        docx.Packer.toBlob( doc ).then( blob => {
            saveAs( blob, "contenido.docx" );
            this.showToast();
        });
    }

    /**
     * Descarga el contenido de la página como un archivo Markdown (.md).
     * 
     * Obtiene el título y el contenido de la página y crea un objeto Blob
     * con el contenido del título y el contenido como texto plano en
     * formato Markdown. Luego, crea un enlace temporal en el DOM y lo hace
     * clic para descargar el archivo con el nombre "contenido.md" y muestra
     * un mensaje de éxito con Toastify.
     * 
     * @memberof ExportToFormat
     */
    exportToMarkdown() {
        const title = document.querySelector( '.title' ).innerText;
        const content = document.querySelector( '.content ').innerText;
        const markdownContent = `# ${title}\n\n${content}`;
        const blob = new Blob( [markdownContent], { type: 'text/markdown' } );

        const link = document.createElement( 'a' );
        link.href = URL.createObjectURL( blob );
        link.download = 'contenido.md';
        link.click();
        URL.revokeObjectURL( link.href );

        this.showToast();
    }

    /**
     * Crea un párrafo a partir de un elemento HTML dependiendo de su tipo.
     * @param {HTMLElement} element 
     */
    createParagraphFromElement( element ) {
        switch ( element.tagName.toLowerCase() ) {
            case 'p':
                return new docx.Paragraph({
                    children: [new docx.TextRun( { text: element.innerText, break: 1 } )]
                });
            case 'h1':
            case 'h2':
            case 'h3':
                return new docx.Paragraph({
                    text: element.innerText,
                    heading: docx.HeadingLevel.HEADING_1,
                    spacing: { after: 200 }
                });
            case 'ul':
                return new docx.Paragraph({
                    children: Array.from( element.children ).map(li => new docx.TextRun( { text: `• ${li.innerText}`, break: 1 } ) )
                });
            case 'ol':
                return new docx.Paragraph({
                    children: Array.from( element.children ).map((li, index) => new docx.TextRun( { text: `${index + 1}. ${li.innerText}`, break: 1 } ) )
                });
            case 'img':
                return new docx.Paragraph({
                    children: [
                        new docx.ImageRun({
                            data: element.src,
                            transformation: { width: 200, height: 150 }
                        })
                    ],
                    spacing: { after: 200 }
                });
            default:
                return new docx.Paragraph({
                    children: [new docx.TextRun({ text: element.innerText, break: 1 })]
                });
        }
    }

    showToast() {
    
        Toast.fire({
            icon: "success",
            title: "Se descargó correctamente"
        });

    }
}

// Exportar la clase para que pueda ser utilizada globalmente
window.ExportToFormat = ExportToFormat;