const prompt = require("prompt-sync")(); 

const ROWS = 3;
const COLUMNS = 3;

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8,
}

const SYMBOL_VALUES = {
    "A": 5,
    "B": 4,
    "C" : 3,
    "D": 2
}

const deposit = () => {
    while (true){
        const depositAmount = prompt("Enter a deposit amount: ");
        const numberDepositAmount = parseFloat(depositAmount);
    
        if (isNaN(numberDepositAmount) || numberDepositAmount <=0){
            console.log("Invalid Deposit Amount");
        }
        else{
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () =>{
    while (true){
        const numLines = prompt("Enter number of lines between 1-3: ");
        const numberOfLines = parseInt(numLines);

    if (isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
        console.log("Invalid Number of Lines");
    }
    else {  
        return numberOfLines;
    }
        }
};

const getBet = (balance, lines) =>{
    while (true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseInt(bet);

    if (isNaN(numberBet) || numberBet <= 0 || numberBet > balance/lines){
        console.log("Invalid bet, try again!");
    }
    else {  
        return numberBet;
    }
        }
};

const spinWheel = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for (let i=0; i<count; i++){
            symbols.push(symbol);
        }
    }
    
    const reels = [];
    for (let i = 0; i < COLUMNS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++){
            var randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }
    return reels;
};

const transpose = (reels) =>{
    const rows = [];
    for (let i = 0; i < ROWS; i++){
        rows.push([]);
        for (let j = 0; j < COLUMNS; j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows;
}

const printRows = (rows) =>{
    for (const row of rows){
        let rowString = "";
        for (const [i, symbol] of row.entries()){
            rowString += symbol
            if (i != row.length - 1){
                rowString += " | "
            }
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) =>{
    let winnings = 0;
    for (let row=0; row<lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols){
            if (symbol != symbols[0]){
                allSame = false;
                break; 
            }
        }
        if (allSame){
            winnings += bet * SYMBOL_VALUES[symbols[0]]; 
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit(); 

    while (true){
        console.log("Your balance is: $" + balance);
        const numOfLines = getNumberOfLines();
        const betFn = getBet(balance, numOfLines);
        balance -= betFn * numOfLines;
        const reels = spinWheel();

        const rows = transpose(reels);
        printRows(rows);

        const winnings = getWinnings(rows, betFn, numOfLines);
        balance += winnings;
        console.log("You won, $" + winnings.toString());

        if (balance <= 0){
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again (Y/N)? ");
        if (playAgain != "Y"){
            break;
        }
    }
};

game();