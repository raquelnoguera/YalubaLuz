import { defineStore } from 'pinia';
import ree_api from '../libsjs/reeApi.js';

export const useYalubaStore = defineStore('yalubaStore', {
  state: () => ({
    reeApi: new ree_api(),
    fecha: null,
    rango: 24,   // We leave it hardcode for now because REE does not give PVPC or spot for longer than "next day"
    hora: null,
    isDarkTheme: false,
    isChartMode: false,
    datalines: []
  }),

  getters: {
    
  },

  actions: {
    
  }
})
