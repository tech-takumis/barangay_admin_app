<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 px-4 w-full max-w-7xl mx-auto">
      <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-8">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-6 text-center">Certificates</h1>
        
        <!-- Search and Filter Controls -->
        <div class="mb-4 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search certificates..."
            class="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
          <div class="flex space-x-2">
            <button
              v-for="status in ['All', 'Available', 'Inactive']"
              :key="status"
              :class="[
                'px-3 py-2 rounded-md text-sm font-medium',
                filterStatus === status.toLowerCase()
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                ]"
                @click="filterStatus = status.toLowerCase()"
            >
              {{ status }}
            </button>
          </div>
        </div>

        <!-- Certificates List -->
        <div class="space-y-4">
          <div v-for="cert in paginatedCertificates" :key="cert.id" class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6 flex">
              <!-- Image Column -->
              <div class="w-1/4 pr-4">
                <img :src="cert.template" :alt="cert.name" class="w-full h-auto object-cover rounded">
              </div>
              
              <!-- Info Column -->
              <div class="w-1/2 px-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">{{ cert.name }}</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500">{{ cert.description }}</p>
                <div class="mt-2 space-y-1">
                  <p class="text-sm text-gray-500">
                    <span class="font-medium">Status:</span>
                    <span :class="cert.status === 'available' ? 'text-green-600' : 'text-red-600'">
                      {{ cert.status }}
                    </span>
                  </p>
                  <p class="text-sm text-gray-500"><span class="font-medium">Validity:</span> {{ cert.validity }}</p>
                  <p class="text-sm text-gray-500"><span class="font-medium">Created:</span> {{ formatDate(cert.created_at) }}</p>
                  <p class="text-sm text-gray-500"><span class="font-medium">Attributes:</span> {{ cert.attributes.length }}</p>
                  <p class="text-sm text-gray-500"><span class="font-medium">Requirements:</span> {{ cert.requirements.length }}</p>
                </div>
              </div>
              
              <!-- Actions Column -->
              <div class="w-1/4 pl-4 flex flex-col justify-center items-end space-y-2">
                <button 
                class="w-full sm:w-24 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                @click="editCertificate(cert)" 
                >
                  UPDATE
                </button>
                <!-- <button 
                class="w-full sm:w-24 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                @click="updateCertificate(cert)" 
                >
                  Update
                </button> -->
                <button 
                class="w-full sm:w-24 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                @click="deleteCertificate(cert)"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between items-center">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ startIndex + 1 }}</span>
              to
              <span class="font-medium">{{ endIndex }}</span>
              of
              <span class="font-medium">{{ filteredCertificates.length }}</span>
              results
            </p>
          </div>
          <div class="flex space-x-2">
            <button
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            @click="currentPage--"
            >
              Previous
            </button>
            <button
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
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
import { useUsers } from '../stores/user'
import router from '../router';

const store = useUsers()

const certificates = computed(() => store.certificates)

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)
const filterStatus = ref('all')

const filteredCertificates = computed(() => {
  return certificates.value.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          cert.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = filterStatus.value === 'all' || cert.status === filterStatus.value
    return matchesSearch && matchesStatus
  })
})

const sortedCertificates = computed(() => {
  return [...filteredCertificates.value].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at)
  })
})

const paginatedCertificates = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return sortedCertificates.value.slice(startIndex, endIndex)
})

const totalPages = computed(() => Math.ceil(filteredCertificates.value.length / itemsPerPage.value))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredCertificates.value.length))

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const editCertificate = (cert) => {
  router.push(`/edit-certificate/${cert?.id}`)
 
}

const updateCertificate = (cert) => {
  // Implement update functionality
  console.log('Update certificate:', cert.id)
}

const deleteCertificate = (cert) => {
  // Implement delete functionality
  console.log('Delete certificate:', cert.id)
  store.deleteCertificate(cert?.id)
}
</script>