<template>
  <q-page padding>
    <q-btn
      label="Adicionar Tarefa"
      color="primary"
      icon="add"
      class="q-ma-md"
      @click="isCreateTaskFormOpen = true"
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
            <q-item-label caption> Criado em: {{ formatDate(todo.created_at) }} </q-item-label>
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
                v-if="todo.status !== 'in-progress' && todo.status !== 'finished'"
                icon="start"
                color="black"
                flat
                size="sm"
                class="q-ma-xs"
                @click="updateTask(todo.id, { status: 'in-progress' })"
              />
              <q-btn
                v-if="todo.status !== 'finished' && todo.status !== 'pending'"
                icon="check_circle"
                color="green"
                flat
                size="sm"
                class="q-ma-xs"
                @click="updateTask(todo.id, { status: 'finished' })"
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
    <q-dialog v-model="isCreateTaskFormOpen" persistent>
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
            :rules="[(v) => v || 'O título é obrigatório']"
          />
          <q-input
            label="Descrição"
            dense
            v-model="newTask.description"
            autofocus
            :rules="[(v) => v || 'A descrição é obrigatória']"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="isCreateTaskFormOpen = false" />
          <q-btn flat label="Criar tarefa" @click="handleCreateTask" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { CreateTask, Task, UpdateTask } from './models'

export default {
  name: 'TodosList',
  setup() {
    const $q = useQuasar()

    const todos = ref<Task[]>([])

    const isCreateTaskFormOpen = ref(false)

    const newTask = ref<CreateTask>({
      title: '',
      description: '',
      status: 'pending',
    })

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
      return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
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
    }
  },
}
</script>

<style scoped>
.q-page {
  width: 100%;
}
</style>
