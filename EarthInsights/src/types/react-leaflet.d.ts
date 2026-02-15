import { TileLayerProps } from 'react-leaflet';

declare module 'react-leaflet' {
    export interface TileLayerProps {
        attribution?: string;
    }
}
