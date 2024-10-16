/**
 * UIInitializer.js
 *
 * Clase para inicializar elementos visuales e interactivos en la interfaz, como tooltips, popovers, 
 * y ventanas modales personalizadas utilizando Bootstrap y SweetAlert2.
 *
 * Funcionalidades:
 * - Inicializar tooltips de Bootstrap
 * - Inicializar popovers de Bootstrap
 * - Configuración predeterminada para ventanas modales (SweetAlert2)
 * - Configuración de Toasts (SweetAlert2)
 *
 * Requiere:
 * - Bootstrap para tooltips y popovers
 * - SweetAlert2 para modales y notificaciones toast
 *
 * Autor: [Francisco ELis]
 * Fecha: [02/10/2024]
 */

/**
 * Clase para inicializar elementos visuales
 *
 * @class VisualElements
 */
class VisualElements {
    /**
     * Constructor de la clase VisualElements.
     * 
     * Inicializa los componentes visuales de Bootstrap (tooltips y popovers)
     * y la configuración de SweetAlert.
     */
    constructor() {

        this.initTooltips();
        this.initPopovers();
    }

    /**
     * Inicializa los tooltips de Bootstrap.
     * 
     * Busca en el DOM los elementos que tengan el atributo data-bs-toggle="tooltip"
     * y los inicializa como tooltips de Bootstrap.
     * 
     * @memberof VisualElements
     */
    initTooltips() {
        // Inicializar tooltip de Bootstrap
        const tooltipTriggerList = document.querySelectorAll( '[data-bs-toggle="tooltip"]' );
        this.tooltipList = [...tooltipTriggerList].map( tooltipTriggerEl => new bootstrap.Tooltip( tooltipTriggerEl ) );
    }

    /**
     * Inicializa los popover de Bootstrap.
     * 
     * Busca en el DOM los elementos que tengan el atributo data-bs-toggle="popover"
     * y los inicializa como popover de Bootstrap.
     * 
     * @memberof VisualElements
     */
    initPopovers() {
        // Inicializar popover de Bootstrap
        const popoverTriggerList = document.querySelectorAll( '[data-bs-toggle="popover"]' );
        this.popoverList = [...popoverTriggerList].map( popoverTriggerEl => new bootstrap.Popover( popoverTriggerEl ) );
    }

    /**
     * Inicializa la configuración predeterminada de SweetAlert y ToastSweetAlert.
     * 
     * La configuración predeterminada de SweetAlert se establece en:
     * - customClass.title: 'modal-title'
     * - customClass.confirmButton: 'btn btn-light'
     * - customClass.cancelButton: 'btn btn-secondary'
     * - customClass.title: 'text-light'
     * - customClass.inputLabel: 'text-light'
     * - customClass.popup: 'bg-dark'
     * - customClass.timerProgressBar: 'bg-success'
     * - customClass.input: 'text-center text-light'
     * - customClass.container: 'text-center text-light'
     * - customClass.htmlContainer: 'text-center text-light'
     * 
     * La configuración predeterminada de ToastSweetAlert se establece en:
     * - toast: true
     * - position: "top-start"
     * - showConfirmButton: false
     * - timer: 3000
     * - timerProgressBar: true
     * - didOpen: (toast) => {
     *   toast.onmouseenter = Swal.stopTimer;
     *   toast.onmouseleave = Swal.resumeTimer;
     * }
     * 
     * @memberof VisualElements
     */
    initSweetAlert() {
        // Configuración de SweetAlert predeterminado
        const customSwal = Swal.mixin({
            customClass: {
                title: 'modal-title',
                confirmButton: 'btn btn-light',
                cancelButton: 'btn btn-secondary',
                title: 'text-light',
                inputLabel: 'text-light',
                popup: 'bg-dark',
                timerProgressBar: 'bg-success',
                input: 'text-center text-light',
                container: 'text-center text-light',
                htmlContainer: 'text-center text-light'
            },
        });

        // Configuración de ToastSweetAlert predeterminado
        const Toast = Swal.mixin({
            toast: true,
            position: "top-start",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: ( toast ) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
    }
}

window.VisualElements = VisualElements;
