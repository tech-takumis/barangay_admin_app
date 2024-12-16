<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 px-4 w-full max-w-7xl mx-auto">
      <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-8 md:p-12 lg:p-20">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Certificate Requests</h1>

        <div class="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in ['All', 'Pending', 'Approved', 'Rejected']"
              :key="status"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium',
                filterStatus === status.toLowerCase()
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border'
              ]"
              @click="filterStatus = status.toLowerCase()"
            >
              {{ status }}
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <label for="pageSize" class="text-sm font-medium text-gray-700">Show:</label>
            <select
              id="pageSize"
              v-model="pageSize"
              class="border rounded-md text-sm py-1 px-2"
            >
              <option v-for="option in pageSizeOptions" :key="option" :value="option">
                {{ option }}
              </option>
            </select>
          </div>
        </div>

        <div class="mb-4">
          <input
            v-model="search"
            type="text"
            placeholder="Search..."
            class="w-full px-3 py-2 border rounded-md"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in columns"
                  :key="column.key"
                  scope="col"
                  class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  @click="sortBy(column.key)"
                >
                  {{ column.label }}
                  <span v-if="sortColumn === column.key">
                    {{ sortDirection === 'asc' ? '▲' : '▼' }}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="request in paginatedRequests" 
                :key="request.id"
                class="hover:bg-gray-50 cursor-pointer"
                @click="navigateToDetails(request.id)"
              >
                <td class="px-3 py-4 whitespace-nowrap text-sm">
                  <div class="font-medium text-gray-900">{{ request.certificate_id }}</div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm">
                  <div class="font-medium text-gray-900">{{ getCertificateName(request.certificate_id) }}</div>
                </td>
                <td class="px-3 py-4 whitespace-nowrap text-sm">
                  <span class="flex items-center justify-center">
                    <component :is="getStatusIcon(request.status)" class="w-5 h-5" :class="getStatusColor(request.status)" />
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-col sm:flex-row justify-between items-center">
          <div class="mb-4 sm:mb-0">
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ filteredRequests.length }}</span>
              results
            </p>
          </div>
          <div class="flex space-x-2">
            <button
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded-md text-sm"
              :class="currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
              @click="currentPage--"
            >
              Previous
            </button>
            <button
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded-md text-sm"
              :class="currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
              @click="currentPage++"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ClockIcon, CheckCircleIcon, XCircleIcon } from 'lucide-vue-next'
import { useUsers } from '../stores/user'

const store = useUsers()
const router = useRouter()

const certificateRequests = computed(() => store.certificateRequests)

const columns = [
  { key: 'certificate_id', label: 'Certificate ID' },
  { key: 'certificate_name', label: 'Certificate Name' },
  { key: 'status', label: 'Status' },
]

const search = ref('')
const sortColumn = ref('certificate_id')
const sortDirection = ref('asc')
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 20, 50]
const filterStatus = ref('all')

const filteredRequests = computed(() => {
  let filtered = certificateRequests.value.filter(request =>
    request.certificate_id.toString().toLowerCase().includes(search.value.toLowerCase()) ||
    request.certificate_name.toLowerCase().includes(search.value.toLowerCase()) ||
    request.status.toLowerCase().includes(search.value.toLowerCase())
  )

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(request => request.status === filterStatus.value)
  }

  return filtered
})

const sortedRequests = computed(() => {
  return [...filteredRequests.value].sort((a, b) => {
    if (a[sortColumn.value] < b[sortColumn.value]) return sortDirection.value === 'asc' ? -1 : 1
    if (a[sortColumn.value] > b[sortColumn.value]) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedRequests = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedRequests.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRequests.value.length / pageSize.value))
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value)
const endIndex = computed(() => Math.min(startIndex.value + pageSize.value, filteredRequests.value.length))

const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortDirection.value = 'asc'
  }
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return ClockIcon
    case 'approved':
      return CheckCircleIcon
    case 'rejected':
      return XCircleIcon
    default:
      return null
  }
}

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'text-yellow-500'
    case 'approved':
      return 'text-green-500'
    case 'rejected':
      return 'text-red-500'
    default:
      return 'text-gray-500'
  }
}
const getCertificateName = (certificateId) => {
  const cert = store.certificates.find(cert => cert.id === certificateId);
  return cert ? cert.name : 'Unknown Certificate';
};


const navigateToDetails = (id) => {
  router.push({ name: 'CertificateRequestDetails', params: { id: id } })
}
</script>

