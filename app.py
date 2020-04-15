import flask
from stockfish import Stockfish
from flask_socketio import SocketIO, send

from flask import Flask, render_template, url_for, jsonify, request


stockfish = Stockfish("/home/ChessOpeningTrainer/Chess-Opening-Trainer/stockfish_20011801_x64")
stockfish.set_position("startpos")


app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)


@app.route('/')
def index():
    return render_template('prototype.html')

@app.route('/reset', methods=['POST'])
def reset():
    stockfish.stop()
    stockfish.new_game()
    return {"reset": "ok"}

@socketio.on('message')
def printAnalysis(fen):
    stockfish.stop()
    stockfish.set_fen_position(fen)
    curLine = ""
    stockfish.get_analysis(20)

    while True:
        curLine = stockfish.stockfish.stdout.readline().split()

        if not curLine:
            return
        
        if "readyok" in curLine:
            continue
        elif curLine[0] == "bestmove":
            stockfish.is_running = False
            break
        elif curLine[3] == "currmove":
            continue
        else:
            socketio.send(str(int(curLine[9]) / 100))

# app.run(debug=True)

if __name__ == '__main__':
    socketio.run(app)
     
