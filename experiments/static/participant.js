$(document).ready(function() {
    var socket = io(null, {rememberTransport: false, tryTransportsOnConnectTimeout: false});

    // login if has cookie
    var user = {};
    var bid = {};
    var ask = {};
    var id = localStorage.getItem('id');

    // payoff info
    var expensive_amount = 0
    var expensive_multiplier = 0.0
    var quasi_expensive_amount = 0
    var quasi_expensive_multiplier = 0.0
    var threshold_amount = 0

// jquery vars -->
    var u_name = $('#p_name');
    var u_role = $('#p_role');
    var u_goods = $('#p_goods');
    var u_funds = $('#p_funds');

    var bid_amount = $('#bid_amount');
    var bid_price = $('#bid_price');
    var bid_price_lot = $('#bid_price_lot');

    var ask_amount = $('#ask_amount');
    var ask_price = $('#ask_price');
    var ask_price_lot = $('#ask_price_lot');

    var your_bid_amount = $('#your_bid_amount');
    var your_bid_price = $('#your_bid_price');
    var your_bid_price_lot = $('#your_bid_price_lot');

    var your_ask_amount = $('#your_ask_amount');
    var your_ask_price = $('#your_ask_price');
    var your_ask_price_lot = $('#your_ask_price_lot');


    var bids_data = $('#bids_data');
    var double_auction_results = $('#double_auction_results');
    var clearing_house = $('#clearing_house');
    double_auction_results.hide();
    clearing_house.hide();
// <-- jquery vars

    if (id) {
        socket.emit('login_existing', {id: id,
                                       name: localStorage.getItem('name') || ''
        });
        $('#register').hide();
    }

    $('#participant').hide();
    $('#double_auction').hide();

    // registered/logged in data
    socket.on('user_info', function(p) {
        localStorage.setItem('id', p.id);
        localStorage.setItem('name', p.name);
        u_name.text('Participant #' + p.id + ', ' + p.name).html();
        u_role.text(p.role).html();
        u_goods.text(p.goods).html();
        u_funds.text(p.funds).html();
        $('#register').hide();
        $('#participant').show();
        user = p;
        if (user.role == 'seller') {
            expensive_amount = 100;
            expensive_multiplier = 0.65;
            quasi_expensive_amount = 200;
            quasi_expensive_multiplier = 0.2;
            threshold_amount = 300;
            $('#initial_funds_subtracted').text('105').html();
        }
        if (user.role == 'buyer') {
            expensive_amount = 200;
            expensive_multiplier = 1.75;
            quasi_expensive_amount = 300;
            quasi_expensive_multiplier = 0.2;
            threshold_amount = 500;
            $('#initial_funds_subtracted').text('10000').html();
        }
        $('#expensive_multiplier').text(expensive_multiplier).html();
        $('#expensive_amount').text(expensive_amount).html();
        $('#quasi_expensive_multiplier').text(quasi_expensive_multiplier).html();
        $('#quasi_expensive_amount').text(quasi_expensive_amount).html();
        $('#threshold_amount').text(threshold_amount).html();

    });

    // participants were reset by admin
    socket.on('participants_reset', function() {
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        user = {};
        $('#register').show();
        $('#participant').hide();
    });

    // registration form handlers -->
    $('form#login').submit(function(event) {
        socket.emit('register', {name: $('#name').val()});
        return false;
    });

    $('form#disconnect').submit(function(event) {
        $('#register').show();
        $('#participant').hide();
        socket.emit('disconnect_request', user);
        localStorage.removeItem('id');
        localStorage.removeItem('name');
        user = {};
        return false;
    });

// <-- registration form handlers

});
