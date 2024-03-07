export default class Object {
    constructor(ctx, x, y, width, height, currentImage, isBall) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.currentImage = currentImage;
        this.isBall = isBall;
    }

    update(speed, gameSpeed, frameTimeDelta, scaleRatio) {
        this.x -= speed * gameSpeed * frameTimeDelta * scaleRatio;
    }

    kickBall(speed, gameSpeed, frameTimeDelta, scaleRatio) {
        this.x += 2*speed * gameSpeed * frameTimeDelta * scaleRatio;
    }

    draw() {
        this.ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
    }

    drawBackground(index) {
        this.image = this.currentImage[index].image
        this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    collideWith(sprite, speed, gameSpeed, frameTimeDelta, scaleRatio) {
        if (!this.isBall) {
            const adjustBy = 2;
            if (
                sprite.x < this.x + this.width / adjustBy &&
                sprite.x + sprite.width / adjustBy > this.x &&
                sprite.y < this.y + this.height / adjustBy &&
                sprite.height + sprite.y / adjustBy > this.y
            ) {
                return true;
            } else {
                return false;
            }
        }
        if (this.isBall) {
            const adjustBy = 1;
            if (
                sprite.x < this.x + this.width / adjustBy &&
                sprite.x + sprite.width / adjustBy > this.x &&
                sprite.y < this.y + this.height / adjustBy &&
                sprite.height + sprite.y / adjustBy > this.y
            ) {
               this.kickBall(speed, gameSpeed, frameTimeDelta, scaleRatio);
            }
        }
    }
}
