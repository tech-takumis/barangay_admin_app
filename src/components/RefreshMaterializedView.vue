<template>
    <div class="mb-4">
      <button
        @click="refreshView"
        :disabled="isRefreshing"
        class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
      >
        {{ isRefreshing ? 'Refreshing...' : 'Refresh Materialized View' }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue'
  import { useUsers } from '../stores/user'
  
  const store = useUsers()
  
  const isRefreshing = computed(() => store.isRefreshing)
  
  const refreshView = () => {
    store.refreshMaterializedView()
  }
  </script>
  
  