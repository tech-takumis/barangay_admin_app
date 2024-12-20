import { axios, setBearerToken } from '@/lib/axios'
import { defineStore, acceptHMRUpdate } from 'pinia'
import { initializeEcho,disconnectEcho} from '../services/echo'
import { Flashlight } from 'lucide-vue-next'
const csrf = () => axios.get('/sanctum/csrf-cookie')

export const useUsers = defineStore('users', {
    state: () => ({
        userData: [],
        users: [],
        authStatus: [],
        officials: [],
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
        userActions: [],
        echoNotificationListener: false,
        totalPending:0,
        totalApproved: 0,
        totalReject: 0,
        totalUsers: 0,
        totalStaff: 0,
        isRefreshing: false,
    }),

    getters: {
        authUser: state => state.authStatus === 204 || state.authStatus === 200,
        authUserData: state => state.userData,
        hasActivityLogs: state => Object.keys(state.activityLogs).length > 0,
        hasStatistic: state => state.totalApproved > 0 || state.totalPending > 0 || state.totalReject > 0,
        hasUserMessage: state => Object.keys(state.userMessage).length > 0,
        hasUsers: state => Object.keys(state.users).length > 0,
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
        handleDeleteCertificateRequest(certificate){
            this.certificateRequests = this.certificateRequests.filter(cert => cert.id !== certificate.id);
            this.showNotification('Cancel Certificate Request',`User Delete certificate request`);
        },
        async getCertificateRequestStatistic(status){
            try {
                const response = await axios.get(`/api/stats/${status}`)
                const data  = response.data.stats

                if(status === 'pending'){
                    this.totalPending = data[0].get_certificate_request_count
                }else if (status === 'approved') {
                    this.totalApproved = data[0].get_certificate_request_count
                } else {
                    this.totalReject = data[0].get_certificate_request_count
                }
                
            } catch (error) {
                console.log("Error while retreiving the total pending certificate request")
            }   
        },
        async getStaffStatistic()
        {
            try {
                const response = await axios.get('/api/staffs/stats')
                const data = response.data
                this.totalStaff = data[0].count
            } catch (error) {
                console.log("Error while fetching user and staff statistic")
            }
        },
        async getUserStatistic()
        {
            try {
                const response = await axios.get('/api/users/stats')
                const data = response.data
                this.totalUsers = data[0].count
            } catch (error) {
                console.log("Error while fetching user and staff statistic")
            }
        },
        async refreshMaterializedView() {
            this.isRefreshing = true
            try {
              const response = await axios.get('/api/refresh-materialize-view')
              this.showNotification('Refresh Materialize view', 'Refresh materialize view successfully')
              await this.getActivityLogs()
            } catch (error) {
              console.error('Error refreshing materialized view:', error)
            } finally {
              this.isRefreshing = false
            }
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
            await axios
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
        async sendMessage(form){
            try {
                const response = await axios.post('/api/staff/messages',form.value)
            } catch (error) {
                console.log("Error while sending message") 
            }
        },
        async getMessage(receiver_id){
            try {
                const response = await axios.get(`/api/staff/message/${receiver_id}`)
                return response.data
            } catch (error) {
                console.log("Can't find user message")
            }
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

            await axios
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
        async getCertificate(certificateId) {
            try {
                const response = await axios.get(`/api/certificates/${certificateId}`);
                    const newCertificate = response.data.certificate;
                    // Add the new certificate to the existing array, or replace if exists
                    const certificateIndex = this.certificates.findIndex(cert => cert.id === newCertificate.id);
                    if (certificateIndex !== -1) {
                        this.certificates.splice(certificateIndex, 1, newCertificate);
                    } else {
                        this.certificates.push(newCertificate);
                    }
                } catch (error) {
                    console.error('Error fetching certificate:', error);
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
                    this.certificateRequests[index].status = 'reject'
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

                    const token = response.data.token
                    setBearerToken(token)
                    localStorage.setItem('authToken',token)

                    initializeEcho(token)

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
                    localStorage.removeItem('authToken')
                    disconnectEcho()
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
