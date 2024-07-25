const filasTablero = 30;
const columnasTablero = 14;

const tablero = Array.from({ length: filasTablero }, () => Array(columnasTablero).fill(0));

let colort = "#f54021"
let intervalo
let pausa = true;
let score = 0;
let lines = 0;
let highscore = localStorage.getItem('highscore') || 0;
highscore = parseInt(highscore, 10);
document.getElementById('highscore').textContent = highscore;

console.log(tablero);

const filas = tablero.length;
const columnas = tablero[0].length;
const tamanoCelda = 20; 

const musicaFondo = document.getElementById('musicaFondo');
const musicaperdedor = document.getElementById("fin");

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');


canvas.width = columnas * tamanoCelda;
canvas.height = filas * tamanoCelda;


function dibujarTablero(color) {
    for (let fila = 0; fila < filas; fila++) {
        for (let columna = 0; columna < columnas; columna++) {
            if (tablero[fila][columna] === 1) {
                
                ctx.fillStyle = color; 
                ctx.fillRect(columna * tamanoCelda, fila * tamanoCelda, tamanoCelda, tamanoCelda);
            } else {
                
                ctx.fillStyle = '#4e4e4e'; 
                ctx.fillRect(columna * tamanoCelda, fila * tamanoCelda, tamanoCelda, tamanoCelda);
            }

            ctx.strokeStyle = '#333'; 
            ctx.strokeRect(columna * tamanoCelda, fila * tamanoCelda, tamanoCelda, tamanoCelda);
        }
    }
}
const piezas = [
    // barra
    {
        rotaciones: [
            [[1, 1, 1, 1]],
            [[1], [1], [1], [1]],
        ],
        color: '#00BCD4'
    },
    // cuadrado
    {
        rotaciones: [
            [[1, 1], [1, 1]]
        ],
        color: '#FFEB3B'
    },
    // T
    {
        rotaciones: [
            [[0, 1, 0], [1, 1, 1]],
            [[1, 0], [1, 1], [1, 0]],
            [[1, 1, 1], [0, 1, 0]],
            [[0, 1], [1, 1], [0, 1]],
        ],
        color: '#9C27B0'
    },
    // S
    {
        rotaciones: [
            [[0, 1, 1], [1, 1, 0]],
            [[1, 0], [1, 1], [0, 1]],
        ],
        color: '#4CAF50'
    },
    // Z
    {
        rotaciones: [
            [[1, 1, 0], [0, 1, 1]],
            [[0, 1], [1, 1], [1, 0]],
        ],
        color: '#F44336'
    },
    // J
    {
        rotaciones: [
            [[1, 0, 0], [1, 1, 1]],
            [[1, 1], [1, 0], [1, 0]],
            [[1, 1, 1], [0, 0, 1]],
            [[0, 1], [0, 1], [1, 1]],
        ],
        color: '#2196F3'
    },
    // L
    {
        rotaciones: [
            [[0, 0, 1], [1, 1, 1]],
            [[1, 0], [1, 0], [1, 1]],
            [[1, 1, 1], [1, 0, 0]],
            [[1, 1], [0, 1], [0, 1]],
        ],
        color: '#FF9800'
    }
];

function obtenerPiezaAleatoria() {
    const index = Math.floor(Math.random() * piezas.length);
    const pieza = piezas[index];
    return {
        forma: pieza.rotaciones[0], 
        rotaciones: pieza.rotaciones,
        color: pieza.color,
        x: Math.floor(columnas / 2) - 2, 
        y: 0,
        rotacionIndex: 0
    };
}

let piezaActual = obtenerPiezaAleatoria();


function dibujarPieza() {

    ctx.fillStyle = piezaActual.color;
    for (let fila = 0; fila < piezaActual.forma.length; fila++) {
        for (let columna = 0; columna < piezaActual.forma[fila].length; columna++) {
            if (piezaActual.forma[fila][columna] === 1) {
                ctx.fillRect(
                    (piezaActual.x + columna) * tamanoCelda,
                    (piezaActual.y + fila) * tamanoCelda,
                    tamanoCelda,
                    tamanoCelda
                );
            }
        }
    }
}

function verificarColision(x, y, forma) {
    for (let fila = 0; fila < forma.length; fila++) {
        for (let columna = 0; columna < forma[fila].length; columna++) {
            
            const nuevoX = x + columna;
            const nuevoY = y + fila;

            if (
                forma[fila][columna] &&
                (nuevoX < 0 || nuevoX >= columnas || nuevoY >= filas || tablero[nuevoY][nuevoX] !== 0)
            ) {
                return true;            }
        } 
    }
    return false; 
}

function fijarPieza() {
    for (let fila = 0; fila < piezaActual.forma.length; fila++) {
        for (let columna = 0; columna < piezaActual.forma[fila].length; columna++) {
            if (piezaActual.forma[fila][columna]) {
                tablero[piezaActual.y + fila][piezaActual.x + columna] = 1;
            }
        }
    }
}

function moverPieza(dx, dy) {
    
    const nuevoX = piezaActual.x + dx;
    const nuevoY = piezaActual.y + dy;

    if (!verificarColision(nuevoX, nuevoY, piezaActual.forma)) {
      
        ctx.clearRect(
            piezaActual.x * tamanoCelda,
            piezaActual.y * tamanoCelda,
            piezaActual.forma[0].length * tamanoCelda,
            piezaActual.forma.length * tamanoCelda
        );
        piezaActual.x = nuevoX;
        piezaActual.y = nuevoY;
        dibujarTablero(colort);
        dibujarPieza();
    } else if (dy > 0) {
       
        fijarPieza();
        eliminarFilasCompletas();
        piezaActual = obtenerPiezaAleatoria();
        if (verificarColision(piezaActual.x, piezaActual.y, piezaActual.forma)) {
            musicaperdedor.volume = 1
            musicaFondo.pause();
            musicaperdedor.play();
            document.getElementById('mensaje').style.display = 'block';
            setTimeout(() => {
                window.location.reload();
            }, 3000);
        }
    }
}

function rotarPieza() {
    const rotacionIndex = (piezaActual.rotacionIndex + 1) % piezaActual.rotaciones.length;
    const nuevaForma = piezaActual.rotaciones[rotacionIndex];

    if (!verificarColision(piezaActual.x, piezaActual.y, nuevaForma)) {
        ctx.clearRect(
            piezaActual.x * tamanoCelda,
            piezaActual.y * tamanoCelda,
            piezaActual.forma[0].length * tamanoCelda,
            piezaActual.forma.length * tamanoCelda
        );
        piezaActual.forma = nuevaForma;
        piezaActual.rotacionIndex = rotacionIndex;
        dibujarTablero(colort);
        dibujarPieza();
    }
}


function eliminarFilasCompletas() {
    let lineasEliminadas = 0;
    for (let fila = filas - 1; fila >= 0; fila--) {
        if (tablero[fila].every(cell => cell === 1)) {
            tablero.splice(fila, 1);
            tablero.unshift(Array(columnas).fill(0));
            fila++;
            lineasEliminadas++;
        }
    }
    if (lineasEliminadas > 0) {
        score += lineasEliminadas * 100;
        lines += lineasEliminadas;
        document.getElementById('score').textContent = score;
        document.getElementById('lines').textContent = lines;
        actualizarHighScore();
    }
}

// Eventos de teclado
document.addEventListener('keydown', (event) => {
    if(!pausa){
        switch (event.key) {
            case 'ArrowLeft':
                moverPieza(-1, 0); // Mover a la izquierda
                break;
            case 'ArrowRight':
                moverPieza(1, 0); // Mover a la derecha
                break;
            case 'ArrowUp':
                rotarPieza(); // Rotar la pieza
                break;
            case 'ArrowDown':
                moverPieza(0, 1); // Mover hacia abajo
                break;
        }
    }
    
});
// modo tactil
document.addEventListener("DOMContentLoaded", function() {
    const leftButton = document.getElementById("leftButton");
    const downButton = document.getElementById("downButton");
    const rightButton = document.getElementById("rightButton");
    const rotateButton = document.getElementById("rotateButton");

    leftButton.addEventListener("click", function() {
        console.log("Left button clicked");
        if(!pausa){
            moverPieza(-1,0);
        }
        
    });
    downButton.addEventListener("click", function() {
        console.log("Down button clicked");
        if(!pausa){
            moverPieza(0,1);
        }
    });
    rightButton.addEventListener("click", function() {
        console.log("Right button clicked");
        if(!pausa){
            moverPieza(1,0);
        }
    });
    rotateButton.addEventListener("click", function() {
        console.log("Rotate button clicked");
        if(!pausa){
            rotarPieza();
        }
    });

    
});

function comenzar(){
    pausa = !pausa

    document.getElementById('iniciar').style.display = 'none';
    document.getElementById("pause").style.display = "inline";
    
    musicaFondo.loop = true; // Repetir música en bucle
    musicaFondo.volume = 0.5; // Ajusta el volumen (0.0 a 1.0)
    musicaFondo.play(); // Reproduce la música
    
    score = 0;
    lines = 0;
    

    document.getElementById('score').textContent = score;
    document.getElementById('lines').textContent = lines;

   

   
    dibujarTablero(colort);
    dibujarPieza();

    // Animación automática de la pieza
    intervalo = setInterval(() => {
        moverPieza(0, 1); // Mover hacia abajo automáticamente
    }, 500);

}

function play(){
    if(pausa){

        musicaFondo.play(); 
        intervalo = setInterval(() => {
                moverPieza(0, 1); // reanuda la animación
            }, 500); 
        document.getElementById("pause").style.display = "inline";
        document.getElementById("play").style.display = "none";
        
        pausa = !pausa

    }
    else{

        musicaFondo.pause(); // Pausa la música
        clearInterval(intervalo); // Detiene la animación
        document.getElementById("pause").style.display = "none";
        document.getElementById("play").style.display = "inline";

        pausa = !pausa

    }
    
}

function cambiarColorBloques(color) {
    colort = color
    dibujarTablero(color);
    dibujarPieza();
}

function ajustarVolumen(volumen) {
    const musicaFondo = document.getElementById('musicaFondo');
    musicaFondo.volume = volumen;
}

function actualizarHighScore() {
    if (score > highscore) {
        highscore = score;
        localStorage.setItem('highscore', highscore);
        document.getElementById('highscore').textContent = highscore;
    }
}