<template>
  <section class="hero">
    <div class="hero-container">
      <div class="hero-content">
        <div class="hero-badge">
          <i class="fas fa-hospital-user badge-icon"></i>
          <span class="badge-text">Diagnóstico por Imagem com IA</span>
        </div>
        
        <h1 class="hero-title">
          Seu destino para<br>
          <span class="gradient-text">tratamentos de excelência mundial</span>
        </h1>
        
        <p class="hero-description">
          VisioMed é o seu lugar para tratamentos de padrão internacional, atendimento humanizado 
          e diagnósticos precisos, tudo reunido em um só lugar.
        </p>
        
        <div class="hero-buttons">
          <button class="btn-primary" @click="$emit('explore')">
            Explorar
            <i class="fas fa-arrow-right"></i>
          </button>
          <button class="btn-secondary" @click="$emit('watchVideo')">
            Assistir ao Vídeo
            <i class="fas fa-play"></i>
          </button>
        </div>
        <div class="stats-container">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
      
      <div class="hero-image">
        <div class="image-wrapper">
          <div class="floating-elements">
            <div class="float-card card-1"><i class="fas fa-brain"></i> Saúde Cerebral</div>
            <div class="float-card card-2"><i class="fas fa-heartbeat"></i> Check-up Cardíaco</div>
            <div class="float-card card-3"><i class="fas fa-lungs"></i> Exame Pulmonar</div>
          </div>
          <div class="main-image">
            <div class="ai-scan-overlay">
              <div class="scan-line">
              </div>            
            </div>
            <img src="../assests/medcapa.png" alt="Imagem Médica">
          </div>
          <div class="experience-badge">
            <span class="years">3</span>
            <span class="years-text">Anos de<br>Excelência Médica</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  emits: ['explore', 'watchVideo'],
  data() {
    return {
      stats: [
        { value: '$250M', label: 'Em Investimentos' },
        { value: '20M+', label: 'Pacientes Atendidos' },
        { value: '95%', label: 'Taxa de Satisfação' },
        { value: '200+', label: 'Profissionais' }
      ]
    }
  }
}
</script>

<style scoped>
.hero {
  padding: 120px 0 60px;
  background: linear-gradient(135deg, rgba(0, 242, 255, 0.05), rgba(0, 255, 136, 0.02));
  overflow: hidden;
}

.hero-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 4rem;
}

.hero-content {
  flex: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 242, 255, 0.1);
  border-radius: 50px;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(0, 242, 255, 0.2);
}

.badge-icon {
  font-size: 1.2rem;
  color: var(--cyber-blue, #00f2ff);
}

.badge-text {
  color: var(--cyber-blue, #00f2ff);
  font-size: 0.9rem;
  font-weight: 500;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: #fff;
}

.gradient-text {
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}

.hero-description {
  font-size: 1.1rem;
  color: #a0a0a0;
  line-height: 1.6;
  margin-bottom: 2rem;
  max-width: 500px;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 28px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  border: none;
  color: #000;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 242, 255, 0.3);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(0, 242, 255, 0.3);
  transform: translateY(-2px);
}

.stats-container {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: left;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.25rem;
}

.stat-label {
  color: #666;
  font-size: 0.85rem;
}

.hero-image {
  flex: 1;
  position: relative;
}

.image-wrapper {
  position: relative;
  width: 100%;
}

.main-image {
  position: relative;
  border-radius: 30px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.main-image img {
  width: 100%;
  height: auto;
  display: block;
}

.ai-scan-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(0, 242, 255, 0.2), transparent);
  animation: scan 3s ease-in-out infinite;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--cyber-blue, #00f2ff), transparent);
  animation: scan-line 3s ease-in-out infinite;
}

@keyframes scan {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

@keyframes scan-line {
  0%, 100% { top: 0; }
  50% { top: 100%; }
}

.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
  
}

.float-card {
  position: absolute;
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 242, 255, 0.3);
  border-radius: 12px;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  color: var(--cyber-blue, #00f2ff);
  white-space: nowrap;
  animation: float 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-1 {
  top: 10%;
  left: -10%;
}

.card-2 {
  bottom: 20%;
  right: -15%;
  animation-delay: 1s;
}

.card-3 {
  top: 40%;
  right: -5%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.experience-badge {
  position: absolute;
  bottom: -20px;
  right: -20px;
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  border-radius: 20px;
  padding: 1rem 1.5rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 242, 255, 0.3);
}

.years {
  font-size: 2rem;
  font-weight: 800;
  color: #000;
  display: block;
  line-height: 1;
}

.years-text {
  font-size: 0.75rem;
  color: #000;
  font-weight: 500;
}

@media (max-width: 1024px) {
  .hero-container {
    flex-direction: column;
  }
  
  .hero-title {
    font-size: 2.5rem;
  }
  
  .stats-container {
    justify-content: center;
  }
  
  .float-card {
    display: none;
  }
}
</style>