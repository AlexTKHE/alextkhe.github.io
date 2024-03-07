import Object from "/Object.js";

export default class ObjectController {
    OBJECT_INTERVAL_MIN = 500;
    OBJECT_INTERVAL_MAX = 2000;

    nextObjectInterval = null;
    nextBackgroundObjectInterval = null;
    nextRotationTime = 100 ;
    objects = [];
    backgroundObjects = [];
    hatIndex = 0;

    constructor(ctx, objectImages, backgroundObjectImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.objectImages = objectImages;
        this.backgroundObjectImages = backgroundObjectImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextObjectTime();

    }

    setNextObjectTime() {
        const num = this.getRandomNumber(
            this.OBJECT_INTERVAL_MIN,
            this.OBJECT_INTERVAL_MAX
        );

        this.nextObjectInterval = num;

    }

    setNextRotationTime() {
        this.nextRotationTime = 125;
    }

    setNextBackgroundObjectTime() {
        this.nextBackgroundObjectInterval = 500 ;
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createObject() {
        const index = this.getRandomNumber(0, this.objectImages.length - 1);
        const objectImage = this.objectImages[index];
        const x = this.canvas.width * 1.5;
        const y = this.canvas.height - objectImage.height;
        const object = new Object(this.ctx,
            x,
            y,
            objectImage.width,
            objectImage.height,
            objectImage.image,
            objectImage.isBall,
            objectImage.isSurfBoard);

        this.objects.push(object);
    }

    createBackgroundObject() {

        const backgroundObjectImage = this.backgroundObjectImages[0];
        const x = this.canvas.width * 1.5;
        const y = 10 * this.scaleRatio;
        const object = new Object(this.ctx,
            x,
            y,
            backgroundObjectImage.width,
            backgroundObjectImage.height,
            this.backgroundObjectImages);

        this.backgroundObjects.push(object);
    }
    update(gameSpeed, frameTimeDelta) {
        
        if (this.nextRotationTime <= 0) {
            if(this.hatIndex == 7) {
                this.hatIndex = 0;
            }
            else {
                this.hatIndex++;
            }
            this.setNextRotationTime();
        }
        if (this.nextObjectInterval <= 0) {
            this.createObject();
            this.setNextObjectTime();
        }

        if (this.nextBackgroundObjectInterval <= 0) {
            this.createBackgroundObject();
            this.setNextBackgroundObjectTime();
        }
        this.nextObjectInterval -= frameTimeDelta;
        this.nextBackgroundObjectInterval -= frameTimeDelta;
        this.nextRotationTime -= frameTimeDelta;
        

        this.objects.forEach((object) => {
            object.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        this.backgroundObjects.forEach((backgroundObject) => {
            backgroundObject.update(this.speed, gameSpeed, frameTimeDelta, this.scaleRatio);
        });

        this.objects = this.objects.filter((objects) => objects.x > -objects.width && objects.y <  this.canvas.height  );
        this.backgroundObjects = this.backgroundObjects.filter((backgroundObjects) => backgroundObjects.x > -backgroundObjects.width);


    }

    draw() {
        console.log(this.objects.length);
        this.objects.forEach((object) => object.draw());
        this.backgroundObjects.forEach((backgroundObject) => backgroundObject.drawBackground(this.hatIndex));
    }

    collideWith(sprite) {
        return this.objects.some((object) => object.collideWith(sprite));
    }

    reset() {
        this.objects = [];
    }
}