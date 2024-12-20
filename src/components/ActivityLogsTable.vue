<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-6">Activity Logs</h1>

    <RefreshMaterializedView />

    <!-- Search and Filters -->
    <div class="mb-6 space-y-4">
      <!-- Search Bar -->
      <div>
        <input
          v-model="search"
          type="text"
          placeholder="Search activities..."
          class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          @input="applyFilters"
        />
      </div>

      <!-- Filter Button -->
      <div class="flex justify-between items-center">
        <button
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        @click="toggleFilters"
        >
          {{ showFilters ? 'Hide Filters' : 'Show Filters' }}
        </button>
        <span class="text-sm text-gray-600">
          Showing {{ filteredColumns.length }} of {{ allColumns.length }} columns
        </span>
      </div>

      <!-- Filters -->
      <div v-if="showFilters" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label for="created_at" class="block text-sm font-medium text-gray-700">Created At</label>
          <input
            id="created_at"
            v-model="filters.created_at"
            type="date"
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          />
        </div>
        <div>
          <label for="table" class="block text-sm font-medium text-gray-700">Table</label>
          <select
            id="table"
            v-model="filters.table"
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option v-for="table in uniqueTables" :key="table" :value="table">{{ table }}</option>
          </select>
        </div>
        <div>
          <label for="column" class="block text-sm font-medium text-gray-700">Column</label>
          <select
            id="column"
            v-model="filters.column"
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option v-for="column in uniqueColumns" :key="column" :value="column">{{ column }}</option>
          </select>
        </div>
        <div>
          <label for="user_type" class="block text-sm font-medium text-gray-700">User Type</label>
          <select
            id="user_type"
            v-model="filters.user_type"
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option v-for="type in uniqueUserTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </div>
        <div>
          <label for="action_performed" class="block text-sm font-medium text-gray-700">Action Performed</label>
          <select
            id="action_performed"
            v-model="filters.action_performed"
            class="mt-1 block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="applyFilters"
          >
            <option value="">All</option>
            <option v-for="action in uniqueActions" :key="action" :value="action">{{ action }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Activity Logs Table -->
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full table-auto">
        <thead class="bg-gray-200">
          <tr>
            <th v-for="column in filteredColumns" :key="column" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="log in paginatedLogs" :key="log.id" class="hover:bg-gray-100">
            <td v-for="column in filteredColumns" :key="column" class="px-4 py-2 whitespace-nowrap">
              {{ column === 'created_at' ? log[column] : log[column] }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <div>
        <span class="text-sm text-gray-700">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredLogs.length }} entries
        </span>
      </div>
      <div class="flex space-x-2">
        <button
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
        @click="prevPage"
        >
          Previous
        </button>
        <button
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
        @click="nextPage"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsers } from '../stores/user';
import RefreshMaterializedView from './RefreshMaterializedView.vue';

const store = useUsers()


const activityLogs = computed(()=> {
  return store.activityLogs
})
const search = ref('')
const filters = ref({
  created_at: '',
  table: '',
  column: '',
  user_type: '',
  action_performed: ''
})

const currentPage = ref(1)
const itemsPerPage = 10
const showFilters = ref(false)

const allColumns = ['created_at', 'table', 'column', 'user_type', 'action_performed', 'description']
const filteredColumns = computed(() => 
  showFilters.value ? ['created_at', 'table', 'column', 'user_type', 'action_performed'] : allColumns
)


const uniqueTables = computed(() => [...new Set(activityLogs.value.map(log => log.table))])
const uniqueColumns = computed(() => [...new Set(activityLogs.value.map(log => log.column))])
const uniqueUserTypes = computed(() => [...new Set(activityLogs.value.map(log => log.user_type))])
const uniqueActions = computed(() => [...new Set(activityLogs.value.map(log => log.action_performed))])

const filteredLogs = computed(() => {
  return activityLogs.value.filter(log => {
    const searchMatch = search.value === '' || 
      Object.values(log).some(value => 
        String(value).toLowerCase().includes(search.value.toLowerCase())
      )
    
    const filterMatch = 
      (filters.value.created_at === '' || log.created_at.startsWith(filters.value.created_at)) &&
      (filters.value.table === '' || log.table === filters.value.table) &&
      (filters.value.column === '' || log.column === filters.value.column) &&
      (filters.value.user_type === '' || log.user_type === filters.value.user_type) &&
      (filters.value.action_performed === '' || log.action_performed === filters.value.action_performed)
    
    return searchMatch && filterMatch
  })
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / itemsPerPage))

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, filteredLogs.value.length))

const paginatedLogs = computed(() => {
  return filteredLogs.value.slice(startIndex.value, endIndex.value)
})

const applyFilters = () => {
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

const toggleFilters = () => {
  showFilters.value = !showFilters.value
}

onMounted(()=>{
  store.getActivityLogs()
})
</script>