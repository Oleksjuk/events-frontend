const apiUrl = 'https://dreadful-frederique-exampleprojects-70ac9c7a.koyeb.app';
//const apiUrl = 'http://localhost:3000';

$(document).ready(function(){

    $.ajax({
        url: apiUrl + '/events/get?offset=0&amount=12',
        method: "GET",
        success: function(data) {
            initEvents(data);
        },
        error: function(error) {
            alert(error);
            console.log(error);
        }
    });

    $(window).scroll(function() {
        let scrollTop = $(window).scrollTop();
        let documentHeight = $(document).height();
        let windowHeight = $(window).height();
        let scrollBottom = documentHeight - (scrollTop + windowHeight);

        if (scrollBottom < 100) {
            loadMoreEvents();
        }
    });
  
});

let isLoading = false;
let offset = 12;
let amount = 12;

function loadMoreEvents() {
    if (!isLoading) {
        isLoading = true;
        
        $.get(apiUrl + '/events/get', { offset: offset, amount: amount })
            .done(function(data) {
                initEvents(data); 
                offset += amount;
            })
            .fail(function() {
                console.error('Failed to load more items.');
            })
            .always(function() {
                isLoading = false;
            });
    }
}

function initEvents(events) {

    $.get('templates/event.html', function(template) {
    
        var templateEvent = $(template).filter('#item-template').html();

        var rendered = Mustache.render(templateEvent, {events: events});

        $('#events').append(rendered);
    });
}

function openRegistrationForm(eventId) {
    $('#exampleModal').modal('show');
    $('#eventId').val(eventId);
}

function submitRegistration() {
    let registration = {};
    registration.eventId = parseInt($('#eventId').val());
    registration.fullName = $('#fullName').val();
    registration.email = $('#email').val();
    registration.dateOfBirth = $('#dateBirth').val();
    registration.source = parseInt($('input[name="source"]:checked').val());

    $.ajax({
        url: apiUrl +'/registration/create',
        method: "POST",
        data: JSON.stringify(registration),
        contentType: "application/json; charset=utf-8",
        success: function(data) {
            alert("Success registration");
            closeRegistrationForm();
        },
        error: function(error) {
            alert(error);
        }
    });
}

function closeRegistrationForm() {
    $('#exampleModal').modal('hide')
}

function viewParticipantsForm(eventId, title) {
    $.ajax({
        url: apiUrl + '/registration/get?eventId='+eventId,
        method: "GET",
        success: function(data) {
            initPartisipants(data);
        },
        error: function(error) {
            alert(error);
            console.log(error);
        }
    });

    $("#event-participants").text('"'+title+'" ' + "participants");

    $('#exampleModalLong').modal('show');
}

function initPartisipants(participants) {

    $.get('templates/participant.html', function(template) {
    
        var templateParticipant = $(template).filter('#item-template').html();

        var rendered = Mustache.render(templateParticipant, {participants: participants});

        $('#participants').html(rendered);
    });
}

function closePartisipantsForm() {
    $('#exampleModalLong').modal('hide');
}