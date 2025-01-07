<template>
  <div class="row items-center justify-center q-mb-md">
    <q-btn-group flat>
      <q-btn
        v-for="option in statusOptions"
        flat
        :key="option.value"
        :label="option.label"
        :outline="filter !== option.value"
        @click="filter = filter === option.value ? null : option.value"
        :color="filter === option.value ? statusColors[option.value as TaskStatus] : 'grey-5'"
      />
    </q-btn-group>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import { TaskStatus } from './models'

export default {
  name: 'StatusFilters',
  setup() {
    const filter = ref<TaskStatus | null>(null)

    const statusOptions = [
      { label: 'Pendente', value: 'pending' },
      { label: 'Em progresso', value: 'in-progress' },
      { label: 'Concluída', value: 'finished' },
    ]

    const statusColors = {
      pending: 'orange',
      'in-progress': 'blue',
      finished: 'green',
    }

    return { filter, statusOptions, statusColors }
  },
}
</script>
