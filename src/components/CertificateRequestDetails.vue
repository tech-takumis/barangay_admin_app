<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 px-4 w-full max-w-7xl mx-auto">
      <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-8 md:p-12 lg:p-20">
        <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Certificate Request Details</h1>
        
        <div v-if="request" class="space-y-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-lg font-semibold">Certificate ID: {{ request.certificate_id }}</p>
              <p class="text-lg">Certificate Name: {{ getCertificateName(request.certificate_id) }}</p>
              <p class="text-lg">Status: 
                <span :class="getStatusColor(request.status)">
                  {{ request.status }}
                </span>
              </p>
            </div>
            <div>
              <p class="text-lg">Created: {{ formatDate(request.created_at) }}</p>
              <p class="text-lg">Updated: {{ formatDate(request.updated_at) }}</p>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Attributes</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div v-for="attr in request.attribute_values" :key="attr.id" class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium">{{ attr.attribute_name }}</p>
                <p>{{ attr.attribute_value }}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-xl font-semibold mb-4">Requirements</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="req in request.requirement_values" :key="req.id" class="bg-gray-50 p-4 rounded-lg">
                <p class="font-medium">{{ req.requirement_name }}</p>
                <a :href="req.requirement_value" target="_blank" class="text-blue-600 hover:underline">View File</a>
              </div>
            </div>
          </div>

          <div class="flex justify-between items-center">
            <button @click="goBack" class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Go Back
            </button>
            <div v-if="request.status === 'pending'" class="space-x-4">
              <button @click="openApproveModal" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                Approve
              </button>
              <button @click="rejectCertificate" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Reject
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center text-gray-600">
          Loading request details...
        </div>
      </div>
    </div>

    <!-- Approval Modal -->
    <ApprovedModal v-if="showApproveModal" @close="closeApproveModal">
      <template #header>
        <h3 class="text-lg font-medium leading-6 text-gray-900">Approve Certificate Request</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <p><strong>User:</strong> {{ getUserName(request?.user_id) }}</p>
          <p><strong>Certificate Name:</strong> {{ getCertificateName(request?.certificate_id) }}</p>
          <div>
            <label for="document_file" class="block text-sm font-medium text-gray-700">Upload Document</label>
            <input 
              type="file" 
              id="document_file" 
              ref="fileInput"
              @change="handleFileChange"
              class="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
        </div>
      </template>
      <template #footer>
        <button 
          @click="approveCertificate" 
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          :disabled="!selectedFile"
        >
          Approve
        </button>
        <button @click="closeApproveModal" class="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </template>
    </ApprovedModal>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '../stores/user'
import ApprovedModal from './ApprovedModal.vue';

const route = useRoute()
const router = useRouter()
const store = useUsers()

const request = ref(null)
const showApproveModal = ref(false)
const selectedFile = ref(null)
const fileInput = ref(null)

onMounted(async () => {
  const requestId = parseInt(route.params.id)
  request.value = computed(() => store.certificateRequests.find(req => req.id === requestId)).value
  if (!request.value) {
    request.value = store.getCertificate(requestId)
  }
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
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

const goBack = () => {
  router.push({ name: 'certificate_requests' })
}

const getCertificateName = (certificateId) => {
  const cert = store.certificates.find(cert => cert.id === certificateId);
  return cert ? cert.name : 'Unknown Certificate';
};

const getUserName = (user_id) =>{
  const user = store.users.find(u => u.id === user_id)
  return user ? user.name : 'Guest'
}

const openApproveModal = () => {
  showApproveModal.value = true
}

const closeApproveModal = () => {
  showApproveModal.value = false
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleFileChange = (event) => {
  if (event.target.files.length > 0) {
    selectedFile.value = event.target.files[0];
  } else {
    selectedFile.value = null;
  }
};


const approveCertificate = async () => {
  if (request.value && request.value.status === 'pending' && selectedFile.value) {
    const formData = new FormData()
    formData.append('document_file', selectedFile.value)
    try {
      await store.approvedCertificate(request.value.id, formData)
      closeApproveModal()
    } catch (error) {
      console.error('Error approving certificate:', error)
      // Handle error (e.g., show error message to user)
    }
  }
}

const rejectCertificate = async () => {
  if (request.value && request.value.status === 'pending') {
    try {
      await store.rejectCertificate(request.value.id)
      request.value.status = 'rejected'
    } catch (error) {
      console.error('Error rejecting certificate:', error)
      // Handle error (e.g., show error message to user)
    }
  }
}
</script>

