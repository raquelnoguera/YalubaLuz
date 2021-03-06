<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Tarifa Eléctrica de España
        </q-toolbar-title>

        <div>
          <img
            alt="Yaluba logo"
            src="~assets/yaluba_logo_constrained.png"
            class="header-image"
          >
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Enlaces de inte&eacute;s
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
      <q-list>
        <q-item-label header >
          Selecci&oacute;n de fecha y hora
        </q-item-label>
        <DateSelector/>
      </q-list>
      <q-list v-if="currentRoute == '/prices'">
        <q-toggle
          class="df"
          :false-value="false"
          :label="chartSwitchLabel"
          :true-value="true"
          color="grey-14"
          v-model="isChartMode"
        />
      </q-list>
      <q-list>
        <q-toggle
          class="df"
          :false-value="false"
          :label="themeSwitchLabel"
          :true-value="true"
          color="grey-14"
          v-model="isDarkTheme"
        />
      </q-list>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, computed, watch, onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { storeToRefs } from 'pinia';
import {useRoute} from 'vue-router'
import { useYalubaStore } from '../stores/yaluba.js';
import EssentialLink from 'components/EssentialLink.vue';
import DateSelector from 'components/DateSelector.vue';

const linksList = [
  {
    title: 'Github',
    caption: 'Código fuente',
    icon: 'ion-logo-github',
    link: 'https://github.com/raquelnoguera/YalubaLuz',
    isblank: true
  },
  {
    title: 'API Red Eléctrica de España',
    caption: 'RED Apidatos',
    icon: 'power',
    link: 'https://www.ree.es/es/apidatos',
    isblank: true
  },
  {
    title: 'Consultar precios',
    caption: 'Tabla de precios regulado y libre',
    icon: 'euro',
    link: '/prices',
    isblank: false
  },
  {
    title: 'Generación Eléctrica',
    caption: 'Fuentes de generación',
    icon: 'electric_meter',
    link: '/generacion',
    isblank: false
  },
  {
    title: 'Split de generación',
    caption: 'Renovable vs no-renovable',
    icon: 'wind_power',
    link: '/split',
    isblank: false
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    DateSelector
  },

  setup () {
    const leftDrawerOpen = ref(false);
    const themeSwitchLabel = ref(null);
    const chartSwitchLabel = ref(null);
    const $q = useQuasar();
    const { isDarkTheme, isChartMode } = storeToRefs(useYalubaStore());
    const route = useRoute();
    $q.dark.set(isDarkTheme);

    // COMPUTED
    const currentRoute = computed(() => route.path);

    // WATCH
    watch(isDarkTheme, () => {
      $q.dark.toggle();
      setThemeLabel();
    });

    watch(isChartMode, () => {
      setChartLabel();
    });

    // METHODS

    function setThemeLabel() {
      if(isDarkTheme.value == true) {
        themeSwitchLabel.value = "Switch to Light Theme";
      }
      else {
        themeSwitchLabel.value = "Switch to Dark Theme";
      }
    }

    function setChartLabel() {
      if(isChartMode.value == true) {
        chartSwitchLabel.value = "Mostrar tabularmente";
      }
      else {
        chartSwitchLabel.value = "Mostrar gráficamente";
      }
    }

    // HOOKS
    onBeforeMount(() => {
      setThemeLabel();
      setChartLabel();
    })

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      isDarkTheme,
      isChartMode,
      themeSwitchLabel,
      chartSwitchLabel,
      currentRoute,
      toggleLeftDrawer () {
        leftDrawerOpen.value = !leftDrawerOpen.value
      }
    }
  }
})
</script>

<style scoped lang="scss">
.header-image {
  display: inline-block;
  z-index: -1;
  opacity: 0.8;
  padding: 0 0 0 0;
  margin: 10px 0 10px 10px;
  scale: 90%;
}
</style>
