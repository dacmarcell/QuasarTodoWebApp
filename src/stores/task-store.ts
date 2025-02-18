import { defineStore, acceptHMRUpdate } from 'pinia'
import { QVueGlobals } from 'quasar'
import { api } from 'src/boot/axios'
import { CreateTask, Task, TaskStatus, UpdateTask } from 'src/components/models'

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    filter: null as TaskStatus | null,
  }),

  getters: {
    allTasks(state) {
      return state.tasks
    },

    filteredTasks(state) {
      return state.filter ? state.tasks.filter((task) => task.status === state.filter) : state.tasks
    },

    totalTasksCount(state) {
      return state.tasks.length
    },

    inProgressTasksCount(state) {
      return state.tasks.filter((task) => task.status === 'in-progress').length
    },

    totalFinishedTasksCount(state) {
      return state.tasks.filter((task) => task.status === 'finished').length
    },

    totalPendingTasksCount(state) {
      return state.tasks.filter((task) => task.status === 'pending').length
    },
  },

  actions: {
    setFilter(status: TaskStatus | null) {
      this.filter = status
    },

    async deleteAllFinishedTasks($q: QVueGlobals) {
      const finishedTasks = this.tasks.filter((todo) => todo.status === 'finished')

      finishedTasks.forEach(async (task) => {
        await this.deleteTask(task.id, $q)
      })
    },

    async getTasks($q: QVueGlobals) {
      const { data, status } = await api.get('/tasks')

      if (status === 200) {
        this.tasks = data
        this.filter = null

        $q.notify({
          message: 'Tarefas carregadas com sucesso',
          color: 'positive',
          icon: 'check_circle',
        })

        return
      }

      $q.notify({
        message: 'Oops! Algo deu errado ao carregar as tarefas... Tente novamente mais tarde',
        color: 'negative',
        icon: 'error',
      })
    },

    async createTask(newTask: CreateTask, $q: QVueGlobals) {
      const { status } = await api.post('/tasks', newTask)

      if (status === 201) {
        await this.getTasks($q)

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
    },

    async updateTask(id: number, data: UpdateTask, $q: QVueGlobals) {
      const { status } = await api.put(`/tasks/${id}`, data)

      if (status === 200) {
        await this.getTasks($q)

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
    },

    async deleteTask(id: number, $q: QVueGlobals) {
      const { status } = await api.delete(`/tasks/${id}`)

      if (status === 204) {
        await this.getTasks($q)

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
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTasksStore, import.meta.hot))
}
