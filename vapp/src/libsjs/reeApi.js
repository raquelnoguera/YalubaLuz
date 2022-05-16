/**
 *    This library implements the communication with Red Electrica de España.
**/

'use strict';

import axios from 'axios';
import { Dialog } from 'quasar';

class ReeApi {
    
    constructor() { 
        this.reeUrl = "https://apidatos.ree.es";
    }

    /**
     * Retrieves the list of prices in hour ranges
     * 
     * @param {String} date with format DD-MM-YYYY
     * @param {String} hour with format HH:mm
     * @param {Number} range in hours 
     */
    getHourlyPrices(date, hour, range) {
        let [dia, mes, anyo] = date.split("-");
        let fechaInicial = new Date(parseInt(anyo), parseInt(mes) - 1, parseInt(dia));  // epoch in seconds
        let fechaFinalMs = fechaInicial.getTime() + (range * 3600000); // epoch of the end date (in ms)
        let fechaFinal = new Date(fechaFinalMs);
        let fechaFinalStr = `${fechaFinal.getDate()}-${fechaFinal.getMonth() + 1}-${fechaFinal.getFullYear()}`;
        return axios({
            method: 'get',
            baseURL: this.reeUrl,
            url: '/es/datos/mercados/precios-mercados-tiempo-real',
            header: {
                'Accept': 'application/json'
            },
            params: {
                start_date: `${date}T${hour}`,
                end_date: `${fechaFinalStr}T${hour}`,
                time_trunc: "hour"
            },
        })
        .then( (response) => {
            // console.debug("reeApi -> getHourlyPrices -> Received response:");
            // console.debug(response.data);
            if(response.status == 200) {
                if("errors" in response.data) {
                    return(-1);
                }
                else {
                    return(response.data.included);
                }
            }
            else {
                return(-1);
            }
        })
        .catch( (error) => {
            console.log("DEBUG Error requesting a new Id:");
            console.log(error);
            return(-2);
        })
    }

    /**
     * Retrieves the generation structure of the days between startdate and enddate
     * 
     * @param {String} startdate with format DD-MM-YYYY
     * @param {String} enddate with format DD-MM-YYYY
     */
    getGeneration(startdate, enddate) {
        return axios({
            method: 'get',
            baseURL: this.reeUrl,
            url: '/es/datos/generacion/estructura-generacion',
            header: {
                'Accept': 'application/json'
            },
            params: {
                start_date: startdate,
                end_date: enddate,
                time_trunc: "day"
            },
        })
        .then( (response) => {
            if(response.status == 200) {
                if("errors" in response.data) {
                    return(-1);
                }
                else {
                    return(response.data.included);
                }
            }
            else {
                return(-1);
            }
        })
        .catch( (error) => {
            console.log("DEBUG Error in getGeneration():");
            console.log(error);
            return(-2);
        })
    }

    /**
     * Gets the power generate by renewable and non-renewable sources in the range of dates defined.
     * 
     * @param {*} startdate 
     * @param {*} enddate 
     * @returns 
     */
    getSplit(startdate, enddate) {
        return axios({
            method: 'get',
            baseURL: this.reeUrl,
            url: '/es/datos/generacion/evolucion-renovable-no-renovable',
            header: {
                'Accept': 'application/json'
            },
            params: {
                start_date: startdate,
                end_date: enddate,
                time_trunc: "day"
            },
        })
        .then( (response) => {
            if(response.status == 200) {
                if("errors" in response.data) {
                    return(-1);
                }
                else {
                    return(response.data.included);
                }
            }
            else {
                return(-1);
            }
        })
        .catch( (error) => {
            console.log("DEBUG Error in getSplit():");
            console.log(error);
            return(-2);
        })
    }
}

export default ReeApi;