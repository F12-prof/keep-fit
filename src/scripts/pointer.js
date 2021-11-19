import { Container, Sprite } from "pixi.js";
import { pointerAssets } from './assets';
import { DropShadowFilter } from "@pixi/filter-drop-shadow";
/**
 * Canvas effects of fancy pointer
 */
export default class Pointer extends Container {
    //-------------------------------
    //      LifeCycle
    //-------------------------------
    constructor() {
        super();
        // Loading sprites
        this.outterSprite = Sprite.from(pointerAssets.outter);
        this.innerSprite = Sprite.from(pointerAssets.inner);
        this.crossSprite = Sprite.from(pointerAssets.cross);
        // add to the container
        this.addChild(this.outterSprite, this.innerSprite, this.crossSprite);
        // setting positioning
        this.outterSprite.anchor.set(0.5, 0.5);
        this.innerSprite.anchor.set(0.5, 0.5);
        this.crossSprite.anchor.set(0.5, 0.5);
        // align the outter & inner sprites
        // this.innerSprite.position.y += 2;
        this.filters = [new DropShadowFilter()];
    }
    //-------------------------------
    //      Public Methods
    //-------------------------------
    // Animation update
    onUpdateFrame(delta) {
        const { outterSprite, innerSprite } = this;
        outterSprite.rotation += delta * 0.04;
        innerSprite.rotation -= delta * 0.06;
    }
}
