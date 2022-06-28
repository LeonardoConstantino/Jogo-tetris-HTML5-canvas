import { largura, altura, paddingX, paddingY, paddingYExtra, t,  dificuldade, } from './scripts/constantes de controle.js'

import { BODY, PONTOS, RECORDE, BTNS, DEBUG, AUDIOS, canvas, ctx, canvas2, ctx2 } from './scripts/constantes do DOM.js'

import fazFormas from './scripts/funcao fazFormas.js'

import { colidiuBaixo, colidiuGiro, colidiuDireita, colidiuEsquerda } from './scripts/funcoes de detctar colisoes.js'

//tamanho do canvas
canvas.width = largura
canvas.height = altura
canvas2.width = largura/100*60
canvas2.height = largura/100*60

const [
    bateuBloco,
    bateuParede,
    clik,
    fezPonto,
    loopTema,
    mover,
    perdeuSemRecorde,
    play,
    pontoRecorde,
    audioReset
] = AUDIOS

let iniciou = false
let perdeu = false
let semSom = false
let fezRecorde = false
let posx = 500
let posy = -200
let attTela = 500
let intervalo
let pontos = 0
let angulo = Math.floor((Math.random() * 4))
let formaAtual = Math.floor((Math.random() * 7))
let proximaForma = Math.floor((Math.random() * 7))
let objetos = []
let recorde =
    localStorage.getItem('recorde') ?
    localStorage.getItem('recorde') : 0
let recordeAnterior = recorde
RECORDE.innerHTML = recorde < 10 ? "0" + recorde : recorde

const atualizaPontos = () => {
    pontos += 1
    PONTOS.innerHTML = pontos < 10 ? "0" + pontos : pontos
    if (pontos > recorde) {
        tocar_audio(pontoRecorde)
        fezRecorde = true
        atualizaRecorde(pontos)
    }
}

const atualizaRecorde = (v) => {
    localStorage.setItem('recorde', v)
    RECORDE.innerHTML = localStorage.getItem('recorde') < 10
        ? "0" + localStorage.getItem('recorde')
        : localStorage.getItem('recorde')
}

const tocar_audio = (audio, volume = 1, loop, currentTime = '0') =>{
    if (semSom) return
    audio.currentTime = currentTime
    audio.loop = loop
    audio.volume = volume
    audio.play()
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
    tocar_audio(audioReset, 0.2)
    ctx.clearRect(0, 0, largura, altura)
}

const marcouPonto = () => {
    let i = altura / t
    for (i; i >= 0; i--) {
        let res = objetos.filter(o => o.y === i * t)
        if (res.length == 10) {
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
    const forma = fazFormas(posx, posy, formaAtual, angulo)
    if (objetos.some(obj => obj.y <= 0)) {
        perdeu = true
        iniciou = false
        desenha()
        reset()
        return
    }
    if (colidiuBaixo(forma , objetos, t)) {
        tocar_audio(fezPonto, 1, false, 1,)
        novaForma()
        return
    }
    posy += 100
    let [pontuou, cord] = marcouPonto()
    if (pontuou) {
        tocar_audio(fezPonto)
        animaPonto(cord, forma[4])
        atualizaPontos()
        atualizaDificuldade()
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

const animaPonto = (cord, cores) => {
    const { cor, sombra } = cores
    var gradientePonto = ctx.createLinearGradient(0, cord, largura, t)
    gradientePonto.addColorStop(0, cor)
    gradientePonto.addColorStop(1, sombra)
    ctx.fillStyle = gradientePonto
    ctx.fillRect(0, cord, largura, t)
    ctx.strokeRect(0, cord, largura, t)
    removeObjetos(cord)
}

const desenha = () => {
    if (!iniciou) {
        const posYInicial = -200
        const palavraCerta = posy !== posYInicial ? "continuar" : "começar"
        ctx.save()
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 7
        ctx.shadowColor = 'rgba(0, 0, 0, 1)';
        ctx.fillStyle = "#ddd"
        ctx.textAlign = "center"
        ctx.font = `65px 'Press Start 2P' `
        ctx.fillText("Aperte o play", 500, 950)
        ctx.fillText(`para ${palavraCerta}`, 500, 1130)
        if (perdeu) {
            if (fezRecorde) {
                ctx.font = `130px 'Press Start 2P' `
                ctx.fillText("RECORDE", 500, 500)
            }
            tocar_audio(perdeuSemRecorde)
            ctx.font = `65px 'Press Start 2P' `
            ctx.fillText("voce marcou", 500, 1310)
            ctx.fillText(pontos + " pontos!", 500, 1450)
        }
        ctx.restore()
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
            ctx.lineWidth = 3
            for (let i = 0; i < 9; i++) {
                ctx.strokeStyle = "#f00"
                ctx.beginPath();
                ctx.moveTo((i+1)*100, 0);
                ctx.lineTo((i+1)*100, 2000);
                ctx.moveTo(0, (i+1)*100);
                ctx.lineTo(1000, (i+1)*100);
                ctx.moveTo(0, (i+1)*100+900);
                ctx.lineTo(1000, (i+1)*100+900);
                ctx.stroke();
            }
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

const limeteDaForma = () => checkxMinMax(
    fazFormas(posx, posy, formaAtual, angulo)
)

const gira = () => {
    if (!iniciou) return
    let prxangulo = angulo == 3 ? 0 : angulo + 1
    if (colidiuGiro(fazFormas(posx, posy, formaAtual, prxangulo), objetos, t)) {
        return
    }
    tocar_audio(clik, 0.8)
    angulo < 3 ? angulo += 1 : angulo = 0
}

const moveCima = () => {
    if (!iniciou) return
    tocar_audio(mover)
    posy -= t
}

const moveBaixo = () => {
    if (!iniciou) return
    if (colidiuBaixo(fazFormas(posx, posy, formaAtual, angulo), objetos, t)) {
        return
    }
    tocar_audio(mover)
    posy += t
}

const moveEsquerda = () => {
    if (!iniciou) return
    if (colidiuEsquerda(fazFormas(posx, posy, formaAtual, angulo), objetos)) {
        tocar_audio(bateuBloco)
        return
    }
    if (limeteDaForma() === 0) {
         tocar_audio(bateuParede, 0.2)
        return
    }
    tocar_audio(mover)
    posx -= t
}

const moveDireita = () => {
    if (!iniciou) return
    if (colidiuDireita(fazFormas(posx, posy, formaAtual, angulo), objetos)) {
         tocar_audio(bateuBloco)
        return
    }
    if (limeteDaForma() + t === largura) {
        tocar_audio(bateuParede, 0.2)
        return
    }
    tocar_audio(mover)
    posx += t
}

const pausar = () => {
    if (iniciou) {
        iniciou = false
        return
    }
    iniciou = true
    fezRecorde = false
    tocar_audio(play, 0.1)
    tocar_audio(loopTema, 0.1, true)
}

const mutar = () => {
    if (semSom) {
        semSom = false
        tocar_audio(loopTema, 0.1, true)
        return
    }
    AUDIOS.forEach(audio => audio.pause())
    semSom = true
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
        "KeyM" : mutar,
    }
    return keys[key]
}

BODY.addEventListener("keydown", (evt) => {
    if (chamaFuncao(evt.code)) {
        chamaFuncao(evt.code)()
    }
})

BTNS.forEach(btn => {
    btn.addEventListener("click", (e) => {
        const BUTTONKEY = e.target.dataset.buttonKey
        if(chamaFuncao(BUTTONKEY)){
            chamaFuncao(BUTTONKEY)()
        }
    })
})

const atualizaDificuldade = ()=>{
    clearInterval(intervalo)
    intervalo = setInterval(desenha, attTela)
    attTela -= dificuldade
}
atualizaDificuldade()