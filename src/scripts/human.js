import { Container, Sprite, LINE_CAP, LINE_JOIN, Graphics } from "pixi.js";
import assets from './assets';
export default class Human extends Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor(screenWidth, screenHeight, _lineStyle, _fillStyle) {
        super();
        this.muscles = [];
        this.lineStyle = {
            color: 0xffffff,
            width: 2,
            alpha: 0.75,
            cap: LINE_CAP.ROUND,
            join: LINE_JOIN.ROUND,
        };
        this.fillStyle = {
            color: 0xff8800,
            alpha: 0.25,
        };
        // Setting basic context
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        // Setting default style if not specified
        if (_lineStyle)
            this.lineStyle = _lineStyle;
        if (_fillStyle)
            this.fillStyle = _fillStyle;
        // Load base bitmap
        const baseImageAsset = assets.baseImage;
        const baseImage = this.baseImage = Sprite.from(assets.baseImage.path);
        // Center the base image
        baseImage.anchor.set(0.5, 0.5);
        baseImage.x = screenWidth / 2;
        baseImage.y = screenHeight / 2;
        // Adding base image to the stage
        this.addChild(this.baseImage);
        // Load muscles blocks and add each muscle element to the stage
        this.loadMusclesFromParsedObject(assets.muscles);
    }
    //-------------------------------
    //      Event Handlers
    //-------------------------------
    onMouseEnterMuscle(event) {
        const muscle = this.getMuscleFromEvent(event);
        const muscleGraphic = muscle.graphic;
        console.log("Mouse entering", muscle.name);
        muscleGraphic.scale.set(1.1);
    }
    onMouseLeaveMuscle(event) {
        const muscle = this.getMuscleFromEvent(event);
        const muscleGraphic = muscle.graphic;
        console.log("Mouse leaving", muscle.name);
        muscleGraphic.scale.set(1.0);
    }
    //-------------------------------
    //      Private Methods
    //-------------------------------
    getMuscleFromEvent(event) {
        for (let muscle of this.muscles) {
            if (muscle.graphic === event.target)
                return muscle;
        }
    }
    loadMusclesFromParsedObject(musclesData) {
        musclesData.forEach((muscleData) => {
            // Create new graphic for muscle with geomery in json
            const muscleGraphic = new Graphics();
            // Restore the status of the graphic
            const points = muscleData.geometry;
            muscleGraphic.beginFill(this.fillStyle.color, this.fillStyle.alpha);
            muscleGraphic.lineStyle(this.lineStyle);
            muscleGraphic.moveTo(points[0], points[1]);
            for (let i = 2; i < points.length; i += 2) {
                muscleGraphic.lineTo(points[i], points[i + 1]);
            }
            muscleGraphic.endFill();
            this.muscles.push({
                graphic: muscleGraphic,
                name: muscleData.name,
                attributes: {}
            });
            // Append the graphic to base image
            this.baseImage.addChild(muscleGraphic);
            console.log(muscleGraphic);
            // Bind event handlers
            muscleGraphic.interactive = true;
            muscleGraphic.on('pointertap', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('pointerenter', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('pointerleave', this.onMouseLeaveMuscle.bind(this));
        });
    }
}
