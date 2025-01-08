<template>
  <q-page padding>
    <CreateTaskButton :handleOpenDialog="handleOpenDialog" />
    <CleanAllTasksButton />
    <q-separator spaced />
    <StatusFilters />
    <!-- Chips de informação rápida -->
    <div>
      <q-chip v-if="inProgressTasksCount > 0" color="blue" outline class="q-ma-sm" size="sm">
        {{ inProgressTasksCount }} {{ inProgressTasksCount === 1 ? 'tarefa' : 'tarefas' }} em
        progresso
      </q-chip>
      <q-chip v-if="allTasksCount > 0" color="green" outline class="q-ma-sm" size="sm">
        {{ allTasksCount }} {{ allTasksCount === 1 ? 'tarefa' : 'tarefas' }} no total
      </q-chip>
    </div>
    <!-- Lista de tarefas -->
    <q-card>
      <q-list bordered separator>
        <q-item v-for="task in tasksToDisplay" :key="task.title" clickable class="q-pa-sm">
          <q-item-section avatar>
            <q-icon :name="getIcon(task.status)" :color="getStatusColor(task.status)" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ task.title }}</q-item-label>
            <q-item-label caption>{{ task.description }}</q-item-label>
            <q-item-label caption> Criado {{ formatDate(task.created_at) }} </q-item-label>
            <q-item-label v-if="task.finished_at" caption>
              Concluído em: {{ formatDate(task.finished_at) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip :color="getStatusColor(task.status)" outline class="q-ma-sm" size="sm">
              {{ formatStatusName(task.status) }}
            </q-chip>

            <div>
              <q-btn
                flat
                size="sm"
                icon="start"
                color="black"
                class="q-ma-xs"
                @click="updateTask(task.id, { status: 'in-progress' }, $q)"
                v-if="task.status !== 'in-progress' && task.status !== 'finished'"
                ><q-tooltip>Iniciar tarefa</q-tooltip></q-btn
              >
              <q-btn
                v-if="task.status !== 'finished' && task.status !== 'pending'"
                icon="check_circle"
                color="green"
                flat
                size="sm"
                class="q-ma-xs"
                @click="updateTask(task.id, { status: 'finished' }, $q)"
                ><q-tooltip>Completar tarefa</q-tooltip></q-btn
              >
              <q-btn
                icon="delete"
                color="red"
                flat
                size="sm"
                class="q-ma-xs"
                @click="deleteTask(task.id, $q)"
                ><q-tooltip>Deletar tarefa</q-tooltip></q-btn
              >
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
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
import { computed, onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { CreateTask, Task, TaskStatus } from './models'
import StatusFilters from 'components/StatusFilters.vue'
import { useTasksStore } from 'src/stores/task-store'
import CleanAllTasksButton from './CleanAllTasksButton.vue'
import CreateTaskButton from './CreateTaskButton.vue'

export default {
  name: 'TodosList',
  setup() {
    const $q = useQuasar()
    const tasksStore = useTasksStore()

    const tasks = ref<Task[]>([])

    const isCreateTaskFormOpen = ref(false)
    const inProgressTasksCount = ref(0)
    const allTasksCount = ref(0)
    const newTask = ref<CreateTask>({
      title: '',
      description: '',
      status: 'pending',
    })

    const tasksToDisplay = computed(() =>
      tasksStore.filter === null ? tasksStore.tasks : tasksStore.filteredTasks,
    )

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

    const formatDate = (date?: Date) => {
      if (!date) return 'N/A'
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    }

    const formatStatusName = (status: TaskStatus) => {
      switch (status) {
        case 'pending':
          return 'Pendente'
        case 'in-progress':
          return 'Em progresso'
        case 'finished':
          return 'Concluída'
        default:
          return 'Desconhecido'
      }
    }

    const getStatusColor = (status: TaskStatus) => {
      switch (status) {
        case 'pending':
          return 'orange'
        case 'in-progress':
          return 'blue'
        case 'finished':
          return 'green'
        default:
          return 'grey'
      }
    }

    const getIcon = (status: TaskStatus) => {
      switch (status) {
        case 'pending':
          return 'hourglass_empty'
        case 'in-progress':
          return 'loop'
        case 'finished':
          return 'check_circle'
        default:
          return 'help'
      }
    }

    watch(
      () => tasksStore.tasks,
      async () => {
        inProgressTasksCount.value = tasksStore.tasks.filter(
          (task) => task.status === 'in-progress',
        ).length

        allTasksCount.value = tasksStore.tasks.length

        tasks.value = tasksStore.tasks
      },
      { immediate: true },
    )

    onMounted(async () => {
      await tasksStore.getTasks($q)
    })

    return {
      tasksToDisplay,
      filteredTasks: tasksStore.filteredTasks,
      deleteTask: tasksStore.deleteTask,
      updateTask: tasksStore.updateTask,
      createTask: tasksStore.createTask,
      getIcon,
      newTask,
      formatDate,
      allTasksCount,
      getStatusColor,
      handleCreateTask,
      formatStatusName,
      handleCloseDialog,
      inProgressTasksCount,
      isCreateTaskFormOpen,
      handleOpenDialog,
    }
  },
  components: {
    StatusFilters,
    CleanAllTasksButton,
    CreateTaskButton,
  },
}
</script>

<style scoped>
.q-page {
  width: 100%;
}
</style>
