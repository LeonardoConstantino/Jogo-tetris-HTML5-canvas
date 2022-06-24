import fazFormas from './scripts/funcao fazFormas.js'

import {
    largura,
    altura,
    paddingX,
    paddingY,
    paddingYExtra,
    t,
    dificuldade,
} from './scripts/constantes de controle.js'

import {
    BODY,
    PONTOS,
    RECORDE,
    BTNS,
    DEBUG,
    canvas,
    ctx,
    canvas2,
    ctx2
} from './scripts/constantes do DOM.js'

//tamanho do canvas
canvas.width = largura
canvas.height = altura
canvas2.width = largura/100*60
canvas2.height = largura/100*60

let iniciou = false
let perdeu = false
let posx = 500
let posy = -200
let attTela = 500
let pontos = 0
let angulo = Math.floor((Math.random() * 4))
let formaAtual = Math.floor((Math.random() * 7))
let proximaForma = Math.floor((Math.random() * 7))
let objetos = []
let recorde =
    localStorage.getItem('recorde') ?
    localStorage.getItem('recorde') : 0
RECORDE.innerHTML = recorde < 10 ? "0" + recorde : recorde

const atualizaPontos = () => {
    pontos += 1
    attDificuldade()
    PONTOS.innerHTML = pontos < 10 ? "0" + pontos : pontos
    if (pontos > recorde) {
        atualizaRecorde(pontos)
    }
}

const atualizaRecorde = (v) => {
    localStorage.setItem('recorde', v)
    RECORDE.innerHTML = localStorage.getItem('recorde') < 10
        ? "0" + localStorage.getItem('recorde')
        : localStorage.getItem('recorde')
}

const reset = () => {
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
}

const marcouPonto = () => {
    let acc = 0
    let i = altura / t
    let somaDosX = 4500
    for (i; i >= 0; i--) {
        let res = objetos.filter(o => o.y === i * t)
            .reduce((p, c) => p + c.x, acc)
        if (res == somaDosX) {
            return [true, i * t]
        }
    }
    return [false, false]
}

const gradiente = (cor1, cor2, x1, y1, x2, y2) => {
    var lineargradient = ctx.createLinearGradient(x1, y1, x2, y2)
    lineargradient.addColorStop(0, cor1)
    lineargradient.addColorStop(1, cor2)
    ctx.fillStyle = lineargradient
    var lineargradient2 =  ctx2.createLinearGradient(
        x1 - posx + 250,
        y1 - posy + 400,
        x2 - posx + 250,
        y2 - posy + 400
    )
    lineargradient2.addColorStop(0, cor1)
    lineargradient2.addColorStop(1, cor2)
    ctx2.fillStyle = lineargradient2
}

const salvaBlocos = (blocos) => {
    for (let i = 0; i < blocos.length - 1; i++) {
        const { x, y, x2, y2 } = blocos[i]
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
}

const checkxMinMax = (forma) => {
    const [b1, b2, b3, b4] = forma
    return b1.x > largura / 2
    ? Math.max(b1.x, b2.x, b3.x, b4.x)
    : Math.min(b1.x, b2.x, b3.x, b4.x)
}

const novaForma = () => {
    salvaBlocos(fazFormas(posx, posy, formaAtual, angulo))
    formaAtual = proximaForma
    proximaForma = Math.floor((Math.random() * 7))
    posx = 500
    posy = -200
    angulo = Math.floor((Math.random() * 4))
}

const atualiza = () => {
    if (objetos.some(obj => obj.y <= 0)) {
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
    let bloco = forma
    let { x, y, x2, y2 } = bloco[i]
    let { cor, sombra } = bloco[4]
    gradiente(cor, sombra, x, y, x2, y2)
    ctx2.fillRect(x - posx + 250, y - posy + 400, t, t)
    ctx2.strokeRect(x - posx + 250, y - posy + 400, t, t)
}

const removeObjetos = (cord) => {
    console.log(objetos)
    objetos.forEach((obj, i) => {
        if (obj.y == cord) {
            objetos.splice(i, 1)
        }
    })
    objetos.forEach((obj, i) => {
        if (obj.y == cord) {
            objetos.splice(i, 1)
        }
    })
    objetos.forEach((obj, i) => {
        if (obj.y == cord) {
            objetos.splice(i, 1)
        }
    })
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
}

const animaPonto = (cord) => {
    console.count("animaPonto")
    var gradientePonto = ctx.createLinearGradient(0, cord, largura, t)
    gradientePonto.addColorStop(0, "#EBEBEB")
    gradientePonto.addColorStop(1, "#121212")
    ctx.fillStyle = gradientePonto
    ctx.fillRect(0, cord, largura, t)
    ctx.strokeRect(0, cord, largura, t)
    removeObjetos(cord)
}

const desenha = () => {
    if (!iniciou) {
        ctx.fillStyle = "#ddd"
        ctx.font = `70px 'Press Start 2P' `
        ctx.fillText("Aperte o play", 50, 950)
        ctx.fillText("para começar", 80, 1130)
        if (perdeu) {
            ctx.fillText("voce marcou", 100, 1310)
            ctx.fillText(pontos + " pontos!", 200, 1450)
        }
        return
    }
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
            ctx.fillText("index: " + i, paddingX, 2 * paddingY + i * paddingYExtra)
            ctx.fillText("X " + x, paddingX, 3 * paddingY + i * paddingYExtra)
            ctx.fillText("Y " + y, paddingX, 4 * paddingY + i * paddingYExtra)
            ctx.fillText("x2 " + x2, paddingX, 5 * paddingY + i * paddingYExtra)
            ctx.fillText("y2 " + y2, paddingX, 6 * paddingY + i * paddingYExtra)
            ctx.fillText(x2 - x, paddingX + 150, 5 * paddingY + i * paddingYExtra)
            ctx.fillText(y2 - y, paddingX + 150, 6 * paddingY + i * paddingYExtra)
            ctx.fillText("ângulo:" + angulo, paddingX, paddingY)
            ctx.fillText("posx:" + posx, paddingX + 200, paddingY)
            ctx.fillText("posy:" + posy, paddingX + 400, paddingY)
            ctx.font = `bold 80px Monospace `
            ctx.fillText(i, x + 20, y + 85)
        }
        desenhaProxima(fazFormas(posx, posy, proximaForma, 0), i)
    }
    atualiza()
}

let limeteDaForma = () => checkxMinMax(
    fazFormas(posx, posy, formaAtual, angulo)
)

const colidiuEsquerda = (forma, objs) => {
    let novo = forma.map(f => {
        return {  x: f.x -= t,  y: f.y }
    })
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
    let novo = forma.map(f => {
        return {  x: f.x + t,  y: f.y }
    })
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
    let novo = forma.map(f => {
        return {  x: f.x,  y: f.y + tam  }
    })
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

const gira = () => {
    if (!iniciou) return
    let prxangulo = angulo == 3 ? 0 : angulo + 1
    if (colidiuGiro(fazFormas(posx, posy, formaAtual, prxangulo), objetos, t)) {
        return
    }
    angulo < 3 ? angulo += 1 : angulo = 0
}

const moveCima = () => {
    if (!iniciou) return
    posy -= t
}

const moveBaixo = () => {
    if (!iniciou) return
    if (colidiuBaixo(fazFormas(posx, posy, formaAtual, angulo), objetos, t)) {
        return
    }
    posy += t
}

const moveEsquerda = () => {
    if (!iniciou) return
    if (colidiuEsquerda(fazFormas(posx, posy, formaAtual, angulo), objetos)) {
        return
    }
    if (limeteDaForma() === 0) return
    posx -= t
}

const moveDireita = () => {
    if (!iniciou) return
    if (colidiuDireita(fazFormas(posx, posy, formaAtual, angulo), objetos)) {
        return
    }
    if (limeteDaForma() + t === largura) return
    posx += t
}

const pausar = () => {
    if (iniciou) {
        iniciou = false
        return
    }
    iniciou = true
}

const chamaFuncao = (key) => {
    const keys = {
        "ArrowUp" : moveCima,
        "ArrowLeft" : moveEsquerda,
        "ArrowDown" : moveBaixo,
        "ArrowRight" : moveDireita,
        "Space" : gira,
        "KeyP" : pausar,
        "KeyR" : reset,
    }
    return keys[key]
}

BODY.addEventListener("keydown", (evt) => {
    chamaFuncao(evt.code)()
})

BTNS.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const BUTTONKEY = e.target.dataset.buttonKey
        chamaFuncao(BUTTONKEY)()
    })
})

const attDificuldade = ()=>{
    setInterval(desenha, attTela)
    attTela -= dificuldade
}
attDificuldade()