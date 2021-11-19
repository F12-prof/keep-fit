import { Container, Sprite, LINE_CAP, LINE_JOIN, Graphics, Ticker } from "pixi.js";
import { mainAssets } from './assets';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import Pointer from "./pointer";
export default class Human extends Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor(screenWidth, screenHeight, _lineStyle, _fillStyle) {
        super();
        this.muscles = [];
        // Styling
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
        // pointer graphics
        this.pointer = new Pointer();
        // Setting basic context
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        // Setting default style if not specified
        if (_lineStyle)
            this.lineStyle = _lineStyle;
        if (_fillStyle)
            this.fillStyle = _fillStyle;
        // Load base bitmap
        const baseImageAsset = mainAssets.baseImage;
        const baseImage = this.baseImage = Sprite.from(mainAssets.baseImage.path);
        // Adding drop shadow filter for baseImage
        baseImage.filters = [new DropShadowFilter()];
        // Center the base image
        baseImage.anchor.set(0.5, 0.5);
        baseImage.x = screenWidth / 2;
        baseImage.y = screenHeight / 2;
        // Adding base image to the stage
        this.addChild(this.baseImage);
        // Load muscles blocks and add each muscle element to the stage
        this.loadMusclesFromParsedObject(mainAssets.muscles);
        // Add pointer
        this.addChild(this.pointer);
        this.on('pointermove', this.onMouseMove.bind(this));
        this.interactive = true;
        Ticker.shared.add(this.pointer.onUpdateFrame.bind(this.pointer));
    }
    //-------------------------------
    //      Event Handlers
    //-------------------------------
    onMouseEnterMuscle(event) {
        const muscle = this.getMuscleFromEvent(event);
        this.currentOverMuscle = muscle;
        const muscleGraphic = muscle.graphic;
        console.log("Mouse entering", muscle.name);
        muscleGraphic.scale.set(1.1);
    }
    onMouseLeaveMuscle(event) {
        const muscle = this.currentOverMuscle;
        const muscleGraphic = muscle.graphic;
        console.log("Mouse leaving", muscle.name);
        muscleGraphic.scale.set(1.0);
    }
    // pointer move event handler
    onMouseMove(event) {
        const pos = event.data.getLocalPosition(this);
        this.pointer.position.set(pos.x, pos.y);
    }
    //-------------------------------
    //      Animation
    //-------------------------------
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
            // Setting relative position of the graphic
            muscleGraphic.position.set(muscleData.x, muscleData.y);
            // Enable anti-alising for the graphic
            muscleGraphic.cacheAsBitmap = true;
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
            muscleGraphic.on('mouseover', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('mouseout', this.onMouseLeaveMuscle.bind(this));
        });
    }
}
