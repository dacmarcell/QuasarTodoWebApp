import { defineStore, acceptHMRUpdate } from 'pinia'
import { QVueGlobals } from 'quasar'
import { api } from 'src/boot/axios'
import { Categories } from 'src/components/models'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [] as Categories[],
  }),

  actions: {
    async getTasks($q: QVueGlobals) {
      const { data, status } = await api.get('/categories')

      if (status === 200) {
        this.categories = data

        $q.notify({
          message: 'Categorias carregadas com sucesso',
          color: 'positive',
          icon: 'check_circle',
        })

        return
      }

      $q.notify({
        message: 'Oops! Algo deu errado ao carregar as categorias... Tente novamente mais tarde',
        color: 'negative',
        icon: 'error',
      })
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoriesStore, import.meta.hot))
}
