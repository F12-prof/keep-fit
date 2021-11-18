import { Container, Sprite } from "pixi.js";
import assets from './assets';
export default class Human extends Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor(screenWidth, screenHeight) {
        super();
        this.muscles = [];
        // Setting basic context
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
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
        assets.muscles.forEach((elem) => {
            // Create element
            const muscleGraphic = Sprite.from(elem.path);
            this.muscles.push({
                graphic: muscleGraphic,
                name: elem.name,
                attributes: elem.attributes
            });
            baseImage.addChild(muscleGraphic);
            // Setting position of the muscle
            muscleGraphic.anchor.set(0.5, 0.5);
            muscleGraphic.x = elem.x - baseImageAsset.width / 2;
            muscleGraphic.y = elem.y - baseImageAsset.height / 2;
            // binding interaction event
            muscleGraphic.interactive = true;
            muscleGraphic.on('pointertap', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('pointerenter', this.onMouseEnterMuscle.bind(this));
            muscleGraphic.on('pointerleave', this.onMouseLeaveMuscle.bind(this));
        });
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
}
