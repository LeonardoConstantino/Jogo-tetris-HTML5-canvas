const BODY = document.querySelector("body")
const PONTOS = document.querySelector(".pontos")
const RECORDE = document.querySelector(".recorde")
const BTNS = document.querySelectorAll(".button")
const DEBUG = document.querySelector("#debug")
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const canvas2 = document.querySelector("#cvspxm")
const ctx2 = canvas2.getContext("2d")
canvas.width = 1000
canvas.height = 2000
canvas2.width = 600
canvas2.height = 600
const largura = ctx.canvas.width
const altura = ctx.canvas.height

//variaveis de controle
const tamanho = 100
const t = tamanho
const m = t / 2
let iniciou = false
let perdeu = false
let angulo = Math.floor((Math.random() * 4))
let posx = 500
let posy = -200
let attTela = 500
const dificuldade = 10
let formaAtual = Math.floor((Math.random() * 7))
let proximaForma = Math.floor((Math.random() * 7))
let pontos = 0
let recorde =
    localStorage.getItem('recorde') ?
    localStorage.getItem('recorde') : 0

RECORDE.innerHTML = recorde < 10 ? "0" + recorde : recorde

let objetos = []

const atualizaPontos = () => {
    pontos += 1
    attTela -= dificuldade
    PONTOS.innerHTML = pontos < 10 ? "0" + pontos : pontos
    if (pontos > recorde) {
        atualizaRecorde(pontos)
    }
}

const atualizaRecorde = (v) => {
    localStorage.setItem('recorde', v)
    RECORDE.innerHTML =
        localStorage.getItem('recorde') < 10 ?
        "0" + localStorage.getItem('recorde') :
        localStorage.getItem('recorde')
}

const reset = () => {
    console.log("perdeu")
    iniciou = false
    perdeu = false
    objetos = []
    posx = 500
    posy = -200
    attTela = 500
    angulo = Math.floor((Math.random() * 4))
    formaAtual = Math.floor((Math.random() * 7))
    proximaForma = Math.floor((Math.random() * 7))
    pontos = 0
    //desenha()
}

const marcouPonto = () => {
    //console.count("marcouPonto")
    let acc = 0
    let i = altura / t
    let somaDosX = 4500
    for (i; i >= 0; i--) {
        let res = objetos.filter(o => o.y === i * t)
            .reduce((p, c) => p + c.x, acc)
        if (res == somaDosX) {
            //console.log("ponto", i)
            return [true, i * t]
            break
        }
    }


    return [false, false]
}

const sleep = async (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

const gradiente = (cor1, cor2, x1, y1, x2, y2) => {
    //console.count("gradiente")
    var lineargradient =
        ctx.createLinearGradient(x1, y1, x2, y2)
    lineargradient.addColorStop(0, cor1)
    lineargradient.addColorStop(1, cor2)
    ctx.fillStyle = lineargradient
    var lineargradient2 = ctx2.createLinearGradient(x1 - posx + 250, y1 - posy + 400, x2 - posx + 250, y2 - posy + 400)
    lineargradient2.addColorStop(0, cor1)
    lineargradient2.addColorStop(1, cor2)
    ctx2.fillStyle = lineargradient2
}

const fazFormas = (x, y, f, a) => {
    //console.count("fazFormas")
    //let t = tamanho 
    const fms = [
        [],
        [],
        [x, y - (t * 3)],
        [],
        [],
        [],
        [x - t, y - (t * 2)],
        [x, y - (t * 2)],
        [x + t, y - (t * 2)],
        [],
        [x - (t * 2), y - t],
        [x - t, y - t],
        [x, y - t],
        [x + t, y - t],
        [x + (t * 2), y - t],
        [x - (t * 2), y],
        [x - t, y],
        [x, y],
        [x + t, y],
        [x + (t * 2), y]
    ]
    const [
        b0, b1, b2, b3, b4,
        b5, b6, b7, b8, b9,
        b10, b11, b12, b13, b14,
        b15, b16, b17, b18, b19
    ] = fms
    //faz forma O
    if (f === 0) {
        return [{
                x: b17[0],
                y: b17[1],
                x2: b17[0] + m,
                y2: b17[1] + m
            },
            {
                x: b16[0],
                y: b16[1],
                x2: b16[0] + m,
                y2: b16[1] + m
            },
            {
                x: b11[0],
                y: b11[1],
                x2: b11[0] + m,
                y2: b11[1] + m
            },
            {
                x: b12[0],
                y: b12[1],
                x2: b12[0] + m,
                y2: b12[1] + m
            },
            {
                cor: "#F9FF00",
                sombra: "#7D8000"
            }
        ]
    }
    //faz forma I
    if (f === 1) {
        a = a % 2
        if (a === 1) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b15[0],
                    y: b15[1],
                    x2: b15[0] + m,
                    y2: b15[1] + m
                },
                {
                    x: b16[0],
                    y: b16[1],
                    x2: b16[0] + m,
                    y2: b16[1] + m
                },
                {
                    x: b18[0],
                    y: b18[1],
                    x2: b18[0] + m,
                    y2: b18[1] + m
                },
                {
                    cor: "#05F2F2",
                    sombra: "#027373"
                }
            ]
        }
        return [{
                x: b17[0],
                y: b17[1],
                x2: b17[0] + m,
                y2: b17[1] + m
            },
            {
                x: b12[0],
                y: b12[1],
                x2: b12[0] + m,
                y2: b12[1] + m
            },
            {
                x: b7[0],
                y: b7[1],
                x2: b7[0] + m,
                y2: b7[1] + m
            },
            {
                x: b2[0],
                y: b2[1],
                x2: b2[0] + m,
                y2: b2[1] + m
            },
            {
                cor: "#05F2F2",
                sombra: "#027373"
            }
        ]
    }
    //faz forma S
    if (f === 2) {
        a = a % 2
        if (a === 1) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b11[0],
                    y: b11[1],
                    x2: b11[0] + m,
                    y2: b11[1] + m
                },
                {
                    x: b6[0],
                    y: b6[1],
                    x2: b6[0] + m,
                    y2: b6[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    cor: "#F60100",
                    sombra: "#750000"
                }
            ]
        }
        return [{
                x: b17[0],
                y: b17[1],
                x2: b17[0] + m,
                y2: b17[1] + m
            },
            {
                x: b16[0],
                y: b16[1],
                x2: b16[0] + m,
                y2: b16[1] + m
            },
            {
                x: b12[0],
                y: b12[1],
                x2: b12[0] + m,
                y2: b12[1] + m
            },
            {
                x: b13[0],
                y: b13[1],
                x2: b13[0] + m,
                y2: b13[1] + m
            },
            {
                cor: "#F60100",
                sombra: "#750000"
            }
        ]
    }
    //faz forma Z
    if (f === 3) {
        a = a % 2
        if (a === 1) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    x: b8[0],
                    y: b8[1],
                    x2: b8[0] + m,
                    y2: b8[1] + m
                },
                {
                    x: b13[0],
                    y: b13[1],
                    x2: b13[0] + m,
                    y2: b13[1] + m
                },
                {
                    cor: "#67B523",
                    sombra: "#1E360A"
                }
            ]
        }
        return [{
                x: b17[0],
                y: b17[1],
                x2: b17[0] + m,
                y2: b17[1] + m
            },
            {
                x: b11[0],
                y: b11[1],
                x2: b11[0] + m,
                y2: b11[1] + m
            },
            {
                x: b12[0],
                y: b12[1],
                x2: b12[0] + m,
                y2: b12[1] + m
            },
            {
                x: b18[0],
                y: b18[1],
                x2: b18[0] + m,
                y2: b18[1] + m
            },
            {
                cor: "#67B523",
                sombra: "#1E360A"
            }
        ]
    }
    //faz forma L
    if (f === 4) {
        if (a === 1) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    x: b13[0],
                    y: b13[1],
                    x2: b13[0] + m,
                    y2: b13[1] + m
                },
                {
                    x: b14[0],
                    y: b14[1],
                    x2: b14[0] + m,
                    y2: b14[1] + m
                },
                {
                    cor: "#F27405",
                    sombra: "#733702"
                }
            ]
        }
        if (a === 2) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b6[0],
                    y: b6[1],
                    x2: b6[0] + m,
                    y2: b6[1] + m
                },
                {
                    x: b7[0],
                    y: b7[1],
                    x2: b7[0] + m,
                    y2: b7[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    cor: "#F27405",
                    sombra: "#733702"
                }
            ]
        }
        if (a === 3) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b16[0],
                    y: b16[1],
                    x2: b16[0] + m,
                    y2: b16[1] + m
                },
                {
                    x: b13[0],
                    y: b13[1],
                    x2: b13[0] + m,
                    y2: b13[1] + m
                },
                {
                    x: b18[0],
                    y: b18[1],
                    x2: b18[0] + m,
                    y2: b18[1] + m
                },
                {
                    cor: "#F27405",
                    sombra: "#733702"
                }
            ]
        }
        return [{
                x: b17[0],
                y: b17[1],
                x2: b17[0] + m,
                y2: b17[1] + m
            },
            {
                x: b12[0],
                y: b12[1],
                x2: b12[0] + m,
                y2: b12[1] + m
            },
            {
                x: b7[0],
                y: b7[1],
                x2: b7[0] + m,
                y2: b7[1] + m
            },
            {
                x: b18[0],
                y: b18[1],
                x2: b18[0] + m,
                y2: b18[1] + m
            },
            {
                cor: "#F27405",
                sombra: "#733702"
            }
        ]
    }
    //faz forma J
    if (f === 5) {
        if (a === 1) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b16[0],
                    y: b16[1],
                    x2: b16[0] + m,
                    y2: b16[1] + m
                },
                {
                    x: b11[0],
                    y: b11[1],
                    x2: b11[0] + m,
                    y2: b11[1] + m
                },
                {
                    x: b18[0],
                    y: b18[1],
                    x2: b18[0] + m,
                    y2: b18[1] + m
                },
                {
                    cor: "#FD50BB",
                    sombra: "#7D285C"
                }
            ]
        }
        if (a === 2) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    x: b7[0],
                    y: b7[1],
                    x2: b7[0] + m,
                    y2: b7[1] + m
                },
                {
                    x: b8[0],
                    y: b8[1],
                    x2: b8[0] + m,
                    y2: b8[1] + m
                },
                {
                    cor: "#FD50BB",
                    sombra: "#7D285C"
                }
            ]
        }
        if (a === 3) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b10[0],
                    y: b10[1],
                    x2: b10[0] + m,
                    y2: b10[1] + m
                },
                {
                    x: b11[0],
                    y: b11[1],
                    x2: b11[0] + m,
                    y2: b11[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    cor: "#FD50BB",
                    sombra: "#7D285C"
                }
            ]
        }
        return [{
                x: b17[0],
                y: b17[1],
                x2: b17[0] + m,
                y2: b17[1] + m
            },
            {
                x: b16[0],
                y: b16[1],
                x2: b16[0] + m,
                y2: b16[1] + m
            },
            {
                x: b7[0],
                y: b7[1],
                x2: b7[0] + m,
                y2: b7[1] + m
            },
            {
                x: b12[0],
                y: b12[1],
                x2: b12[0] + m,
                y2: b12[1] + m
            },
            {
                cor: "#FD50BB",
                sombra: "#7D285C"
            }
        ]
    }
    //faz forma J
    if (f === 6) {
        if (a === 1) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b11[0],
                    y: b11[1],
                    x2: b11[0] + m,
                    y2: b11[1] + m
                },
                {
                    x: b7[0],
                    y: b7[1],
                    x2: b7[0] + m,
                    y2: b7[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    cor: "#9E0095",
                    sombra: "#5E005A"
                }
            ]
        }
        if (a === 2) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b16[0],
                    y: b16[1],
                    x2: b16[0] + m,
                    y2: b16[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    x: b18[0],
                    y: b18[1],
                    x2: b18[0] + m,
                    y2: b18[1] + m
                },
                {
                    cor: "#9E0095",
                    sombra: "#5E005A"
                }
            ]
        }
        if (a === 3) {
            return [{
                    x: b17[0],
                    y: b17[1],
                    x2: b17[0] + m,
                    y2: b17[1] + m
                },
                {
                    x: b12[0],
                    y: b12[1],
                    x2: b12[0] + m,
                    y2: b12[1] + m
                },
                {
                    x: b7[0],
                    y: b7[1],
                    x2: b7[0] + m,
                    y2: b7[1] + m
                },
                {
                    x: b13[0],
                    y: b13[1],
                    x2: b13[0] + m,
                    y2: b13[1] + m
                },
                {
                    cor: "#9E0095",
                    sombra: "#5E005A"
                }
            ]
        }
        return [{
                x: b17[0],
                y: b17[1],
                x2: b17[0] + m,
                y2: b17[1] + m
            },
            {
                x: b11[0],
                y: b11[1],
                x2: b11[0] + m,
                y2: b11[1] + m
            },
            {
                x: b12[0],
                y: b12[1],
                x2: b12[0] + m,
                y2: b12[1] + m
            },
            {
                x: b13[0],
                y: b13[1],
                x2: b13[0] + m,
                y2: b13[1] + m
            },
            {
                cor: "#9E0095",
                sombra: "#5E005A"
            }
        ]
    }
}

function Random(min, max) {
    console.count("Random")
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const salvaBlocos = (blocos) => {
    console.count("salvaBlocos")
    for (let i = 0; i < blocos.length - 1; i++) {
        const {
            x,
            y,
            x2,
            y2
        } = blocos[i]
        const bloco = {
            x,
            y,
            x2,
            y2,
            cor: blocos[4].cor,
            sombra: blocos[4].sombra
        }
        objetos.push(bloco)
    }
    //console.log(objetos)
}

const checkxMinMax = (forma) => {
    //console.count("checkxMinMax")
    const [b1, b2, b3, b4] = forma
    return b1.x > largura / 2 ?
        Math.max(b1.x, b2.x, b3.x, b4.x) :
        Math.min(b1.x, b2.x, b3.x, b4.x)
}

const novaForma = () => {
    console.count("novaForma")
    salvaBlocos(fazFormas(posx, posy, formaAtual, angulo))
    formaAtual = proximaForma
    proximaForma = Math.floor((Math.random() * 7))
    //console.log("objetos") 
    posx = 500
    posy = -200
    angulo = Math.floor((Math.random() * 4))
}

const atualiza = () => {
    //console.count("atualiza")
    if (objetos.some(obj => obj.y <= 0)) {
        console.log("fim")
        perdeu = true
        iniciou = false
        reset()
        return
    }
    if (colidiuBaixo(fazFormas(posx, posy, formaAtual, angulo), objetos, t)) {
        novaForma()
        return
    }
    posy += 100
    let [pontuou, cord] = marcouPonto()
    if (pontuou) {
        animaPonto(cord)
        atualizaPontos()
        console.log(recorde)
        return
    }
}

const desenhaProxima = (forma, i) => {
    //console.count("desenhaProxima")
    let bloco = forma
    let {
        x,
        y,
        x2,
        y2
    } = bloco[i]
    let {
        cor,
        sombra
    } = bloco[4]
    gradiente(cor, sombra, x, y, x2, y2)
    ctx2.fillRect(x - posx + 250, y - posy + 400, t, t)
    ctx2.strokeRect(x - posx + 250, y - posy + 400, t, t)
}

const removeObjetos = (cord) => {
    console.count("removeObjetos")
    //       for (let obj of objetos) {
    //           if(obj.y == cord) {
    //             console.log(obj )
    //             console.count("removeu no 1")
    //             //objetos.splice(i, 1)
    //           } 
    //       }
    console.log(objetos)
    objetos.forEach((obj, i) => {
        if (obj.y == cord) {
            console.log(objetos[i])
            console.count("removeu no 1")
            objetos.splice(i, 1)
        }
    })
    objetos.forEach((obj, i) => {
        if (obj.y == cord) {
            console.log(objetos[i])
            console.count("removeu no 2")
            objetos.splice(i, 1)
        }
    })
    objetos.forEach((obj, i) => {
        if (obj.y == cord) {
            console.log(objetos[i])
            console.count("removeu no 3")
            objetos.splice(i, 1)
        }
    })
    console.log(cord)
    objetos = objetos.map(f => {
        return {
            x: f.x,
            y: f.y > cord ? f.y : f.y + t,
            x2: f.x2,
            y2: f.y > cord ? f.y2 : f.y2 + t,
            cor: f.cor,
            sombra: f.sombra
        }
    })
    console.table(objetos)
}

const animaPonto = (cord) => {
    console.count("animaPonto")
    var gradientePonto =
        ctx.createLinearGradient(0, cord, largura, t)
    gradientePonto.addColorStop(0, "#EBEBEB")
    gradientePonto.addColorStop(1, "#121212")
    ctx.fillStyle = gradientePonto
    ctx.fillRect(0, cord, largura, t)
    ctx.strokeRect(0, cord, largura, t)
    removeObjetos(cord)

}

let px = 30
let py = 80
let dpy = 480

const desenha = () => {
    //ctx.save()
    //console.count("desenha")
    ctx.clearRect(0, 0, largura, altura)
    ctx.lineWidth = 4
    ctx.strokeStyle = "#121212"
    ctx.fillStyle = "#333333"
    ctx.fillRect(0, 0, largura, altura)
    ctx2.clearRect(0, 0, largura, altura)
    ctx2.lineWidth = 4
    ctx2.strokeStyle = "#121212"
    ctx2.fillStyle = "#333333"
    ctx2.fillRect(0, 0, largura, altura)

    for (let i = 0; i < objetos.length; i++) {
        const {
            x,
            y,
            x2,
            y2,
            cor,
            sombra
        } = objetos[i]
        gradiente(cor, sombra, x, y, x2, y2)
        ctx.fillRect(x, y, t, t)
        ctx.strokeRect(x, y, t, t)
        ctx.fillStyle = "#ddd"
        if (DEBUG.checked) {
            ctx.font = `bold 30px Monospace `
            ctx.fillText(i, x + 20, y + 30);
            ctx.fillText(x, x + 20, y + 60);
            ctx.fillText(y, x + 20, y + 85);
        }
    }

    //requestAnimationFrame(desenha) 
    for (let i = 0; i < 4; i++) {
        let bloco = fazFormas(posx, posy, formaAtual, angulo)
        let {
            x,
            y,
            x2,
            y2
        } = bloco[i]
        let {
            cor,
            sombra
        } = bloco[4]
        gradiente(cor, sombra, x, y, x2, y2)
        ctx.fillRect(x, y, t, t)
        ctx.strokeRect(x, y, t, t)
        ctx.fillStyle = "#ddd"
        if (DEBUG.checked) {
            ctx.font = `bold 30px Monospace `
            ctx.fillText("index: " + i, px, 2 * py + i * dpy)
            ctx.fillText("X " + x, px, 3 * py + i * dpy)
            ctx.fillText("Y " + y, px, 4 * py + i * dpy)
            ctx.fillText("x2 " + x2, px, 5 * py + i * dpy)
            ctx.fillText("y2 " + y2, px, 6 * py + i * dpy)
            ctx.fillText(x2 - x, px + 150, 5 * py + i * dpy)
            ctx.fillText(y2 - y, px + 150, 6 * py + i * dpy)
            ctx.fillText("ângulo:" + angulo, px, py)
            ctx.fillText("posx:" + posx, px + 200, py)
            ctx.fillText("posy:" + posy, px + 400, py)
            ctx.font = `bold 80px Monospace `
            ctx.fillText(i, x + 20, y + 85)
        }
        desenhaProxima(fazFormas(posx, posy, proximaForma, 0), i)
        //ctx.restore()
    }
    if (!iniciou) {
        //ctx.fillStyle = "rgba(51,51,51,.5)" 
        //ctx.fillRect(0,0,largura,altura)
        //ctx.fillStyle = "#f00" 
        ctx.fillStyle = "#ddd"
        ctx.font = `70px 'Press Start 2P' `
        ctx.fillText("Aperte o play", 50, 950)
        ctx.fillText("para começar", 80, 1130)
        if (perdeu) {
            ctx.fillText("voce marcou", 100, 1310)
            ctx.fillText(pontos + " pontos!", 200, 1450)
        }
        //ctx.restore()
        return
    }


    atualiza()

}

let limeteDaForma = () => checkxMinMax(
    fazFormas(posx, posy, formaAtual, angulo)
)

const colidiuEsquerda = (forma, objs) => {
    //console.count("colidiuEsquerda")
    let novo = forma.map(f => {
        return {
            x: f.x -= t,
            y: f.y
        }
    })
    //console.log(novo)
    let [b0, b1, b2, b3] = novo
    if (objs.some(obj => obj.x == b0.x && obj.y == b0.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b1.x && obj.y == b1.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b2.x && obj.y == b2.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b3.x && obj.y == b3.y)) {
        return true
    }
    return false
}

const colidiuDireita = (forma, objs) => {
    //console.count("colidiuDireita")
    let novo = forma.map(f => {
        return {
            x: f.x + t,
            y: f.y
        }
    })
    //console.log(novo)
    let [b0, b1, b2, b3] = novo
    if (objs.some(obj => obj.x == b0.x && obj.y == b0.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b1.x && obj.y == b1.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b2.x && obj.y == b2.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b3.x && obj.y == b3.y)) {
        return true
    }
    return false
}

const colidiuGiro = (forma, objs) => {
    //console.count("colidiuGiro")
    //let novo = forma.map(f => {
    //return {x: f.x + t, y: f.y} 
    //})
    //console.log(novo)
    if (forma.some(f => f.x <= 0 || f.x >= largura)) {
        return true
    }
    let [b0, b1, b2, b3] = forma
    if (objs.some(obj => obj.x == b0.x && obj.y == b0.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b1.x && obj.y == b1.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b2.x && obj.y == b2.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b3.x && obj.y == b3.y)) {
        return true
    }
    return false
}

const colidiuBaixo = (forma, objs, tam) => {
    //console.count("colidiuBaixo")
    let novo = forma.map(f => {
        return {
            x: f.x,
            y: f.y + tam
        }
    })
    //console.table(novo)
    //console.table(objs) 
    if (novo.some(bf => bf.y >= altura)) {
        return true
    }
    let [b0, b1, b2, b3] = novo
    if (objs.some(obj => obj.x == b0.x && b0.y == obj.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b1.x && b1.y == obj.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b2.x && b2.y == obj.y)) {
        return true
    }
    if (objs.some(obj => obj.x == b3.x && b3.y == obj.y)) {
        return true
    }
    return false
}

const esp = () => {
    let prxangulo = angulo == 3 ? 0 : angulo + 1
    if (colidiuGiro(fazFormas(posx, posy, formaAtual, prxangulo), objetos, t)) {
        return
    }
    angulo < 3 ? angulo += 1 : angulo = 0
}

const c = () => {
    posy -= t
    desenha()
}

const b = () => {
    if (colidiuBaixo(fazFormas(posx, posy, formaAtual, angulo), objetos, t)) {
        return
    }
    posy += t
}

const e = () => {
    if (colidiuEsquerda(fazFormas(posx, posy, formaAtual, angulo), objetos)) {
        return
    }
    if (limeteDaForma() === 0) {
        return
    }
    posx -= t
    desenha()
}

const d = () => {
    if (colidiuDireita(fazFormas(posx, posy, formaAtual, angulo), objetos)) {
        return
    }
    if (limeteDaForma() + t === largura) {
        return
    }
    posx += t
    desenha()
}

const pausar = () => {
    if (iniciou) {
        iniciou = false
        return
    }
    iniciou = true
}


BODY.addEventListener("keydown", (evt) => {
    if (evt.code == "ArrowUp") {
        c()
    }
    if (evt.code == "ArrowLeft") {
        e()
    }
    if (evt.code == "ArrowDown") {
        b()
    }
    if (evt.code == "ArrowRight") {
        d()
    }
    if (evt.code == "Space") {
        esp()
    }
    //console.log(evt.code )
});

setInterval(desenha, attTela)


//colocar os .length em variaveis