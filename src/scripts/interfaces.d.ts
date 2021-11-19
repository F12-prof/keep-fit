
import pixi from 'pixi.js';

export interface BaseImageAssetElement {
    name?: string;
    path: string,
    x: number,
    y: number
}

export interface AssetType {
    baseImage: BaseImageAssetElement
}