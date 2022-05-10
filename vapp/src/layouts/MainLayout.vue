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
        <q-item-label
          header
        >
          Selecci&oacute;n de fecha y hora
        </q-item-label>

        <SelectComponent/>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue';
import EssentialLink from 'components/EssentialLink.vue';
import SelectComponent from 'components/SelectComponent.vue';

const linksList = [
  {
    title: 'Github',
    caption: 'Código fuente',
    icon: 'code',
    link: 'https://github.com/raquelnoguera/YalubaLuz'
  },
  {
    title: 'API Red Eléctrica de España',
    caption: 'RED Apidatos',
    icon: 'api',
    link: 'https://www.ree.es/es/apidatos'
  }
]

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink,
    SelectComponent
  },

  setup () {
    const leftDrawerOpen = ref(false)

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
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
