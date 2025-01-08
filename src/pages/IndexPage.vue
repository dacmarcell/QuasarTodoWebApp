<template>
  <q-page class="row items-center justify-evenly">
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
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue'

import CleanAllTasksButton from 'components/CleanAllTasksButton.vue'
import CreateTaskDialog from 'components/CreateTaskDialog.vue'
import CreateTaskButton from 'components/CreateTaskButton.vue'
import StatusFilters from 'components/StatusFilters.vue'
import TaskChips from 'components/TaskChips.vue'
import TaskList from 'components/TaskList.vue'

export default {
  name: 'IndexPage',
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
