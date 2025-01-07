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
            <q-item-label caption> Criado em: {{ formatDate(todo.createdAt) }} </q-item-label>
            <q-item-label v-if="todo.finishedAt" caption>
              Concluído em: {{ formatDate(todo.finishedAt) }}
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
                @click="markAsCompleted(todo)"
                :disabled="todo.status === 'finished'"
              />
              <q-btn
                icon="delete"
                color="red"
                flat
                size="sm"
                class="q-ma-xs"
                @click="deleteTask(todo)"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script lang="ts">
import { ref } from 'vue'

export default {
  name: 'TodosList',
  setup() {
    const todos = ref([
      {
        title: 'Aprender Quasar',
        description: 'Estudar os conceitos básicos de Quasar Framework',
        createdAt: new Date(),
        finishedAt: null,
        status: 'in-progress',
      },
      {
        title: 'Fazer desafio técnico',
        description: 'Criar uma TODO list com Quasar e Axios',
        createdAt: new Date(),
        finishedAt: null,
        status: 'pending',
      },
      {
        title: 'Finalizar projeto pessoal',
        description: 'Publicar o sistema de controle de estoque',
        createdAt: new Date(),
        finishedAt: new Date(),
        status: 'finished',
      },
    ])

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

    const markAsCompleted = (todo: any) => {
      todo.status = 'finished'
      todo.finishedAt = new Date()
    }

    const deleteTask = (todo: any) => {
      const index = todos.value.indexOf(todo)
      if (index !== -1) {
        todos.value.splice(index, 1)
      }
    }

    return {
      todos,
      getIcon,
      formatDate,
      deleteTask,
      getStatusColor,
      markAsCompleted,
    }
  },
}
</script>

<style scoped>
.q-page {
  width: 100%;
}
</style>
