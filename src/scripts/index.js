import { Application } from 'pixi.js';
const app = new Application({
    view: document.getElementById("pixi-canvas"),
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    backgroundColor: 0x6495ed,
    width: 1024,
    height: 768
});
import Human from './human';
app.stage.addChild(new Human(app.screen.width, app.screen.height));
