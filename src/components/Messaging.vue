<template>
    <div class="flex h-screen bg-gray-100">
      <!-- Staff List Column -->
      <div class="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <div class="p-4">
          <h2 class="text-xl font-semibold mb-4">Staff</h2>
          <div class="space-y-2">
            <div
              v-for="staff in staffList"
              :key="staff.id"
              @click="selectStaff(staff)"
              class="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
              :class="{ 'bg-blue-100': selectedStaff && selectedStaff.id === staff.id }"
            >
              <img :src="`https://i.pravatar.cc/150?img=${staff.id}`" :alt="staff.staff_name" class="w-10 h-10 rounded-full mr-3">
              <div>
                <p class="font-medium">{{ staff.staff_name }}</p>
                <p class="text-sm text-gray-500">{{ staff.staff_position }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Messaging Column -->
      <div class="flex-1 flex flex-col bg-gray-50">
        <div v-if="selectedStaff" class="bg-white border-b border-gray-200 p-4">
          <h2 class="text-xl font-semibold">{{ selectedStaff.staff_name }}</h2>
          <p class="text-sm text-gray-500">{{ selectedStaff.staff_position }}</p>
        </div>
        <div v-else class="bg-white border-b border-gray-200 p-4">
          <h2 class="text-xl font-semibold">Select a staff member to start messaging</h2>
        </div>
  
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="message in messages" :key="message.id" class="flex">
            <div
              :class="[
                'max-w-xs sm:max-w-md px-4 py-2 rounded-lg',
                message.sender_id === store.userData.id ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-300'
              ]"
            >
              {{ message.message }}
            </div>
          </div>
        </div>
  
        <div class="bg-white border-t border-gray-200 p-4">
          <div class="flex space-x-2">
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              type="text"
              placeholder="Type a message..."
              class="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
            <button
              @click="sendMessage"
              class="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue';
  import { useUsers } from '../stores/user';
  import { getEchoInstance } from '../services/echo';
  
  const echo = getEchoInstance()

  const store = useUsers()
  const staffList = computed(()=>{
    return store.officials
  })
  
  const selectedStaff = ref(null);
  const messages = ref([]);
  const newMessage = ref('');

  const form = ref({
    sender_id: store.userData.id,
    receiver_id: '',
    message: ''
  })
  
  const selectStaff =async (staff) => {
    selectedStaff.value = staff;
    form.value.receiver_id = staff.id
    try {
        const response = await store.getMessage(staff.id)
        messages.value = response
    } catch (error) {
        console.error("Failed to fetch messages:", error);
        messages.value = [];
    }
  };
  
  const sendMessage = () => {
    if (newMessage.value.trim() && selectedStaff.value) {

        form.value.message = newMessage.value

        store.sendMessage(form)
        messages.value.push(form.value)
        form.value.message = ''
        newMessage.value = ''
    }
  };

  const subscribeToChatChannel = () => {
  if (echo && store.userData?.id) {
    echo.private(`chat.${store.userData.id}`)
      .listen('MessageEvent', (event) => {

        // Find the staff in the officials list
        const staff = store.officials.find(
          (staffMember) =>  staffMember.id === event.receiver_id
        );

        if (staff) {
          // Ensure the staff has a messages property to store messages
          if (!staff.messages) {
            staff.messages = [];
          }

          // Append the new message to the staff's messages array
          staff.messages.push({
            id: event.id, // Assuming the event contains a unique `id` for the message
            message: event.message,
            sender_id: event.sender_id,
            receiver_id: event.receiver_id,
            created_at: event.created_at,
          });

          console.log(`Message added to staff: ${staff.staff_name}`, staff.messages);

          // If the staff is currently selected, update the messages array
          if (selectedStaff.value && selectedStaff.value.id === staff.id) {
            messages.value = staff.messages;
          }
        }
      });
  }
};


  onMounted(()=>{
    subscribeToChatChannel()
  })

  onUnmounted(()=>{
    echo.leave(`chat.${store.userData.id}`)
  })


  </script>
  
  