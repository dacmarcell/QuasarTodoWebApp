<template>
  <q-btn
    label="Adicionar Tarefa"
    color="primary"
    icon="add"
    class="q-ma-md"
    @click="handleOpenDialog()"
  />
</template>

<script lang="ts">
export default {
  name: 'CreateTaskButton',
  props: {
    handleOpenDialog: {
      type: Function,
      required: true,
    },
  },
}
</script>
