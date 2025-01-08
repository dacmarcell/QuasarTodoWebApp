<template>
  <div class="row items-center justify-center q-mb-md">
    <q-btn-group flat>
      <q-btn
        v-for="statusOptions in statusOptions"
        flat
        :key="statusOptions.value"
        :label="statusOptions.label"
        :outline="filter !== statusOptions.value"
        @click="handleChangeFilter(statusOptions)"
        :color="
          filter === statusOptions.value
            ? statusColors[statusOptions.value as TaskStatus]
            : 'grey-5'
        "
      />
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { computed } from 'vue'
import { useTasksStore } from 'src/stores/task-store'

import { TaskStatus } from './models'

type StatusOption = { label: string; value: TaskStatus }

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
      { label: 'Pendente', value: 'pending' },
      { label: 'Em progresso', value: 'in-progress' },
      { label: 'Concluída', value: 'finished' },
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
