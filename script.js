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

    this.injured = false;

    this.jumpTimeout1 = null;
    this.jumpTimeout2 = null;
    this.jumpTimeout3 = null;
    this.jumping = false;

    this.attackTimeout1 = null;
    this.attackTimeout2 = null;
    this.attackTimeout3 = null;
    this.attacking = false;
  }

  getRunImages() {
    this.runImagesInterval = setInterval(() => {
      if (this.runImage === images.run1) {
        this.width = 65;
        this.runImage = images.run2;
      } else if (this.runImage === images.run2) {
        this.runImage = images.run3;
      } else if (this.runImage === images.run3) {
        this.runImage = images.run4;
      } else if (this.runImage === images.run4) {
        this.runImage = images.run1;
      }
      this.image = this.runImage;
    }, 60);
  }

  getJumpImages() {
    this.image = images.jump1;
    this.jumpTimeout1 = setTimeout(() => {
      this.image = images.jump2;
    }, 250);
    this.jumpTimeout2 = setTimeout(() => {
      this.image = images.jump3;
    }, 320);
    this.jumpTimeout3 = setTimeout(() => {
      this.actions = this.actions.filter((action) => action !== "jump");
    }, 750);
  }

  attack() {
    this.width = 60;
    this.image = images.attack1;
    this.attackTimeout1 = setTimeout(() => {
      this.image = images.attack2;
    }, 150);
    this.attackTimeout2 = setTimeout(() => {
      this.image = images.attack3;
    }, 230);
    this.attackTimeout3 = setTimeout(() => {
      this.actions = this.actions.filter((action) => action !== "attack");
      this.attacking = false;
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
        this.jumping = false;
        this.actions = this.actions.filter((action) => action !== "jump");
      }
    }, 50);
  }

  hit() {
    this.width = 68;
    this.injured = true;
    clearInterval(this.runImagesInterval);

    clearTimeout(this.jumpTimeout1);
    clearTimeout(this.jumpTimeout2);
    clearTimeout(this.jumpTimeout3);

    clearTimeout(this.attackTimeout1);
    clearTimeout(this.attackTimeout2);

    this.image = images.hit;
    setTimeout(() => {
      this.actions = this.actions.filter((action) => action !== "hit");
      this.injured = false;
    }, 500);
  }
}

class Background {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 1200;
    this.height = 600;
  }
}
const background_1 = new Background(0, 0);
const background_2 = new Background(1200, 0);
const player = new Player();

class Fireball {
  constructor() {
    this.x = 1300;
    this.y = Math.floor(Math.random() * (100 - 0 + 1) + 0);
    this.speedX = randomNumber(-5, -7);
    this.doubleSpeedX = this.speedX - 5;
    this.speedY = randomNumber(2, 6);
    this.doubleSpeedY = this.speedY + 5;
    this.width = 70;
    this.height = 70;
    this.image = images.fireball1;
    this.imagesInterval = null;
    this.ownImageIntervalStarted = false;
    this.impact = false;
  }

  updateOwnImage() {
    this.imagesInterval = setInterval(() => {
      if (this.image === images.fireball1) {
        this.image = images.fireball2;
      } else if (this.image === images.fireball2) {
        this.image = images.fireball3;
      } else if (this.image === images.fireball3) {
        this.image = images.fireball4;
      } else if (this.image === images.fireball4) {
        this.image = images.fireball5;
      } else if (this.image === images.fireball5) {
        this.image = images.fireball6;
      } else if (this.image === images.fireball6) {
        this.image = images.fireball1;
      }
    }, 60);
  }
}

//Variables
let counterForImages = 0;
let startGame = false;

const images = {};
const imagesInfo = [
  // 1614880146539
  { url: "backgrounds/day.jpeg", title: "backgroundDay" },
  { url: "1614880146539.png", title: "hit" },
  { url: "1614870923357.png", title: "stand" },
  { url: "1614873424949.png", title: "example" },
  { url: "1614873016362.png", title: "run1" },
  { url: "1614873036309.png", title: "run2" },
  { url: "1614873063261.png", title: "run3" },
  { url: "1614873081388.png", title: "run4" },
  { url: "1614873612743.png", title: "attack1" },
  { url: "1614873641521.png", title: "attack2" },
  { url: "1614873680021.png", title: "attack3" },
  { url: "1614873109599.png", title: "jump1" },
  { url: "1614873132252.png", title: "jump2" },
  { url: "1614873162993.png", title: "jump3" },
  { url: "sprites/fire1left.png", title: "fireball1" },
  { url: "sprites/fire2left.png", title: "fireball2" },
  { url: "sprites/fire3left.png", title: "fireball3" },
  { url: "sprites/fire4left.png", title: "fireball4" },
  { url: "sprites/fire5left.png", title: "fireball5" },
  { url: "sprites/fire6left.png", title: "fireball6" },
];

//Images loading
for (let i = 0; i < imagesInfo.length; i++) {
  const img = new Image();
  img.src = `images/${imagesInfo[i].url}`;
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

const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const checkForLoadedImages = () => {
  return images.length === 2;
};

const clearCanvas = () => {
  ctx.clearRect(0, 0, 1200, 600);
};

const checkForRunningOutbounds = () => {
  if (player.x >= 600) {
    player.x = 600;
  } else if (player.x <= 15) {
    player.x = 15;
  }
};

let keyBoolean = true;

const checkForActualImage = () => {
  if (player.actions.includes("hit")) {
    player.speedX = 0;
  } else {
    if (!player.actions.length) {
      player.image = images.stand;
      player.width = 50;
    }
    if (player.actions.includes("move-right")) {
      player.speedX = 5;
    }
    if (player.actions.includes("move-left")) {
      player.speedX = -5;
    }
    if (player.actions.includes("attack") && !player.attacking) {
      player.attacking = true;
      player.attack();
    }
    if (
      player.actions.includes("move-right") &&
      !player.actions.includes("jump") &&
      !player.attacking
    ) {
      if (keyBoolean) {
        player.getRunImages();
        keyBoolean = false;
      }
    }
  }
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
  if (player.x > 600) {
    whichSpeedX = "doubleSpeedX";
    if (background_1.x <= -1200) {
      background_1.x = 1200;
    }
    if (background_2.x <= -1200) {
      background_2.x = 1200;
    }
    background_1.x -= 5;
    background_2.x -= 5;
  } else {
    whichSpeedX = "speedX";
  }
};

const updatePlayer = () => {
  checkForActualImage();

  checkForRunningOutbounds();
  player.x += player.speedX;
  player.y += player.speedY;
};

const drawPlayer = (image) => {
  if (!player.injured) {
    ctx.drawImage(image, player.x, player.y, player.width, player.height);
  } else {
    const frequency = 100;
    if (Math.floor(Date.now() / frequency) % 2) {
      ctx.drawImage(image, player.x, player.y, player.width, player.height);
    }
  }
};

const fireballs = [];

const createFireballs = () => {
  const prueba = setInterval(() => {
    const fireball = new Fireball();
    fireballs.push(fireball);
  }, randomNumber(1000, 3000));
  creatingFireballs = true;
};

let whichSpeedX = "speedX";

const updateFireballs = () => {
  for (let i = 0; i < fireballs.length; i++) {
    if (fireballs[i].x < -10) {
      fireballs.splice(i, 1);
    } else {
      if (!fireballs[i].ownImageIntervalStarted) {
        fireballs[i].updateOwnImage();
        fireballs[i].ownImageIntervalStarted = true;
      }
      fireballs[i].x += fireballs[i][whichSpeedX];
      fireballs[i].y += fireballs[i].speedY;
    }
  }
};

const drawFireballs = () => {
  for (let i = 0; i < fireballs.length; i++) {
    ctx.drawImage(
      fireballs[i].image,
      fireballs[i].x,
      fireballs[i].y,
      fireballs[i].width,
      fireballs[i].height
    );
  }
};

const checkforCollisions = () => {
  fireballs.forEach((fireball) => {
    const rightImpact = fireball.x < player.x + 30;
    const leftImpact = fireball.x > player.x - 30;
    const upperImpact = fireball.y < player.y + 30;
    const lowerImpact = fireball.y > player.y - 30;

    if (
      rightImpact &&
      leftImpact &&
      upperImpact &&
      lowerImpact &&
      !fireball.impact
    ) {
      // console.log("impacto");
      fireball.impact = true;
      player.actions.push("hit");
      player.hit();
    }
  });
};

const loadAudio = () => {
  const sound = new Audio("./sounds/kimetsu-song.mp3");
  sound.preload = "auto";
  sound.load();
  audio = sound;
  // audio.play();
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

window.onload = () => {
  document.addEventListener("keydown", (event) => {
    if (!player.actions.includes("hit")) {
      if (event.key === "ArrowRight") {
        if (!player.actions.includes("move-right")) {
          player.actions.push("move-right");
        }
      } else if (event.key === "ArrowLeft") {
        player.actions.push("move-left");
      } else if (event.key === "a" || event.key === "A") {
        player.actions.push("attack");
      } else if (event.key === " " && !player.jumping) {
        player.width = 68;
        player.jumping = true;
        player.actions.push("jump");
        player.jump();
      }
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.key === "ArrowRight") {
      player.actions = player.actions.filter(
        (action) => action !== "move-right"
      );
    } else if (event.key === "ArrowLeft") {
      player.actions = player.actions.filter(
        (action) => action !== "move-left"
      );
    }
    const events = ["ArrowUp", "ArrowDown", "ArrowRight", "ArrowLeft"];
    if (events.includes(event.key)) {
      player.speedX = 0;
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
    document.querySelector("canvas").classList.remove("display-none");
    document.querySelector("canvas").classList.add("display-block");
    document.querySelector(".main-poster").classList.add("display-none");
  });
};

let creatingFireballs = false;

//Update Canvas Function
const updateCanvas = () => {
  if (startGame) {
    if (!audio) loadAudio();
    if (!creatingFireballs) createFireballs();
    clearCanvas();
    updateBackground();
    updateFireballs();
    updatePlayer();
    checkforCollisions();
    drawBackgrounds();
    drawFireballs();
    drawPlayer(player.image);
  }
  requestAnimationFrame(updateCanvas);
};

updateCanvas();
//1. Save canvas state
//2. Clear the canvas
//3. Draw
//4. Restore the state
