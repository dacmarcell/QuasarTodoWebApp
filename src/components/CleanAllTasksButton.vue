<template>
  <q-btn
    v-if="doesHaveFinishedTasks"
    label="Limpar finalizadas"
    color="secondary"
    icon="cleaning_services"
    class="q-ma-md"
    @click="handleDeleteFinishedTasks"
  />
</template>
<script lang="ts">
import { useQuasar } from 'quasar'
import { ref, watch } from 'vue'
import { useTasksStore } from 'src/stores/task-store'

export default {
  name: 'CleanAllTasksButton',
  setup() {
    const tasksStore = useTasksStore()
    const $q = useQuasar()

    const doesHaveFinishedTasks = ref(false)

    watch(
      () => tasksStore.tasks,
      () => {
        doesHaveFinishedTasks.value = tasksStore.tasks.some((todo) => todo.status === 'finished')
      },
      { immediate: true },
    )

    const handleDeleteFinishedTasks = async () => {
      await tasksStore.deleteAllFinishedTasks($q)
    }

    return { doesHaveFinishedTasks, handleDeleteFinishedTasks }
  },
}
</script>
