<template>
    <div class="p-6 bg-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Certificate Requests Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Certificate Requests</h2>
          <div class="grid grid-cols-3 gap-4">
            <div class="text-center">
              <p class="text-2xl font-bold text-yellow-500">{{ store.totalPending }}</p>
              <p class="text-sm text-gray-600">Pending</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-green-500">{{ store.totalApproved}}</p>
              <p class="text-sm text-gray-600">Approved</p>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-red-500">{{ store.totalReject }}</p>
              <p class="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
  
        <!-- Total Users Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Total Users</h2>
          <div class="flex items-center justify-center">
            <svg class="w-12 h-12 text-blue-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="text-4xl font-bold text-blue-500">{{ store.totalUsers }}</p>
          </div>
          <p class="mt-4 text-center text-gray-700">Registered Users</p>
        </div>
  
        <!-- Total Staff Card -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Total Staff</h2>
          <div class="flex items-center justify-center">
            <svg class="w-12 h-12 text-purple-500 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <p class="text-4xl font-bold text-purple-500">{{ store.totalStaff }}</p>
          </div>
          <p class="mt-4 text-center text-gray-700">Active Staff Members</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeMount } from 'vue';
  import { useUsers } from '../stores/user';
  
  const store = useUsers()
  
  
  </script>
  
  