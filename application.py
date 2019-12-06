import os

from flask import Flask,render_template,make_response,jsonify,request
from flask_socketio import SocketIO, emit,join_room, leave_room

from messages import Message
from channels import Channel
from sessions import Sessions

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# user list
usernames=[]

#messages
messages={}

#direct messages
directmsgs={}

@app.route("/")
def index():
    return render_template('login.html')

@app.route("/home/<usrname>")
def home(usrname):
    print(usrname)
    return render_template('index.html')

@app.route("/loadchannels/<username>")
def loadchannels(username):
    channelobj=Channel(username)
    channelobj.readchannel()
    resp=make_response(jsonify(channels=channelobj.channels),200)
    return resp

@app.route("/addchannel/<username>",methods=['POST'])
def createchannel(username):
    input=request.get_json()
    print(input)
    channelobj=Channel(username)
    channelobj.readchannel()
    if channelobj.checkduplicates(input['channelname']):
        resp=make_response(jsonify(status='exist'),200)
    else:
        channelobj.addchannel(input['channelname'])
        channelobj.writechannels()
        resp=make_response(jsonify(status='success',channel=input['channelname']),200)
    return resp

@app.route("/getsessions/<username>",methods=['GET'])
def getsession(username):
    sessionobj=Sessions(username)
    onlinesessions=sessionobj.readsession()
    resp=make_response(jsonify(sessions=onlinesessions),200)
    return resp

@app.route("/addsessions/<username>",methods=['POST'])
def addsessions(username):
    sessionobj=Sessions(username)
    sessionadded=sessionobj.addsession()
    resp=make_response(jsonify(status='success'),200)
    return resp


@app.route("/sendmessage",methods=['POST'])
def sendmessage():
    input=request.get_json()
    messageobj=Message(input['username'])
    messageobj.readmessages()
    messageobj.addmessages(messageobj.username,input['messagetxt'],input['channelname'])
    messageobj.writemessages()
    resp=make_response(jsonify(status='success'),200)
    return resp

@app.route("/loadmessages")
def loadmessages():
    args=request.args
    channelnme=args['channel']
    usernme=args['username']
    messageobj=Message(usernme)
    messages=messageobj.readmessage(channelnme)
    resp=make_response(jsonify(messages=messages),200)
    return resp


@app.route("/delsession/<username>")
def delsession(username):
    sessionobj=Sessions(username)
    session_id=sessionobj.readsessionid(username)
    sessionobj.delsession(session_id)
    resp=make_response(jsonify(status='success'),200)
    # socket.
    return resp

#-------------------------------------direct messages-----------------------------------------------
@app.route("/loaddirect/<username>")
def loaddirect(username):
    args=request.args
    destuser=args['getuser']
    directobj=Message(username)
    directobj.readdirect()
    retmsg=[]
    for msg in directobj.directmessages:
        if (msg['frm']==username or msg['to']==username) and (msg['frm']==destuser or msg['to']==destuser):
            retmsg.append(msg)
    print(retmsg)
    resp=make_response(jsonify(messages=retmsg),200)
    return resp

@app.route("/senddirect/<username>",methods=['POST'])
def senddirect(username):
    input=request.get_json()
    directobj=Message(username)
    directobj.readdirect()
    directobj.senddirect(input['to'],input['msg'],username)
    directobj.writedirect()
    resp=make_response(jsonify(status='success'),200)
    return resp



#-------------------------------------end direct messages-----------------------------------------------


@socketio.on('loggedin')
def loginmsg(loggedin):
    print('This is {}'.format(loggedin))
    sessionobj=Sessions(loggedin['user'])
    sessionadded=sessionobj.addsession(request.sid)
    print(sessionadded)
    
    if sessionadded=='error':
        # resp=make_response(jsonify(status='success'),200)
        resp='exist'
    else:
        # resp=make_response(jsonify(status='success'),200)
        emit('sessionadd',loggedin['user'],include_self=False,broadcast=True)
        resp='success'
    return resp

@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    # send(username + ' has entered the room.', room=room)
    emit('joined','new user',room=room,include_self=False)


@socketio.on('directjoin')
def on_join(data):
    sessionobj=Sessions(data['username'])
    username = data['username']
    room=sessionobj.readsessionid(data['room'])
    # room = data['room']
    # join_room(room)
    # send(username + ' has entered the room.', room=room)
    emit('dirjoined',data,room=room,include_self=False)


@socketio.on('senddirectmsg')
def on_join(data):
    sessionobj=Sessions(data['username'])
    username = data['username']
    room=sessionobj.readsessionid(data['room'])
    # room = data['room']
    # join_room(room)
    # send(username + ' has entered the room.', room=room)
    emit('sentdirect',data,room=room,include_self=False)



@socketio.on('leave')
def on_leave(data):
    username = data['username']
    room = data['room']
    leave_room(room)
    # send(username + ' has left the room.', room=room)
    emit('left','left the room',room=room)

@socketio.on('sendmsg')
def sendmessage(data):
    emit('msgsent',data,room=data['room'],include_self=False)

@socketio.on('disconnect')
def test_disconnect():
    print(f'Client disconnected {request.sid}')
    session_del=Sessions.delsession(request.sid)
    print(f'a delete {session_del}')
    emit('sessiondel',session_del,include_self=False,broadcast=True)





if __name__=='__main__':
    socketio.run(app,debug=True)
