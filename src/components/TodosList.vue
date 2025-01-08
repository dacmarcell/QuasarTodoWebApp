<template>
  <q-page padding>
    <CreateTaskButton :handleOpenDialog="handleOpenDialog" />
    <CleanAllTasksButton />
    <q-separator spaced />
    <StatusFilters />
    <TaskChips />
    <TaskList />
    <q-dialog v-model="isCreateTaskFormOpen">
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
          <q-btn flat label="Cancelar" @click="handleCloseDialog" />
          <q-btn flat label="Criar tarefa" @click="handleCreateTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

import { CreateTask } from './models'
import { useTasksStore } from 'src/stores/task-store'

import CleanAllTasksButton from './CleanAllTasksButton.vue'
import CreateTaskButton from './CreateTaskButton.vue'
import StatusFilters from './StatusFilters.vue'
import TaskList from './TaskList.vue'
import TaskChips from './TaskChips.vue'

export default {
  name: 'TodosList',
  setup() {
    const $q = useQuasar()
    const tasksStore = useTasksStore()

    const isCreateTaskFormOpen = ref(false)
    const newTask = ref<CreateTask>({
      title: '',
      description: '',
      status: 'pending',
    })

    const handleOpenDialog = () => {
      isCreateTaskFormOpen.value = true
    }

    const handleCloseDialog = () => {
      isCreateTaskFormOpen.value = false

      newTask.value = {
        title: '',
        description: '',
        status: 'pending',
      }
    }

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

      isCreateTaskFormOpen.value = false
      newTask.value = {
        title: '',
        description: '',
        status: 'pending',
      }
    }

    return {
      newTask,
      handleOpenDialog,
      handleCreateTask,
      handleCloseDialog,
      isCreateTaskFormOpen,
    }
  },
  components: {
    CleanAllTasksButton,
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
