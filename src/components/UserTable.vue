<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <div class="p-6 border-b border-gray-200">
      <h2 class="text-xl font-semibold text-gray-800">Staff</h2>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Email
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
              Position
            </th>
            <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="official in officials" :key="official.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span 
                  :class="[ 
                    'flex-shrink-0 h-2.5 w-2.5 rounded-full mr-2', 
                    official.is_active ? 'bg-green-400' : 'bg-red-400' 
                  ]"
                  :title="official.is_active ? 'Active' : 'Inactive'"
                ></span>
                <div class="text-sm font-medium text-gray-900">{{ official.staff_name }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
              <div class="text-sm text-gray-500">{{ official.email }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap hidden md:table-cell">
              <div class="text-sm text-gray-500">{{ official.staff_position }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button 
                class="text-blue-600 hover:text-blue-900 mr-2"
                title="Chat"
                @click="chatWithOfficial(official, official.id)"
              >
                <MessageSquareIcon class="h-5 w-5" />
              </button>
              <button 
                v-if="store.userData.is_admin"
                class="text-green-600 hover:text-green-900 mr-2"
                title="Edit"
                @click="updateOfficial(official)"
              >
                <EditIcon class="h-5 w-5" />
              </button>
              <button
                v-if="store.userData.is_admin" 
                class="text-red-600 hover:text-red-900"
                title="Delete"
                @click="store.deleteOfficial(official.id)"
              >
                <TrashIcon class="h-5 w-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Chat Modal -->
  <Modal v-if="isChatModalOpen" @close="closeChatModal">
    <template #header>
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Chat with {{ selectedUser?.staff_name }}
      </h3>
    </template>
    <template #body>
      <input 
        v-model="message.message" 
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
        type="text" 
        placeholder="Type a message..." 
        @keyup.enter="sendMessage" 
      />
    </template>
    <template #footer>
      <button 
        type="button" 
        class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
        @click="sendMessage"
      >
        Send
      </button>
      <button 
        type="button" 
        class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        @click="closeChatModal"
      >
        Cancel
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { MessageSquareIcon, EditIcon, TrashIcon } from 'lucide-vue-next'
import { useUsers } from '@/stores/user'
import Modal from '@/components/Modal.vue'

const store = useUsers()

const isChatModalOpen = ref(false)
const selectedUser = ref(null) 
const message = ref({
  'message': '',
  'sender_id': store.userData?.id,
  'receiver_id': ''
})

const officials = computed(() => store.officials)

const chatWithOfficial = (user, id) => {
  selectedUser.value = user
  message.value.receiver_id = id
  isChatModalOpen.value = true
}

const closeChatModal = () => {
  isChatModalOpen.value = false
  selectedUser.value = null
}

const sendMessage = async () => {
  if (message.value.message.trim() && selectedUser.value) {
    await store.sendMessage(message.value)
    message.value.message = '' 
    closeChatModal()
  } else {
    alert('Please enter a message')
  }
}

const updateOfficial = (user) => {
  console.log('Update user:', user.name)
}
</script>

