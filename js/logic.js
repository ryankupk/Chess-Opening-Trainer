let chess = new Chess();

let board = null
let game = new Chess()
let $status = $('#status')

function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false
    }
}

function onDrop (source, target, piece) {
    let promoteTo = "q";
    console.log(source, target, piece);

    //check if the piece is a pawn moving to the eighth rank
    //if so, the pawn has to promote. Present promotion window to select to which piece the pawn should promote
    if (/8/.test(target) && /P/.test(piece)) {
        console.log("promotion");
        promoteTo = promotePiece(function(promoteTo) {

            let move = game.move({
                from: source,
                to: target,
                promotion: promoteTo
            })

            updateStatus();
        });

        return;
    }

    // attempt to make move
    let move = game.move({
        from: source,
        to: target
    })

    // illegal move
    if (move === null) return 'snapback'

    updateStatus()
}

// update the board position after the piece snap
// for castling, en passant, pawn promotion
function onSnapEnd () {
    board.position(game.fen())
}

function updateStatus () {
    let status = ''

    let moveColor = 'White'
    if (game.turn() === 'b') {
        moveColor = 'Black'
    }

    // checkmate?
    if (game.in_checkmate()) {
        status = 'Game over, ' + moveColor + ' is in checkmate.'
    }

    // draw?
    else if (game.in_draw()) {
        status = 'Game over, drawn position'
    }

    // game still on
    else {
        status = moveColor + ' to move'

        // check?
        if (game.in_check()) {
            status += ', ' + moveColor + ' is in check'
        }
    }

    $status.html(status)
}

let config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}
board = Chessboard('myBoard', config)

updateStatus()