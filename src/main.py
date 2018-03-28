import os
from flask import Flask, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = 'change!me!'

socketio = SocketIO(app)

# server params
port = int(os.environ.get("PORT", 33508))
localhost = '0.0.0.0'

# auction params - change these
STARTING_FUNDS = 10000.00
STARTING_GOODS = 300.00

# not to be changed params
last_id = 0
participants = []
sellers = []
buyers = []
bids = []
asks = []

bids_ch = []
history_ch = []

ps_res = []
history = []
bid_id = 0


# serve pages
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/DxBERGk2eXZmiFzgOEpwk4Px4zU9zDdZViG20sHI3kg=')
def admin():
    return render_template('DxBERGk2e.html')


# bookkeeping
@socketio.on('connect')
def participant_connect():
    print('participant connected')


@socketio.on('admin_connect')
def admin_connect():
    print('admin connected')
    emit('admin_connected', {'participants': participants,
                             'buyers': buyers,
                             'sellers': sellers,
                             'bids': bids,
                             'asks': asks
                             })


@socketio.on('disconnect')
def disconnect():
    print('Client disconnected')


@socketio.on('admin_disconnected')
def admin_disconnect():
    print('Admin disconnected')


# login and disconnect handlers
def register_participant(user):
    global last_id
    last_id = last_id + 1
    participant = {
       'name': user['name'],
       'id': last_id
    }

    if len(buyers) <= len(sellers):
        participant['role'] = 'buyer'
        participant['goods'] = 0.00
        participant['funds'] = STARTING_FUNDS
        buyers.append(participant)
    else:
        participant['role'] = 'seller'
        participant['goods'] = STARTING_GOODS
        participant['funds'] = 0.00
        sellers.append(participant)

    participants.append(participant)
    return participant


@socketio.on('register')
def participant_registration(user):
    print('participant registration')
    participant = register_participant(user)
    emit('user_info', participant)
    emit('participant_registered', participant, broadcast=True)


@socketio.on('login_existing')
def participant_login(user):
    print('existing participant login')
    participant = None
    for p in participants:
        if match(p, int(user['id'])):
            participant = p
            break
    if participant:
        emit('user_info', participant)
        emit('participant_reconnected', participant, broadcast=True)
    else:
        participant_registration(user)


def match(x, i):
    return int(x['id']) == int(i)


def match_user_id(b, i):
    return int(b[2]) == int(i)


@socketio.on('disconnect_request')
def disconnect_request(user):
    print('participant logout')
    ids = int(user['id'])
    participants[:] = [p for p in participants if not match(p, ids)]
    buyers[:] = [p for p in buyers if not match(p, ids)]
    sellers[:] = [p for p in sellers if not match(p, ids)]
    emit('participant_disconnected', user, broadcast=True)


# admin actions
@socketio.on('reset_bids')
def reset_bids():
    print('resetting bids')
    global bids, asks
    bids = []
    asks = []


@socketio.on('reset_participants')
def reset_participants():
    print('resetting participants')
    global participants, buyers, sellers
    participants = []
    buyers = []
    sellers = []
    emit('participants_reset', broadcast=True)


# run server
if __name__ == '__main__':
    print("running server on http://" + localhost + ":" + str(port))
    socketio.run(app, host=localhost, port=port)

