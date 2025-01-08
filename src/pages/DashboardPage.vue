<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center">
      <h1 class="text-primary">Dashboard</h1>
    </div>
    <div class="row justify-around q-gutter-lg q-mt-md">
      <q-card flat bordered class="col-12 col-md-4">
        <q-card-section>
          <div class="text-h6">Tarefas Criadas</div>
          <div class="text-primary text-subtitle1">{{ metrics.totalTasks }}</div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="col-12 col-md-4">
        <q-card-section>
          <div class="text-h6">Tarefas Concluídas</div>
          <div class="text-green text-subtitle1">{{ metrics.completedTasks }}</div>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="col-12 col-md-4">
        <q-card-section>
          <div class="text-h6">Tarefas Pendentes</div>
          <div class="text-orange text-subtitle1">{{ metrics.pendingTasks }}</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="row q-gutter q-mt-lg">
      <q-card flat bordered class="col-12 col-md-6">
        <q-card-section>
          <h3 class="text-primary">Resumo</h3>
          <ul>
            <li>Tarefas Criadas: {{ metrics.totalTasks }}</li>
            <li>Tarefas Concluídas: {{ metrics.completedTasks }}</li>
            <li>Tarefas Pendentes: {{ metrics.pendingTasks }}</li>
          </ul>
        </q-card-section>
      </q-card>
      <q-card flat bordered class="col-12 col-md-6">
        <q-card-section>
          <h3 class="text-primary">Lista de categorias</h3>
          <ul>
            <li v-for="category in categories" :key="category.id">{{ category.name }}</li>
          </ul>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useQuasar } from 'quasar'
import { useCategoriesStore } from 'src/stores/category-store'
import { ref, defineComponent, computed, onMounted } from 'vue'

export default defineComponent({
  name: 'DashboardPage',
  setup() {
    const categoriesStore = useCategoriesStore()
    const $q = useQuasar()

    const categories = computed(() => categoriesStore.categories)

    const metrics = ref({
      totalTasks: 3,
      completedTasks: 1,
      pendingTasks: 1,
      inProgressTasks: 1,
    })

    onMounted(async () => {
      await categoriesStore.getTasks($q)
    })

    return { categories, metrics }
  },
})
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
}
</style>
