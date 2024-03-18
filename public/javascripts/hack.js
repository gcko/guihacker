let settings = {
  canvas: document.querySelector(".hacker-3d"),
  ctx: document.querySelector(".hacker-3d").getContext("2d"),
  canvasBars: document.querySelector(".bars-and-stuff"),
  ctxBars: document.querySelector(".bars-and-stuff").getContext("2d"),
  outputConsole: document.querySelector(".output-console"),
  vpx: 0,
  vpy: 0,
  focal: 0,
  color: "#00FF00",
  title: "Gui Hacker",
  gui: true
};

/* Graphics stuff */
function Square(z) {
  this.width = settings.canvas.width / 2;
  this.height = settings.canvas.height;
  z = z || 0;

  const canvas = settings.canvas;

  this.points = [
    new Point({
      x: (canvas.width / 2) - this.width,
      y: (canvas.height / 2) - this.height,
      z: z,
    }),
    new Point({
      x: (canvas.width / 2) + this.width,
      y: (canvas.height / 2) - this.height,
      z: z
    }),
    new Point({
      x: (canvas.width / 2) + this.width,
      y: (canvas.height / 2) + this.height,
      z: z
    }),
    new Point({
      x: (canvas.width / 2) - this.width,
      y: (canvas.height / 2) + this.height,
      z: z
    })
  ];
  this.dist = 0;
}

Square.prototype.update = function () {
  for (const element of this.points) {
    element.rotateZ(0.001);
    element.z -= 3;
    if (element.z < -300) {
      element.z = 2700;
    }
    element.map2D();
  }
};

Square.prototype.render = function () {
  settings.ctx.beginPath();
  settings.ctx.moveTo(this.points[0].xPos, this.points[0].yPos);

  for (let p = 1; p < this.points.length; p++) {
    if (this.points[p].z > -(settings.focal - 50)) {
      settings.ctx.lineTo(this.points[p].xPos, this.points[p].yPos);
    }
  }

  settings.ctx.closePath();
  settings.ctx.stroke();

  this.dist = this.points[this.points.length - 1].z;
};

function Point(pos) {
  this.x = pos.x - settings.canvas.width / 2 || 0;
  this.y = pos.y - settings.canvas.height / 2 || 0;
  this.z = pos.z || 0;

  this.cX = 0;
  this.cY = 0;
  this.cZ = 0;

  this.xPos = 0;
  this.yPos = 0;

  this.map2D();
}

Point.prototype.rotateZ = function (angleZ) {
  const cosZ = Math.cos(angleZ),
    sinZ = Math.sin(angleZ),
    y1 = this.y * cosZ + this.x * sinZ;

  this.x = this.x * cosZ - this.y * sinZ;
  this.y = y1;
};

Point.prototype.map2D = function () {
  const scaleX = settings.focal / (settings.focal + this.z + this.cZ),
    scaleY = settings.focal / (settings.focal + this.z + this.cZ);

  this.xPos = settings.vpx + (this.cX + this.x) * scaleX;
  this.yPos = settings.vpy + (this.cY + this.y) * scaleY;
};

// ** Main function **//
function GuiHacker() {
  this.squares = [];

  this.barVals = [];
  this.sineVal = [];

  for (let i = 0; i < 15; i++) {
    this.squares.push(new Square(-300 + (i * 200)));
  }

  // Console stuff
  this.commandStart = [
    'Performing DNS Lookups for ',
    'Searching ',
    'Analyzing ',
    'Estimating Approximate Location of ',
    'Compressing ',
    'Requesting Authorization From : ',
    'wget -a -t ',
    'tar -xzf ',
    'Entering Location ',
    'Compilation Started of ',
    'Downloading '
  ];
  this.commandParts = [
    'Data Structure',
    'http://wwjd.com?au&2',
    'Texture',
    'TPS Reports',
    ' .... Searching ... ',
    'http://zanb.se/?23&88&far=2',
    'http://ab.ret45-33/?timing=1ww'
  ];
  this.responses = [
    'Authorizing ',
    'Authorized...',
    'Access Granted..',
    'Going Deeper....',
    'Compression Complete.',
    'Compilation of Data Structures Complete..',
    'Entering Security Console...',
    'Encryption Unsuccesful Attempting Retry...',
    'Waiting for response...',
    '....Searching...',
    'Calculating Space Requirements '
  ];
  this.isProcessing = false;
  this.processTime = 0;
  this.lastProcess = 0;

  this.render();
  this.consoleOutput();
}

GuiHacker.prototype.render = function () {
  let i;
  let len = this.squares.length;
  const ctx = settings.ctx,
    canvas = settings.canvas,
    ctxBars = settings.ctxBars,
    canvasBars = settings.canvasBars;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  this.squares.sort(function (a, b) {
    return b.dist - a.dist;
  });

  for (i = 0; i < len; i++) {
    const square = this.squares[i];
    square.update();
    square.render();
  }

  ctxBars.clearRect(0, 0, canvasBars.width, canvasBars.height);

  ctxBars.beginPath();
  const y = canvasBars.height / 6;
  ctxBars.moveTo(0, y);

  for (i = 0; i < canvasBars.width; i++) {
    let ran = (Math.random() * 20) - 10;
    if (Math.random() > 0.98) {
      ran = (Math.random() * 50) - 25;
    }
    ctxBars.lineTo(i, y + ran);
  }

  ctxBars.stroke();

  for (i = 0; i < canvasBars.width; i += 20) {
    if (!this.barVals[i]) {
      this.barVals[i] = {
        val: Math.random() * (canvasBars.height / 2),
        freq: 0.1,
        sineVal: Math.random() * 100
      };
    }

    let barVal = this.barVals[i];
    barVal.sineVal += barVal.freq;
    barVal.val += Math.sin(barVal.sineVal * Math.PI / 2) * 5;
    ctxBars.fillRect(i + 5, canvasBars.height, 15, -barVal.val);
  }

  const self = this;
  requestAnimationFrame(function () {
    self.render();
  });
};

GuiHacker.prototype.consoleOutput = function () {
  let textEl = document.createElement('p');

  if (this.isProcessing) {
    textEl = document.createElement('span');
    textEl.textContent += Math.random() + " ";
    if (Date.now() > this.lastProcess + this.processTime) {
      this.isProcessing = false;
    }
  } else {
    let commandType = ~~(Math.random() * 4);
    switch (commandType) {
      case 0:
        textEl.textContent = this.commandStart[~~(Math.random() * this.commandStart.length)] + this.commandParts[~~(Math.random() * this.commandParts.length)];
        break;
      case 3:
        this.isProcessing = true;
        this.processTime = ~~(Math.random() * 5000);
        this.lastProcess = Date.now();
        break;
      default:
        textEl.textContent = this.responses[~~(Math.random() * this.responses.length)];
        break;
    }
  }

  const outputConsole = settings.outputConsole;
  outputConsole.scrollTop = outputConsole.scrollHeight;
  outputConsole.appendChild(textEl);

  if (outputConsole.scrollHeight > window.innerHeight) {
    let removeNodes = outputConsole.querySelectorAll('*');
    for (let n = 0; n < ~~(removeNodes.length / 3); n++) {
      outputConsole.removeChild(removeNodes[n]);
    }
  }

  const self = this;
  setTimeout(function () {
    self.consoleOutput();
  }, ~~(Math.random() * 200));
};


// Settings
let hash = decodeURIComponent(document.location.hash.substring(1)),
  userSettings = {};

if (hash) {
  userSettings = JSON.parse(hash);
  if (userSettings && userSettings.title !== undefined) {
    document.title = userSettings.title;
  }

  if (userSettings && userSettings.gui !== undefined) {
    settings.gui = userSettings.gui;
  }

  settings.color = userSettings.color || settings.color;
}

const adjustCanvas = (() => {
  if (settings.gui) {
    settings.canvas.width = (window.innerWidth / 3) * 2;
    settings.canvas.height = window.innerHeight / 3;

    settings.canvasBars.width = window.innerWidth / 3;
    settings.canvasBars.height = settings.canvas.height;

    settings.outputConsole.style.height = (window.innerHeight / 3) * 2 + 'px';
    settings.outputConsole.style.top = window.innerHeight / 3 + 'px';

    settings.focal = settings.canvas.width / 2;
    settings.vpx = settings.canvas.width / 2;
    settings.vpy = settings.canvas.height / 2;

    settings.ctx.strokeStyle = settings.ctxBars.strokeStyle = settings.ctxBars.fillStyle = settings.color;
  } else {
    document.querySelector(".hacker-3d").style.display = "none";
    document.querySelector(".bars-and-stuff").style.display = "none";
  }
  document.body.style.color = settings.color;
});

const _ = new GuiHacker(settings);
adjustCanvas();
window.addEventListener('resize', adjustCanvas);
