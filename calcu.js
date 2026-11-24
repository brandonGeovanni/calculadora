const app = Vue.createApp({
    data() {
        return {
            current: "0",
            previous: null,
            operator: null,
            resetDisplay: false,
            history: "Bienvenido · realiza tu primer cálculo"
        };
    },
    methods: {
        clearAll() {
            this.current = "0";
            this.previous = null;
            this.operator = null;
            this.resetDisplay = false;
            this.history = "Bienvenido · realiza tu primer cálculo";
        },
        deleteLast() {
            if (this.resetDisplay) {
                this.current = "0";
                this.resetDisplay = false;
                return;
            }

            const shortened = this.current.slice(0, -1);
            this.current = shortened === "" || shortened === "-"
                ? "0"
                : shortened;
        },
        addNumber(number) {
            if (this.resetDisplay) {
                this.current = "0";
                this.resetDisplay = false;
            }

            if (number === "." && this.current.includes(".")) return;

            if (["0", "-0"].includes(this.current) && number !== ".") {
                this.current = this.current.startsWith("-") ? `-${number}` : number;
            } else {
                this.current += number;
            }
        },
        chooseOperator(operator) {
            if (this.current === "Error") return;

            if (this.operator !== null && !this.resetDisplay) {
                this.calculate();
                if (this.current === "Error") return;
            }

            this.previous = Number(this.current);
            this.operator = operator;
            this.resetDisplay = true;
            this.history = `${this.previous} ${this.operatorSymbol(operator)}`;
        },
        operatorSymbol(operator) {
            return { "/": "÷", "*": "×", "-": "−", "+": "+", "^": "^" }[operator];
        },
        calculate() {
            if (this.operator === null || this.previous === null) return;

            const second = Number(this.current);
            let result;

            switch (this.operator) {
                case "+":
                    result = this.previous + second;
                    break;
                case "-":
                    result = this.previous - second;
                    break;
                case "*":
                    result = this.previous * second;
                    break;
                case "/":
                    if (second === 0) {
                        this.showError("No se puede dividir entre cero");
                        return;
                    }
                    result = this.previous / second;
                    break;
                case "^":
                    result = Math.pow(this.previous, second);
                    break;
            }

            if (!Number.isFinite(result)) {
                this.showError("El resultado no es un número válido");
                return;
            }

            this.history = `${this.previous} ${this.operatorSymbol(this.operator)} ${second} =`;
            this.current = String(Number(result.toPrecision(12)));
            this.previous = null;
            this.operator = null;
            this.resetDisplay = true;
        },
        squareRoot() {
            if (this.current === "Error") return;

            const number = Number(this.current);
            if (number < 0) {
                this.showError("No existe raíz real para un número negativo");
                return;
            }

            this.history = `√ ${number}`;
            this.current = String(Number(Math.sqrt(number).toPrecision(12)));
            this.resetDisplay = true;
        },
        percentage() {
            if (this.current === "Error") return;

            const number = Number(this.current);
            this.history = `${number} %`;
            this.current = String(Number((number / 100).toPrecision(12)));
            this.resetDisplay = true;
        },
        toggleSign() {
            if (this.current === "Error") return;

            const number = Number(this.current);
            this.current = String(number === 0 ? 0 : -number);
            this.resetDisplay = false;
        },
        showError(message) {
            this.current = "Error";
            this.history = message;
            this.previous = null;
            this.operator = null;
            this.resetDisplay = true;
        },
        handleKeydown(event) {
            if (/^[0-9.]$/.test(event.key)) {
                this.addNumber(event.key);
                return;
            }

            if (["+", "-", "*", "/"].includes(event.key)) {
                this.chooseOperator(event.key);
                return;
            }

            if (event.key === "Enter" || event.key === "=") {
                event.preventDefault();
                this.calculate();
            } else if (event.key === "Backspace") {
                event.preventDefault();
                this.deleteLast();
            } else if (event.key === "Escape") {
                this.clearAll();
            } else if (event.key === "%") {
                this.percentage();
            }
        }
    },
    mounted() {
        window.addEventListener("keydown", this.handleKeydown);
    },
    beforeUnmount() {
        window.removeEventListener("keydown", this.handleKeydown);
    }
});

app.mount("#app");
