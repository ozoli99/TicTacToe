function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const gameBoard = (() => {
    let _board = new Array(9);

    const getField = (num) => _board[num];
    const setField = (num, player) => {
        const htmlField = document.querySelector(`.board button:nth-child(${num+1}) p`);
        htmlField.classList.add("puff-in-center");
        htmlField.textContent = player.getSign();
        _board[num] = player.getSign();
    };
    const setFieldForAiLogic = (num, player) => {
        if (player == undefined) {
            _board[num] = undefined;
            return;
        }
        _board[num] = player.getSign();
    };
    const getEmptyFieldsIdx = () => {
        let fields = [];
        for (let i = 0; i < _board.length; i++) {
            const field = _board[i];
            if (field == undefined) {
                fields.push(i);
            }
        }
        return fields;
    };
    const clear = () => {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = undefined;
        }
    };

    return {
        getField,
        getEmptyFieldsIdx,
        setField,
        setFieldForAiLogic,
        clear
    };
})();

const Player = (sign) => {
    let _sign = sign;

    const getSign = () => _sign;
    const setSign = (sign, active) => {
        _sign = sign;
        const p = document.querySelector(`.btn-p.${sign.toLowerCase()}`);
        if (active) {
            p.classList.add("selected");
            p.classList.remove("not-selected");
        } else {
            p.classList.remove("selected");
            p.classList.add("not-selected");
        }
    };

    return {
        getSign,
        setSign
    };
};

const minimaxAiLogic = ((percentage) => {
    let aiPrecision = percentage;

    const setAiPercentage = (oercentage) => {
        aiPrecision = percentage;
    };
    const getAiPercentage = () => {
        return aiPrecision;
    };

    const chooseField = () => {
        const value = Math.floor(Math.random() * (100 + 1));

        let choice = null;
        if (value <= aiPrecision) {
            console.log("bestChoice");
            choice = minimax(gameBoard, gameController.getAiPlayer()).index;
            const field = gameBoard.getField(choice);
            if (field != undefined) {
                return "error";
            }
        } else {
            console.log("NotbestChoice");
            const emptyFieldsIdx = gameBoard.getEmptyFieldsIdx();
            let noBestMove = Math.floor(Math.random() * emptyFieldsIdx.length);
            choice = emptyFieldsIdx[noBestMove];
        }
        return choice;
    };
    const findBestMove = (moves, palyer) => {
        let bestMove;
        if (player === gameController.getAiPlayer()) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    };
    const minimax = (newBoard, player) => {
        let empty = newBoard.getEmptyFieldsIdx();

        if (gameController.checkForDraw(newBoard)) {
            return { score: 0 };
        } else if (gameController.checkForWin(newBoard)) {
            if (player.getSign() == gameController.getHumanPlayer().getSign()) {
                return { score: 10 };
            } else if (player.getSign() == gameController.getAiPlayer().getSign()) {
                return { score: -10 };
            }
        }

        let moves = [];

        for (let i = 0; i < empty.length; i++) {
            let move = {};
            move.index = empty[i];

            newBoard.setFieldForAiLogic(empty[i], player);

            if (player.getSign() == gameController.getAiPlayer().getSign()) {
                let result = minimax(newBoard, gameController.getHumanPlayer());
                move.score = result.score;
            } else {
                let result = minimax(newBoard, gameController.getAiPlayer());
                move.score = result.score;
            }

            newBoard.setFieldForAiLogic(empty[i], undefined);

            moves.push(move);
        }
        
        return findBestMove(moves, player);
    };

    return {
        minimax,
        chooseField,
        getAiPercentage,
        setAiPercentage
    };
})(0);