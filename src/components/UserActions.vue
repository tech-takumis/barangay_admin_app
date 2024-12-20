<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold mb-4">User Actions</h1>
    
    <!-- Filter and Sort Controls -->
    <div class="mb-4 flex flex-wrap gap-4">
      <div>
        <label for="actionType" class="block text-sm font-medium text-gray-700">Filter by Action Type:</label>
        <select v-model="filterType" id="actionType" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="">All</option>
          <option v-for="type in actionTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <div>
        <label for="sortBy" class="block text-sm font-medium text-gray-700">Sort by:</label>
        <select v-model="sortKey" id="sortBy" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="id">ID</option>
          <option value="action">Action</option>
          <option value="timestamp">Timestamp</option>
        </select>
      </div>
      <div>
        <label for="sortOrder" class="block text-sm font-medium text-gray-700">Sort Order:</label>
        <select v-model="sortOrder" id="sortOrder" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>

    <!-- User Actions Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Agent</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="action in sortedAndFilteredActions" :key="action.id">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ action.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ action.user_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ action.action_type }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(action.action_timestamp) }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ action.ip_address }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              <span class="truncate block max-w-xs" :title="action.user_agent">{{ action.device_info }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUsers } from '../stores/user';


const store = useUsers()
const userActions = computed(()=>{
  return store.userActions
})

const filterType = ref('');
const sortKey = ref('id');
const sortOrder = ref('asc');

const actionTypes = computed(() => {
  return [...new Set(userActions.value.map(action => action.action_type))];
});

const sortedAndFilteredActions = computed(() => {
  let result = userActions.value;

  if (filterType.value) {
    result = result.filter(action => action.action_type === filterType.value);
  }

  result.sort((a, b) => {
    let modifier = sortOrder.value === 'asc' ? 1 : -1;
    if (a[sortKey.value] < b[sortKey.value]) return -1 * modifier;
    if (a[sortKey.value] > b[sortKey.value]) return 1 * modifier;
    return 0;
  });

  return result;
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString();
};
</script>

