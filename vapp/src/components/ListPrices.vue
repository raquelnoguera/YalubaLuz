<template>
  <div class="q-pa-md">
        <p>Todos los precios son €/MWh<br>
            <strong>PVPV</strong> Precio voluntario Peque&ntilde;o consumidor (tarifa regulada)<br>
            <strong>Spot</strong> Precio en mercado spot (tarifa libre)
        </p>
        <q-markup-table>
        <thead>
            <tr>
            <th class="text-left">Fecha</th>
            <th class="text-right">Hora</th>
            <th class="text-right">PVPC</th>
            <th class="text-right">Spot</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="line in lines" :key="line[0]">
            <td class="text-left">{{line[1]}}</td>
            <td class="text-right">{{line[2]}}</td>
            <td class="text-right">{{line[3]}}</td>
            <td class="text-right">{{line[4]}}</td>
            </tr>
        </tbody>
        </q-markup-table>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ref, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useYalubaStore } from '../stores/yaluba.js';
import { useQuasar } from 'quasar';

export default defineComponent({
    name: 'ListPricesComponent',

    setup () {
        const $q = useQuasar();
        const store = useYalubaStore();
        const lines = ref([]);
        const { fecha, rango, hora } = storeToRefs(store);

        // WATCHERs
        watch(fecha, () => {
            console.debug(`ListPrices -> fecha: ${fecha.value}`);
            updateList(fecha.value, hora.value, rango.value);
        });
        
        watch(hora, (_new, _old) => {
            console.debug(`ListPrices -> hora nueva: ${_new} , hora anterior: ${_old}`);
            // Disregard minutes
            if(_new && _old) {  // both have to be defined
                let newComp = _new.split(":");
                let oldComp = _old.split(":");
                if(newComp[0] != oldComp[0]) {  // update only if hour changed
                    console.debug("ListPrices -> Updating list!!!")
                    updateList(fecha.value, `${newComp[0]}:00`, rango.value);
                }
            }
        });

        watch(rango, () => {
            console.debug(`ListPrices -> rango: ${rango.value}`);
            updateList(fecha.value, hora.value, rango.value);
        });

        // METHODS

        /**
         * Called when there is a change in the connection status to the EOA in the wallet.
         */
        function updateList(_fecha, _hora, _rango) {
            // console.debug("HERE");
            store.reeApi.getHourlyPrices(_fecha, _hora, _rango)
            .then( (response) => {
                if(typeof(response) == 'number') { // an error ocurred
                    console.error(`ListPrices -> updateList() -> reeApi.getHourlyPrices returned ${response}`);
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
                lines.value.splice(0, lines.value.length);  // Empty the lines array
                let pvpc = [];  // List of "precio voluntario pequeño consumidor (tarifa regulada)"
                let spot = [];  // List of "precio spot (tarifa libre)"
                // console.debug(`ListPrices -> Response length: ${response.length}`);
                if(response.length > 0) {   // PVPC, spot or both included
                    // console.debug("ListPrices -> Response[0].attributes.values:");
                    // console.debug(response[0].attributes.values);
                    if(response[0].type.includes("PVPC")) {
                        response[0].attributes.values.forEach( value => {
                            // console.debug("ListPrices -> PVPC loop -> value:");
                            // console.debug(value);
                            // datetime format "2022-05-08T16:00:00.000+02:00"
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
                                // console.debug("ListPrices -> Spot loop -> value:");
                                // console.debug(value);
                                // datetime format "2022-05-08T16:00:00.000+02:00"
                                let datetime = value.datetime.split("T");
                                let date = datetime[0].split("-");
                                let datestr = `${date[2]}-${date[1]}-${date[0]}`;
                                let hour = datetime[1].split(":");
                                let hourstr = `${hour[0]}:${hour[1]}`;
                                spot.push([datestr, hourstr, value.value]);
                            });
                        }
                        else {
                            console.error(`ListPrices -> Unknown type ${response[0].type}`);
                        }
                    }
                }
                if(response.length > 1) {
                    // console.debug("ListPrices -> Response[1].attributes.values:");
                    // console.debug(response[1].attributes.values);
                    if(response[1].type.includes("PVPC")) {
                        response[1].attributes.values.forEach( value => {
                            // console.debug("ListPrices -> PVPC loop -> value:");
                            // console.debug(value);
                            // datetime format "2022-05-08T16:00:00.000+02:00"
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
                                // console.debug("ListPrices -> Spot loop -> value:");
                                // console.debug(value);
                                // datetime format "2022-05-08T16:00:00.000+02:00"
                                let datetime = value.datetime.split("T");
                                let date = datetime[0].split("-");
                                let datestr = `${date[2]}-${date[1]}-${date[0]}`;
                                let hour = datetime[1].split(":");
                                let hourstr = `${hour[0]}:${hour[1]}`;
                                spot.push([datestr, hourstr, value.value]);
                            });
                        }
                        else {
                            console.error(`ListPrices -> Unknown type ${response[0].type}`);
                        }
                    }
                }
                if(pvpc.length > 0) {
                    for(let i = 0; i < pvpc.length; i++) {
                        if(spot.length >= i) {
                            lines.value.push([i, pvpc[i][0], pvpc[i][1], pvpc[i][2], spot[i][2]]);
                        }
                        else {
                            lines.value.push([i, pvpc[i][0], pvpc[i][1], pvpc[i][2], 'No disponible']);
                        }
                    }
                }
                else {
                    if(spot.length > 0) {
                        for(let i = 0; i < spot.length; i++) {
                            lines.value.push([i, spot[i][0], spot[i][1], "No disponible", spot[i][2]]);
                        }
                    }
                }
                // Currently in REE API, spot can extend for 2 days while PVPC is only for the current day
                if(spot.length > pvpc.length) {
                    console.debug(`ListPrices -> pvpc.length: ${pvpc.length} , spot.length: ${spot.length}, difference: ${spot.length - pvpc.length}`);
                    for(let i = pvpc.length; i < spot.length; i++) {
                        lines.value.push([i, spot[i][0], spot[i][1], "No disponible", spot[i][2]]);
                    }
                }
            })
            .catch(error => {
                console.debug(error);
            })
        }

        // HOOKS
        onMounted(() => {
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
        });

        return {
            fecha,
            hora,
            rango,
            lines
        }
    }
})

</script>