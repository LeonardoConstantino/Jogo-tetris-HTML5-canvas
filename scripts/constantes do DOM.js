//constantes do DOM
const BODY = document.querySelector("body")
const PONTOS = document.querySelector(".pontos")
const RECORDE = document.querySelector(".recorde")
const BTNS = document.querySelectorAll(".button")
const DEBUG = document.querySelector("#debug")
const canvas = document.querySelector("#canvas")
const ctx = canvas.getContext("2d")
const canvas2 = document.querySelector("#cvspxm")
const ctx2 = canvas2.getContext("2d")

export  {
    BODY,
    PONTOS,
    RECORDE,
    BTNS,
    DEBUG,
    canvas,
    ctx,
    canvas2,
    ctx2
}