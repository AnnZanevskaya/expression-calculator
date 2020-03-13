function eval() {
    // Do not use eval!!!
    return;
}

const standart_operators = ["(", ")", "+", "-", "*", "/", "^"];

function separate(input) {
    let separatedArray = [];
    let tmpNumber = "";
    for (let index = 0; index < input.length; index++) {
        if (standart_operators.indexOf(input[index]) !== -1) {
            if (tmpNumber !== "") {
                separatedArray.push(tmpNumber);
                tmpNumber = "";
            }

            separatedArray.push(input[index]);
        } else {
            tmpNumber = tmpNumber + input[index];
        }
    }

    if(tmpNumber!==""){
        separatedArray.push(tmpNumber);
    }

    return separatedArray;
}

function getPriority(s) {
    switch (s) {
        case "(":
        case ")":
            return 0;
        case "+":
        case "-":
            return 1;
        case "*":
        case "/":
            return 2;
        case "^":
            return 3;
        default:
            return 4;
    }
}

function convertToPostfixNotation(input) {
    let outSeparated = [];
    let stack = [];

    let separateExpr = separate(input);

    separateExpr.forEach(c => {
        if (standart_operators.indexOf(c) !== -1) {
            if (stack.length > 0 && c !== ("(")) {
                if (c === ")") {
                    let s = stack.pop();
                    while (s != "(") {
                        outSeparated.push(s);
                        s = stack.pop();
                    }
                } else if (getPriority(c) > getPriority(stack[stack.length - 1])) {
                    stack.push(c);
                } else {
                    while (stack.length > 0 && getPriority(c) <= getPriority(stack[stack.length - 1])) {
                        outSeparated.push(stack.pop());
                    }
                    stack.push(c);
                }
            } else {
                stack.push(c);
            }
        } else {
            outSeparated.push(c);
        }

    });

    if (stack.length > 0) {
        stack.reverse().forEach(c => {
            outSeparated.push(c);
        });
    }

    return outSeparated;
}


function checkBrackets(input) {
    let left = input.split('').filter(f => f === "(");
    let right = input.split('').filter(f => f === ")");

    if (left.length !== right.length) {
        throw new Error('ExpressionError: Brackets must be paired');
    }
}

function expressionCalculator(input) {
    input = input.split(/\s/).join('');
    checkBrackets(input);

    let stack = [];
    let convertedQueue = convertToPostfixNotation(input);

    let str = convertedQueue.shift();
    while (convertedQueue.length >= 0) {
        if (standart_operators.indexOf(str) === -1) {
            stack.push(str);
            str = convertedQueue.shift();
        } else {
            let sum = 0;
            switch (str) {
                case "+": {
                    let a = parseFloat(stack.pop());
                    let b = parseFloat(stack.pop());
                    sum = a + b;
                    break;
                }
                case "-": {
                    let a = parseFloat(stack.pop());
                    let b = parseFloat(stack.pop());
                    sum = b - a;
                    break;
                }
                case "*": {
                    let a = parseFloat(stack.pop());
                    let b = parseFloat(stack.pop());
                    sum = b * a;
                    break;
                }
                case "/": {

                    let a = parseFloat(stack.pop());
                    let b = parseFloat(stack.pop());
                    if (a === 0) {
                        throw TypeError("TypeError: Division by zero.");
                    }

                    sum = b / a;
                    break;
                }
                default:
                    break;
            }

            stack.push(sum.toString());
            if (convertedQueue.length > 0) {
                str = convertedQueue.shift();
            } else {
                break;
            }
        }
    }

    return parseFloat(stack.pop());
}

module.exports = {
    expressionCalculator
}