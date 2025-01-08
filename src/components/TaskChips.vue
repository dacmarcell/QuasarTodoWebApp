<template>
  <q-chip v-if="pendingTasksCount > 0" color="orange" outline class="q-ma-sm" size="sm">
    {{ pendingTasksCount }}
    {{ pendingTasksCount === 1 ? 'tarefa pendente' : 'tarefas pendentes' }}
  </q-chip>
  <q-chip v-if="inProgressTasksCount > 0" color="blue" outline class="q-ma-sm" size="sm">
    {{ inProgressTasksCount }}
    {{ inProgressTasksCount === 1 ? 'tarefa' : 'tarefas' }} em andamento
  </q-chip>
  <q-chip v-if="finishedTasksCount > 0" color="green" outline class="q-ma-sm" size="sm">
    {{ finishedTasksCount }}
    {{ finishedTasksCount === 1 ? 'tarefa concluída' : 'tarefas concluídas' }}
  </q-chip>
  <q-chip v-if="allTasksCount > 0" color="purple" outline class="q-ma-sm" size="sm">
    {{ allTasksCount }}
    {{ allTasksCount === 1 ? 'tarefa' : 'tarefas' }} no total
  </q-chip>
</template>
<script lang="ts">
import { useTasksStore } from 'src/stores/task-store'
import { ref, watch } from 'vue'

export default {
  name: 'TaskChips',
  setup() {
    const tasksStore = useTasksStore()

    const inProgressTasksCount = ref(0)
    const finishedTasksCount = ref(0)
    const pendingTasksCount = ref(0)
    const allTasksCount = ref(0)

    watch(
      () => tasksStore.tasks,
      async () => {
        allTasksCount.value = tasksStore.tasks.length
        inProgressTasksCount.value = tasksStore.inProgressTasksCount
        finishedTasksCount.value = tasksStore.totalFinishedTasksCount
        pendingTasksCount.value = tasksStore.totalPendingTasksCount
      },
      { immediate: true },
    )

    return {
      allTasksCount,
      pendingTasksCount,
      finishedTasksCount,
      inProgressTasksCount,
    }
  },
}
</script>
