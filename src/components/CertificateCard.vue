<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-500 hover:scale-105">
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-gray-800">Certiticate name</h3>
            <span :class="['px-2 py-1 rounded-full text-xs font-semibold', getStatusClass(certificate.validity)]">
              {{ isValid(certificate.validity) ? 'Valid' : 'Expired' }}
            </span>
          </div>
          <p class="text-gray-600">{{ certificate.description }}</p>
          <div class="flex justify-between items-center text-sm text-gray-500">
            <span>Valid until:</span>
            <span class="font-semibold">{{ formatDate(certificate.validity) }}</span>
          </div>
        </div>
        <div class="px-6 py-4 bg-gray-50 flex justify-between items-center">
          <button class="text-indigo-600 hover:text-indigo-800 font-medium">View Details</button>
          <DownloadIcon class="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { DownloadIcon } from 'lucide-vue-next'
  
  defineProps({
    certificate: {
        type: Object,
        required: true
    }
  })
  
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  const isValid = (dateString) => {
    return new Date(dateString) > new Date()
  }
  
  const getStatusClass = (dateString) => {
    return isValid(dateString) 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }
  </script>