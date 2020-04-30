import flask
from stockfish import Stockfish
from flask_socketio import SocketIO, send

from flask import Flask, render_template, url_for, jsonify, request


stockfish = Stockfish("./stockfish_20011801_x64.exe")
stockfish.set_position("startpos")


app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app, cors_allowed_origins='*')


@app.route('/')
def index():
    #return static html file
    return render_template('prototype.html')

@app.route('/reset', methods=['POST'])
def reset():
    #on reset of position, stop and restart stockfish
    stockfish.stop()
    stockfish.new_game()
    #something has to return, doesn't really matter
    return {"reset": "ok"}

@socketio.on('message')
def printAnalysis(fen):
    #stop stockfish in case it was already running
    stockfish.stop()
    #set position according to position received from client
    stockfish.set_fen_position(fen)
    curLine = ""
    #start analysis
    stockfish.get_analysis(20)

    while True:
        #get next line of output from engine
        curLine = stockfish.stockfish.stdout.readline().split()

        #if no output, return from function
        if not curLine:
            return
        
        #readyok is the response from newgame function, ignore
        if "readyok" in curLine:
            continue
        #bestmove is in final line of analysis from stockfish "go"
        elif curLine[0] == "bestmove":
            stockfish.is_running = False
            break
        #currmove is in auxiliary information lines, not important
        elif curLine[3] == "currmove":
            continue
        #otherwise, line contains centipawn analysis
        else:
            #send back to front end current analysis
            #cp advantage is 9th element of line, needs to be divided by 100 to represent whole pawn advantage
            socketio.send(str(int(curLine[9]) / 100)) # ex: 70 -> 0.70

# app.run(debug=True)

if __name__ == '__main__':
    socketio.run(app)
     
