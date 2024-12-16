<script setup>
import { ref, computed } from 'vue'
import { useUsers } from '@/stores/user'
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import { UserRole } from '@/enums/UserRole'

const store = useUsers()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  position: '',
  terms: false,
})

const processing = ref(false)
const errors = ref({})

const positions = Object.values(UserRole)

const submitRegister = async () => {
  processing.value = true
  errors.value = {}
  try {
    await store.register(form,errors,processing)
    form.value = { name: '', email: '', password: '', password_confirmation: '', position: '', terms: false }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value = { general: ['An unexpected error occurred.'] }
    }
  } finally {
    processing.value = false
  }
}
</script>

<template>
  <AuthenticatedLayout>
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register New Staff
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form 
          class="space-y-6"
          @submit.prevent="submitRegister" >
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div class="mt-1">
                <input 
                  id="name" v-model="form.name" type="text" required autocomplete="name"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <p v-if="errors.name" class="mt-2 text-sm text-red-600">{{ errors.name[0] }}</p>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div class="mt-1">
                <input 
                  id="email" v-model="form.email" type="email" required autocomplete="email"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email[0] }}</p>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input 
                  id="password" v-model="form.password" type="password" required autocomplete="new-password"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password[0] }}</p>
            </div>

            <div>
              <label for="password_confirmation" class="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div class="mt-1">
                <input 
                  id="password_confirmation" v-model="form.password_confirmation" type="password" required
                  autocomplete="new-password"
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
              </div>
            </div>

            <div>
              <label for="position" class="block text-sm font-medium text-gray-700">
                Position
              </label>
              <div class="mt-1">
                <select 
                  id="position" v-model="form.position" required
                  class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="" disabled>Select a position</option>
                  <option v-for="position in positions" :key="position" :value="position">
                    {{ position }}
                  </option>
                </select>
              </div>
              <p v-if="errors.position" class="mt-2 text-sm text-red-600">{{ errors.position[0] }}</p>
            </div>

            <div>
              <button 
                type="submit" :disabled="processing"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {{ processing ? 'Processing...' : 'Register Staff' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AuthenticatedLayout>
</template>