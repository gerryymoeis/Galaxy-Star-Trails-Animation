const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

canvas.width = window.innerWidth
canvas.height = window.innerHeight

// Declare some Function or Event Listener
window.addEventListener("resize", () =>{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

let mouseDown = false

window.addEventListener("mousedown", () =>{
    mouseDown = true
})

window.addEventListener("mouseup", () =>{
    mouseDown = false
})

function randomIntFromRange(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors){
    return colors[Math.floor(Math.random() * colors.length)];
}

function drawStar(positionX, positionY, spikes, outerRadius, innerRadius){
    let rotation = Math.PI / 2 * 3
    let x = positionX
    let y = positionY
    let step = Math.PI / spikes

    ctx.beginPath()
    ctx.moveTo(positionX, positionY - outerRadius)
    for(let i = 0; i < spikes; i++){
        x = positionX + Math.cos(rotation) * outerRadius
        y = positionY + Math.sin(rotation) * outerRadius

        ctx.lineTo(x, y)
        rotation += step

        x = positionX + Math.cos(rotation) * innerRadius
        y = positionY + Math.sin(rotation) * innerRadius

        ctx.lineTo(x, y)
        rotation += step
    }
    ctx.lineTo(positionX, positionY - outerRadius)
    ctx.closePath()
}

const colors = ['#2185c5', '#7ecefd', '#fff6es', '#ff7f66', '#a87bff']

let wobble = 0
let shadowBlur = 15
let velocity = 0.002

// Declare Object Class Particle
class Particle{
    constructor(moveRadius, step, position, size, color){
        this.moveRadius = moveRadius
        this.step = step
        this.stepBase = step
        this.position = position
        this.size = size
        this.color = color
    }

    draw(){
        wobble += 0.00005
        let x = (Math.cos(this.position)) * this.moveRadius + canvas.width / 2
        let y = (Math.sin(this.position)) * this.moveRadius + canvas.height / 2

        // drawStar(x, y, 5, this.size, this.size / 2)
        ctx.beginPath()
        ctx.arc(x, y, this.size, 0, Math.PI * 2, false)
        ctx.save()
        ctx.shadowColor = this.color
        ctx.shadowBlur = shadowBlur
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.restore()
        ctx.closePath()
    }

    update(){
        this.position += velocity

        if(mouseDown == true && shadowBlur >= 5 && velocity < 0.02){
            shadowBlur += (5 - shadowBlur) * 0.01
            velocity += (0.02 - velocity) * 0.01
        }
        else if(mouseDown != true && shadowBlur <= 15 && velocity > 0.002){
            shadowBlur += (15 - shadowBlur) * 0.1
            velocity += (0.002 - velocity) * 0.1
        }

        // if(mouseDown == true && shadowBlur > 5 && this.step < 0.1){
        //     shadowBlur -= 0.1
        //     this.step += 0.005
        // }
        // else if(mouseDown != true && shadowBlur <= 15 && this.step > this.stepBase){
        //     shadowBlur += 1
        //     this.step -= 0.005
        // }

        this.draw()
    }
}

// Implementation / Init Function
let particleArray

function init(){
    particleArray = []
    particleAmount = 500

    for(let i = 0; i < particleAmount; i++){
        let size = Math.random() * 4 + 1
        let moveRadius = randomIntFromRange(size, canvas.width - size)
        let step = 0.002
        let position = Math.random() * (Math.PI * 2)
        let color = randomColor(colors)
        
        particleArray.push(new Particle(moveRadius, step, position, size, color))
    }
}

// Animation Function
let alpha = 1

function animate(){
    requestAnimationFrame(animate)
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    particleArray.forEach(particle => {
        particle.update()
    })

    if(mouseDown == true && alpha >= 0.01){
        alpha += (0.01 - alpha) * 0.01
    }
    else if(mouseDown != true && alpha < 1){
        alpha += (1 - alpha) * 0.01
    }
}

init()
animate()