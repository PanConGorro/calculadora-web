document.addEventListener('DOMContentLoaded', () => {
    const pantalla = document.getElementById("pantallita");
    const botones = document.querySelectorAll(".boton");
    const historial = document.getElementById("ultimos-resultados");

    let operacionActual = "";
    let resultadoCalculado = false;

    function actualizarPantalla(){
        if (operacionActual === ""){
            pantalla.textContent = "0";
        } else {
            pantalla.textContent = operacionActual;
        }
    }

    function agregarHistorial(expresion, resultado){
        const p = document.createElement("p");
        p.textContent = `${expresion} = ${resultado}`;
        historial.prepend(p);
    }

    function limpiarPantalla(){
        operacionActual = "";
        resultadoCalculado = false;
        actualizarPantalla();
    }

    function borrar(){
        operacionActual = operacionActual.slice(0, -1); 
    }

    function escribirNumeros(numero){
        if(resultadoCalculado){
            operacionActual = numero;
            resultadoCalculado = false;
        } else if (operacionActual === "0" && numero !== "0"){
                operacionActual = numero;
            } else if (operacionActual === "0" && numero === "0"){
                return;
            } else {
                operacionActual += numero;
            }
    }

    function escribirOperador(operador){
        if (operacionActual === "" && operador !== "-"){
            operacionActual = "0" + operador;
            resultadoCalculado = false;
            return;
        }

        const ultimoCaracter = operacionActual.slice(-1);
        if(["/", "X", "-", "+", "."].includes(ultimoCaracter)){
            operacionActual = operacionActual.slice(0, -1) + operador;
        } else {
            operacionActual += operador;
        }
        resultadoCalculado = false;
    }

    function coma(){
        if(resultadoCalculado){
            operacionActual = "0.";
            resultadoCalculado = false;
            return;
        }

        const ultimoCaracter = operacionActual.slice(-1);

        if (ultimoCaracter.includes('.')) {
            return;
        }
        if (operacionActual === '' || ["/", "*", "-", "+", "."].includes(ultimoCaracter)) {
            operacionActual += "0.";
        } else {
            operacionActual += ".";
        }
    }

    function calcular(){
        if (operacionActual.trim() === '') {
            return; 
        }
        try {
            let expresionFinal = operacionActual;
            const ultimoChar = expresionFinal.slice(-1);
            if (['/', '*', '-', '+', '.'].includes(ultimoChar)) {
                expresionFinal = expresionFinal.slice(0, -1);
            }

            const resultado = eval(expresionFinal);

            if (isNaN(resultado) || !isFinite(resultado)) {
                pantalla.textContent = 'Error';
                operacionActual = '';
            } else {
                const resultadoRedondeado = Math.round(resultado * 10000000000) / 10000000000;
                agregarHistorial(operacionActual, resultadoRedondeado);
                operacionActual = resultadoRedondeado.toString();
                resultadoCalculado = true;
            }
        } catch (e) {
            pantalla.textContent = 'Error de Sintaxis';
            operacionActual = '';
        }
    }

    botones.forEach(button => {
        button.addEventListener("click", () =>{
            const valorBoton = button.textContent;
            const buttonId = button.id;

            switch(buttonId){
                case "limpiar":
                    limpiarPantalla();
                    break;
                case "dividir":
                    escribirOperador("/");
                    break;
                case "borrar":
                    borrar();
                    break;
                case "igual":
                    calcular();
                    break;
                case "por":
                    escribirOperador("*");
                    break;
                case "mas":
                    escribirOperador("+");
                    break;
                case "menos":
                    escribirOperador("-");
                    break;
                case "coma":
                    coma();
                    break;
                case "cero":
                case "uno":
                case "dos":
                case "tres":
                case "cuatro":
                case "cinco":
                case "seis":
                case "siete":
                case "ocho":
                case "nueve":
                    escribirNumeros(valorBoton);
                    break;
                default:
                    console.log("Ingreso no esperado: ", buttonID, valorBoton);
                    break;
            }
            actualizarPantalla();
        });
    });

    actualizarPantalla();
});