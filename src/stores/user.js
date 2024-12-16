import { axios, setBearerToken } from '@/lib/axios'
import { useStorage } from '@vueuse/core'
import { defineStore, acceptHMRUpdate } from 'pinia'
import Announcement from '../components/Announcement.vue'
import swal from 'sweetalert'
import { all } from 'axios'

const csrf = () => axios.get('/sanctum/csrf-cookie')

export const useUsers = defineStore('users', {
    state: () => ({
        userData: [],
        users: [],
        authStatus: [],
        officials: [],
        authStaffMessage: [],
        userMessage: [],
        authUserNotification: [],
        announcement: [],
        certificates: [],
        certificateRequests: [],
        activityLogs: [],
        notificationModal: {
            isOpen: false,
            title: '',
            message: '',
        },
        listenersInitialized: false,
        userActions: []
    }),

    getters: {
        authUser: state => state.authStatus === 204 || state.authStatus === 200,
        authUserData: state => state.userData,
        hasActivityLogs: state => Object.keys(state.activityLogs).length > 0,
        hasUserMessage: state => Object.keys(state.userMessage).length > 0,
        hasUsers: state => Object.keys(state.users).length > 0,
        hasStaffMessageAndNotification: state => Object.keys(state.authStaffMessage).length > 0,
        hasAnnoucement: state => Object.keys(state.announcement).length > 0,
        hasCertificate: state => Object.keys(state.certificates).length > 0,
        hasCertificateRequest: state => Object.keys(state.certificateRequests).length > 0,
        hasUserData: state => Object.keys(state.userData).length > 0,
        hasOfficials: state => Object.keys(state.officials).length > 0,
        hasVerified: state =>
            Object.keys(state.userData).length > 0
                ? state.userData.email_verified_at !== null
                : false,
    },

    actions: {
        showNotification(title, message) {
            this.notificationModal.isOpen = true
            this.notificationModal.title = title
            this.notificationModal.message = message
        },

        closeNotification() {
            this.notificationModal.isOpen = false
            this.notificationModal.title = ''
            this.notificationModal.message = ''
        },

        handleNewStaff(staff) {
            this.officials.push(staff)
            this.showNotification('New Staff Added', `${staff.staff_name} has been added to the staff.`)
        },

        handleStaffDeleted(staff) {
            this.officials = this.officials.filter(t => t.id !== staff.id)
            this.showNotification('Staff Deleted', `${staff.staff_name} has been removed from the staff.`)
        },

        handleNewCertificate(certificate) {
            this.certificates.unshift(certificate)
            this.showNotification('New Certificate', `A new certificate "${certificate.name}" has been added.`)
        },
        handleCertificateDeleted(certificate) {
            this.certificates = this.certificates.filter(cert => cert.id !== certificate.id)
            this.showNotification('Certificate Deleted', `The certificate "${certificate.certificate_name}" has been deleted.`)
        },
        async getData() {
            axios
                .get('/api/user')
                .then(response => {
                    this.userData = response.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    this.router.push('/verify-email')
                })
        },
        async getUserActions() {
            axios
                .get('/api/user/actions')
                .then(response => {
                    this.userActions = response.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    this.router.push('/verify-email')
                })
        },
        async getAllUsers() {
            await axios
                .get('/api/users')
                .then(response => {
                    this.users = response.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    this.router.push('/verify-email')
                })
        },
        async GlobalAnnouncement(form) {
            await axios
                .post('/api/announcements', form.value)
                .then(res => {
                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    console.log('error while saving th annoucement in user store glocal announcement function catch' + error)
                })

        },
        async getStaffMessage() {
            await axios
                .get('/api/staff/messages')
                .then(res => {
                    this.authStaffMessage = res.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    this.router.push('/verify-email')
                })
        },
        async getUserMessage() {
            await axios
                .get('/api/user/all/messages')
                .then(res => {
                    this.userMessage = res.data
                })
                .catch(error => {
                    if (error.response.status !== 409) throw error

                    this.router.push('/verify-email')
                })
        },
        async sendMessage(form) {

            await axios
                .post('/api/staff/messages', form.value)
                .then(res => {

                })
                .catch(error => {
                    if (error.response.status != 409) throw error
                    console.log("Error when sending message in user store certificate function")
                    this.router.push({ name: 'dashboard' })
                })
        },
        async getOfficials() {
            await axios
                .get('/api/officials')
                .then(response => {
                    // Assuming the response contains extra data, filter or map the array as needed
                    this.officials = response.data.map(official => ({
                        id: official.staff_id,
                        staff_name: official.staff_name,
                        staff_position: official.staff_position,
                        is_active: official.is_active,
                        is_staff: official.is_staff,
                        is_admin: official.is_admin,
                        email: official.email,
                    }));

                })
                .catch(error => {
                    if (error.response.status != 409) throw error

                    this.router.push({ name: 'dashboard' })
                })
        },
        async resetPassword(form, setErrors, processing) {
            await csrf()

            processing.value = true

            axios
                .post('/user/reset-password', form.value)
                .then(response => {
                    this.router.push(
                        '/login?reset=' + btoa(response.data.status),
                    )
                    processing.value = false
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },
        async storeCertificate(form) {
            await axios
                .post('/api/certificates', form)
                .then(res => {
                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    if (error.response.status != 409) throw error
                    console.log("Error when storing certificate in user store certificate function")
                    this.router.push({ name: 'dashboard' })
                })
        },
        async getCertificates() {
            await axios
                .get('/api/certificates')
                .then(res => {
                    this.certificates = res.data.certificate
                })
                .catch(error => {
                    if (error.response.status != 409) throw error
                    console.log("Error when storing certificate in user store certificate function")
                    this.router.push({ name: 'dashboard' })
                })
        },
        async getCertificate(id) {
            try {
                const response = await axios.get(`/api/certificates/${id}`);
                console.log("API Response:", response.data.certificate);
                return response.data.certificate; 
            } catch (error) {
                if (error.response && error.response.status !== 409) throw error;
                console.log("Error when fetching certificate in user store certificate function");
                this.router.push({ name: 'dashboard' });
            }
        },
        async getCertificateRequests() {
            try {
                const response = await axios.get('/staff/certificates/requests')
                this.certificateRequests = response.data
            } catch (error) {
                console.error('Error fetching certificate requests:', error)
            }
        },
        async approvedCertificate(id, formData) {
            try {
                const response = await axios.post(`/api/certificate-requests/${id}/approve`, formData)
                const index = this.certificateRequests.findIndex(req => req.id === id)
                if (index !== -1) {
                    this.certificateRequests[index].status = 'approved'
                }
            } catch (error) {
                console.error('Error approving certificate:', error)
                throw error
            }
        },
        async rejectCertificate(id) {
            try {
                await axios.post(`/api/certificate-requests/${id}/reject`)
                const index = this.certificateRequests.findIndex(req => req.id === id)
                if (index !== -1) {
                    this.certificateRequests[index].status = 'rejected'
                }
            } catch (error) {
                console.error('Error rejecting certificate:', error)
            }
        },
        async getActivityLogs() {
            await axios
                .get('/api/activity/logs')
                .then(response => {
                    this.activityLogs = response.data
                })
                .catch(error => {
                    console.log("Error while fetching activity logs", error)
                })
        },
        async getLatestAnnouncement() {
            try {
                const response = await axios.get('/api/announcement')
                this.announcement = response.data
            } catch (error) {
                console.error("Error while fetching the announcement:", error)
                this.announcement = []
            }
        },
        async updateCertificate(updatedCertificate) {
            try {
                const response = await axios.put(`/api/certificates/${updatedCertificate.id}`, updatedCertificate);

                if (response.data.certificate) {
                    // Replace the old certificate data with the updated one
                    const index = this.certificates.findIndex(c => c.id === updatedCertificate.id);
                    if (index !== -1) {
                        this.certificates[index] = response.data.certificate;
                    }
                }
            } catch (error) {
                console.error("Error updating certificate:", error);
                throw error; // Optionally re-throw to handle in the UI
            }
        },
        async deleteCertificate(id) {
            await axios
                .delete(`/api/certificates/${id}`)
                .then(response => {
                    if (response.status === 200) {
                        this.certificates = this.certificates.filter(cert => cert.id !== id);
                    }
                })
                .catch(error => {
                    console.log("Certificate Not deleted")
                })
        },
        async register(form, setErrors, processing) {
            await csrf()

            processing.value = true

            axios
                .post('/staff/register', form.value)
                .then(response => {
                    this.authStatus = response.status
                    processing.value = false

                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    setErrors.value = Object.values(
                        error.response.data.errors,
                    ).flat()
                    processing.value = false
                })
        },
        async login(form, setErrors, processing) {
            await csrf()

            processing.value = true

            axios
                .post('/staff/login', form.value)
                .then(response => {
                    this.authStatus = response.status
                    processing.value = false
                    setBearerToken(response.data.token)
                    localStorage.setItem('authToken',response.data.token)
                    
                    this.router.push({ name: 'dashboard' })
                })
                .catch(error => {
                    processing.value = false

                    if(error.response){
                        if(error.response.status === 403){
                            setErrors.value = ['Your account is temporarily locked.'];
                        }else if(error.response.status === 422){
                            setErrors.value = Object.values(error.response.data.errors).flat();
                        }else{
                            setErrors.value = [error.response.data.message || 'An unexpected error occurred.'];
                        }
                    }else{
                        setErrors.value = ['Unable to connect to the server. Please try again later.'];
                    }
                   
                })
        },
        async deleteOfficial(id) {
            await axios
                .delete(`/api/official/${id}`)
                .then(res => {
                    this.officials = this.officials.filter(t => t.id !== id)
                })
                .catch(e => {
                    console.log("Error" + e)
                })
        },
        async logout() {
            await csrf()
            await axios
                .post('/staff/logout')
                .then(() => {
                    this.$reset()

                    this.router.push({ name: 'welcome' })
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                })
        },
    },
    persist: true
})

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUsers, import.meta.hot))
}
