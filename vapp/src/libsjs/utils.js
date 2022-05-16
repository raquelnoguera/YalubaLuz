/**
 * Library of utility functions used in various files
 */

 'use strict';

 export const utils = {

    /**
     * Calculates the canvas size in which to insert a chart based on the size of the
     * current window.
     * 
     * @param {Number} rate_width    rate between 0 and 1 to apply to the width
     * @param {Number} rate_height   rate between 0 and 1 to apply to the height
     * @returns array with canvas width in position 0 and canvas height in position 1
     */
    setCanvasSize: (rate_width, rate_height) => {
        // let width = window.screen.availWidth;
        // let height = window.screen.availHeight;
        let width = window.innerWidth;
        let height = window.innerHeight;
        let canvaswidth = 0;
        let canvasheight = 0;
        if(width >= (2 * height)) {
            canvaswidth = Math.round(height * rate_width);
            canvasheight = Math.round(height * rate_height);
        }
        else {
            canvaswidth = width * rate_width;
            canvasheight = width * rate_height;
        }
        if(canvaswidth < 600) {
            canvaswidth = 600;
            canvasheight = 450;
        }5
        if(canvasheight < 450) {
            canvasheight = 450;
        }
        return([`${canvaswidth}px`, `${canvasheight}px`]);
    },

}