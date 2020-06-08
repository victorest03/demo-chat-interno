$(function () {
    navigator.geolocation.getCurrentPosition(function(position) {
        loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
    });
    setInterval(function () {
        navigator.geolocation.getCurrentPosition(function(position) {
            loadWeather(position.coords.latitude+','+position.coords.longitude); //load weather using your lat/lng coordinates
        });
    }, 600000);

    var dialog = document.querySelector('dialog');
    if (! dialog.showModal) {
        dialogPolyfill.registerDialog(dialog);
    }
    $('.show-modal').on('click', function() {
        dialog.showModal();
    });
    $('.close').on('click', function() {
        dialog.close();
    });

    $('#micsac--btn--send').on('click', function() {
        var txtmsg = $('#txtMsg');
        var listmsg = $('#list--msg');
        var html = "<li class='mdl-list__item mdl-list__item--two-line mi'> \
                        <span class='mdl-list__item-primary-content'> \
                            <span>"+ txtmsg.val() +"</span> \
                            <span class='mdl-list__item-sub-title'>Enviado "+ dateFormat(new Date(), "h:MM tt") +"</span> \
                        </span> \
                    </li>"
        listmsg.append(html);
        txtmsg.val('');
    });

    
})

function loadWeather(location, woeid) {
    $.simpleWeather({
        location: location,
        woeid: woeid,
        unit: 'c',
        success: function(weather) {
            $("#mdl-card__weather").css('background-image', 'url("' + weather.image + '")');
            $("#mdl-card__weather").css('background-repeat', 'no-repeat');
            html = '<h2>'+weather.temp+'&deg;'+weather.units.temp+'</h2>';
            html += '<ul><li>'+weather.city+', '+weather.region+'</li>';
            html += '<li><strong>Humedad</strong>: '+weather.humidity+' <strong>Presion</strong>: '+weather.pressure; + '</li>'
            html += '<li><strong>Ult. Actual.</strong>: '+weather.updated+'</li></ul>';
            $("#mdl-card__weather").html(html);
        },
        error: function(error) {
            $("#weather").html('<p>'+error+'</p>');
        }
    });
}