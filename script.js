// Crear entorno 2d
const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");

//Classes
class Player {
  constructor() {
    this.x = 255;
    this.y = 400;
    this.speedX = 0;
    this.speedY = 0;
    this.image = null;
    this.width = 50;
    this.height = 75;
    this.runImage = "";
    this.runImagesInterval = "";
    this.actions = [];
    this.jumping = false;
  }

  getRunImages() {
    this.runImagesInterval = setInterval(() => {
      if (this.runImage === images.run1) {
        this.runImage = images.run2;
      } else if (this.runImage === images.run2) {
        this.runImage = images.run3;
      } else if (this.runImage === images.run3) {
        this.runImage = images.run4;
      } else if (this.runImage === images.run4) {
        this.runImage = images.run1;
      }
      this.image = this.runImage;
      this.width = 65;
    }, 60);
  }

  getJumpImages() {
    this.width = 68;
    this.image = images.jump1;
    setTimeout(() => {
      this.image = images.jump2;
    }, 250);
    setTimeout(() => {
      this.image = images.jump3;
    }, 320);
    // setTimeout(() => {
    //   this.image = images.jump4;
    // }, 600);
    setTimeout(() => {
      player.actions = player.actions.filter((action) => action !== "jump");
      this.width = 50;
    }, 750);
  }

  attack() {
    this.width = 60;
    this.image = images.attack1;
    setTimeout(() => {
      this.image = images.attack2;
    }, 150);
    setTimeout(() => {
      this.image = images.attack3;
    }, 230);
    setTimeout(() => {
      this.image = images.stand;
      this.width = 50;
      player.actions = player.actions.filter((action) => action !== "attack");
    }, 280);
  }

  jump() {
    this.getJumpImages();
    this.speedY = -7;
    this.y += this.speedY;
    const gravity = setInterval(() => {
      this.speedY++;
      if (this.y >= 380) {
        clearInterval(gravity);
        this.y = 400;
        this.speedY = 0;
        player.jumping = false;
      }
    }, 50);
  }
}

class Background {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 1200;
    this.height = 600;
  }

  update() {}
}
const background_1 = new Background(0, 0);
const background_2 = new Background(1200, 0);
const player = new Player();

//Variables
let counterForImages = 0;
let startGame = false;

const images = {};
const imagesInfo = [
  { url: "1614870923357.png", title: "stand" },
  { url: "1614873424949.png", title: "example" },
  { url: "1614873016362.png", title: "run1" },
  { url: "1614873036309.png", title: "run2" },
  { url: "1614873063261.png", title: "run3" },
  { url: "1614873081388.png", title: "run4" },
  { url: "1614873612743.png", title: "attack1" },
  { url: "1614873641521.png", title: "attack2" },
  { url: "1614873680021.png", title: "attack3" },
  { url: "backgrounds/day.jpeg", title: "backgroundDay" },
  { url: "1614873109599.png", title: "jump1" },
  { url: "1614873132252.png", title: "jump2" },
  { url: "1614873162993.png", title: "jump3" },
  { url: "1614873212104.png", title: "jump4" },
];

//Images loading
for (let i = 0; i < imagesInfo.length; i++) {
  const img = new Image();
  img.src = `images/${imagesInfo[i].url}`;
  if (img.src.includes("background")) {
    const ptrn = ctx.createPattern(img, "repeat");
    ctx.fillStyle = ptrn;
  } //Esto hay que echarle un ojo
  img.onload = () => {
    counterForImages++;
    images[imagesInfo[i].title] = img;
    if (counterForImages === imagesInfo.length) {
      player.image = images.stand;
      player.runImage = images.run1;
      startGame = true;
    }
  };
}

let audio = false;
let musicActivated = true;

//Functions
const checkForLoadedImages = () => {
  return images.length === 2;
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, 1200, 600);
};

const checkForRunningOutbounds = () => {
  if (player.x >= 800) {
    player.x = 800;
  }
};

const updatePlayer = () => {
  if (!player.actions.length) {
    player.image = images.stand;
  }
  checkForRunningOutbounds();
  player.x += player.speedX;
  player.y += player.speedY;
};

const drawBackgrounds = () => {
  ctx.drawImage(
    images.backgroundDay,
    background_1.x,
    background_1.y,
    background_1.width,
    background_1.height
  );
  ctx.drawImage(
    images.backgroundDay,
    background_2.x,
    background_2.y,
    background_2.width,
    background_2.height
  );
};

const updateBackground = () => {
  if (player.x > 800) {
    if (background_1.x <= -1200) {
      background_1.x = 1200;
    }
    if (background_2.x <= -1200) {
      background_2.x = 1200;
    }
    background_1.x -= 5;
    background_2.x -= 5;
  }
};

const drawPlayer = (image) => {
  ctx.drawImage(image, player.x, player.y, player.width, player.height);
};

const loadAudio = () => {
  const sound = new Audio("./sounds/kimetsu-song.mp3");
  sound.preload = "auto";
  sound.load();
  audio = sound;
};

// const checkForMusicButton = () => {
//   if (audio) {
//     console.log(audio)
//     if (musicActivated) {
//       audio.play();
//     } else {
//       audio.pause();
//     }
//   }
// };

//Keyboard event listener

let keyBoolean = false;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    player.actions.push("move-right");
    player.speedX = 5;
    if (keyBoolean) {
      player.getRunImages();
    }
  } else if (event.key === "ArrowLeft") {
    player.actions.push("move-left");
    player.speedX = -5;
  } else if (event.key === "a") {
    player.actions.push("attack");
    player.attack();
  } else if (event.key === " " && !player.jumping) {
    player.jumping = true;
    player.actions.push("jump");
    player.jump();
  }
  console.log(player.actions);
  keyBoolean = false;
});

document.addEventListener("keyup", (event) => {
  if (event.key === "ArrowRight") {
    player.actions = player.actions.filter((action) => action !== "move-right");
  } else if (event.key === "ArrowLeft") {
    player.actions = player.actions.filter((action) => action !== "move-left");
  }
  const events = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
  if (events.includes(event.key)) {
    player.speedX = 0;
    player.width = 50;
  }
  clearInterval(player.runImagesInterval);
  keyBoolean = true;
});

let eventCounter = 0;
document.querySelector(".switch").addEventListener("click", (event) => {
  eventCounter++;
  if (eventCounter === 2) {
    if (musicActivated) {
      audio.pause();
    } else {
      audio.play();
    }
    musicActivated = !musicActivated;
    eventCounter = 0;
  }
});

document.getElementById("start-game").addEventListener("click", () => {
  audio.play();
});

//Update Canvas Function
const updateCanvas = () => {
  if (startGame) {
    if (!audio) loadAudio();
    clearCanvas();
    updateBackground();
    updatePlayer();
    drawBackgrounds();
    drawPlayer(player.image);
  }
  requestAnimationFrame(updateCanvas);
};

updateCanvas();
//1. Save canvas state
//2. Clear the canvas
//3. Draw
//4. Restore the state
