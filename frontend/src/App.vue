<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo" @click="goToHome">
          <div class="logo-icon">V</div>
          <span class="logo-text">Visio<span class="highlight">Med</span></span>
        </div>
        <div class="nav-links">
          <router-link to="/">Início</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
          <router-link to="/exams">Exames</router-link>
          <router-link to="/doctors">Médicos</router-link>
          <router-link to="/contact">Contato</router-link>
        </div>
        <button class="btn-appointment" @click="goToConsultation">Consulta Online</button>
      </div>
    </nav>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    goToHome() {
      this.$router.push('/')
    },
    goToConsultation() {
      this.$router.push('/contact')
    }
  }
}
</script>

<style>
* { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
}

body { 
  font-family: 'Inter', sans-serif; 
  background: #0A0A0B; 
  color: #fff; 
}

.navbar { 
  position: fixed; 
  top: 0; 
  left: 0; 
  right: 0; 
  background: rgba(10,10,15,0.95); 
  backdrop-filter: blur(10px); 
  border-bottom: 1px solid rgba(0,242,255,0.1); 
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
  cursor: pointer; 
}

.logo-icon { 
  width: 40px; 
  height: 40px; 
  background: linear-gradient(135deg, #00f2ff, #00ff88); 
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
  color: #00f2ff; 
}

.nav-links { 
  display: flex; 
  gap: 2rem; 
}

.nav-links a { 
  color: #fff; 
  text-decoration: none; 
  font-weight: 500; 
  transition: all 0.3s; 
  cursor: pointer; 
  padding: 8px 0;
}

.nav-links a:hover, 
.nav-links a.router-link-active { 
  color: #00f2ff; 
}

.btn-appointment { 
  background: linear-gradient(135deg, #00f2ff, #00ff88); 
  border: none; 
  padding: 10px 24px; 
  border-radius: 30px; 
  color: #000; 
  font-weight: 600; 
  cursor: pointer; 
  transition: all 0.3s; 
}

.btn-appointment:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 5px 20px rgba(0,242,255,0.3); 
}

@media (max-width: 768px) { 
  .nav-links { 
    display: none; 
  } 
}

/* Adicione um padding-top para compensar a navbar fixa */
#app {
  padding-top: 80px;
}
</style>