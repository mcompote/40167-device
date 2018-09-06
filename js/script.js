



document.addEventListener('DOMContentLoaded', function(evt) {
    


    // для form-filter в catalog.html оживлялка output'ов
    let inputMinCost  = document.querySelector('#form_filter__min_cost_input'  );
    let outputMinCost = document.querySelector('#form_filter__min_cost_output' );
    let inputMaxCost  = document.querySelector('#form_filter__max_cost_input'  );
    let outputMaxCost = document.querySelector('#form_filter__max_cost_output' );

    inputMinCost.addEventListener('change', function(evt) {
        outputMinCost.innerHTML = evt.target.value;
    });

    inputMaxCost.addEventListener('change', function(evt) {
        outputMaxCost.innerHTML = evt.target.value;
    });


});

