document.addEventListener('DOMContentLoaded', function(evt) {   

    sliderify( document.querySelector ('.services') );
    sliderify( document.querySelector ('.promo'   ) );

    popuppify(  document.body, 
                { 
                    animation: {
                        fadeInClasses: ['animation-fade-in'],
                        fadeOutClasses: ['animation-fade-out'],
                        animationDuration: 0.1 
                        },
                    memorizeFormInputsValues: true
                } 
    );            


    //убрать ugly-block, показать pretty-block в фильтре товаров на catalog.html
    let uglyRangeBlock   = document.querySelector('.form-filter-input-range-pretty');
    let prettyRangeBlock = document.querySelector('.form-filter-input-range-ugly');
    if( uglyRangeBlock && prettyRangeBlock ) {
        uglyRangeBlock.classList.toggle('none');
        prettyRangeBlock.classList.toggle('none');
    }

});



/**
 * @param {HTMLElement} rootElement
 */
function popuppify(rootElement = document.body, options = {}) {
    const POPUP_ROOT_CLS    = 'js-popuppify-popup';
    const POPUP_OPEN_CLS    = 'js-popuppify-open';
    const POPUP_CLOSE_CLS   = 'js-popuppify-close';
    const POPUP_OVERLAY_CLS = 'js-popuppify-overlay';
    const DOT               = '.';

    if( !rootElement )
    return;
    
    //find overlay
    const POPUP_OVERLAY = document.querySelector(DOT + POPUP_OVERLAY_CLS) || generateOverlay();
    //copy options to constant
    const POPUP_OPTIONS = options;

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
        registerPopupFormsHandlers( popupRoot );
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


    function closePopupAndOverlay( popupRoot, overlay ) {
        if( popupRoot ) {
            if( options && options.animation && options.animation.fadeOutClasses )
            options.animation.fadeOutClasses.forEach( cls => popupRoot.classList.add(cls) );

            let animationDuration = POPUP_OPTIONS.animation.animationDuration*1000 || 1000;
            setTimeout( () => { popupRoot.classList.add('none') } , animationDuration);
        }
        
        if( overlay ) {
            overlay.classList.add('none');
        }
    }

    function openPopupAndOverlay( popupRoot, overlay ) {
        if( popupRoot )
            if( options && options.animation && options.animation.fadeOutClasses )
                options.animation.fadeOutClasses.forEach( cls => popupRoot.classList.remove(cls) );
            if( options && options.animation && options.animation.fadeInClasses )
                options.animation.fadeInClasses.forEach( cls => popupRoot.classList.add(cls) );

            popupRoot.classList.remove('none');
        
        if( overlay )
            overlay.classList.remove('none');
    }


    /**
     * @param {HTMLElement} popupRoot 
    */
    function registerClosePopupHandlers( popupRoot ) {
        closeButtons = popupRoot.querySelectorAll(DOT + POPUP_CLOSE_CLS);
        Array.from( closeButtons ).forEach( closeBtn => registerCloseButtonHandler(closeBtn) );

        registerEscKeyboardEvent( popupRoot );
    }

    /**
     * @param {HTMLElement} popupRoot 
    */
    function registerOpenPopupHandlers( popupRoot ) {
        let dataAttr = popupRoot.dataset.jsPopuppifyName;
        if( dataAttr )
            Array.from( document.querySelectorAll(DOT + POPUP_OPEN_CLS) )
                 .filter( link => link.dataset.jsPopuppifyName == dataAttr )
                 .forEach( link => registerLinkHandler(link, popupRoot) );
    }

    /**
     * @param {HTMLElement} popupRoot 
    */
    function registerPopupFormsHandlers( popupRoot ) {
        if ( !( POPUP_OPTIONS && POPUP_OPTIONS.memorizeFormInputsValues) )
            return;
        
        let forms = findForms( popupRoot );
        if( !forms.length )
            return;
        
        forms.forEach( form => {
            formMemorizeInputValuesInLocalStorage( form );
            addAttributesChangeObsever( popupRoot );
            changeOnSubmitBehaviour( form, popupRoot );
        });


        function changeOnSubmitBehaviour(form, popupRoot) {
            form.addEventListener('submit', evt => {
                evt.preventDefault();
                fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ hello: 'AND', die: '111' })
                }
                ).then(response => { console.log( response) ;flushFormControlsAndLocalStorageValues(form); });
            });
        }

        /**
         * watch for class changes (popup closes and opens by adding/removing classes)
         */
        function addAttributesChangeObsever( popupRoot ) {
            // create an observer instance
            let observer = new MutationObserver(function (mutations) {
                let mutationsArray = Array.from(mutations).filter(mutation => 
                        mutation.type == 'attributes' &&
                        mutation.attributeName == "class" &&
                        !mutation.target.classList.contains('none') &&
                        mutation.target.getBoundingClientRect().height == 0 );
                
                //form opening moment catched
                if( !mutationsArray.length ) {
                    forms.forEach( form => restoreControlsValuesFromLocalStorage(form) );
                }

            });

            // configuration of the observer:
            let config = {
                attributes: true,
                childList: false,
                characterData: false
            };

            // pass in the target node, as well as the observer options
            observer.observe(popupRoot, config);
        }

        /**
         * @param {HTMLFormElement} form 
         */
        function formMemorizeInputValuesInLocalStorage( form ) {
            // no fallback to cookies
            if (!localStorage)
                return;

            let controls = searchInputControls(form);
            if (!controls.length)
                return;

            //prepare Utils
            if (!form.Utils)
                initializeIdsGenerator(form);

            controls.forEach(control => {
                checkGenerateId(control);
                control.addEventListener('change', evt => {
                    localStorage.setItem(evt.target.id, evt.target.value);
                });
            });


            /**
            * @param {HTMLElement} control 
            */
            function checkGenerateId(control) {
                if (!control.id)
                    control.id = form.Utils.text.getRandomStrStrict(20);
            }

            /**
             * initialize library and add it to root container
             */
            function initializeIdsGenerator(root) {
                var _data = {};
                _data.symbols = {};

                var module = {};

                module.text = {

                    getRandomHex: function () {
                        return (Math.floor(Math.random() * 0x100000) % 0x10000).toString(16);
                    },

                    getRandomHexFixed: function () {
                        let _temp = this.getRandomHex();
                        let _zeros = 4 - _temp.length;

                        for (let i = 0; i < _zeros; i++)
                            _temp = "0" + _temp;

                        return _temp;
                    },

                    getUnicodeSymbol: function () {
                        return String.fromCharCode(this.getRandomHexFixed());
                    },

                    /**
                     * @param {string} symb  - Symbol to check
                     * @param {RegExp} regex - Symbol should satisfy the conditions in regex
                     */
                    satisfyRestrictions: function (symb, regex = /[a-zA-Z0-9_]/) {
                        return symb ? regex.test(symb) : false;
                    },

                    /**
                     * @param {string} str        - String to check
                     * @param {RegExpp[]} regexes - String should satisfy all the conditions listed in given Regexes array
                     */
                    satisfyRestrictionsStrict: function (
                        str,
                        regexes = [/[a-z]/, /[A-Z]/, /[0-9]/, /\_/]
                    ) {
                        return regexes.reduce((prev, curr, inx) => {
                            return prev && curr.test(str);
                        }, true);
                    },

                    getUnicodeSymbolNoRepeats: function () {
                        let current;
                        do { current = this.getUnicodeSymbol(); }
                        while (current == _data.symbols.last);
                        _data.symbols.last = current;
                        return current;
                    },

                    getUnicodeSymbolNoRepeatsFiltered: function (filterRegex) {
                        let current;
                        do { current = this.getUnicodeSymbol(); }
                        while (!this.satisfyRestrictions(current, filterRegex) || current == _data.symbols.last);
                        _data.symbols.last = current;
                        return current;
                    },

                    getRandomStr: function (len) {
                        if (!len) return;
                        let result = [];

                        while (len--) {
                            result.push(this.getUnicodeSymbolNoRepeatsFiltered());
                        }

                        return result.join('');
                    },

                    getRandomStrStrict: function (len) {
                        if (!len) return;
                        let result = "";

                        do { result = this.getRandomStr(len); }
                        while (!this.satisfyRestrictionsStrict(result));

                        return result;
                    },

                    boldify: function (text) {
                        return '<b>' + text + '</b>';
                    }
                };

                if (!root.Utils)
                    root.Utils = module;
            }
        }

        /**
         * @param {HTMLFormElement} form 
         */
        function restoreControlsValuesFromLocalStorage( form ) {
            // no fallback to cookies
            if (!localStorage)
                return;

            let controls = searchInputControls(form);
            if (!controls.length)
                return; 
                
            controls.forEach( control => { 
                control.value = localStorage.getItem( control.id );
            });
        }


        function flushFormControlsAndLocalStorageValues( form ) {
            // no fallback to cookies
            if (!localStorage)
                return;

            let controls = searchInputControls(form);
            if (!controls.length)
                return; 
                
            controls.forEach( control => { 
                control.value = '';
                localStorage.setItem( control.id, control.value );
            });
        }

        /**
         * @param {HTMLFormElement} form 
         */
        function searchInputControls(form) {
            return Array.from( form.elements )
                        .filter( element => !(element.attributes.type && element.attributes.type.nodeValue == 'submit') );
        }

        function getJsonDataFromInputControls( form ) {
            let result;
            
            let controls = searchInputControls(form);
            if (!controls.length)
                return; 

            controls.forEach( control => {
                //TODO: get json from controls
            });

        }
    }


    function generateOverlay() {
        //TODO: generate overlay HTML markup + css, add to <body>, return link to element
    }

    /**
     * @param {HTMLElement} rootElement 
     */
    function findForms( rootElement ) {
        return Array.from( rootElement.querySelectorAll('form') );
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

/**
 * @description callback for google maps <script>
 * @param {string} selector 
 */
function gMapsInitialize( selector='.popup-map-container' ) {
    
    findMapContainers( selector ).forEach( mapContainer => {

        // mapContainer.style.height = mapContainer.getBoundingClientRect().height;
        // findAndHideImages( mapContainer );
        let mskPosition = {lat: 55.687126, lng: 37.529640};
        let gMap = new google.maps.Map( mapContainer, {
                                        center: mskPosition,
                                        zoom: 17,
                                        zoomControl: false,
                                        streetViewControl: false,
                                        fullscreenControl: false
                                    });
        let marker = new google.maps.Marker({position: mskPosition, map: gMap});
    });
    

    function findMapContainers(selector) {
        return Array.from( document.querySelectorAll( selector ) );
    }

    function findAndHideImages( root ) {
        let gmapsFallbackImages = root.querySelectorAll('img');
        Array.from(gmapsFallbackImages).forEach( img => img.style.display = 'none');
    }
}

