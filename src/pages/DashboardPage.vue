<template>
  <q-page class="q-pa-lg">
    <div class="row justify-between items-center">
      <h1 class="text-primary">Dashboard</h1>
      <q-btn icon="refresh" label="Atualizar" color="primary" flat @click="fetchData" />
    </div>

    <!-- Cards de Métricas -->
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

    <!-- Gráficos e Resumo -->
    <div class="row q-gutter-lg q-mt-lg">
      <q-card flat bordered class="col-12 col-md-7">
        <q-card-section>
          <h3 class="text-primary">Gráfico de Tarefas</h3>
          <BarChart :chart-data="chartData" :chart-options="chartOptions" />
        </q-card-section>
      </q-card>
      <q-card flat bordered class="col-12 col-md-5">
        <q-card-section>
          <h3 class="text-primary">Resumo</h3>
          <ul>
            <li>Tarefas Criadas: {{ metrics.totalTasks }}</li>
            <li>Tarefas Concluídas: {{ metrics.completedTasks }}</li>
            <li>Tarefas Pendentes: {{ metrics.pendingTasks }}</li>
          </ul>
        </q-card-section>
      </q-card>
    </div>

    <!-- Tabela de Tarefas -->
    <div class="row q-mt-lg">
      <q-card flat bordered class="col-12">
        <q-card-section>
          <h3 class="text-primary">Lista de Tarefas</h3>
          <q-table
            :rows="tasks"
            :columns="columns"
            row-key="id"
            flat
            bordered
            :pagination="pagination"
            hide-bottom
          >
            <template v-slot:body-cell-status="props">
              <q-chip :color="getStatusColor(props.row.status)" outline size="sm">
                {{ formatStatusName(props.row.status) }}
              </q-chip>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script lang="ts">
import { ref, defineComponent, onMounted } from 'vue'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { defineChartComponent } from 'vue-chart-3'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const BarChart = defineChartComponent('bar_chart', 'bar')

export default defineComponent({
  name: 'DashboardPage',
  components: { BarChart },
  setup() {
    const tasks = ref([
      { id: 1, title: 'Tarefa 1', status: 'completed' },
      { id: 2, title: 'Tarefa 2', status: 'pending' },
      { id: 3, title: 'Tarefa 3', status: 'in-progress' },
    ])
    const metrics = ref({
      totalTasks: 3,
      completedTasks: 1,
      pendingTasks: 1,
      inProgressTasks: 1,
    })
    const chartData = ref({
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril'],
      datasets: [
        {
          label: 'Tarefas Criadas',
          data: [12, 19, 3, 5],
          backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#EF5350'],
        },
      ],
    })
    const chartOptions = ref({
      responsive: true,
      maintainAspectRatio: false,
    })
    const columns = ref([
      { name: 'id', required: true, label: 'ID', field: 'id' },
      { name: 'title', label: 'Título', field: 'title' },
      { name: 'status', label: 'Status', field: 'status' },
    ])
    const pagination = ref({ rowsPerPage: 10 })

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'pending':
          return 'orange'
        case 'in-progress':
          return 'blue'
        case 'completed':
          return 'green'
        default:
          return 'grey'
      }
    }

    const formatStatusName = (status: string) => {
      switch (status) {
        case 'pending':
          return 'Pendente'
        case 'in-progress':
          return 'Em Progresso'
        case 'completed':
          return 'Concluída'
        default:
          return 'Desconhecido'
      }
    }

    const fetchData = () => {
      console.log('Fetching data...')
    }

    onMounted(() => {
      console.log('Dashboard loaded.')
    })

    return {
      tasks,
      metrics,
      chartData,
      chartOptions,
      columns,
      pagination,
      getStatusColor,
      formatStatusName,
      fetchData,
    }
  },
})
</script>

<style scoped>
.q-page {
  background-color: #f5f5f5;
}
</style>
