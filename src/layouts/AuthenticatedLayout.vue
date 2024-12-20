<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Sidebar -->
    <aside :class="[
      'fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform',
      { '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen },
      'md:relative md:translate-x-0'
    ]">
      <div class="flex items-center justify-between h-16 px-4 border-b">
        <router-link to="/" class="flex items-center">
          <ApplicationLogo class="block h-9 w-auto" />
        </router-link>
        <h2 class="md:font-bold md:uppercase text-sm hidden md:inline-block">Barangay Loreto</h2>
        <button
          class="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          @click="toggleSidebar">
          <XIcon class="h-6 w-6" />
        </button>
      </div>
      <nav class="mt-5 px-2 space-y-1">
        <div class="py-2 border-b border-gray-200">
          <p class="text-sm text-gray-600 px-2 font-semibold">{{ store.userData.email }}</p>
        </div>
        <template v-for="item in navItems" :key="item.name">
          <router-link v-if="!item.children" :to="item.href"
            class="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
            <component :is="item.icon" class="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true" />
            {{ item.name }}
          </router-link>
          <Disclosure v-else v-slot="{ open }" as="div" class="space-y-1">
            <DisclosureButton
              class="group w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <component :is="item.icon" class="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true" />
              <span class="flex-1 text-left">{{ item.name }}</span>
              <ChevronDownIcon
                :class="[open ? 'text-gray-400 rotate-180' : 'text-gray-300', 'ml-3 h-5 w-5 transform group-hover:text-gray-400 transition-colors ease-in-out duration-150']" />
            </DisclosureButton>
            <DisclosurePanel class="space-y-1">
              <router-link v-for="subItem in filteredChildren(item.children)" :key="subItem.name" :to="subItem.href"
                class="group flex items-center pl-11 pr-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-50">
                <component :is="subItem.icon" class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true" />
                {{ subItem.name }}
              </router-link>
            </DisclosurePanel>
          </Disclosure>
        </template>
      </nav>
      <div class="absolute bottom-0 w-full p-4">
        <button
          class="w-full flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          @click="submitLogout">
          <LogOutIcon class="mr-4 h-6 w-6" />
          Log Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Sticky Navbar -->
      <nav class="sticky top-0 z-10 bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <button
                class="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                @click="toggleSidebar">
                <Bars3Icon class="h-6 w-6" aria-hidden="true" />
              </button>
              <h1 v-if="store.userData.is_admin" class="ml-2 text-xl font-semibold"> Admin Dashboard</h1>
              <h1 v-else class="ml-2 text-xl font-semibold"> Employee Dashboard</h1>
            </div>
          </div>
        </div>
      </nav>

      <!-- Page Content -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div class="py-6">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <slot />
          </div>
        </div>
      </main>
      <NotificationModal 
      :is-open="store.notificationModal.isOpen" :title="store.notificationModal.title"
        :message="store.notificationModal.message" @close="store.closeNotification" />
    </div>
  </div>
</template>

<script setup>

import { ref, computed, onMounted, watch, inject, onUnmounted } from 'vue'
import { useUsers } from '@/stores/user'
import ApplicationLogo from '@/components/ApplicationLogo.vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import {
  Bars3Icon, XMarkIcon, ChatBubbleLeftRightIcon,
  Squares2X2Icon, DocumentTextIcon, BellIcon, UserGroupIcon, PlusCircleIcon,
  ClipboardDocumentListIcon, UserPlusIcon, UsersIcon, ChevronDownIcon,
  ClipboardDocumentIcon
} from '@heroicons/vue/24/outline'
import NotificationModal from '../components/NotificationModal.vue'

import { LogOutIcon, Mic2, XIcon } from 'lucide-vue-next'
import { ActivityIcon, ActivitySquareIcon } from 'lucide-vue-next'
import { getEchoInstance } from '../services/echo'


const echo = getEchoInstance()
const store = useUsers()
const sidebarOpen = ref(window.innerWidth >= 768)
const showMessages = ref(false)
const totalMessage = computed(() => store.authStaffMessage.length)

const filteredChildren = (item) => {
  if (!store.userData.is_admin) {
    return item.filter((child) => child.is_staff);
  }
  return item;
};

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleMessages = () => {
  showMessages.value = !showMessages.value
}

const submitLogout = () => {
  store.logout()
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Squares2X2Icon },
  {
    name: 'Documents',
    icon: DocumentTextIcon,
    children: [
      { name: 'New Certificate', href: '/certificate', icon: PlusCircleIcon, is_staff: false },
      { name: 'Certificate Requests', href: '/certificate/requests', icon: ClipboardDocumentListIcon, is_staff: true },
      { name: 'Certificates', href: '/certificates', icon: ClipboardDocumentIcon, is_staff: true }
    ]
  },
  {
    name: 'Staff',
    icon: UserGroupIcon,
    children: [
      { name: 'New Staff', href: '/staff/register', icon: UserPlusIcon, is_staff: false },
      { name: 'All Staff', href: '/staff', icon: UsersIcon, is_staff: true }
    ]
  },
  { name: 'activity logs', href: '/activity/logs', icon: ActivitySquareIcon, is_staff: false },
  // { name: 'User Actions', href: '/users/actions', icon: UserGroupIcon, is_staff: false },
  { name: 'Add Announcement', href: '/announcement', icon: Mic2, is_staff: false },
]

const subscribeToNotificationChannel = () => {
  if(echo && !store.echoNotificationListener){
    echo.private('staff.notifications')
      .listen('NewOfficialNotification', (event) => {
        store.handleNewStaff(event)
      })
      .listen('DeleteOfficialEvent', (event) => {
        store.handleStaffDeleted(event)
      })
      .listen('AnnouncementEvent', (event) => {
        store.announcement.unshift(event)
      })
      .listen('NewCertificateEvent', (event) => {
        store.handleNewCertificate(event)
      })
      .listen('DeleteCertificateEvent', (event) => {
        store.handleCertificateDeleted(event)
      })
      .listen('CertificateRequestEvent', (event) => {
          store.totalPending = store.totalPending + 1
           store.certificateRequests.unshift(event);
        })
      .listen('StaffMessageEvent', (event) => {
        console.log("Staff message", event)
      })
      .listen('DeleteCertificateRequestEvent', (event) => {
        store.certificateRequests.length - 1
        store.handleDeleteCertificateRequest(event)
      })
      store.echoNotificationListener = true
  }
} 




onMounted(async () => {
  if (!store.hasUserData) {
    await store.getData()
  }
  if(!store.hasUsers)
  {
    await store.getAllUsers()
  }
  if(!store.hasAnnoucement){
    await store.getLatestAnnouncement()
  }
  if(!store.hasOfficials){
    await store.getOfficials()
  }
  if(!store.hasCertificate){
    await store.getCertificates()
  }
  if(!store.hasCertificateRequest){
    await store.getCertificateRequests()
  }

  if(!store.hasStatistic){
    await store.getCertificateRequestStatistic('pending')
    await store.getCertificateRequestStatistic('reject')
    await store.getCertificateRequestStatistic('approved')
    await store.getUserStatistic()
    await store.getStaffStatistic()
  }
  subscribeToNotificationChannel()

})

</script>

<style scoped>
@media (min-width: 768px) {
  .md\:relative {
    position: relative;
  }

  .md\:translate-x-0 {
    transform: translateX(0);
  }
}
</style>
