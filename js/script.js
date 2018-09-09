



document.addEventListener('DOMContentLoaded', function(evt) {
    
    // спагетти-код



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



    // для .services переключалка слайдера
    let sliderServices = document.querySelector('.services');
    if( sliderServices )
        Array.from( sliderServices.querySelectorAll('.btn-animated') )
            .forEach( button => 
                    button.addEventListener('click', 
                                            evt => { superListener(evt) } 
                                            ) 
                    );  
                

    //для .promo-slider переключалка слайдов
    let sliderPromo = document.querySelector('.promo-slider');
    if( sliderPromo )
        Array.from(sliderPromo.querySelectorAll('.btn-slide-changer'))
            .forEach(button =>
                    button.addEventListener('click',
                                            evt => { superListener2(evt) }
                                            )
            );  
    

    // показать каталог товаров в header'е
    let goodsCatalogueBtn = document.querySelector('.header-nav-item-link.plus-sign');
    if ( goodsCatalogueBtn )
        goodsCatalogueBtn.addEventListener( 'click', superListener3 );


    //убрать ugly-block, показать pretty-block в фильтре товаров на catalog.html
    let uglyRangeBlock   = document.querySelector('.form-filter-input-range-pretty');
    let prettyRangeBlock = document.querySelector('.form-filter-input-range-ugly');
    if( uglyRangeBlock && prettyRangeBlock ) {
        uglyRangeBlock.classList.toggle('none');
        prettyRangeBlock.classList.toggle('none');
    }
    
    //кнопка "Напишите Нам"
    let feedbackPopupLink = document.getElementById('js-popup-opener-feedback');
    if( feedbackPopupLink )
        feedbackPopupLink.addEventListener('click', superPopupOpener );


    //закрывашки popup'ов
    let popupCloseBtns = document.querySelectorAll('.btn-close-popup');
    if( popupCloseBtns )
        Array.from( popupCloseBtns )
             .forEach(btn =>
                      btn.addEventListener('click',
                                            evt => { superPopupCloser(evt) }
                                          ) 
        ); 
        
        
});





function superListener(evt) {
    evt.preventDefault();
    let element = evt.target;
    let dot = '.';

    if( element.parentNode.className.includes('active') )
        return;

    //  find <div.services>
    let servicesBlock = element;
    while ( servicesBlock.className !== 'services' && servicesBlock.nodeName.toLowerCase() !== 'body' )
        servicesBlock = servicesBlock.parentNode;
    
    Array.from( servicesBlock.querySelectorAll(dot + 'services-item_active') ).forEach( child => {
            console.log( child );
            child.classList.toggle('services-item_active');
    });
    Array.from( servicesBlock.querySelectorAll( dot + 'service-description-box_active') ).forEach( child => {
            child.classList.toggle('service-description-box_active');
    });


    element.parentNode.classList.toggle('services-item_active');
    
    let nth = 1;
    let lSibling = element.parentNode.previousElementSibling;
    while( lSibling !== null ) {
        nth++;
        lSibling = lSibling.previousElementSibling;
    }

    servicesBlock.querySelector(`${dot}service-description-box:nth-of-type(${nth})`)
                 .classList
                 .toggle('service-description-box_active');
}

function superListener2(evt) {
    evt.preventDefault();
    let element = evt.target;
    let dot = '.';

    if( element.parentNode.className.includes('active') )
        return;

    //  find <section class="promo-slider">
    let promoBlock = element;
    while ( promoBlock.className !== 'promo-slider' && promoBlock.nodeName.toLowerCase() !== 'body' )
        promoBlock = promoBlock.parentNode;
    
    Array.from( promoBlock.querySelectorAll(dot + 'promo-item_active') ).forEach( child => {
            console.log( child );
            child.classList.toggle('promo-item_active');
    });
    Array.from( promoBlock.querySelectorAll( dot + 'slider-navigation-item_active') ).forEach( child => {
            child.classList.toggle('slider-navigation-item_active');
    });


    element.parentNode.classList.toggle('slider-navigation-item_active');
    
    let nth = 1;
    let lSibling = element.parentNode.previousElementSibling;
    while( lSibling !== null ) {
        nth++;
        lSibling = lSibling.previousElementSibling;
    }

    promoBlock.querySelector(`${dot}promo-item:nth-of-type(${nth})`)
                 .classList
                 .toggle('promo-item_active');
}

function superListener3(evt) {
    evt.preventDefault();
    let element = evt.target;
    let dot = '.';


    let cataloguePopupBlock = document.querySelector('.header-catalogue-list');
    if (cataloguePopupBlock ) 
        cataloguePopupBlock.style.display = ( cataloguePopupBlock.style.display === "none" ) ? 
                                            "flex" :
                                            "none";

}


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