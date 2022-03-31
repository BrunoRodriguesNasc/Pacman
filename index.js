const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');
const score = document.querySelector('#score');

canvas.height = innerHeight;
canvas.width = innerWidth;

class Boundary {

    static width = 40;
    static height = 40;
    constructor({ position, image }) {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.image = image;
    }

    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height);
        c.drawImage(this.image, this.position.x, this.position.y);
    }
}

class Pelled {
    constructor({ position }) {
        this.position = position;
        this.radius = 3;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = 'white';
        c.fill();
        c.closePath();
    }
}

class Player {
    constructor({ position, velocity }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.radians = 0.75;
        this.openRate = 0.12;
        this.rotation = 0;
    }

    draw() {
        c.save();
        c.translate(this.position.x, this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x, -this.position.y)
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = 'yellow';
        c.fill();
        c.closePath();
        c.restore();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (this.radians < 0 || this.radians > .75) this.openRate = -this.openRate

        this.radians += this.openRate;
    }
}

class Ghost {
    static speed = 2;
    constructor({ position, velocity, color = 'red' }) {
        this.position = position;
        this.velocity = velocity;
        this.radius = 15;
        this.color = color;
        this.prevCollisions = [];
        this.speed = 2;
    }

    draw() {
        c.beginPath();
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        c.fillStyle = this.color;
        c.fill();
        c.closePath();
    }

    update() {
        this.draw();
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
}

const pellets = [];
const boundaries = [];
const ghosts = [
    new Ghost({
        position: {
            x: Boundary.width * 6 + Boundary.width / 2,
            y: Boundary.height + Boundary.height / 2,
        },
        velocity: {
            x: -Ghost.speed,
            y: 0
        }
    },
    )
];

const player = new Player({
    position: {
        x: Boundary.width + Boundary.width / 2,
        y: Boundary.height + Boundary.height / 2,
    },
    velocity: {
        x: 0,
        y: 0
    }
});

const keys = {
    w: {
        pressed: false,
        lastKey: 'w'
    },
    a: {
        pressed: false,
        lastKey: 'a'
    },
    s: {
        pressed: false,
        lastKey: 's'
    },
    d: {
        pressed: false,
        lastKey: 'd'
    },
}

let lastKey = '';
let scoreValue = 0;
const map = [
    ['1', '-', '-', '-', '-', '-', '-', '2'],
    ['|', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '+', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '|'],
    ['|', '.', '.', '.', '.', '+', '.', '|'],
    ['|', '.', '[', ']', '.', '_', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '3'],
];


function createImage(src) {
    const image = new Image();
    image.src = src;
    return image;
}


map.forEach((row, i) => {
    row.forEach((symbol, j) => {
        switch (symbol) {
            case '-':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/pipeHorizontal.png')
                    })
                )
                break;
            case '|':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/pipeVertical.png')
                    })
                )
                break;
            case '1':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/pipeCorner1.png')
                    })
                )
                break;
            case '2':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/pipeCorner2.png')
                    })
                )
                break;
            case '3':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/pipeCorner3.png')
                    })
                )
                break;
            case '4':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/pipeCorner4.png')
                    })
                )
                break;
            case 'b':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/block.png')
                    })
                )
                break;
            case '_':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/capBottom.png')
                    })
                )
                break;
            case '+':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/capTop.png')
                    })
                )
                break;
            case '[':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/capLeft.png')
                    })
                )
                break;
            case ']':
                boundaries.push(
                    new Boundary({
                        position: {
                            x: Boundary.width * j,
                            y: Boundary.height * i
                        }, image: createImage('./assets/capRight.png')
                    })
                )
                break;
            case '.':
                pellets.push(
                    new Pelled({
                        position: {
                            x: Boundary.width * j + Boundary.width / 2,
                            y: Boundary.height * i + Boundary.height / 2
                        }
                    })
                )
                break;
        }
    })
})

function circleCollidesWithRectangle({ circle, rectangle }) {
    const padding = Boundary.width / 2 - circle.radius - 1;
    return (circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding)
}

let animationId;
function animate() {
    animationId = requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);

    if (keys.w.pressed && lastKey === 'w') {
        for (let i = 0; i < boundaries.length; i++) {
            const b = boundaries[i];
            if (circleCollidesWithRectangle({ circle: { ...player, velocity: { x: 0, y: -5 } }, rectangle: b })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = -5;
            }

        }
    } else if (keys.a.pressed && lastKey === 'a') {
        for (let i = 0; i < boundaries.length; i++) {
            const b = boundaries[i];
            if (circleCollidesWithRectangle({ circle: { ...player, velocity: { x: -5, y: 0 } }, rectangle: b })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = -5;
            }
        }
    } else if (keys.s.pressed && lastKey === 's') {
        for (let i = 0; i < boundaries.length; i++) {
            const b = boundaries[i];
            if (circleCollidesWithRectangle({ circle: { ...player, velocity: { x: 0, y: 5 } }, rectangle: b })) {
                player.velocity.y = 0;
                break;
            } else {
                player.velocity.y = 5;
            }

        }
    } else if (keys.d.pressed && lastKey === 'd') {
        for (let i = 0; i < boundaries.length; i++) {
            const b = boundaries[i];
            if (circleCollidesWithRectangle({ circle: { ...player, velocity: { x: 5, y: 0 } }, rectangle: b })) {
                player.velocity.x = 0;
                break;
            } else {
                player.velocity.x = 5;
            }
        }
    }

    for (let i = pellets.length - 1; 0 < i; i--) {
        const pellet = pellets[i];
        pellet.draw();
        if (Math.hypot(pellet.position.x - player.position.x, pellet.position.y - player.position.y) < pellet.radius + player.radius) {
            pellets.splice(i, 1);
            scoreValue += 10;
            score.innerHTML = scoreValue;
        }
    }

    boundaries.forEach(boundary => {
        boundary.draw();
        if (circleCollidesWithRectangle({ circle: player, rectangle: boundary })) {

            player.velocity.x = 0;
            player.velocity.y = 0;
        }
    });

    player.update();
    ghosts.forEach(ghost => {
        const collisions = [];
        ghost.update();
        if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius) {
            cancelAnimationFrame(animationId);
        }

        boundaries.forEach(boundary => {
            if (!collisions.includes('right') && circleCollidesWithRectangle({ circle: { ...ghost, velocity: { x: Ghost.speed, y: 0 } }, rectangle: boundary })) {
                collisions.push('right');
            }
            if (!collisions.includes('left') && circleCollidesWithRectangle({ circle: { ...ghost, velocity: { x: -Ghost.speed, y: 0 } }, rectangle: boundary })) {
                collisions.push('left');
            }
            if (!collisions.includes('up') && circleCollidesWithRectangle({ circle: { ...ghost, velocity: { x: 0, y: -Ghost.speed } }, rectangle: boundary })) {
                collisions.push('up');
            }
            if (!collisions.includes('down') && circleCollidesWithRectangle({ circle: { ...ghost, velocity: { x: 0, y: Ghost.speed } }, rectangle: boundary })) {
                collisions.push('down');

            }
        })
        if (collisions.length > ghost.prevCollisions.length) {
            ghost.prevCollisions = collisions;

        }
        if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)) {

            if (ghost.velocity.x > 0) {
                ghost.prevCollisions.push('right')
            }
            else if (ghost.velocity.x < 0) {
                ghost.prevCollisions.push('left')
            }
            else if (ghost.velocity.y > 0) {
                ghost.prevCollisions.push('up')
            }
            else if (ghost.velocity.y < 0) {
                ghost.prevCollisions.push('down')
            }
            const pathWays = ghost.prevCollisions.filter(collision => {
                return !collisions.includes(collision);
            })
            const direction = pathWays[Math.floor(Math.random() * pathWays.length)];
            switch (direction) {
                case 'down':
                    ghost.velocity.y = Ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'up':
                    ghost.velocity.y = -Ghost.speed;
                    ghost.velocity.x = 0;
                    break;
                case 'right':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = Ghost.speed;
                    break;
                case 'left':
                    ghost.velocity.y = 0;
                    ghost.velocity.x = -Ghost.speed;
                    break;
            }

            ghost.prevCollisions = [];
        }

    })

    if (player.velocity.x > 0) player.rotation = 0;
    else if (player.velocity.x < 0) player.rotation = Math.PI;
    else if (player.velocity.y > 0) player.rotation = Math.PI / 2;
    else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5;
}


animate();

window.addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = true;
            lastKey = 'w';
            break;
        case 'a':
            keys.a.pressed = true;
            lastKey = 'a';
            break;
        case 's':
            keys.s.pressed = true;
            lastKey = 's';
            break;
        case 'd':
            keys.d.pressed = true;
            lastKey = 'd';
            break;
    }
})

window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'w':
            keys.w.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
        case 's':
            keys.s.pressed = false;
            break;
        case 'd':
            keys.d.pressed = false;
            break;
    }
})