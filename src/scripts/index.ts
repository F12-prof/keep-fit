import { Application } from 'pixi.js'
import Human from './human';

/**
 * Importing style sheets
 */
import '../styles/bootstrap.min.css'
import '../styles/main.scss'

/**
 * Configuring pixi application
 */
const app = new Application({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: 2,
    autoDensity: true,
    backgroundColor: 0xffffff,
    width: 400,
    height: document.body.clientHeight,
    antialias: true,
});

/**
 * Adding **main scene**
 */
const humanScene = new Human(app.screen.width, app.screen.height);
app.stage.addChild(humanScene);
