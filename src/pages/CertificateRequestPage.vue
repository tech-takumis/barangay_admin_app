<template>
    <AuthenticatedLayout>
        <CertificateRequestTable />
    </AuthenticatedLayout>
</template>

<script setup>
import AuthenticatedLayout from '../layouts/AuthenticatedLayout.vue';
import CertificateRequestTable from '../components/CertificateRequestTable.vue';
</script>