import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomePage.vue'
import Dashboard from '../views/DashboardPage.vue'
import Exams from '../views/ExamsPage.vue'
import Doctors from '../views/Doctors.vue'
import Contact from '../views/Contact.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/dashboard', name: 'Dashboard', component: Dashboard },
    { path: '/exams', name: 'Exams', component: Exams },
    { path: '/doctors', name: 'Doctors', component: Doctors },
    { path: '/contact', name: 'Contact', component: Contact }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router