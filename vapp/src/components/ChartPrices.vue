<template>
    <div class="q-pa-md">
        <canvas id="price-chart" :style="{width: canvasSize[0], height: canvasSize[1]}"></canvas>
        <div class="fit row justify-center" v-if="showZeroMsg"><em><sup>*</sup>Un valor de cero significa que no hay datos en esa hora para esa tarifa.</em></div>
    </div>
    <q-dialog v-model="toolbar">
      <q-card>
        <q-toolbar>
          <q-avatar>
            <img src="~assets/yaluba_icon-32.png">
          </q-avatar>

          <q-toolbar-title>Tarifa {{tarifa}}</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section v-html="msg_text">
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script>
import { Chart, registerables } from 'chart.js';
import { defineComponent } from 'vue';
import { ref, shallowRef, triggerRef, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useYalubaStore } from '../stores/yaluba.js';
import { useQuasar } from 'quasar';
// import { utils } from '../libsjs/utils.js';

const filename = "ChartPrices";

export default defineComponent({
    name: 'ChartPricesComponent',

    setup () {
        const $q = useQuasar();
        const store = useYalubaStore();
        const { fecha, rango, hora, datalines } = storeToRefs(store);
        const priceChartData = ref(null);
        const showZeroMsg = ref(false);     // Used to show the paragraph on top of the chart
        const chart = shallowRef(null);
        const canvasSize = ref([980, 500]) // used to set the size of the canvas
        // Dialog specific
        const toolbar = ref(false);
        const msg_text = ref('');   // Message shown when the user clicks on a point in the chart
        const tarifa = ref('');     // Used in the title of the dialog that appears when the user click on a poin in the chart 

        // WATCHERs
        watch(fecha, () => {
            console.debug(`${filename} -> fecha: ${fecha.value}`);
            updateList(fecha.value, hora.value, rango.value);
        });
        
        watch(hora, (_new, _old) => {
            console.debug(`${filename} -> hora nueva: ${_new} , hora anterior: ${_old}`);
            // Disregard minutes
            if(_new && _old) {  // both have to be defined
                let newComp = _new.split(":");
                let oldComp = _old.split(":");
                if(newComp[0] != oldComp[0]) {  // update only if hour changed
                    updateList(fecha.value, `${newComp[0]}:00`, rango.value);
                }
            }
        });

        watch(rango, () => {
            console.debug(`${filename} -> rango: ${rango.value}`);
            updateList(fecha.value, hora.value, rango.value);
        });


        // METHODS

        /**
         * Set the size of the canvas to be 80% of the screen
         */

        function setCanvasSize() {
            const fname = "setCanvasSize()";
            // let width = window.screen.availWidth;
            // let height = window.screen.availHeight;
            let width = window.innerWidth;
            let height = window.innerHeight;
            let canvaswidth = 0;
            let canvasheight = 0;
            if(width >= (2 * height)) {
                canvaswidth = height * 0.8;
                canvasheight = height * 0.7;
            }
            else {
                canvaswidth = width * 0.8;
                canvasheight = width * 0.7;
            }
            if(canvaswidth < 600) {
                canvaswidth = 600;
                canvasheight = 450;
            }5
            if(canvasheight < 450) {
                canvasheight = 450;
            }
            canvasSize.value = [`${canvaswidth}px`, `${canvasheight}px`];
            console.debug(`${filename} -> ${fname} -> Canvas size: ${canvasSize.value[0]} x ${canvasSize.value[1]}`);
        }

        /**
         * Computes the data to use in the chart
         */
        function updateChartData() {
            const fname = "updateChartData()";
            console.log(`${filename} -> ${fname} -> Updating chart data`);
            let labelsHours = [];
            let pvpcPrices = [];
            let spotPrices = [];
            showZeroMsg.value = false;
            datalines.value.forEach( (line) => {
                labelsHours.push(line[2]);
                if(line[3] == "No disponible") {
                    showZeroMsg.value = true;
                    pvpcPrices.push(0);
                }
                else {
                    pvpcPrices.push(parseFloat(line[3]));
                }
                if(line[4] == "No disponible") {
                    showZeroMsg.value = true;
                    spotPrices.push(0);
                }
                else {
                    spotPrices.push(parseFloat(line[4]));
                }
            });
            
            let chartData = {
                type: "line",
                data: {
                    labels: labelsHours,
                    datasets: [
                        {
                            label: "PVPC",
                            data: pvpcPrices,
                            fill:true,
                            backgroundColor: "rgba(255, 178, 102, .25)",
                            borderColor: "#ff8000",
                            pointRadius: 2,
                            borderWidth: 1
                        },
                        {
                            label: "Spot",
                            data: spotPrices,
                            fill: true,
                            backgroundColor: "rgba(51, 51, 255, .25)",
                            borderColor: "#3333ff",
                            pointRadius: 2,
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    hover : {
                        mode: 'nearest',
                        intersect: false
                    },
                    lineTension: 0.25,
                    plugins: {
                        title: {
                            display: true,
                            text: `Fecha de inicio: ${fecha.value}`
                        }
                    },
                    scales: {
                        yAxes: {
                            ticks: {
                                beginAtZero: true,
                                padding: 25
                            },
                            title: {
                                display: true,
                                text: '€/MWh'
                            }
                        }
                    },
                    onClick: (event) => {
                        let activePoint = chart.value.getElementsAtEventForMode(event, 'nearest', { intersect: false }, true);
                        // make sure click was on an actual point
                        if (activePoint.length > 0) {
                            var clickedDatasetIndex = activePoint[0].datasetIndex;
                            var clickedElementindex = activePoint[0].index;
                            console.debug(`${filename} -> ${fname} -> clickedDatasetIndex: ${clickedDatasetIndex} , clickedElementindex: ${clickedElementindex}`)
                            var label = chart.value.data.labels[clickedElementindex];
                            var value = chart.value.data.datasets[clickedDatasetIndex].data[clickedElementindex];     
                            // alert("Clicked: " + label + " - " + value);
                            tarifa.value = (chart.value.data.datasets[clickedDatasetIndex].label == "PVPC") ? "PVPC (regulada)" : "Spot (libre)";
                            msg_text.value = `
                                <strong>Fecha:</strong> ${datalines.value[clickedElementindex][1]}<br>
                                <strong>Hora:</strong> ${label}<br>
                                <strong>Precio:</strong> ${value} €/MWh`;
                            toolbar.value = true
                        }
                    }
                }
            }
            // console.debug(`ChartPrices -> priceChartData -> labels: ${labelsHours}`);
            // console.debug(`ChartPrices -> priceChartData -> PVPC: ${pvpcPrices}`);
            // console.debug(`ChartPrices -> priceChartData -> PVPC: ${spotPrices}`);
            const ctx = document.getElementById('price-chart');
            if(!chart.value) {
                console.debug(`${filename} -> ${fname} -> New Chart`);
                Chart.register(...registerables);
                chart.value = new Chart(ctx, chartData);
                triggerRef(chart);
            }
            else {
                console.debug(`${filename} -> ${fname} -> Chart Update`);
                // Remove data
                chart.value.data.labels.splice(0, chart.value.data.labels.length); // empty the labels list
                chart.value.data.datasets.splice(0, 2); // empty the datasets list
                chart.value.update();
                // Add new data
                chart.value.data.labels.push(...chartData.data.labels); // set new labels
                chartData.data.datasets.forEach((dataset) => {  // build the datasets
                    chart.value.data.datasets.push(dataset);
                });
                chart.value.options.plugins.title.text = chartData.options.plugins.title.text; // set the new title
                chart.value.update();
                triggerRef(chart);
                // chart.value.update(chartData);
                // triggerRef(chart);
            }
        }


        /**
         * Called when there is a change in the connection status to the EOA in the wallet.
         */
        function updateList(_fecha, _hora, _rango) {
            const fname = "updateList()";
            store.reeApi.getHourlyPrices(_fecha, _hora, _rango)
            .then( (response) => {
                if(typeof(response) == 'number') { // an error ocurred
                    console.error(`${filename} -> ${fname} -> reeApi.getHourlyPrices returned ${response}`);
                    $q.notify({
                        color: 'negative',
                        textColor: 'white',
                        icon: 'error',
                        message: `Tarifas no disponibles para la fecha solicitada.`,
                        timeout: 5000,
                        position: "center"
                        })
                    return;     // nothing to do
                }
                console.debug(`${filename} -> ${fname} -> New data retrieved`);
                datalines.value.splice(0, datalines.value.length);  // Empty the lines array
                let pvpc = [];  // List of "precio voluntario pequeño consumidor (tarifa regulada)"
                let spot = [];  // List of "precio spot (tarifa libre)"
                if(response.length > 0) {   // PVPC, spot or both included
                    if(response[0].type.includes("PVPC")) {
                        response[0].attributes.values.forEach( value => {
                            let datetime = value.datetime.split("T");
                            let date = datetime[0].split("-");
                            let datestr = `${date[2]}-${date[1]}-${date[0]}`;
                            let hour = datetime[1].split(":");
                            let hourstr = `${hour[0]}:${hour[1]}`;
                            pvpc.push([datestr, hourstr, value.value]);
                        });
                    }
                    else {
                        if(response[0].type.includes("spot")) {
                            response[0].attributes.values.forEach( value => {
                                let datetime = value.datetime.split("T");
                                let date = datetime[0].split("-");
                                let datestr = `${date[2]}-${date[1]}-${date[0]}`;
                                let hour = datetime[1].split(":");
                                let hourstr = `${hour[0]}:${hour[1]}`;
                                spot.push([datestr, hourstr, value.value]);
                            });
                        }
                        else {
                            console.error(`${filename} -> ${fname} -> Unknown type ${response[0].type}`);
                        }
                    }
                }
                if(response.length > 1) {
                    if(response[1].type.includes("PVPC")) {
                        response[1].attributes.values.forEach( value => {
                            let datetime = value.datetime.split("T");
                            let date = datetime[0].split("-");
                            let datestr = `${date[2]}-${date[1]}-${date[0]}`;
                            let hour = datetime[1].split(":");
                            let hourstr = `${hour[0]}:${hour[1]}`;
                            pvpc.push([datestr, hourstr, value.value]);
                        });
                    }
                    else {
                        if(response[1].type.includes("spot")) {
                            response[1].attributes.values.forEach( value => {
                                let datetime = value.datetime.split("T");
                                let date = datetime[0].split("-");
                                let datestr = `${date[2]}-${date[1]}-${date[0]}`;
                                let hour = datetime[1].split(":");
                                let hourstr = `${hour[0]}:${hour[1]}`;
                                spot.push([datestr, hourstr, value.value]);
                            });
                        }
                        else {
                            console.error(`${filename} -> ${fname} -> Unknown type ${response[0].type}`);
                        }
                    }
                }
                if(pvpc.length > 0) {
                    console.debug(`${filename} -> ${fname} -> Updating datalines`);
                    for(let i = 0; i < pvpc.length; i++) {
                        if(spot.length >= i) {
                            datalines.value.push([i, pvpc[i][0], pvpc[i][1], pvpc[i][2], spot[i][2]]);
                        }
                        else {
                            datalines.value.push([i, pvpc[i][0], pvpc[i][1], pvpc[i][2], 'No disponible']);
                        }
                    }
                    updateChartData();
                }
                else {
                    if(spot.length > 0) {
                        for(let i = 0; i < spot.length; i++) {
                            datalines.value.push([i, spot[i][0], spot[i][1], "No disponible", spot[i][2]]);
                        }
                        updateChartData();
                    }
                }
                // Currently in REE API, spot can extend for 2 days while PVPC is only for the current day
                if(spot.length > pvpc.length) {
                    console.debug(`${filename} -> ${fname} -> pvpc.length: ${pvpc.length} , spot.length: ${spot.length}, difference: ${spot.length - pvpc.length}`);
                    for(let i = pvpc.length; i < spot.length; i++) {
                        datalines.value.push([i, spot[i][0], spot[i][1], "No disponible", spot[i][2]]);
                    }
                    updateChartData();
                }
            })
            .catch(error => {
                console.debug(error);
            })
        }

        // HOOKS
        onMounted(() => {
            setCanvasSize();
            if(!datalines) {    // load data if none available
                if(!fecha.value) {
                    const currentDate = new Date();
                    let cDay = currentDate.getDate();
                    let cMonth = currentDate.getMonth() + 1;
                    let cYear = currentDate.getFullYear();
                    let cHour = currentDate.getHours();
                    fecha.value = `${cDay}-${cMonth}-${cYear}`;
                    hora.value = `${cHour}:00`;
                    rango.value = 24;
                }
                updateList(fecha.value, hora.value, rango.value);
            }
            else {
                updateChartData();
            }
        });

        return {
            fecha,
            hora,
            rango,
            datalines,
            chart,
            priceChartData,
            showZeroMsg,
            canvasSize,
            toolbar,
            msg_text,
            tarifa
        }
    }
})
</script>