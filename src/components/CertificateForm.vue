<template>
  <div class="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
    <div class="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      <div class="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
        <div class="max-w-md mx-auto">
          <h1 class="text-3xl font-bold mb-6 text-center text-gray-900">Certificate Form</h1>
          <form 
          class="space-y-6"
          @submit.prevent="submitForm" >
            <!-- Basic Certificate Information -->
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  id="name"
                  v-model="form.name"
                  
                  type="text"
                  required
                  maxlength="255"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  v-model="form.description"
                  required
                  rows="3"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  v-model="form.status"
                  required
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="available">Available</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label for="validity" class="block text-sm font-medium text-gray-700">Validity</label>
                <input
                  id="validity"
                  v-model="form.validity"
                  type="text"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label for="file_path" class="block text-sm font-medium text-gray-700">Upload the template</label>
                <input
                  id="file_path"
                  type="file"
                  required
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  @change="handleFileInput"
                />
              </div>
            </div>

            <!-- Certificate Attributes and Requirements -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Certificate Attributes -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <button 
                  type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click.prevent="openAttributeModal" >
                    Add Attribute
                  </button>
                </div>
                <ul class="divide-y divide-gray-200">
                  <li v-for="(attribute, index) in form.attributes" :key="index" class="py-4 flex justify-between items-center">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ attribute.placeholder }}</p>
                      <p class="text-sm text-gray-500">Type: {{ attribute.data_type }}, Required: {{ attribute.is_required ? 'Yes' : 'No' }}</p>
                    </div>
                    <button 
                    type="button" class="text-red-600 hover:text-red-800"
                    @click.prevent="removeAttribute(index)" >
                      Remove
                    </button>
                  </li>
                </ul>
              </div>

              <!-- Certificate Requirements -->
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <button 
                  type="button" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click.prevent="openRequirementModal" >
                    Add Requirement
                  </button>
                </div>
                <ul class="divide-y divide-gray-200">
                  <li v-for="(requirement, index) in form.requirements" :key="index" class="py-4 flex justify-between items-center">
                    <div>
                      <p class="text-sm font-medium text-gray-900">{{ requirement.name }}</p>
                      <p class="text-sm text-gray-500">{{ requirement.description }}</p>
                      <p class="text-sm text-gray-500">Type: {{ requirement.datatype }}, Required: {{ requirement.is_required ? 'Yes' : 'No' }}</p>
                    </div>
                    <button 
                    type="button" class="text-red-600 hover:text-red-800"
                    @click.prevent="removeRequirement(index)" >
                      Remove
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit Certificate
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Attribute Modal -->
    <div v-if="showAttributeModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-4">
              <h3 
              id="modal-title"
              class="text-lg leading-6 font-medium text-gray-900">
              Add Certificate Attribute</h3>
              <button 
              class="text-gray-400 hover:text-gray-500"
              @click="closeAttributeModal">
                <XIcon class="h-6 w-6" />
              </button>
            </div>
            <div class="mt-2">
              <form 
              class="space-y-4"
              @submit.prevent="addAttribute" >
                <div>
                  <label for="placeholder" class="block text-sm font-medium text-gray-700">Placeholder</label>
                  <input 
                  id="placeholder"
                  v-model="newAttribute.placeholder"
                   type="text" 
                   required 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                   />
                </div>
                <div>
                  <label for="data_type" class="block text-sm font-medium text-gray-700">Data Type</label>
                  <select 
                  id="data_type" 
                  v-model="newAttribute.data_type" 
                  required 
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="date">Date</option>
                  </select>
                </div>
                <div class="flex items-center">
                  <input 
                  id="is_required" 
                  v-model="newAttribute.is_required" 
                  type="checkbox" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                   />
                  <label for="is_required" class="ml-2 block text-sm text-gray-900">Required</label>
                </div>
                <div class="mt-5 sm:mt-6">
                  <button type="submit" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Add Attribute</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Requirement Modal -->
    <div v-if="showRequirementModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="flex justify-between items-center mb-4">
              <h3 
              id="modal-title"
              class="text-lg leading-6 font-medium text-gray-900" 
              >Add Certificate Requirement</h3>
              <button 
              class="text-gray-400 hover:text-gray-500"
              @click="closeRequirementModal" 
              >
                <XIcon class="h-6 w-6" />
              </button>
            </div>
            <div class="mt-2">
              <form 
              class="space-y-4"
              @submit.prevent="addRequirement" 
              >
                <div>
                  <label for="req_name" class="block text-sm font-medium text-gray-700">Name</label>
                  <input 
                  id="req_name" 
                  v-model="newRequirement.name" 
                  required 
                  type="text" 
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
                  />
                </div>
                <div>
                  <label for="req_description" class="block text-sm font-medium text-gray-700">Description</label>
                  <textarea 
                  id="req_description"
                  v-model="newRequirement.description" 
                  rows="3" 
                  required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>
                <div>
                  <label for="req_datatype" class="block text-sm font-medium text-gray-700">Data Type</label>
                  <select 
                  id="req_datatype" 
                  v-model="newRequirement.datatype" 
                  required 
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="file">File</option>
                  </select>
                </div>
                <div class="flex items-center">
                  <input 
                  id="req_is_required" 
                  v-model="newRequirement.is_required" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                  type="checkbox" 
                  />
                  <label for="req_is_required" class="ml-2 block text-sm text-gray-900">Required</label>
                </div>
                <div class="mt-5 sm:mt-6">
                  <button type="submit" class="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm">Add Requirement</button>
                </div>
              </form></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useUsers } from '../stores/user'
import { XIcon } from 'lucide-vue-next'

const store = useUsers()

const form = reactive({
  name: '',
  description: '',
  status: 'available',
  validity: '',
  template: null,
  attributes: [],
  requirements: []
})

const showAttributeModal = ref(false)
const showRequirementModal = ref(false)

const newAttribute = reactive({
  placeholder: '',
  data_type: 'text',
  is_required: false
})

const handleFileInput = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.template = file;
  }
};


const newRequirement = reactive({
  name: '',
  description: '',
  datatype: 'text',
  is_required: false
})

const openAttributeModal = () => {
  showAttributeModal.value = true
}

const closeAttributeModal = () => {
  showAttributeModal.value = false
}

const openRequirementModal = () => {
  showRequirementModal.value = true
}

const closeRequirementModal = () => {
  showRequirementModal.value = false
}

const addAttribute = () => {
  form.attributes.push({ ...newAttribute })
  showAttributeModal.value = false
  Object.assign(newAttribute, {
    placeholder: '',
    data_type: 'text',
    is_required: false
  })
}

const removeAttribute = (index) => {
  form.attributes.splice(index, 1)
}

const addRequirement = () => {
  form.requirements.push({ ...newRequirement })
  showRequirementModal.value = false
  Object.assign(newRequirement, {
    name: '',
    description: '',
    datatype: 'text',
    is_required: false
  })
}

const removeRequirement = (index) => {
  form.requirements.splice(index, 1)
}
const isValidForm = computed(() => {
  return form.name.trim() !== '' &&
         form.description.trim() !== '' &&
         form.status.trim() !== '' &&
         form.validity.trim() !== '';
});

const submitForm = () => {
  if (!isValidForm.value) {
    alert('Please fill out all required fields.');
    return;
  }

  const formData = new FormData();
  formData.append('name', form.name);
  formData.append('description', form.description);
  formData.append('status', form.status);
  formData.append('validity', form.validity);
  if (form.template) {
    formData.append('template', form.template); // Add file
  }

  form.attributes.forEach((attribute, index) => {
    formData.append(`attributes[${index}][placeholder]`, attribute.placeholder);
    formData.append(`attributes[${index}][data_type]`, attribute.data_type);
    formData.append(`attributes[${index}][is_required]`, attribute.is_required);
  });

  form.requirements.forEach((requirement, index) => {
    formData.append(`requirements[${index}][name]`, requirement.name);
    formData.append(`requirements[${index}][description]`, requirement.description);
    formData.append(`requirements[${index}][datatype]`, requirement.datatype);
    formData.append(`requirements[${index}][is_required]`, requirement.is_required);
  });


  store.storeCertificate(formData)

  
  Object.assign(form, {
    name: '',
    description: '',
    status: 'available',
    validity: '',
    template: null,
    attributes: [],
    requirements: []
  });
};

</script>