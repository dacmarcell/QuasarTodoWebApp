<template>
  <q-page padding>
    <CreateTaskButton
      :isCreateTaskFormOpen="isCreateTaskFormOpen"
      @update:isCreateTaskFormOpen="isCreateTaskFormOpen = $event"
    />
    <CreateTaskDialog
      :isCreateTaskFormOpen="isCreateTaskFormOpen"
      @update:isCreateTaskFormOpen="isCreateTaskFormOpen = $event"
    />
    <CleanAllTasksButton />
    <q-separator spaced />
    <StatusFilters />
    <TaskChips />
    <TaskList />
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue'

import CleanAllTasksButton from './CleanAllTasksButton.vue'
import CreateTaskDialog from './CreateTaskDialog.vue'
import CreateTaskButton from './CreateTaskButton.vue'
import StatusFilters from './StatusFilters.vue'
import TaskChips from './TaskChips.vue'
import TaskList from './TaskList.vue'

export default {
  name: 'TodosList',
  setup() {
    const isCreateTaskFormOpen = ref(false)
    return { isCreateTaskFormOpen }
  },
  components: {
    CleanAllTasksButton,
    CreateTaskDialog,
    CreateTaskButton,
    StatusFilters,
    TaskChips,
    TaskList,
  },
}
</script>

<style scoped>
.q-page {
  width: 100%;
}
</style>
