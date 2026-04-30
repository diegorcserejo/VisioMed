<template>
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <div class="logo-icon">V</div>
                <span class="logo-text">Visi<span class="highlight">Med</span></span>
            </div>
            
            <div class="nav-links">
                <router-link to="/" class="nav-link"><i class="fas fa-home"></i> Home</router-link>
                <router-link to="/dashboard" class="nav-link"><i class="fas fa-chart-line"></i> Dashboard</router-link>
                <router-link to="/exams" class="nav-link"><i class="fas fa-x-ray"></i> Exames</router-link>
                <router-link to="/doctors" class="nav-link"><i class="fas fa-user-md"></i> Médicos</router-link>
                <router-link to="/contact" class="nav-link"><i class="fas fa-envelope"></i> Contato</router-link>
            </div>
            
            <button class="btn-appointment" @click="showAppointment = true">
                <i class="fas fa-calendar-check"></i> Consulta Online
            </button>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {
            showAppointment: false
        }
    }
}
</script>

<style scoped>
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(10, 10, 15, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 242, 255, 0.1);
    z-index: 1000;
    padding: 1rem 0;
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: bold;
    color: #000;
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #fff;
}

.logo-text .highlight {
    color: var(--cyber-blue, #00f2ff);
}

.nav-links {
    display: flex;
    gap: 2rem;
}

.nav-link {
    color: #fff;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    gap: 8px;
}

.nav-link:hover {
    color: var(--cyber-blue, #00f2ff);
}

.nav-link.router-link-active {
    color: var(--cyber-blue, #00f2ff);
}

.nav-link.router-link-active::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
}

.btn-appointment {
    background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    border: none;
    padding: 10px 24px;
    border-radius: 30px;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-appointment:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 242, 255, 0.3);
}
</style>