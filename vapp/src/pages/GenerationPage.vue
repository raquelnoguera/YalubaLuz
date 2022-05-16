<template>
  <q-page class="fit row wrap justify-center items-start content-start">
    <GenerationChartComponent />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import GenerationChartComponent from '../components/ChartGeneration.vue';

export default defineComponent({
  name: 'GenerationPage',
  components: { GenerationChartComponent },

  setup () {
    
  }
})
</script>
