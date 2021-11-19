import { Application, Container } from 'pixi.js'
import Human from './human';
import Matrix from './Matrix';
import CLI from './cli';

/**
 * Importing style sheets
 */
import '../styles/main.scss'


/**
 * Configuring pixi application
 */
const app = new Application({
    view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
    resolution: 2,
    autoDensity: true,
    backgroundColor: 0x000000,

    width: document.body.clientWidth - 50,
    height: document.body.clientHeight - 50,
    antialias: true,
});

/**
 * Parameters
 */
const leftSceneWidth = 600;
const leftSceneHeight = document.body.clientHeight - 50;
const lines_of_01_effect = 20;

const sceneGap = 30;
const rightSceneWidth = app.screen.width - sceneGap - leftSceneWidth;
const rightSceneHeight = leftSceneHeight;

/**
 * Configuring left scene
 */
const leftSceneContainer = new Container();

const matrixBackground = new Matrix(leftSceneWidth, leftSceneHeight, lines_of_01_effect);
const humanScene = new Human(leftSceneWidth, leftSceneHeight);

leftSceneContainer.addChild(matrixBackground);
leftSceneContainer.addChild(humanScene);

app.stage.addChild(leftSceneContainer);

/**
 * Configuring right scene
 */
const rightSceneContainer = new Container();

const cli = new CLI(leftSceneWidth + sceneGap, 0, rightSceneWidth, rightSceneHeight, 5);
humanScene.bindOutput(cli);
rightSceneContainer.addChild(cli);
cli.append('Initializing communication system...').append('...Finished').append('hello, world');
app.stage.addChild(rightSceneContainer);


