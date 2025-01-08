<template>
  <div class="row items-center justify-end q-mb-md">
    <q-btn-group outline flat>
      <q-btn
        class="text-bold"
        v-for="statusOptions in statusOptions"
        :key="statusOptions.value"
        :label="statusOptions.label"
        :outline="filter !== statusOptions.value"
        @click="handleChangeFilter(statusOptions)"
        :color="
          filter === statusOptions.value
            ? statusColors[statusOptions.value as TaskStatus]
            : 'grey-5'
        "
        ><q-tooltip
          >{{ filter === statusOptions.value ? 'Todas as tarefas' : statusOptions.tooltip }}
        </q-tooltip></q-btn
      >
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useTasksStore } from 'src/stores/task-store'

import { TaskStatus } from './models'

type StatusOption = { label: string; value: TaskStatus; tooltip: string }

export default {
  name: 'StatusFilters',
  setup() {
    const tasksStore = useTasksStore()
    const filter = computed({
      get: () => tasksStore.filter,
      set: (value) => {
        tasksStore.setFilter(value)
      },
    })

    const statusOptions: StatusOption[] = [
      { label: 'Pendente', value: 'pending', tooltip: 'Tarefas pendentes' },
      { label: 'Em progresso', value: 'in-progress', tooltip: 'Tarefas em progresso' },
      { label: 'Concluída', value: 'finished', tooltip: 'Tarefas concluídas' },
    ]

    const statusColors = {
      all: 'purple',
      pending: 'orange',
      'in-progress': 'blue',
      finished: 'green',
    }

    function handleChangeFilter(statusOption: StatusOption) {
      const filterOption = tasksStore.filter === statusOption.value ? null : statusOption.value
      tasksStore.setFilter(filterOption)
    }

    return { filter, statusOptions, statusColors, handleChangeFilter }
  },
}
</script>
