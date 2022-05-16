<template>
    <q-card class="gen-card">
        <div class="q-pa-md">
            <canvas id="card-chart" width="400px" height="400px"></canvas>
        </div>
        <q-card-section>
            <div class="row no-wrap items-center">
                <div class="col text-h6 ellipsis"><strong>Fecha:</strong> {{fecha}}</div>
            </div>
        </q-card-section>
    </q-card>
</template>

<script>
/**
 * Displays a polar chart with the different components for the selected date.
 */
import { Chart, registerables } from 'chart.js';
import { defineComponent } from 'vue';
import { ref, onMounted } from 'vue';

const filename = "GenerationCard";

export default defineComponent({
    name: 'GenerationCardComponent',
    props: ['date', 'labels', 'colors', 'dataset'],
    setup (props) {
        const chart = ref(null);
        const fecha = ref(props.date);

        // HOOKS
        onMounted(() => {
            let chartData = {
                type: "pie",
                data: {
                    labels: props.labels,
                    datasets: [{
                        data: props.dataset,
                        backgroundColor: props.colors
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            };
            if(chartData.data.labels.length < 5) {
                chartData.options.plugins.legend.display = true;
            }
            const ctx = document.getElementById('card-chart');
            Chart.register(...registerables);
            chart.value = new Chart(ctx, chartData);   
        });

        return {
            chart,
            fecha
        }
    }
})

</script>

<style lang="sass" scoped>
.gen-card
  width: 100%
  max-width: 420px

</style>