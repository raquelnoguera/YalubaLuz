<template>
  <q-page v-if="isChartMode" class="fit row wrap justify-center items-start content-start">
    <PriceChartComponent />
  </q-page>
  <q-page v-else class="fit row wrap justify-center items-start content-start">
    <PriceListComponent />
  </q-page>
</template>

<script>
import { storeToRefs } from 'pinia';
import { useYalubaStore } from '../stores/yaluba.js';
import { defineComponent } from 'vue';
import PriceListComponent from '../components/ListPrices.vue';
import PriceChartComponent from '../components/ChartPrices.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { PriceListComponent, PriceChartComponent},

  setup () {
    const { isChartMode } = storeToRefs(useYalubaStore());

    return {
      isChartMode
    }
  }
})
</script>


<style>

</style>