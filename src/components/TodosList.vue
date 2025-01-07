<template>
  <q-page padding>
    <q-card>
      <q-list bordered separator>
        <q-item v-for="todo in todos" :key="todo.title" clickable class="q-pa-sm">
          <q-item-section avatar>
            <q-icon :name="getIcon(todo.status)" :color="getStatusColor(todo.status)" size="md" />
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ todo.title }}</q-item-label>
            <q-item-label caption>{{ todo.description }}</q-item-label>
            <q-item-label caption> Criado em: {{ formatDate(todo.created_at) }} </q-item-label>
            <q-item-label v-if="todo.finished_at" caption>
              Concluído em: {{ formatDate(todo.finished_at) }}
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip :color="getStatusColor(todo.status)" outline class="q-ma-sm" size="sm">
              {{ todo.status }}
            </q-chip>

            <div>
              <q-btn
                icon="check_circle"
                color="green"
                flat
                size="sm"
                class="q-ma-xs"
                @click="markAsCompleted(todo.id)"
                :disabled="todo.status === 'finished'"
              />
              <q-btn
                icon="delete"
                color="red"
                flat
                size="sm"
                class="q-ma-xs"
                @click="deleteTask(todo.id)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { CreateTask, Task } from './models'

export default {
  name: 'TodosList',
  setup() {
    const $q = useQuasar()

    const todos = ref<Task[]>([])

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

    const markAsCompleted = async (id: number) => {
      const { status } = await api.put(`/tasks/${id}`, { status: 'finished' })

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
      return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
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
      markAsCompleted,
      createTask,
    }
  },
}
</script>

<style scoped>
.q-page {
  width: 100%;
}
</style>
