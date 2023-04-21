const calculator = document.querySelector('.calculator')
const keys = calculator.querySelector('.calculator__keys')
const display = document.querySelector('.calculator__display')

keys.addEventListener('click', e => {
    if (e.target.matches('button')) {
        const key = e.target
        const action = key.dataset.action
        const keyContent = key.textContent
        const displayedNum = display.textContent
        const previousKeyType = calculator.dataset.previousKeyType

        if (!action) {
            if (displayedNum === '0' || previousKeyType === 'operator' ||
                previousKeyType === 'calculate') {
                display.textContent = keyContent
                if (previousKeyType === 'calculate') { calculator.dataset.firstValue = '' }

            } else {
                display.textContent = displayedNum + keyContent
            }
            calculator.dataset.previousKeyType = 'number'
        }

        if (
            action === 'add' ||
            action === 'subtract' ||
            action === 'multiply' ||
            action === 'divide'
        ) {
            const firstValue = calculator.dataset.firstValue
            const operator = calculator.dataset.operator
            const secondValue = displayedNum

            // Note: It's sufficient to check for firstValue and operator because secondValue always exists
            if (
                firstValue &&
                operator &&
                previousKeyType !== 'operator' &&
                previousKeyType !== 'calculate'
            ) {
                const calcValue = calculate(firstValue, operator, secondValue)
                display.textContent = calcValue
                //make consecutive calculations
                // Update calculated value as firstValue
                calculator.dataset.firstValue = calcValue
            } else {
                // If there are no calculations, set displayedNum as the firstValue
                calculator.dataset.firstValue = displayedNum
            }

            //highlighted to let user know the operator is active
            key.classList.add('is-depressed')
            // Add custom attribute.If the previousKeyType is an operator, we want to replace the displayed number with clicked number.
            calculator.dataset.previousKeyType = 'operator'
            // calculator.dataset.firstValue = displayedNum
            calculator.dataset.operator = action

        }

        if (action === 'decimal') {
            if (previousKeyType === 'operator') {
                display.textContent = '0.'
            } else if (previousKeyType === 'calculate') {
                display.textContent = '0.'
                calculator.dataset.firstValue = ''
            } else if (!displayedNum.includes('.')) {
                display.textContent = displayedNum + '.'
            }
            calculator.dataset.previousKeyType = 'decimal'
        }
        if (action !== 'clear') {
            const clearButton = calculator.querySelector('[data-action=clear]')
            clearButton.textContent = 'CE'
        }
        if (action === 'clear') {
            if (key.textContent === 'AC') {
                calculator.dataset.firstValue = ''
                calculator.dataset.modValue = ''
                calculator.dataset.operator = ''
                calculator.dataset.previousKeyType = ''
            } else {
                key.textContent = 'AC'
            }

            display.textContent = 0
            calculator.dataset.previousKeyType = 'clear'
        }

        if (action === 'calculate') {
            let firstValue = calculator.dataset.firstValue
            const operator = calculator.dataset.operator
            const secondValue = displayedNum

            if (firstValue) {
                if (previousKeyType === 'calculate') {
                    firstValue = calculator.dataset.modValue
                    secondValue = displayedNum
                }

                display.textContent = calculate(firstValue, operator, secondValue)
            }
            // Set modValue attribute
            calculator.dataset.modValue = secondValue
            calculator.dataset.previousKeyType = 'calculate'
        }



        //operator key  release its pressed state when a user hits a number key again
        Array.from(key.parentNode.children)
            .forEach(k => k.classList.remove('is-depressed'))
    }
})


const calculate = (n1, operator, n2) => {
    // Perform calculation and return calculated value
    let result = ''

    if (operator === 'add') {
        result = parseFloat(n1) + parseFloat(n2)
    } else if (operator === 'subtract') {
        result = parseFloat(n1) - parseFloat(n2)
    } else if (operator === 'multiply') {
        result = parseFloat(n1) * parseFloat(n2)
    } else if (operator === 'divide') {
        result = parseFloat(n1) / parseFloat(n2)
    }

    return result
}