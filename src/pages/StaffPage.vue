<script setup>
import UserTable from '../components/UserTable.vue';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue';
</script>

<template>
  <AuthenticatedLayout>
    <template #default>
      <div class="py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-semibold text-gray-900 mb-6">Staff Management</h1>
        <UserTable />
      </div>
    </template>
  </AuthenticatedLayout>
</template>