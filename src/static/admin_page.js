$(document).ready(function() {
    namespace = '';

    var socket = io(null, {rememberTransport: false, tryTransportsOnConnectTimeout: false});
    var bids_data = $('#bids_data');

    var llog = $('#log');
    var history = $('#history');

// socket registration handlers -->
    socket.on('connect', function() {
        socket.emit('admin_connect');
    });

    socket.on('admin_connected', function(ps) {
        for (var i in ps.participants) {
            var p = ps.participants[i];
            $('#participants').append('<br>' + $('<div/>').text('Participant #' + p.id + ', ' + p.name + ': ' + p.role).html());
        }
        for (var i in ps.buyers) {
            var p = ps.buyers[i];
            $('#buyers').append('<br>' + $('<div/>').text('id#' + p.id + ', ' + p.name + ': ' + p.role).html());
        }
        for (var i in ps.sellers) {
            var p = ps.sellers[i];
            $('#sellers').append('<br>' + $('<div/>').text('id#' + p.id + ', ' + p.name + ': ' + p.role).html());
        }

        var bids_length = Object.keys(ps.bids).length;
        var asks_length = Object.keys(ps.asks).length;
        var max_length = Math.max(bids_length, asks_length);

        bids_data.empty();
        bids_data.append('<tr><th>Bid</th><th>Ask</th></tr>');
        for (var i = 0; i < max_length; i++) {
            var bid_string = '<td></td>';
            if (i < bids_length) {
                bid_string = '<td>' + ps.bids[i][0] + ' shares at ' + ps.bids[i][1] + ' per lot </td>';
            }
            var ask_string = '<td></td>';
            if (i < asks_length) {
                ask_string = '<td>' + ps.asks[i][0] + ' shares at ' + ps.asks[i][1] + ' per lot </td>';
            }
            var table_row = '<tr>' + bid_string + ask_string + '</tr>';
            bids_data.append(table_row);
        }


    });

    socket.on('participant_registered', function(p) {
        $('#participants').append('<br>' + $('<div/>').text('New Participant registered #' + p.id + ', ' + p.name + ': ' + p.role).html());
    });

    socket.on('participant_reconnected', function(p) {
        $('#participants').append('<br>' + $('<div/>').text('Reconnected #' + p.id + ', ' + p.name + ': ' + p.role).html());
    });

    socket.on('participant_disconnected', function(p) {
        $('#participants').append('<br>' + $('<div/>').text('! Logged out #' + p.id + ', ' + p.name + ': ' + p.role).html());
    });

    socket.on('participants_reset', function(p) {
        $('#participants').empty();
        $('#buyers').empty();
        $('#sellers').empty();
    });
// <-- socket registration handlers


// form handlers -->
    $('form#reset').submit(function(event) {
        socket.emit('reset_participants');
        return false;
    });

    $('form#reset_bids').submit(function(event) {
        socket.emit('reset_bids');
        return false;
    });

// <-- form handlers

});