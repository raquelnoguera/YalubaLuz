<template>
  <q-page class="fit row wrap justify-center items-start content-start">
    <ListComponent />
  </q-page>
</template>

<script>
import { defineComponent } from 'vue';
import ListComponent from '../components/ListPrices.vue';

export default defineComponent({
  name: 'IndexPage',
  components: { ListComponent},
})
</script>


<style>

</style>