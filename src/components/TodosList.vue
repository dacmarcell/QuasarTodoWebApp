<template>
  <q-page padding>
    <q-btn
      label="Adicionar Tarefa"
      color="primary"
      icon="add"
      class="q-ma-md"
      @click="isCreateTaskFormOpen = true"
    />
    <!-- Apagar todas as tarefas finalizadas -->
    <CleanAllTasksButton />
    <!-- Filtragem por status -->
    <div>
      <q-separator spaced />
      <StatusFilters />
    </div>
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
    <q-btn
      v-if="doesHaveFinishedTasks"
      label="Limpar finalizadas"
      color="secondary"
      icon="cleaning_services"
      class="q-ma-md"
      @click="deleteAllFinishedTasks"
    />
    <q-card>
      <q-list bordered separator>
        <q-item v-for="todo in todos" :key="todo.title" clickable class="q-pa-sm">
          <q-item-section avatar>
            <q-icon :name="getIcon(todo.status)" :color="getStatusColor(todo.status)" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ todo.title }}</q-item-label>
            <q-item-label caption>{{ todo.description }}</q-item-label>
            <q-item-label caption> Criado {{ formatDate(todo.created_at) }} </q-item-label>
            <q-item-label v-if="todo.finished_at" caption>
              Concluído em: {{ formatDate(todo.finished_at) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip :color="getStatusColor(todo.status)" outline class="q-ma-sm" size="sm">
              {{ formatStatusName(todo.status) }}
            </q-chip>

            <div>
              <q-btn
                flat
                size="sm"
                icon="start"
                color="black"
                class="q-ma-xs"
                @click="updateTask(todo.id, { status: 'in-progress' })"
                v-if="todo.status !== 'in-progress' && todo.status !== 'finished'"
                ><q-tooltip>Iniciar tarefa</q-tooltip></q-btn
              >
              <q-btn
                v-if="todo.status !== 'finished' && todo.status !== 'pending'"
                icon="check_circle"
                color="green"
                flat
                size="sm"
                class="q-ma-xs"
                @click="updateTask(todo.id, { status: 'finished' })"
                ><q-tooltip>Completar tarefa</q-tooltip></q-btn
              >
              <q-btn
                icon="delete"
                color="red"
                flat
                size="sm"
                class="q-ma-xs"
                @click="deleteTask(todo.id)"
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
import { onMounted, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

import { api } from 'src/boot/axios'
import { CreateTask, Task, UpdateTask } from './models'

export default {
  name: 'TodosList',
  setup() {
    const $q = useQuasar()

    const todos = ref<Task[]>([])

    const isCreateTaskFormOpen = ref(false)
    const doesHaveFinishedTasks = ref(false)
    const inProgressTasksCount = ref(0)
    const allTasksCount = ref(0)

    const newTask = ref<CreateTask>({
      title: '',
      description: '',
      status: 'pending',
    })

    watch(
      todos,
      () => {
        inProgressTasksCount.value = todos.value.filter(
          (todo) => todo.status === 'in-progress',
        ).length

        allTasksCount.value = todos.value.length

        doesHaveFinishedTasks.value = todos.value.some((todo) => todo.status === 'finished')
      },
      { immediate: true },
    )

    const deleteAllFinishedTasks = () => {
      const finishedTasks = todos.value.filter((todo) => todo.status === 'finished')

      finishedTasks.forEach(async (task) => {
        await deleteTask(task.id)
      })
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
      isCreateTaskFormOpen.value = false

      if (newTask.value.title === '' || newTask.value.description === '') {
        $q.notify({
          message: 'Oops! O título e a descrição são obrigatórios',
          color: 'negative',
          icon: 'error',
        })
        return
      }

      await createTask(newTask.value)
      $q.notify({
        message: 'Tarefa criada com sucesso',
        color: 'positive',
        icon: 'check_circle',
      })

      newTask.value = {
        title: '',
        description: '',
        status: 'pending',
      }
    }

    const getTasks = async () => {
      const { data, status } = await api.get('/tasks')

      if (status === 200) {
        todos.value = data
        return
      }

      $q.notify({
        message: 'Oops! Algo deu errado ao buscar tarefas... Tente novamente mais tarde',
        color: 'negative',
        icon: 'error',
      })
    }

    const createTask = async (newTask: CreateTask) => {
      const { status } = await api.post('/tasks', newTask)

      if (status === 201) {
        await getTasks()

        $q.notify({
          message: 'Tarefa criada com sucesso',
          color: 'positive',
          icon: 'check_circle',
        })
        return
      }

      $q.notify({
        message: 'Oops! Algo deu errado ao criar a tarefa... Tente novamente mais tarde',
        color: 'negative',
        icon: 'error',
      })
    }

    const updateTask = async (id: number, data: UpdateTask) => {
      const { status } = await api.put(`/tasks/${id}`, data)

      if (status === 200) {
        await getTasks()

        $q.notify({
          message: 'Tarefa concluída com sucesso',
          color: 'positive',
          icon: 'check_circle',
        })

        return
      }

      $q.notify({
        message: 'Oops! Algo deu errado ao concluir a tarefa... Tente novamente mais tarde',
        color: 'negative',
        icon: 'error',
      })
    }

    const deleteTask = async (id: number) => {
      const { status } = await api.delete(`/tasks/${id}`)

      if (status === 204) {
        await getTasks()

        $q.notify({
          message: 'Tarefa apagada com sucesso',
          color: 'negative',
          icon: 'delete',
        })

        return
      }

      $q.notify({
        message: 'Oops! Algo deu errado ao deletar a tarefa... Tente novamente mais tarde',
        color: 'negative',
        icon: 'error',
      })
    }

    const formatDate = (date?: Date) => {
      if (!date) return 'N/A'
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    }

    const formatStatusName = (status: string) => {
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

    const getStatusColor = (status: string) => {
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

    const getIcon = (status: string) => {
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

    onMounted(getTasks)

    return {
      todos,
      getIcon,
      formatDate,
      deleteTask,
      getStatusColor,
      updateTask,
      createTask,
      isCreateTaskFormOpen,
      handleCreateTask,
      newTask,
      formatStatusName,
      handleCloseDialog,
      doesHaveFinishedTasks,
      deleteAllFinishedTasks,
      inProgressTasksCount,
      allTasksCount,
    }
  },
}
</script>

<style scoped>
.q-page {
  width: 100%;
}
</style>
