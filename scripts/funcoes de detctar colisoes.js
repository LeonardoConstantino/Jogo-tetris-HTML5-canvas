import {altura, largura, t }from './constantes de controle.js'

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

export { colidiuBaixo, colidiuGiro, colidiuDireita, colidiuEsquerda }