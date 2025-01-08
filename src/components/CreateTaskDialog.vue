<!-- eslint-disable vue/no-mutating-props -->
<template>
  <q-dialog
    :model-value="isCreateTaskFormOpen"
    @update:model-value="handleUpdateDialogState"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Criar uma tarefa</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input
          label="Título"
          dense
          v-model="newTask.title"
          autofocus
          :rules="[(value) => Boolean(value) || 'O título é obrigatório']"
        />
        <q-input
          label="Descrição"
          dense
          v-model="newTask.description"
          autofocus
          :rules="[(value) => Boolean(value) || 'A descrição é obrigatória']"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancelar" @click="handleUpdateDialogState(false)" />
        <q-btn flat label="Criar tarefa" @click="handleCreateTask" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { useQuasar } from 'quasar'
import { useTasksStore } from 'src/stores/task-store'
import { CreateTask } from './models'
import { ref } from 'vue'

export default {
  name: 'CreateTaskDialog',
  props: {
    isCreateTaskFormOpen: Boolean,
  },

  setup(_, ctx) {
    const $q = useQuasar()
    const tasksStore = useTasksStore()

    const newTask = ref<CreateTask>({
      title: '',
      description: '',
      status: 'pending',
    })

    const handleCreateTask = async () => {
      if (newTask.value.title === '' || newTask.value.description === '') {
        $q.notify({
          message: 'Oops! O título e a descrição são obrigatórios',
          color: 'negative',
          icon: 'error',
        })
        return
      }

      await tasksStore.createTask(newTask.value, $q)
      ctx.emit('update:isCreateTaskFormOpen', false)

      newTask.value = {
        title: '',
        description: '',
        status: 'pending',
      }
    }

    const handleUpdateDialogState = (value: boolean) => {
      ctx.emit('update:isCreateTaskFormOpen', value)

      if (value === false) {
        newTask.value = {
          title: '',
          description: '',
          status: 'pending',
        }
      }
    }

    return { handleCreateTask, newTask, handleUpdateDialogState }
  },
}
</script>
