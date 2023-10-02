// random helper
rand = (min, max) => Math.random() * (max - min) + min;

const colors = {
    green: {
        front: '#3b870a',
        back: '#235106',
        color: 'green'
    },
    yellow: {
        front: '#b9b900',
        back: '#6f6f00',
        color: 'yellow'
    },
    red: {
        front: '#e23d34',
        back: '#88251f',
        color: 'red'
    },
    pink: {
        front: '#cd3168',
        back: '#7b1d3e',
        color: 'pink'
    },
    mylar: {
        front: '#eeeeee',
        back: '#dddddd',
        color: 'mylar'
    },
    blue: {
        front: '#394f78',
        back: '#222f48',
        color: 'blue'
    },
    sky: {
        front: '#008a8a',
        back: '#005353',
        color: 'sky'
    },
    heart: {
        front: '#cc0000',
        back: '#990000',
        color: 'darkred'
    }
};

const colorlist = ['blue', 'green', 'pink', 'red', 'sky', 'yellow', 'mylar', 'heart'];


// params to play with
const confettiParams = {
    // number of confetti per "explosion"
    number: 40,
    // min and max size for each rectangle
    size: {
        x: [3, 20],
        y: [3, 20]
    },
    // power of explosion
    initSpeed: 20,
    // defines how fast particles go down after blast-off
    gravity: 0.25,
    // how wide is explosion
    drag: 0.008,
    // how slow particles are falling
    terminalVelocity: 7,
    // how fast particles are rotating around themselves
    flipSpeed: 0.027,
    victimWidth: 240,
    victimHeight: 240
};

// const colors = [{ front: '#3B870A', back: '#235106', color: 'green' }, { front: '#B96300', back: '#6f3b00', color: 'orange' }, { front: '#E23D34', back: '#88251f', color: 'red' }, { front: '#CD3168', back: '#7b1d3e', color: 'purple' }, { front: '#664E8B', back: '#3d2f53', color: 'violet' }, { front: '#394F78', back: '#222f48', color: 'blue' }, { front: '#008A8A', back: '#005353', color: 'cyan' }, ];

// Confetti constructor
function Conf(color) {
    this.randomModifier = rand(-1, 1);

    if (!color) {
        color = colorlist[Math.floor(rand(0, colorlist.length))];
    }

    this.colorPair = colors[color];
    this.dimensions = {
        x: rand(confettiParams.size.x[0], confettiParams.size.x[1]),
        y: rand(confettiParams.size.y[0], confettiParams.size.y[1]),
    };
    this.position = {
        x: clickPosition[0],
        y: clickPosition[1]
    };
    this.rotation = rand(0, 2 * Math.PI);
    this.scale = {
        x: 1,
        y: 1
    };
    this.velocity = {
        x: rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.3,
        y: rand(-confettiParams.initSpeed, confettiParams.initSpeed) * 0.5
    };
    this.flipSpeed = rand(0.5, 3.5) * confettiParams.flipSpeed;

    if (this.position.y <= window.innerHeight) {
        this.velocity.y = -Math.abs(this.velocity.y);
    }

    this.terminalVelocity = rand(1, 1.5) * confettiParams.terminalVelocity;

    this.update = function() {
        this.velocity.x *= 0.98;
        this.position.x += this.velocity.x;

        this.velocity.y += (this.randomModifier * confettiParams.drag);
        this.velocity.y += confettiParams.gravity;
        this.velocity.y = Math.min(this.velocity.y, this.terminalVelocity);
        this.position.y += this.velocity.y;

        this.scale.y = Math.cos((this.position.y + this.randomModifier) * this.flipSpeed);
        this.color = this.scale.y > 0 ? this.colorPair.front : this.colorPair.back;
    }
}

function updateConfetti() {
    confettiCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    confettiElements.forEach((c, i) => {
        c.update();
        confettiCtx.translate(c.position.x, c.position.y);
        confettiCtx.rotate(c.rotation);
        const width = (c.dimensions.x * c.scale.x);
        const height = (c.dimensions.y * c.scale.y);
        confettiCtx.fillStyle = c.color;
        confettiCtx.fillRect(-0.5 * width, -0.5 * height, width, height);
        c.dimensions.x -= 0.125;
        c.dimensions.y -= 0.125;

        if ((c.dimensions.x < 0) || (c.dimensions.y < 0)) {
            confettiElements.splice(i, 1);
        }
        confettiCtx.setTransform(1, 0, 0, 1, 0, 0)
    });
    /*
        confettiElements.forEach((c, idx) => {
            if (c.position.y > container.h ||
                c.position.x < -0.5 * container.x ||
                c.position.x > 1.5 * container.x) {
                confettiElements.splice(idx, 1)

            }
        });
    */
    if (confettiElements.length) window.requestAnimationFrame(updateConfetti);
}
let container, confettiCtx,
    victimWidth = 240, victimHeight = 240;

function setupCanvas() {
    confettiCtx = document.querySelector("#confetti").getContext('2d');
//    POP.confetti.style.width = POP.currentWidth + 'px';
//    POP.confetti.style.height = POP.currentHeight + 'px';

    
    document.querySelector("#confetti").height = window.innerHeight;
    document.querySelector("#confetti").width = window.innerWidth;

    document.querySelector("#confetti").style.height = window.innerHeight + 'px';
    document.querySelector("#confetti").style.width = window.innerWidth + 'px';

    const box = document.querySelector("#confetti").getBoundingClientRect();

    container = {
        x: box.left,
        y: box.top,
        w: victimWidth,
        h: victimHeight
    };

    /*
    container = {
        w: confetti.clientWidth,
        h: confetti.clientHeight
    };
    */
}

let confettiElements = [];

function addConfetti(e) {
    const canvasBox = confetti.getBoundingClientRect();
    let color = "yellow";
    if (e) {
        if (e.clientX) {
            clickPosition = [
                e.clientX - canvasBox.left,
                e.clientY - canvasBox.top
            ];
        } else if (e.x) {
            clickPosition = [e.x, e.y];
        }
        if (e.color) {
            color = e.color;
        }
    } else {
        clickPosition = [
            victimWidth * Math.random(),
            victimHeight * Math.random()
        ];
    }
    for (let i = 0; i < confettiParams.number; i++) {
        confettiElements.push(new Conf(color))
    }
    window.requestAnimationFrame(updateConfetti);
}

function hideConfetti() {
    confettiElements = [];
    window.cancelAnimationFrame(updateConfetti)
}

// confettiLoop();
function confettiLoop() {
    let x = { x: ~~(Math.random() * 1600) + 100, y: ~~(Math.random() * 800), color: "yellow" };

    addConfetti(x);
    setTimeout(confettiLoop, 700 + Math.random() * 1700);
}

window.onload = setupCanvas;

