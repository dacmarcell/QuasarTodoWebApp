<template>
  <q-card>
    <q-list bordered separator>
      <q-item v-for="task in tasks" :key="task.title" clickable class="q-pa-sm">
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

          <q-item-label v-if="task.categories.length > 0" caption class="q-mt-sm">
            Categorias:
            <q-chip
              v-for="category in task.categories"
              :key="category.id"
              color="info"
              label-color="white"
              class="q-ma-sm"
              size="sm"
              outline
            >
              {{ category.name }}
            </q-chip>
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
</template>
<script lang="ts">
import { formatDistanceToNow } from 'date-fns'
import { computed, onMounted } from 'vue'
import { ptBR } from 'date-fns/locale'
import { useQuasar } from 'quasar'

import { useTasksStore } from 'src/stores/task-store'
import { TaskStatus } from './models'

export default {
  name: 'TaskList',
  setup() {
    const tasksStore = useTasksStore()
    const $q = useQuasar()

    const tasks = computed(() =>
      tasksStore.filter === null ? tasksStore.tasks : tasksStore.filteredTasks,
    )

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

    const formatDate = (date?: Date) => {
      if (!date) return 'N/A'
      return formatDistanceToNow(date, { addSuffix: true, locale: ptBR })
    }

    onMounted(async () => {
      await tasksStore.getTasks($q)
    })

    return {
      tasks,
      getIcon,
      formatDate,
      getStatusColor,
      formatStatusName,
      updateTask: tasksStore.updateTask,
      deleteTask: tasksStore.deleteTask,
    }
  },
}
</script>
