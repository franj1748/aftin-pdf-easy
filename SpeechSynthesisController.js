/**
 * SpeechSynthesisController.js
 *
 * Clase para controlar la lectura de texto en voz alta utilizando la API SpeechSynthesis.
 * Permite pausar, reanudar, detener la lectura, y guardar/cargar configuraciones de voz.
 *
 * Funcionalidades:
 * - Guardar y cargar configuraciones de voz (localStorage)
 * - Leer el texto seleccionado o todo el contenido
 * - Pausar, reanudar, y detener la lectura
 * - Interfaz para personalizar la voz, velocidad, tono, y volumen
 *
 * Requiere:
 * - SweetAlert2 para la interfaz visual
 * - Soporte de SpeechSynthesis en el navegador
 *
 * Autor: [Francisco Elis]
 * Fecha: [13/10/2024]
 */

/**
 * Clase VoiceReader
 *
 * @class VoiceReader
 */
class VoiceReader {
    
    /**
     * Constructor de la clase VoiceReader.
     *
     * @param {String} speakSelector - Selector CSS del botón de voz.
     */
    constructor( speakSelector ) {
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.speakElement = document.querySelector( speakSelector );
        this.init();
    }

    /**
     * Inicializa la funcionalidad de VoiceReader.
     *
     * Agrega un evento de clic al botón de voz para mostrar el popover
     * con los controles de volumen, tono y velocidad. Luego carga las
     * configuraciones guardadas en localStorage.
     * 
     * @memberof VoiceReader
     */
    init() {
        this.speakElement.addEventListener( 'click', () => this.addPopoverEvents() );
        //this.loadSettings();
    }

    /**
     * Guarda las configuraciones actuales en localStorage.
     *
     * Guarda el valor seleccionado en el select de voz, el valor del
     * input de rango de velocidad, el valor del input de rango de tono
     * y el valor del input de rango de volumen en un objeto y lo
     * serializa en JSON y lo guarda en localStorage con la clave
     * 'speechSettings'.
     * 
     * @memberof VoiceReader
     */
    saveSettings() {

        const voiceSelect = document.querySelector( '#voiceSelect' );
        const rateInput = document.querySelector( '#rangeVoice' );
        const pitchInput = document.querySelector( '#pitch' );
        const volumeInput = document.querySelector( '#volume' );

        const settings = {
            voice: voiceSelect.value,
            rate: rateInput.value,
            pitch: pitchInput.value,
            volume: volumeInput.value
        };

        localStorage.setItem( 'speechSettings', JSON.stringify( settings ) );
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
        const savedSettings = JSON.parse( localStorage.getItem( 'speechSettings' ) );

        if ( savedSettings ) {
            const voiceSelect = document.querySelector( '#voiceSelect' );
            const rateInput   = document.querySelector( '#rangeVoice' );
            const pitchInput  = document.querySelector( '#pitch' );
            const volumeInput = document.querySelector( '#volume' );

            voiceSelect.value = savedSettings.voice;
            rateInput.value   = savedSettings.rate;
            pitchInput.value  = savedSettings.pitch;
            volumeInput.value = savedSettings.volume;
        }
    }

    /**
     * Pausa la lectura actual.
     *
     * Verifica si la lectura se encuentra en progreso y si no se ha
     * pausado previamente, remueve las animaciones de button y
     * pausa la lectura.
     * 
     * @memberof VoiceReader
     */
    pauseReading() {
        if ( this.synth.speaking && !this.synth.paused ) {
            this.speakElement.classList.remove( 'animate__animated', 'animate__pulse', 'animate__infinite', 'infinite', 'btn-danger', 'opacity-50' );
            this.synth.pause();
        }
    }

    /**
     * Reanuda la lectura actual o inicia una nueva.
     *
     * Si la lectura se encuentra en pausa, la reanuda.
     * De lo contrario, obtiene el texto seleccionado o el texto del
     * documento y lo lee con las configuraciones actuales.
     * 
     * @memberof VoiceReader
     */
    resumeReading() {
        const voices = this.synth.getVoices();
        const rateInput = document.querySelector( '#rangeVoice' );
        const pitchInput = document.querySelector( '#pitch' );
        const volumeInput = document.querySelector( '#volume' );

        if ( this.synth.paused ) {
            this.synth.resume();
            this.speakElement.classList.add( 'animate__animated', 'animate__pulse', 'animate__infinite', 'infinite', 'btn-danger', 'opacity-50' );
            return;
        }

        let textToRead = window.getSelection().toString() || document.body.innerText;

        const excludedElement = document.querySelector( '.tagline' );
        if ( excludedElement ) {
            const excludedText = excludedElement.innerText;
            textToRead = textToRead.replace( excludedText, '' );  // Remover el texto del elemento excluido
        }

        if ( textToRead ) {
            this.utterance = new SpeechSynthesisUtterance( textToRead );
            this.utterance.voice = voices.find( voice => voice.name === document.querySelector( '#voiceSelect' ).value );
            this.utterance.rate = rateInput.value;
            this.utterance.lang = 'es-ES'; // Usar español por defecto
            this.utterance.pitch = pitchInput.value;
            this.utterance.volume = volumeInput.value;

            this.utterance.onboundary = ( event ) => {
                if ( event.name === 'word' ) {
                    //highlightWord(event.charIndex, event.charLength); // Función personalizada para resaltar
                }
            };

            this.synth.speak( this.utterance );
            this.speakElement.classList.add( 'animate__animated', 'animate__pulse', 'animate__infinite', 'infinite', 'btn-danger', 'opacity-50' );
        } else {
            alert( "No hay texto para leer." );
        }

        // Guardar las configuraciones cada vez que se empieza la lectura
        this.saveSettings();
    }
    
    /**
     * Detiene la lectura actual.
     *
     * Si se encuentra una lectura en progreso, la detiene y
     * remueve las animaciones de button.
     * 
     * @memberof VoiceReader
     */
    stopReading() {
        if ( this.synth.speaking ) {
            this.speakElement.classList.remove( 'animate__animated', 'animate__pulse', 'animate__infinite', 'infinite', 'btn-danger', 'opacity-50' );
            this.synth.cancel();
        }
    }

    /**
     * Agrega eventos de clic a los botones de pausa, play y stop
     * en el popover de configuración de la voz.
     *
     * @memberof VoiceReader
     * 
     * @example
     * const voiceReader = new VoiceReader();
     * voiceReader.addPopoverEvents();
     */
    addPopoverEvents() {
        const voices = this.synth.getVoices();

        let htmlContent = `
            <div>
                <label class="mb-3" for="voiceSelect">Voz:</label>
                <select id="voiceSelect" class="form-select mb-4 text-center text-light bg-dark">
                    ${voices.map( voice => `<option value="${voice.name}">${voice.name} (${voice.lang})</option>` ).join('')}
                </select>
                <label for="rangeVoice" class="form-label">Velocidad</label>
                <div class="d-flex justify-content-evenly">
                    <i class="bi bi-skip-backward-circle"></i>
                    <input type="range" class="form-range w-50" id="rangeVoice" min="0.1" max="2" step="0.1" value="1">
                    <i class="bi bi-skip-forward-circle"></i>
                </div>
                <label for="pitch" class="form-label">Tono</label>
                <div class="d-flex justify-content-evenly">
                    <i class="bi bi-robot"></i>
                    <input type="range" class="form-range w-50" id="pitch" min="0.1" max="2" step="0.1" value="1">
                    <i class="bi bi-person-raised-hand"></i>
                </div>
                <label for="volume" class="form-label">Volumen</label>
                <div class="d-flex justify-content-evenly">
                    <i class="bi bi-volume-down"></i>
                    <input type="range" class="form-range w-50" id="volume" min="0.1" max="1" step="0.1" value="0.5">
                    <i class="bi bi-volume-up-fill"></i>
                </div>
            </div>
        `;

        customSwal.fire({
            title: "Leer en voz alta",
            showCancelButton: false,
            showConfirmButton: false,
            showCloseButton: true,
            html: htmlContent,
            footer: '<button type="button" class="button-23" id="pause" data-title="Pausar" data-intro="Puedes pausar la reproducción de la lectura"><i class="bi bi-pause-circle-fill"></i></button><button type="button" class="button-23" id="play" data-title="Play" data-intro="Reanudarla"><i class="bi bi-play-circle-fill"></i></button><button type="button" class="button-23" id="stop" data-title="Stop" data-intro="O detenerla"><i class="bi bi-stop-circle-fill"></i></button>',
            customClass: {
                title: 'text-light',
                popup: 'bg-dark',
                container: 'text-center text-light',
                htmlContainer: 'text-center text-light',
                footer: 'd-flex justify-content-evenly text-light'
            }
        });

        const pauseIcon   = document.querySelector( 'i.bi-pause-circle-fill' );
        const resumeIcon  = document.querySelector( 'i.bi-play-circle-fill' );
        const stopIcon    = document.querySelector( 'i.bi-stop-circle-fill' );
        const voiceSelect = document.querySelector( '#voiceSelect' );
        const rateInput   = document.querySelector( '#rangeVoice' );
        const pitchInput  = document.querySelector( '#pitch' );
        const volumeInput = document.querySelector( '#volume' );

        pauseIcon.style.cursor  = 'pointer';
        resumeIcon.style.cursor = 'pointer';
        stopIcon.style.cursor   = 'pointer';

        pauseIcon.style.fontSize  = '30px';
        resumeIcon.style.fontSize = '30px';
        stopIcon.style.fontSize   = '30px';

        if ( pauseIcon && resumeIcon && stopIcon ) {
            pauseIcon.addEventListener( 'click', () => this.pauseReading() );
            resumeIcon.addEventListener( 'click', () => this.resumeReading() );
            stopIcon.addEventListener( 'click', () => this.stopReading() );
        }

        // Cargar configuraciones cuando se abre el modal
        this.loadSettings();

        // Guardar las configuraciones cuando el usuario las cambie
        voiceSelect.addEventListener( 'change', () => this.saveSettings() );
        rateInput.addEventListener( 'input', () => this.saveSettings() );
        pitchInput.addEventListener( 'input', () => this.saveSettings() );
        volumeInput.addEventListener( 'input', () => this.saveSettings() );
    }
}

