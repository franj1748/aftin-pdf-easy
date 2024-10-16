/**
 * IntroTourController.js
 *
 * Clase para gestionar un tour interactivo en la página utilizando Intro.js.
 * Proporciona guías paso a paso y hints visuales para mejorar la experiencia del usuario.
 *
 * Funcionalidades:
 * - Mostrar guías paso a paso con soporte para botones de navegación
 * - Mostrar hints con descripciones adicionales
 * - Soporte para opciones de configuración personalizadas del tour
 *
 * Requiere:
 * - Intro.js para crear los tours interactivos
 * - Bootstrap Icons para los íconos en las descripciones
 *
 * Autor: [Francisco Elis]
 * Fecha: [10/10/2024]
 */


/**
 * Clase para mostrar una guía de uso
 *
 * @class TourGuide
 */
class TourGuide {
    /**
     * Constructor de la clase TourGuide.
     * 
     * Inicializa la librería introJs y llama al método init() para
     * configurar los hints y las opciones del tour.
     * 
     * @constructor
     * @memberof TourGuide
     * @instance
     */
    constructor() {
        this.intro = introJs();
        this.init();
    }

    /**
     * Inicializa la guía de uso.
     * 
     * Llama a los métodos setHints() y setOptions() para configurar los hints y las opciones del tour.
     * 
     * @memberof TourGuide
     * @instance
     */
    
    init() {
        // Configurar hints
        this.setHints();
        // Establecer las opciones del tour
        this.setOptions();
    }

    /**
     * Configura los hints del tour.
     * 
     * Agrega un hint en el elemento con id="info" y lo muestra en el medio de la pantalla.
     * Luego, comienza el tour en el paso 1.
     * 
     * @memberof TourGuide
     * @instance
     */
    setHints() {
        // Mostrar hints 
        this.intro.setOptions({
            hints: [
                {
                    element: '#info',
                    hint: '<i class="bi bi-question-circle-fill"></i> Comienza una guía de uso, paso a paso',
                    hintPosition: 'middle-middle'
                }
            ],
            hintButtonLabel: 'Entiendo'
        }).addHints();
    
    }

    /**
     * Establece las opciones del tour.
     * 
     * Establece las opciones básicas del tour, como el comportamiento al
     * presionar teclas, el color del overlay, la posición de los tooltipes,
     * entre otros.
     * 
     * @memberof TourGuide
     * @instance
     */
    setOptions() {

        // Comenzar desde el paso 1
        this.intro.goToStep(1);

        // Establecer las opciones del tour
        this.intro.setOptions({
            dontShowAgain: true,
            nextLabel: 'Siguiente',
            prevLabel: 'Anterior',
            doneLabel: 'Finalizar',
            skipLabel: '<i class="bi bi-x-circle"></i>',
            hidePrev: true,
            hideNext: false,
            exitOnEsc: false,
            exitOnOverlayClick: false,
            showStepNumbers: true,
            stepNumbersOfLabel: 'de',
            keyboardNavigation: true,
            overlayOpacity: 0.8,
            dontShowAgainLabel: 'No volver a mostrar',
            tooltipPosition: 'bottom-middle-aligned'
        }).start();
    }
}


