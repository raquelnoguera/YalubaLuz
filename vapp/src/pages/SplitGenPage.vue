<template>
  <q-page class="fit row wrap justify-center items-start content-start">
    <SplitgenChartComponent />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import SplitgenChartComponent from '../components/ChartSourceSplit.vue';

export default defineComponent({
  name: 'SplitGenPage',
  components: { SplitgenChartComponent },

  setup () {
    
  }
})
</script>
