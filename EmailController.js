/**
 * EmailController.js
 *
 * Clase para enviar el contenido por correo electrónico.
 * Permite al usuario compartir el contenido de la página a través de un email.
 *
 * Funcionalidades:
 * - Abrir el cliente de correo predeterminado con el contenido como cuerpo del mensaje
 * - Opción para modificar el asunto y cuerpo del mensaje antes de enviarlo
 * 
 * Requiere:
 * - EmailJS para el envío de correos
 * - SweetAlert2 para el diálogo de confirmación
 *
 * Autor: [Tu nombre]
 * Fecha: [Fecha actual]
 */

/**
 * Clase para enviar lka página por correo
 *
 * @class EmailSender
 */
class EmailSender {

    /**
     * Constructor de la clase EmailSender.
     * 
     * @param {String} emailButtonSelector - Selector CSS del botón de correo electrónico.
     */
    constructor( emailButtonSelector ) {

        this.emailButton = document.querySelector( emailButtonSelector );
        
        // Inicializar EmailJS con tu User ID
        this.initEmailJS( "4_U7UfZLTEpQCKpfB" ); 

        // Agregar el evento de clic al botón de correo electrónico
        this.addClickEvent();

    }

    /**
     * Inicializa EmailJS con tu User ID.
     * 
     * @param {String} userID - Tu User ID de EmailJS.
     */
    initEmailJS( userID ) {

        emailjs.init( userID );

    }

    /**
     * Muestra un diálogo para ingresar un correo y enviar la página como correo electrónico.
     * 
     * @memberof EmailSender
     */
    sendEmail() {

        customSwal.fire({
            title: 'Enviar por Correo',
            text: 'Ingresa el correo al que deseas enviar:',
            input: 'email', // Solicita un email
            inputPlaceholder: 'correo@example.com',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            
            /**
             * Valida que el correo electrónico ingresado sea válido.
             * Si el correo electrónico es inválido, se devuelve un string con el mensaje de error.
             * Si el correo electrónico es válido, se devuelve el correo electrónico mismo.
             * 
             * @param {String} email - Correo electrónico ingresado por el usuario.
             * @returns {String} Mensaje de error o el correo electrónico si es válido.
             */
            preConfirm: ( email ) => {

                if ( ! email ) {
                    return 'Debes ingresar un correo válido';
                } else {
                    return email;
                }

            }
        }).then(( result ) => {

            if ( result.isConfirmed ) {

                // Obtener los elementos de la página y el correo ingresado
                const userEmail     = result.value;
                const content       = document.querySelector( '.content' ).textContent;
                const tagline       = document.querySelector( '.tagline' ).textContent;
                const titleComplete = document.querySelector( '.title' ).textContent;
                const title         = document.querySelector( '.title h1' ).textContent;

                // Definir los parámetros para el correo electrónico
                const templateParams = {
                    to_name: 'Destinatario', 
                    from_name: 'Aftin | Agencia de Viajes',
                    tagline: tagline,
                    title: title,
                    titleComplete: titleComplete,
                    message_html: content, // Contenido de la página
                    user_email: userEmail  // Correo ingresado por el usuario
                };

                // Mostrar loader mientras se envía el correo
                customSwal.fire({
                    title: 'Enviando correo...',
                    allowOutsideClick: false,
                    /**
                     * Muestra el loader de SweetAlert una vez que se haya abierto el diálogo.
                     * 
                     * @function
                     * @name didOpen
                     * @memberof EmailSender
                     * @instance
                     */
                    didOpen: () => {
                        customSwal.showLoading();
                    }
                });

                // Enviar el correo usando EmailJS
                emailjs.send( 'service_02gnv2b', 'template_9fv8u47', templateParams )
                .then( response => {

                    customSwal.fire( '¡Correo enviado!', 'Tu mensaje ha sido enviado a ' + userEmail, 'success' );

                }, error => {

                    customSwal.fire( 'Error', 'Ocurrió un error al enviar el correo: ' + error.text, 'error' );

                });

            }

        });

    }

    /**
     * Agrega un evento de clic al botón de correo electrónico para enviar
     * el correo a la dirección ingresada por el usuario.
     * 
     * @memberof EmailSender
     */
    addClickEvent() {

        this.emailButton.addEventListener( 'click', () => {
            this.sendEmail();
        });

    }

}
