import { Container, Sprite, Graphics, LINE_CAP, LINE_JOIN } from "pixi.js";
import assets from './assets';
export default class Sketch extends Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor(screenWidth, screenHeight) {
        super();
        this.drawnObjects = [];
        this.isDrawing = false;
        this.currentObject = new Graphics();
        this.currentPath = [];
        this.currentName = '';
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
        // binding drawing events
        baseImage.interactive = true;
        baseImage.on('click', this.onClick.bind(this));
        baseImage.on('rightclick', this.onRightClick.bind(this));
        baseImage.addChild(this.currentObject);
    }
    //-------------------------------
    //      Event Handlers
    //-------------------------------
    onClick(event) {
        console.log('Left Clicked');
        this.isDrawing = true;
        const pt = event.data.getLocalPosition(event.target);
        console.log(pt);
        const { currentObject, currentPath } = this;
        currentPath.push(pt);
        currentObject.clear();
        currentObject.beginFill(0xff0000);
        currentObject.lineStyle({
            width: 1,
            color: 0x00ff00,
            cap: LINE_CAP.ROUND,
            join: LINE_JOIN.ROUND
        });
        currentObject.moveTo(currentPath[0].x, currentPath[0].y);
        for (let i = 1; i < currentPath.length; ++i) {
            currentObject.lineTo(currentPath[i].x, currentPath[i].y);
        }
        currentObject.lineTo(currentPath[0].x, currentPath[0].y);
        currentObject.endFill();
    }
    onRightClick(event) {
        console.log('Right Clicked');
        this.isDrawing = false;
        if (this.currentPath.length < 3) {
            alert('Need more than 3 points');
            return;
        }
        if (!this.currentName.length) {
            alert('You have to name the muscle');
            return;
        }
        this.drawnObjects.push({
            graphic: this.currentObject,
            name: this.currentName
        });
        this.currentObject = new Graphics();
        this.baseImage.addChild(this.currentObject);
        this.currentPath = [];
        document.getElementById('muscle-name').value = '';
        this.currentName = '';
    }
    setCurrentName(name) { this.currentName = name; }
    getDrawnObjects() { return this.drawnObjects; }
    clearAllDrawnObjects() {
        this.drawnObjects.forEach(elem => {
            elem.graphic.destroy();
        });
        this.drawnObjects = [];
        this.currentPath = [];
        this.currentObject.destroy();
        this.currentObject = new Graphics();
    }
    resetCurrent() {
        this.currentObject.destroy();
        this.currentObject = new Graphics();
        this.currentPath = [];
        this.baseImage.addChild(this.currentObject);
    }
}
