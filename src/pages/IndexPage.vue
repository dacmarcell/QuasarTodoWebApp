<template>
  <q-page class="row items-center justify-evenly">
    <div class="bg-primary q-pa-xl">
      <TodosList />
    </div>
  </q-page>
</template>

<script lang="ts">
import TodosList from 'components/TodosList.vue'

export default {
  name: 'IndexPage',
  components: {
    TodosList,
  },
}
</script>
