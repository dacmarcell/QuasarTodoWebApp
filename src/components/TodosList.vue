<template>
  <q-page padding>
    <CreateTaskButton :handleOpenDialog="handleOpenDialog" />
    <CleanAllTasksButton />
    <q-separator spaced />
    <StatusFilters />
    <!-- Chips de informação rápida -->
    <div>
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
    </div>
    <!-- Lista de tarefas -->
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
import { ref, watch } from 'vue'
import { useQuasar } from 'quasar'

import { CreateTask } from './models'
import { useTasksStore } from 'src/stores/task-store'

import CleanAllTasksButton from './CleanAllTasksButton.vue'
import CreateTaskButton from './CreateTaskButton.vue'
import StatusFilters from './StatusFilters.vue'
import TaskList from './TaskList.vue'

export default {
  name: 'TodosList',
  setup() {
    const $q = useQuasar()
    const tasksStore = useTasksStore()

    const isCreateTaskFormOpen = ref(false)
    const inProgressTasksCount = ref(0)
    const finishedTasksCount = ref(0)
    const pendingTasksCount = ref(0)
    const allTasksCount = ref(0)
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
      newTask,
      allTasksCount,
      handleOpenDialog,
      handleCreateTask,
      handleCloseDialog,
      finishedTasksCount,
      inProgressTasksCount,
      isCreateTaskFormOpen,
      pendingTasksCount,
    }
  },
  components: {
    CleanAllTasksButton,
    CreateTaskButton,
    StatusFilters,
    TaskList,
  },
}
</script>

<style scoped>
.q-page {
  width: 100%;
}
</style>
