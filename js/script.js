



document.addEventListener('DOMContentLoaded', function(evt) {
    
    // для form-filter в catalog.html оживлялка output'ов
    let inputMinCost  = document.querySelector('#form_filter__min_cost_input'  );
    let outputMinCost = document.querySelector('#form_filter__min_cost_output' );
    let inputMaxCost  = document.querySelector('#form_filter__max_cost_input'  );
    let outputMaxCost = document.querySelector('#form_filter__max_cost_output' );

    if( inputMinCost && inputMaxCost && outputMinCost && outputMaxCost ) {
        inputMinCost.addEventListener('change', function(evt) {
            outputMinCost.innerHTML = evt.target.value;
        });
    
        inputMaxCost.addEventListener('change', function(evt) {
            outputMaxCost.innerHTML = evt.target.value;
        });
    }


    sliderify( document.querySelector ('.services') );
    sliderify( document.querySelector ('.promo')    );
    popuppify( document.body );            

    //убрать ugly-block, показать pretty-block в фильтре товаров на catalog.html
    let uglyRangeBlock   = document.querySelector('.form-filter-input-range-pretty');
    let prettyRangeBlock = document.querySelector('.form-filter-input-range-ugly');
    if( uglyRangeBlock && prettyRangeBlock ) {
        uglyRangeBlock.classList.toggle('none');
        prettyRangeBlock.classList.toggle('none');
    }
});









function superPopupOpener(evt) {
    evt.preventDefault();
    let element = evt.target;

    let feedbackPopupBlock  = document.querySelector('.popup-feedback');
    // find nearest 'popup' container (EXACTLY 'POPUP', not 'POPUP-bla-bla-bla' classes)
    let parent = feedbackPopupBlock;
    while ( !parent.classList.contains('popup') && parent.nodeName.toLowerCase() !== 'body' )
        parent = parent.parentNode;

    let overlayBlock        = document.getElementById('overlay');
    if (parent && overlayBlock) {
        if (parent.classList.contains("none") && parent.classList.contains("none") ) {
            parent.classList.remove("none");
            overlayBlock.classList.remove("none");
        }
    }

}

function superPopupOpener2(evt) {
    evt.preventDefault();
    let element = evt.target;

    let mapPopupBlock  = document.querySelector('.popup-map');
    // find nearest 'popup' container (EXACTLY 'POPUP', not 'POPUP-bla-bla-bla' classes)
    let parent = mapPopupBlock;
    while ( !parent.classList.contains('popup') && parent.nodeName.toLowerCase() !== 'body' )
        parent = parent.parentNode;

    let overlayBlock        = document.getElementById('overlay');
    if (parent && overlayBlock) {
        if (parent.classList.contains("none") && parent.classList.contains("none") ) {
            parent.classList.remove("none");
            overlayBlock.classList.remove("none");
        }
    }

}

function superPopupCloser(evt) {
    evt.preventDefault();
    let element = evt.target;

    // find nearest 'popup' container (EXACTLY 'POPUP', not 'POPUP-bla-bla-bla' classes)
    let parent = element;
    while ( !parent.classList.contains('popup') && parent.nodeName.toLowerCase() !== 'body' )
        parent = parent.parentNode;

    // close popup
    if (parent) {
        if ( !parent.classList.contains('none') ) {
            parent.classList.add('none');
        }
    }

    // close overlay
    let overlayBlock = document.getElementById('overlay');
    if( overlayBlock && !overlayBlock.classList.contains('none') )
        overlayBlock.classList.add('none');


}

/**
 * @param {HTMLElement} rootElement
 */
function popuppify(rootElement = document.body) {
    const POPUP_ROOT_CLS    = 'js-popuppify-popup';
    const POPUP_OPEN_CLS    = 'js-popuppify-open';
    const POPUP_CLOSE_CLS   = 'js-popuppify-close';
    const POPUP_OVERLAY_CLS = 'js-popuppify-overlay';
    const DOT               = '.';

    if( !rootElement )
        return;
    
    //find overlay
    const POPUP_OVERLAY = document.querySelector(DOT + POPUP_OVERLAY_CLS) || generateOverlay();


    //find all .popup containers inside root container
    let popups = rootElement.querySelectorAll(DOT + POPUP_ROOT_CLS);
    Array.from( popups ).forEach( popup => registerPopupHandlers(popup) );


    /**
     * @param {HTMLElement} popupRoot
    */
    function registerPopupHandlers(popupRoot) {
        if( !popupRoot )
            return;
        
        registerOpenPopupHandlers( popupRoot );
        registerClosePopupHandlers( popupRoot );
    }

    /**
     * @param {HTMLAnchorElementElement|HTMLButtonElement}  link
     * @param {HTMLElement}                                 popupRoot
    */
    function registerLinkHandler(link, popupRoot) {
        //element is not <a> or <button> - do nothing 
        if(!( link && (link instanceof HTMLAnchorElement || link instanceof HTMLButtonElement) ))
            return;

        //if element's property '-data-js-popuppify-name' is empty we can't determine class name of desired popup to be opened
        if( !( link.dataset.jsPopuppifyName) )
            return;

        link.addEventListener('click', evt => {
            evt.preventDefault();
            openPopupAndOverlay( popupRoot, POPUP_OVERLAY );
        });
    }

    function registerCloseButtonHandler(closeBtn) {
        let element = closeBtn;

        let parent = element;
        while ( !parent.classList.contains(POPUP_ROOT_CLS)  )
            parent = parent.parentNode;

        closeBtn.addEventListener('click', evt => {
            closePopupAndOverlay( parent, POPUP_OVERLAY );
        });
    }

    function closePopupAndOverlay( popupRoot, overlay ) {
        if( popupRoot )
            popupRoot.classList.add('none');
        
        if( overlay )
            overlay.classList.add('none');
    }

    function openPopupAndOverlay( popupRoot, overlay ) {
        if( popupRoot )
            popupRoot.classList.remove('none');
        
        if( overlay )
            overlay.classList.remove('none');
    }

    function registerEscKeyboardEvent( popupRoot ) {
        document.addEventListener('keydown', evt => {
            if ( !popupRoot.classList.contains('none') ) {
                let keycode = (typeof evt.keyCode !='undefined' && evt.keyCode) ? evt.keyCode : evt.which;
                if (keycode === 27) {
                    closePopupAndOverlay( popupRoot, POPUP_OVERLAY );
                };
            }
        });
    }


    /**
     * @param {HTMLElement} popupRoot 
    */
    function registerClosePopupHandlers( popupRoot ) {
        closeButtons = popupRoot.querySelectorAll(DOT + POPUP_CLOSE_CLS);
        Array.from( closeButtons ).forEach( closeBtn => registerCloseButtonHandler(closeBtn) );

        registerEscKeyboardEvent( popupRoot );
    }

    function registerOpenPopupHandlers( popupRoot ) {
        let dataAttr = popupRoot.dataset.jsPopuppifyName;
        if( dataAttr )
            Array.from( document.querySelectorAll(DOT + POPUP_OPEN_CLS) )
                 .filter( link => link.dataset.jsPopuppifyName == dataAttr )
                 .forEach( link => registerLinkHandler(link, popupRoot) );
    }


    function generateOverlay() {
        //TODO: generate overlay HTML markup + css, add to <body>, return link to element
    }
}



/**
 * @param {HTMLElement} sliderContainer 
 */
function sliderify( sliderContainer ) { 
    const SLIDER_CONTAINER_CLS_NAME = 'js-sliderify-slider';
    const SLIDER_CONTROL_CLS_NAME   = 'js-sliderify-control';
    const SLIDER_SLIDE_CLS_NAME     = 'js-sliderify-slide';
    const DOT                       = '.';
    const ACTIVE_STATE              = '_active';

    // slider - div element (or section or whatever html5 div-like) 
    // with class .js-slider
    if(    !(sliderContainer                         &&
             sliderContainer instanceof(HTMLElement) && 
             sliderContainer.classList.contains(SLIDER_CONTAINER_CLS_NAME) 
    ))  
        return;
    
    // slider has controls, when you click on them - slider changes active slide   
    const CONTROLS = sliderContainer.querySelectorAll(DOT + SLIDER_CONTROL_CLS_NAME);
    if( !CONTROLS.length ) 
        return;

    // slider should definitely have slides, otherwise nothing to show
    const SLIDES = sliderContainer.querySelectorAll(DOT + SLIDER_SLIDE_CLS_NAME);
    if( !SLIDES.length )
        return;

    // here goes all "magic"
    registerControlsHandlers( CONTROLS );



    /**
     * @param {NodeList} controls
     * @param {string}   evtName 
     */
    function registerControlsHandlers(controls, evtName='click') {
        Array.from( controls ).forEach( control => {
            registerControlHandler( control, evtName ); 
        });
    }

    /**
     * 
     * @param {HTMLElement} control 
     * @param {string}      evtName
     */
    function registerControlHandler( control, evtName ) {

        control.addEventListener(evtName, (evt) => {
            evt.preventDefault();

            let result = findRootClassPrefixForElement( control, sliderContainer );
            if( !result ) 
                return; //didn't find prefixed classes like slider-item or greetings-item or whatever-whatever

            let activeItem = result.element;
            if( activeItem.classList.contains(result.prefixedClass + ACTIVE_STATE) )
                return;

            let controlContainersAndSlides = Array.from( sliderContainer.querySelectorAll(DOT + result.prefixedClass) )
                                                  .concat( ...Array.from( SLIDES) ); 
            removeActiveState( controlContainersAndSlides );

            activeItem.classList.add( result.prefixedClass + ACTIVE_STATE );

            let activeItemPosition = findElementSequenceNumber(activeItem, result.prefixedClass);
            let activeSlide = SLIDES.item(activeItemPosition);
            activeSlideClass = findRootClassPrefixForElement(activeSlide, sliderContainer).prefixedClass;
            activeSlide.classList.add( activeSlideClass  + ACTIVE_STATE );
        });

    }

    /**
     * @param {HTMLElement} element 
     * @param {string} inactiveClassName 
     */
    function findElementSequenceNumber(element, inactiveClassName) {
         
        let array = Array.from( element.parentElement.querySelectorAll(DOT + inactiveClassName) );
        for (let index = 0; index < array.length; index++) {
            if (element == array[index] )
                return index;
        }
        
        return;
    }
 
    /**
    * @typedef  {Object} ObjectAndPrefix
    * @property {HTMLElement} element html element
    * @property {string} prefixedClass prefixed class found in one of element's classList values
    */
    /** 
     * 
     * 
     * @param {HTMLElement} element 
     * @param {HTMLElement} root 
     * @param {string}      delimiter 
     * @returns {ObjectAndPrefix} result
     */
    function findRootClassPrefixForElement(element, root, delimiter='-') {
        let possiblePrefixes =  Array.from(root.classList).filter( element => element != SLIDER_CONTAINER_CLS_NAME );
        let current = element;
        // usually goes first in classes list, i.e. use possiblePrefixes[0]
        do {
            let clsList = filterClassListByRegex(element.classList, possiblePrefixes[0] + delimiter) 

            if( clsList.length ) {
                return { element: element, prefixedClass: clsList[0] };            
            }
            element = element.parentNode;
        }
        while (element != root);
        
        return null;
    }


    function removeActiveState(elements) {
        for (const element of elements) {
            let activeClasses = filterClassListByRegex(element.classList, ACTIVE_STATE);
            if( activeClasses.length ) {
                for (const activeClass of activeClasses) {
                    element.classList.remove(activeClass);    
                }
            }
        }
    }
    
    /**
     * 
     * @param {DOMTokenList} clsList 
     * @param {string} regexString 
     * @returns {Array<string>} filtered classList
     */
    function filterClassListByRegex(clsList, regexString) {
        let regex = new RegExp(regexString);
        return Array.from(clsList).filter( cls => regex.test( cls ) );
    }
    
}





