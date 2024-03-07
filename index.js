import Player from './Player.js';
import Ground from './Ground.js';
import ObjectController from './ObjectController.js';
import TitleBar from './TitleBar.js';

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const GAME_SPEED_START = 1 // 1.0
const GAME_SPEED_INCREMENT = 0.00001;

const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;
// these numbers in constant of the game world
const PLAYER_WIDTH = 88 / 1.5; //58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_AND_OBJECT_SPEED = 0.5;
const HATSIZE = 50;

const OBJECT_CONFIG = [
    { width: 378 / 12, height: 1200 / 12 , image: "images/fanObstickle.png" },
    { width: 1809 / 50, height: 4032 / 50, image: "images/dairyConeObstickle.png" }, 
    { width: 600 / 5, height: 374 / 5, image: "images/computerObstickle.png" },
    { width: 1100 / 30 , height: 3578 / 30 , image: "images/surfBoardObstickle.png"},
    { width: 1211 / 40, height: 1180 /40, image: "images/soccerBall.png" }
];

const BACKGROUND_OBJECT_CONFIG = [
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat0.png"},
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat1.png"},
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat2.png"},
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat3.png"},
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat4.png"},
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat5.png"},
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat6.png"},
    { width : 3311 / HATSIZE, height: 2848 / HATSIZE, image: "images/tylerHat7.png"},
]
// Game Objects 
let player = null;
let ground = null;
let objectController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameOver = false;
let hasAddedEventListnersForRestart = false;
let waitingToStart = true;

function createSprites() {
    const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
    const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
    const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
    const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

    const groundWidthInGame = GROUND_WIDTH * scaleRatio;
    const groundHeightInGame = GROUND_HEIGHT * scaleRatio;


    player = new Player(ctx, playerWidthInGame, playerHeightInGame, minJumpHeightInGame, maxJumpHeightInGame, scaleRatio);

    ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_AND_OBJECT_SPEED, scaleRatio);

    const objectImages = OBJECT_CONFIG.map(object => {
        const image = new Image();
        image.src = object.image;
        const isBall = object.image === "images/soccerBall.png"; 
        const isSurfBoard = object.image === "images/surfBoardObstickle.png";
        return {
            image: image,
            width: object.width * scaleRatio,
            height: object.height * scaleRatio,
            isBall : isBall,
            isSurfBoard : isSurfBoard
        }
    });

    const backgroundObjectImages = BACKGROUND_OBJECT_CONFIG.map(object => {
        const image = new Image();
        image.src = object.image;
        return {
            image: image,
            width: object.width * scaleRatio,
            height: object.height * scaleRatio,
            isBall: false,
            isSurfBoard: false
        }
    });

    objectController = new ObjectController(ctx, objectImages, backgroundObjectImages, scaleRatio, GROUND_AND_OBJECT_SPEED);

    score = new TitleBar(ctx, scaleRatio);
}

function setScreen() {
    // to scale to fit on any time screen size
    scaleRatio = getScaleRatio();
    canvas.width = GAME_WIDTH * scaleRatio;
    canvas.height = GAME_HEIGHT * scaleRatio;
    createSprites();
}

setScreen();
// Use setTimeout to fix mobile resize on safari broweser
window.addEventListener("resize", () => setTimeout(setScreen, 500));
// now for chrome
if (screen.orientation) {
    screen.orientation.addEventListener("change", setScreen)
}


window.addEventListener('resize', setScreen)

function getScaleRatio() {
    const screenHeight = Math.min(
        window.innerHeight,
        document.documentElement.clientHeight
    );

    const screenWidth = Math.min(
        window.innerWidth,
        document.documentElement.clientWidth
    );

    // window is wider than the game width
    if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
        return screenWidth / GAME_WIDTH;
    }
    else {
        return screenHeight / GAME_HEIGHT;
    }

}

function showGameOver() {
    const fontSize = 70 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "white";
    const x = canvas.width / 4.5;
    const y = canvas.height / 2;
    ctx.fillText("GAME OVER", x, y);
}

function setupGameReset() {
    if (!hasAddedEventListnersForRestart) {
        hasAddedEventListnersForRestart = true;

        setTimeout(() => {
            window.addEventListener("keyup", reset, { once: true });
            window.addEventListener("touchstart", reset, { once: true });
        }, 500);
    }
}

function reset() {
    hasAddedEventListnersForRestart = false;
    gameOver = false;
    waitingToStart = false;
    ground.reset();
    objectController.reset();
    score.reset();
    gameSpeed = GAME_SPEED_START;
}



function showStartGameText() {
    const fontSize = 40 * scaleRatio;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillStyle = "white";
    const x = canvas.width / 3.5;
    const y = canvas.height / 2;
    ctx.fillText("Start Bart Bart", x, y);
}


function clearScreen() {
    ctx.fillStyle = "#87ceeb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
    if (previousTime == null) {
        previousTime = currentTime;
        requestAnimationFrame(gameLoop);
        return;
    }
    const frameTimeDelta = currentTime - previousTime;
    previousTime = currentTime;




    clearScreen();


    if (!gameOver && !waitingToStart) {
        // update game objects
        ground.update(gameSpeed, frameTimeDelta);
        objectController.update(gameSpeed, frameTimeDelta);
        player.update(gameSpeed, frameTimeDelta);
        score.update(frameTimeDelta);
        updateGameSpeed(frameTimeDelta);
    }

    if (!gameOver && objectController.collideWith(player)) {
        gameOver = true;
        score.setHighScore();
        setupGameReset();
    }

    // draw game objects

    ground.draw();
    objectController.draw();
    player.draw();
    score.draw();




    if (gameOver) {
        showGameOver();
    }

    if (waitingToStart) {
        showStartGameText();
    }

    requestAnimationFrame(gameLoop);
}

function updateGameSpeed(frameTimeDelta) {
    gameSpeed += frameTimeDelta * GAME_SPEED_INCREMENT;
}

requestAnimationFrame(gameLoop);

window.addEventListener("keyup", reset, { once: true });
window.addEventListener("touchstart", reset, { once: true });


