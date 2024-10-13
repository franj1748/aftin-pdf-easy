/*!
  * Prin PDF Easy v1.3.3
  * Copyright 2011-2024 
  * Licensed under GPL 
  */

function downloadPdf() {

    const header   = document.querySelector( '.header' );
    const images   = document.querySelector( '#product-images' );
    const content  = document.querySelector( '.content' );
    const title    = document.querySelector( '.title' ).innerText;
    const spinner  = document.querySelector( '.spinner-border' );

    spinner.classList.remove( 'd-none' );
    spinner.classList.add( 'd-block' );
    pdf.querySelector( 'i' ).style.display = 'none';
    pdf.style.height = '38px';

    // Crear un nuevo elemento para contener el contenido combinado
    const combinedElement = document.createElement( 'div' );

    // Agregar el contenido de los elementos a combinedElement
    combinedElement.appendChild( header.cloneNode( true ) );  // Clonar el elemento para evitar que se quite del DOM
    combinedElement.appendChild( images.cloneNode( true ) );  // Clonar el elemento
    combinedElement.appendChild( content.cloneNode( true ) ); // Clonar el elemento

    // Opciones para el PDF
    const options = {
        margin: [ 10, 10, 20, 10 ],
        filename: title,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Convertir el elemento HTML a PDF
    html2pdf()
    .from( combinedElement )
    .set( options )
    .save()
    .then(() => {
        spinner.classList.add( 'd-none' );
        spinner.classList.remove( 'd-block' );
        pdf.querySelector('i').style.display = 'block';
        console.log( "PDF generado y descargado" );
    })
    .catch((error) => {
        console.error( "Error al generar el PDF: ", error );
    });
    
}
