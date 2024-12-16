<script setup>
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue';
import ActivityLogsTable from '../components/ActivityLogsTable.vue';
</script>

<template>
    <AuthenticatedLayout>
        <ActivityLogsTable/>
    </AuthenticatedLayout>
</template>