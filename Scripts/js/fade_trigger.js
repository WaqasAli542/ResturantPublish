/* Fade Trigger */

$(function(){ 
    $('.js-fade').click(function(){ 
        $('.st-container').addClass('fadein');
        setTimeout(function () { 
            $('.st-container').removeClass('fadein');
        }, 1000);
    }); 
});