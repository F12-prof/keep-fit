import { Container, Sprite, ParticleContainer, Ticker, Texture, BaseTexture, Graphics, Renderer, Application, BLEND_MODES } from "pixi.js";
import * as pixi from "pixi.js";
import * as particles from 'pixi-particles';
import { matrixAssets } from './assets';
import { Muscle, MuscleDataJSON } from "./interfaces";
import { DropShadowFilter } from '@pixi/filter-drop-shadow';

export default class Matrix extends Container {

    //-------------------------------
    //      LifeCycle
    //-------------------------------

    constructor(sceneWidth: number, sceneHeight: number, maxBinNumColumns?: number) {
        super();
        // context initialization
        this.sceneHeight = sceneHeight;
        this.sceneWidth = sceneWidth;

        // some boring math
        const oriColumnWidth = matrixAssets.columnWidth;
        const oriColumnHeight = matrixAssets.columnHeight;
        maxBinNumColumns = maxBinNumColumns || (sceneWidth / oriColumnWidth);
        const actColumnWidth = sceneWidth / maxBinNumColumns;
        const scale = actColumnWidth / oriColumnWidth;
        const actColumnHeight = oriColumnHeight * scale;

        const colsNeeded = maxBinNumColumns;
        const colsAvailable = matrixAssets.binaryColumns.length;

        // Loading binary number columns
        for (let i = 0; i < colsNeeded; i++) {
            const container = new Container();

            for (let j = 0; j < 3; ++j) {
                const sprite = Sprite.from(matrixAssets.binaryColumns[i % colsAvailable]);
                // align the sprite to the midline
                sprite.anchor.set(0.5, 0.5);
                // resizing to fit maxBinNumColumns
                sprite.scale.set(scale);
                
                sprite.position.set(actColumnWidth * (i + 0.5), sceneHeight / 2 + actColumnHeight * (j - 1));
                container.addChild(sprite);
            }
            // add to the container
            this.binNumberColumns.push(container);
            this.addChild(container);
        }

        // bind number moving animations
        Ticker.shared.add(this.onUpdateFrame.bind(this));

        // Create texture for particles
        const textureGraphic = new Graphics();
        textureGraphic.beginFill(0x72B377, 0.60);
        textureGraphic.lineStyle({ alpha: 0 });
        textureGraphic.drawCircle(0, 0, 5);
        textureGraphic.endFill();

        // Initializing particles
        const emitter = this.binParticleEmitter = new particles.Emitter(
            this.binParticleContainer,
            //pixi.autoDetectRenderer().generateTexture(textureGraphic),
            Texture.from(matrixAssets.particleTexturePath),
            matrixAssets.emitterSetting);
        
        // Setting properties
        this.addChild(this.binParticleContainer);
        emitter.autoUpdate = true;
        emitter.startAlpha.value = 0.02;
        this.binParticleContainer.blendMode = BLEND_MODES.SCREEN;
    }

    //-------------------------------
    //      Properties
    //-------------------------------
    private readonly sceneWidth: number;
    private readonly sceneHeight: number;

    private binNumberColumns: Container[] = [];

    private binParticleContainer: ParticleContainer = new ParticleContainer();
    private binParticleEmitter: particles.Emitter;

    private animatedRounds: number = 0;

    //-------------------------------
    //      Public Methods
    //-------------------------------

    public onUpdateFrame(delta: number): void {
        // moving column up and down in different speed
        this.binNumberColumns.forEach((elem, index) => {
            let speedMultiplier = index % 3 + 2;
            let speedDirection = (index % 3 == 0) ? 1 : -1;
            elem.position.y += speedMultiplier * speedDirection;
        });

        ++this.animatedRounds;

        if (this.animatedRounds == 100) {
            this.animatedRounds = 0;
            this.binNumberColumns.forEach(elem => {
                elem.position.y = 0;
            });

            // Emit particle every 100 rounds
            this.binParticleEmitter.updateSpawnPos(
                Math.random() * this.sceneWidth,
                Math.random() * this.sceneHeight);
            this.binParticleEmitter.playOnce();
        }
    }
}