<template>
  <div class="q-pa-md" style="max-width: 300px">
    <q-input filled v-model="proxyDateTime">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy @before-show="updateDateProxy" cover transition-show="scale" transition-hide="scale">
            <q-date v-model="proxyDate" mask="DD-MM-YYYY" today-btn>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
                <q-btn label="OK" color="primary" flat @click="saveDate" v-close-popup />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy @before-show="updateTimeProxy" cover transition-show="scale" transition-hide="scale">
            <q-time v-model="proxyTime" mask="HH:mm" format24h now-btn >
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
                <q-btn label="OK" color="primary" flat @click="saveDate" v-close-popup />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { ref, watch, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import { useYalubaStore } from '../stores/yaluba.js';

export default defineComponent({
    name: 'DateSelector',
    setup () {
        const $q = useQuasar();
        const proxyDate = ref(null);
        const proxyTime = ref(null);
        const proxyDateTime = ref(null);
        const { fecha, rango, hora } = storeToRefs(useYalubaStore());
        
        const es_locale = ref(
            {
                /* starting with Sunday */
                days: 'Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado'.split('_'),
                daysShort: 'Dom_Lun_Mar_Mié_Jue_Vie_Sáb'.split('_'),
                months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
                monthsShort: 'Ene_Feb_Mar_Abr_May_Jun_Jul_Ago_Sep_Oct_Nov_Dic'.split('_'),
                firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
                format24h: true,
                pluralDay: 'dias'
            });

        // Methods

        function updateDateProxy () {
            if(fecha.value) {
                proxyDate.value = fecha.value;
            }
            else {
                proxyDate.value = new Date();
            }
        }

        function saveDate () {
            // Check that the selected date does not go over the limit of two days
            let currentdate = new Date();
            //let currentepoch = new Date(`${currentdate.getFullYear()}-${currentdate.getMonth() + 1}-${currentdate.getDate()}`).getTime();
            let currentepoch = currentdate.getTime();
            let [day, month, year] = proxyDate.value.split("-");
            let selectedDate = new Date(`${year}-${month}-${day}`).getTime();
            console.debug(`SelectComponent -> saveDate() -> current: ${currentdate} selected: ${selectedDate}`)
            if(selectedDate > currentepoch) {
                if((selectedDate - currentepoch ) >= (24 * 3600000)) {
                    $q.notify({
                        color: 'warning',
                        textColor: 'white',
                        icon: 'error',
                        message: `Tarifas disponibles solo con un día de adelanto.`,
                        timeout: 5000,
                        position: "center"
                        })
                }
                else { 
                    // if the date has changed, then set the time to 00:00
                    if(parseInt(day) != currentdate.getDate()) {
                        hora.value = proxyTime.value;
                        fecha.value = proxyDate.value;
                    }
                }
            }
            else {
                fecha.value = proxyDate.value;
                hora.value = proxyTime.value;
            }
        }

        function updateTimeProxy () {
            if(hora.value) {
                proxyTime.value = hora.value;
            }
            else {
                let currenttime = new Date();
                proxyTime.value = `${currenttime.getHours()}:${currenttime.getMinutes()}`;
            }
        }

        // function saveTime () {
        //     hora.value = proxyTime.value
        // }

        // WATCHERs
        watch(proxyDate, () => {
            proxyDateTime.value = `${proxyDate.value} ${proxyTime.value}`;
        });

        watch(proxyTime, () => {
            proxyDateTime.value = `${proxyDate.value} ${proxyTime.value}`;
        });

        // HOOKS
        onMounted(() => {
          const currentDate = new Date();
          let cDay = currentDate.getDate();
          let cMonth = currentDate.getMonth() + 1;
          let cYear = currentDate.getFullYear();
          let cHour = currentDate.getHours();
          proxyDate.value = `${cDay}-${cMonth}-${cYear}`;
          proxyTime.value = `${cHour}:00`;
          proxyDateTime.value = `${proxyDate.value} ${proxyTime.value}`;
        });

        return {
            proxyDate,
            proxyTime,
            proxyDateTime,
            fecha,
            hora,
            rango,
            es_locale,
            updateDateProxy,
            saveDate,
            updateTimeProxy
        }
    }
})
</script>
