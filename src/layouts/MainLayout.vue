<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Super TODO App! </q-toolbar-title>

        <q-btn
          href="https://github.com/dacmarcell"
          target="_blank"
          icon-right="open_in_new"
          class="q-mr-sm"
          >Github</q-btn
        >
        <q-btn
          href="https://linkedin.com/in/marcell-dactes"
          target="_blank"
          icon-right="open_in_new"
          >LinkedIN</q-btn
        >
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Menu </q-item-label>

        <EssentialLink v-for="link in linksList" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EssentialLink, { type EssentialLinkProps } from 'components/EssentialLink.vue'

const linksList: EssentialLinkProps[] = [
  {
    title: 'Início',
    caption: '',
    icon: 'home',
    link: '/',
  },
  {
    title: 'Dashboard',
    caption: 'Seu painel de controle com informações detalhadas',
    icon: 'dashboard',
    link: '/dashboard',
  },
]

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
