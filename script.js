const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator__keys')
const display = document.querySelector('.calculator__display')


keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target
        const displayedNum = display.textContent

        // Pure function--the value needs to be displayed on the calculator
        const resultString = createResultString(key, displayedNum, calculator)

        // Update states   
        display.textContent = resultString
        // Impure stuff
        updateCalculatorState(key, displayedNum, calculator, resultString)

    }
})


const createResultString = (key, displayedNum, calculator) => {
    const keyType = getKeyType(key)
    const keyContent = key.textContent
    const { previousKeyType, firstValue, operator, modValue } = calculator.dataset

    if (keyType === 'number') {
        return displayedNum === '0' || previousKeyType === 'operator' ||
            previousKeyType === 'calculate'
            ? keyContent
            : displayedNum + keyContent
    }

    if (
        keyType === 'operator'
    ) {
        // Note: It's sufficient to check for firstValue and operator because secondValue always exists
        return firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'calculate'
            ? calculate(firstValue, operator, displayedNum)
            : displayedNum
    }

    if (keyType === 'decimal') {
        if (previousKeyType === 'operator' ||
            previousKeyType === 'calculate') return '0.'
        if (!displayedNum.includes('.')) return displayedNum + '.'
    }

    if (keyType === 'clear') return '0'

    if (keyType === 'calculate') {
        return firstValue
            ? previousKeyType === 'calculate'
                ? calculate(displayedNum, operator, modValue)
                : calculate(firstValue, operator, displayedNum)
            : displayedNum
    }
}


const updateCalculatorState = (key, displayedNum, calculator, calculatedValue) => {
    const keyType = getKeyType(key)
    const action = key.dataset.action
    const { previousKeyType, operator } = calculator.dataset
    let { firstValue, modValue } = calculator.dataset

    calculator.dataset.previousKeyType = keyType

    if (keyType === 'number' || keyType === 'decimal') {
        if (previousKeyType === 'calculate') { calculator.dataset.firstValue = '' }
    }

    if (keyType === 'operator') {
        // Note: It's sufficient to check for firstValue and operator because secondValue always exists
        calculator.dataset.firstValue = firstValue &&
            operator &&
            previousKeyType !== 'operator' &&
            previousKeyType !== 'calculate'
            //make consecutive calculations
            // Update calculated value as firstValue
            ? calculatedValue
            // If there are no calculations, set displayedNum as the firstValue
            : displayedNum

        //highlighted to let user know the operator is active
        key.classList.add('is-depressed')
        // Add custom attribute.If the previousKeyType is an operator, we want to replace the displayed number with clicked number.
        // calculator.dataset.firstValue = displayedNum
        calculator.dataset.operator = action
    }

    if (keyType !== 'clear') {
        const clearButton = calculator.querySelector('[data-action=clear]')
        clearButton.textContent = 'CE'
    }

    if (keyType === 'clear') {
        if (key.textContent === 'AC') {
            calculator.dataset.firstValue = ''
            calculator.dataset.modValue = ''
            calculator.dataset.operator = ''
            calculator.dataset.previousKeyType = ''
        } else {
            key.textContent = 'AC'
            calculator.dataset.firstValue = ''
        }
    }

    if (keyType === 'calculate') {
        // Set modValue attribute
        calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
            ? modValue
            : displayedNum
    }

    //operator key  release its pressed state when a user hits a number key again
    Array.from(key.parentNode.children)
        .forEach(k => k.classList.remove('is-depressed'))
}


const getKeyType = (key) => {
    const { action } = key.dataset
    if (!action) return 'number'
    if (
        action === 'add' ||
        action === 'subtract' ||
        action === 'multiply' ||
        action === 'divide'
    ) return 'operator'
    // For everything else, return the action
    return action
}


const calculate = (n1, operator, n2) => {
    const firstNum = parseFloat(n1)
    const secondNum = parseFloat(n2)
    if (operator === 'add') return firstNum + secondNum
    if (operator === 'subtract') return firstNum - secondNum
    if (operator === 'multiply') return firstNum * secondNum
    if (operator === 'divide') return firstNum / secondNum
}