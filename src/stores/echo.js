import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

import { onMounted, onUnmounted, ref } from "vue";
import { axios } from "../lib/axios";

const useEcho = () => {
    const echoInstance = ref(null);

    const initializeEcho = () => {
        if (echoInstance.value) {
            echoInstance.value.disconnect();
        }

        const echo = new Echo({
            broadcaster: 'reverb',
            key: import.meta.env.VITE_REVERB_APP_KEY,
            authorizer: (channel, options) => {
                return {
                    authorize: (socketId, callback) => {
                        axios.post('/api/broadcasting/auth', {
                            socket_id: socketId,
                            channel_name: channel.name
                        }, {
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                            }
                        })
                            .then(response => {
                                callback(false, response.data);
                            })
                            .catch(error => {
                                callback(true, error);
                            });
                    }
                };
            },
            wsHost: import.meta.env.VITE_REVERB_HOST,
            wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
            wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
            forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
            enabledTransports: ['ws', 'wss'],
            auth: {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            }
        });
        echoInstance.value = echo;
        return echo;
    };

    onMounted(() => {
        initializeEcho();
    });

    onUnmounted(() => {
        if (echoInstance.value) {
            echoInstance.value.disconnect();
        }
    });

    return {
        echo: echoInstance,
        reinitialize: initializeEcho
    };
};

export default useEcho;