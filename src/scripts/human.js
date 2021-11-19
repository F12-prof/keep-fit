import { Container, Sprite, LINE_CAP, LINE_JOIN, Graphics, Ticker } from "pixi.js";
import { mainAssets } from './assets';
import { RGBSplitFilter } from "@pixi/filter-rgb-split";
import Pointer from "./pointer";
export default class Human extends Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor(sceneWidth, sceneHeight, _lineStyle, _fillStyle) {
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
        // filters
        this.rgbSplitFilter = new RGBSplitFilter([0, 0], [0, 0], [0, 0]);
        //-------------------------------
        //      Animation
        //-------------------------------
        this.animationRounds = 0;
        this.filterDelta = 0.03;
        this.halfPeriod = 120;
        // Setting basic context
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        // Setting default style if not specified
        if (_lineStyle)
            this.lineStyle = _lineStyle;
        if (_fillStyle)
            this.fillStyle = _fillStyle;
        // Load base bitmap
        const baseImageAsset = mainAssets.baseImage;
        const baseImage = this.baseImage = Sprite.from(mainAssets.baseImage.path);
        // Adding rgb split filter for baseImage
        baseImage.filters = [this.rgbSplitFilter];
        // bind filter animation
        Ticker.shared.add(this.onUpdateFrame.bind(this));
        // Center the base image
        baseImage.anchor.set(0.5, 0.5);
        baseImage.x = sceneWidth / 2;
        baseImage.y = sceneHeight / 2;
        // Adding base image to the stage
        this.addChild(this.baseImage);
        // Load muscles blocks and add each muscle element to the stage
        this.loadMusclesFromParsedObject(mainAssets.muscles);
        // Add a fancy pointer
        this.addChild(this.pointer);
        this.interactive = true;
        this.on('mousemove', this.onMouseMove.bind(this));
        this.on('mouseout', this.onMouseLeave.bind(this));
        // animate pointer
        Ticker.shared.add(this.pointer.onUpdateFrame.bind(this.pointer));
        // setting original postion of the pointer. it won't be seen before mouse moves in
        this.pointer.position.set(-500, -500);
    }
    //-------------------------------
    //      Event Handlers
    //-------------------------------
    onClickMuscle(event) {
        if (!this.output)
            return;
        const muscle = this.getMuscleFromEvent(event);
        this.output.append(`That's ${muscle.name}!`);
    }
    onMouseEnterMuscle(event) {
        const muscle = this.getMuscleFromEvent(event);
        this.currentOverMuscle = muscle;
        const muscleGraphic = muscle.graphic;
        console.log("Mouse entering", muscle.name);
        muscleGraphic.scale.set(1.25);
    }
    onMouseLeaveMuscle(event) {
        const muscle = this.currentOverMuscle;
        const muscleGraphic = muscle.graphic;
        console.log("Mouse leaving", muscle.name);
        muscleGraphic.scale.set(1.0);
    }
    // pointer move event handler
    onMouseMove(event) {
        document.body.style.cursor = 'none';
        const pos = event.data.getLocalPosition(this);
        this.pointer.position.set(pos.x, pos.y);
    }
    // pointer move out of human scene
    onMouseLeave(event) {
        document.body.style.cursor = 'pointer';
        this.pointer.position.set(-500, -500); // make it invisible
    }
    // Update filter parameters for base image
    onUpdateFrame(delta) {
        ++this.animationRounds;
        const { filterDelta, halfPeriod, animationRounds } = this;
        // changes every 60 rounds
        const [x, y] = this.rgbSplitFilter.green;
        if (animationRounds < halfPeriod) {
            this.rgbSplitFilter.green = [x + filterDelta, y + filterDelta];
        }
        else if (animationRounds < halfPeriod * 2) {
            this.rgbSplitFilter.green = [x - filterDelta, y - filterDelta];
        }
        if (animationRounds == halfPeriod * 2)
            this.animationRounds = 0;
    }
    //-------------------------------
    //      Public Methods
    //-------------------------------
    bindOutput(output) {
        this.output = output;
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
            // Bind event handlers
            muscleGraphic.interactive = true;
            muscleGraphic.on('mouseover', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('mouseout', this.onMouseLeaveMuscle.bind(this));
            muscleGraphic.on('click', this.onClickMuscle.bind(this));
        });
    }
}
