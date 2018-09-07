



document.addEventListener('DOMContentLoaded', function(evt) {
    
    // спагетти



    // для form-filter в catalog.html оживлялка output'ов
    let inputMinCost  = document.querySelector('#form_filter__min_cost_input'  );
    let outputMinCost = document.querySelector('#form_filter__min_cost_output' );
    let inputMaxCost  = document.querySelector('#form_filter__max_cost_input'  );
    let outputMaxCost = document.querySelector('#form_filter__max_cost_output' );

    if( inputMinCost && inputMaxCost ) {
        inputMinCost.addEventListener('change', function(evt) {
            outputMinCost.innerHTML = evt.target.value;
        });
    
        inputMaxCost.addEventListener('change', function(evt) {
            outputMaxCost.innerHTML = evt.target.value;
        });
    }



    // для .services переключалка слайдера
    let sliderServices = document.querySelector('.services');

    Array.from( document.querySelectorAll('.services .btn-animated') )
         .forEach( button => 
                   button.addEventListener('click', 
                                           evt => { superListener(evt) } 
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