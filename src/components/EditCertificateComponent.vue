<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 px-4 w-full max-w-4xl mx-auto">
      <div class="relative bg-white shadow-lg sm:rounded-3xl sm:p-8">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-6 text-center">Edit Certificate</h1>
        
        <form @submit.prevent="saveCertificate" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
              <input 
                id="name" 
                v-model="certificate.name" 
                required
                type="text" 
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
            
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select 
                id="status" 
                v-model="certificate.status"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="available">Available</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label for="validity" class="block text-sm font-medium text-gray-700">Validity</label>
              <input 
                type="text" 
                id="validity" 
                v-model="certificate.validity"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>

            <div>
              <label for="template" class="block text-sm font-medium text-gray-700">Template</label>
              <input 
                type="text" 
                id="template" 
                v-model="certificate.template"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              />
            </div>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
            <textarea 
              id="description" 
              v-model="certificate.description" 
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          <!-- Attributes Section -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-2">Attributes</h2>
            <div v-for="(attr, index) in certificate.attributes" :key="attr.id" class="flex items-center space-x-2 mb-2">
              <input 
                v-model="attr.placeholder" 
                type="text" 
                class="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Attribute name"
              />
              <select 
                v-model="attr.data_type"
                class="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
              </select>
              <input 
                v-model="attr.is_required" 
                type="checkbox" 
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              />
              <label class="text-sm text-gray-600">Required</label>
              <button @click="removeAttribute(index)" type="button" class="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
            <button @click="addAttribute" type="button" class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Attribute
            </button>
          </div>

          <!-- Requirements Section -->
          <div>
            <h2 class="text-lg font-medium text-gray-900 mb-2">Requirements</h2>
            <div v-for="(req, index) in certificate.requirements" :key="req.id" class="flex items-center space-x-2 mb-2">
              <input 
                v-model="req.name" 
                type="text" 
                class="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Requirement name"
              />
              <input 
                v-model="req.description" 
                type="text" 
                class="flex-grow border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                placeholder="Description"
              />
              <select 
                v-model="req.datatype"
                class="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
              <input 
                v-model="req.is_required" 
                type="checkbox" 
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" 
              />
              <label class="text-sm text-gray-600">Required</label>
              <button @click="removeRequirement(index)" type="button" class="text-red-600 hover:text-red-800">
                Remove
              </button>
            </div>
            <button @click="addRequirement" type="button" class="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Add Requirement
            </button>
          </div>
          
          <div class="flex justify-end space-x-3">
            <button 
              type="button" 
              @click="goBack"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUsers } from '../stores/user'

const route = useRoute()
const router = useRouter()
const store = useUsers()

const certificate = ref({
  id: '',
  name: '',
  description: '',
  status: 'available',
  validity: '',
  template: '',
  attributes: [],
  requirements: []
})

onMounted(async () => {
  const certId = route.params.id
  const fetchedCertificate = await store.getCertificate(certId)
  if (fetchedCertificate) {
    certificate.value = { ...fetchedCertificate }
  }
})

const addAttribute = () => {
  certificate.value.attributes.push({
    id: Date.now(), // Temporary ID
    placeholder: '',
    data_type: 'text',
    is_required: false
  })
}

const removeAttribute = (index) => {
  certificate.value.attributes.splice(index, 1)
}

const addRequirement = () => {
  certificate.value.requirements.push({
    id: Date.now(), // Temporary ID
    name: '',
    description: '',
    datatype: 'text',
    is_required: false
  })
}

const removeRequirement = (index) => {
  certificate.value.requirements.splice(index, 1)
}

const saveCertificate = async () => {
  try {
    await store.updateCertificate(certificate.value);
    router.push('/certificates'); // Redirect or handle success feedback
  } catch (error) {
    console.error('Failed to update certificate:', error);
    // Optionally display an error notification
  }
};


const goBack = () => {
  router.push('/certificates')
}
</script>

