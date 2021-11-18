
import pixi from 'pixi.js';

export interface MuscleAttributes {

}

export interface Muscle {

    graphic: pixi.Sprite,
    name: string,
    attributes: MuscleAttributes
}

export interface BaseImageAssetElement {
    name?: string;
    path: string,
    x: number,
    y: number
    width: number,
    height: number
}

export interface MuscleAssetElement {
    name: string;
    attributes: MuscleAttributes
    path: string,
    x: number,
    y: number
}

export interface AssetType {
    baseImage: BaseImageAssetElement
    muscles: MuscleAssetElement[]
}