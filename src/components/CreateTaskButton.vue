<template>
  <q-btn
    label="Adicionar Tarefa"
    color="primary"
    icon="add"
    class="q-ma-md"
    @click="handleOpenDialog"
  />
</template>

<script lang="ts">
export default {
  name: 'CreateTaskButton',
  props: {
    isCreateTaskFormOpen: Boolean,
  },
  setup(_, ctx) {
    const handleOpenDialog = () => {
      ctx.emit('update:isCreateTaskFormOpen', true)
    }
    return { handleOpenDialog }
  },
}
</script>
