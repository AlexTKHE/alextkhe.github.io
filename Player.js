export default class Player {
    WALK_ANIMATION_TIMER = 150;
    walkAnimationTimer = this.WALK_ANIMATION_TIMER;
    dinoRunImages = [];

    jumpPressed = false;
    jumpInProgress = false;
    falling = false;
    JUMP_SPEED = 0.6;
    GRAVITY = 0.4;

    // for animation
    count = 0;
    photoDecreasing = false;


    constructor(ctx, width, height, minJumpHeight, maxJumpHeight, scaleRatio) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.width = width;
        this.height = height;
        this.minJumpHeight = minJumpHeight;
        this.maxJumpHeight = maxJumpHeight;
        this.scaleRatio = scaleRatio;

        this.x = 10 * scaleRatio;
        this.y = this.canvas.height - this.height - 1.5 * scaleRatio;
        this.yStandingPosition = this.y;

        this.standingStillImage = new Image();
        this.standingStillImage.src = "images/tylerStandStill.png";

        this.image = this.standingStillImage;

        const tylerRun1 = new Image();
        tylerRun1.src = "images/tylerRun1.png";

        const tylerRun2 = new Image();
        tylerRun2.src = "images/tylerRun1-1.5.png";

        const tylerRun3 = new Image();
        tylerRun3.src = "images/tylerRun2-1.5.png";

        const tylerRun4 = new Image();
        tylerRun4.src = "images/tylerRun2.png";

        this.dinoRunImages.push(tylerRun1);
        this.dinoRunImages.push(tylerRun2);
        this.dinoRunImages.push(tylerRun3);
        this.dinoRunImages.push(tylerRun4);

        //keyboard
        window.removeEventListener('keydown', this.keydown);
        window.removeEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
        window.addEventListener('keyup', this.keyup);

        //touch
        window.removeEventListener('touchstart', this.touchstart);
        window.removeEventListener('touchend', this.touchend);
        window.addEventListener('touchstart', this.touchstart);
        window.addEventListener('touchend', this.touchend);

    }

    touchstart = () => {
        this.jumpPressed = true;
    }

    touchend = () => {
        this.jumpPressed = false;
    }

    keydown = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = true;
        }
    };

    keyup = (event) => {
        if (event.code === "Space") {
            this.jumpPressed = false;
        }
    };

    update(gameSpeed, frameTimeDelta) {
        this.run(gameSpeed, frameTimeDelta);

        if (this.jumpInProgress) {
            this.image = this.standingStillImage;
        }

        this.jump(frameTimeDelta);
    }

    run(gameSpeed, frameTimeDelta) {
        if (this.walkAnimationTimer <= 0) {
           
            this.image =this.dinoRunImages[this.count];
            if (this.count == 0) {
                this.decreasing = false;
            }
            else if (this.count == 3) {
                this.decreasing = true;
            }
            if (this.decreasing) {
                this.count--;
            }
            else {
                this.count++;
            }
           
            this.walkAnimationTimer = this.WALK_ANIMATION_TIMER;
        }
        this.walkAnimationTimer -= frameTimeDelta * gameSpeed;
    }
    draw() {
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    jump(frameTimeDelta) {
        if (this.jumpPressed) {
            this.jumpInProgress = true;
        }

        if (this.jumpInProgress && !this.falling) {
            if (this.y > this.canvas.height - this.minJumpHeight ||
                (this.y > this.canvas.height - this.maxJumpHeight && this.jumpPressed)) {
                    this.y -= this.JUMP_SPEED * frameTimeDelta * this.scaleRatio;
            }
            else {
                this.falling = true;
            }
        }
        else {
            if (this.y < this.yStandingPosition) {
                this.y += this.GRAVITY * frameTimeDelta * this.scaleRatio;
                if (this.y + this.height > this.canvas.height) {
                    this.y = this.yStandingPosition;
                }
            }
            else {
                this.falling = false;
                this.jumpInProgress = false;
            }
        }
    }

}
