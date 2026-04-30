<template>
  <div class="doctors-page">
    <section class="doctors-hero">
      <div class="hero-content">
        <h1><i class="fas fa-user-md"></i> Nossa Equipe Médica</h1>
        <p>Profissionais altamente qualificados dedicados ao seu bem-estar</p>
      </div>
    </section>

    <section class="team-stats">
      <div class="stats-container">
        <div class="stat-card">
          <div class="stat-number">50+</div>
          <div class="stat-label"><i class="fas fa-stethoscope"></i> Médicos Especialistas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">20+</div>
          <div class="stat-label"><i class="fas fa-flask"></i> Especialidades Médicas</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">15+</div>
          <div class="stat-label"><i class="fas fa-chart-line"></i> Anos de Experiência Média</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">10k+</div>
          <div class="stat-label"><i class="fas fa-heartbeat"></i> Cirurgias Realizadas</div>
        </div>
      </div>
    </section>

    <section class="doctors-grid-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-star-of-life"></i> MEET OUR EXPERTS</span>
          <h2>Médicos Especialistas</h2>
          <p>Conheça nossos profissionais dedicados a oferecer o melhor cuidado</p>
        </div>

        <div class="doctors-grid">
          <div class="doctor-card" v-for="doctor in doctors" :key="doctor.id">
            <div class="doctor-image">
              <div class="image-placeholder">
                <i :class="doctor.icon" class="doctor-icon"></i>
              </div>
              <div class="doctor-social">
                <a href="#" class="social-icon"><i class="fas fa-envelope"></i></a>
                <a href="#" class="social-icon"><i class="fab fa-linkedin"></i></a>
                <a href="#" class="social-icon"><i class="fas fa-globe"></i></a>
              </div>
            </div>
            <div class="doctor-info">
              <h3>{{ doctor.name }}</h3>
              <p class="specialty">{{ doctor.specialty }}</p>
              <div class="doctor-details">
                <span class="experience"><i class="fas fa-graduation-cap"></i> {{ doctor.experience }} anos</span>
                <span class="patients"><i class="fas fa-users"></i> {{ doctor.patients }}+ pacientes</span>
              </div>
              <div class="rating">
                <i class="fas fa-star" v-for="n in 5" :key="n" :class="{ filled: n <= Math.floor(doctor.rating) }"></i>
                <span class="rating-value">{{ doctor.rating }}</span>
              </div>
              <button class="btn-schedule" @click="scheduleAppointment(doctor)">
                <i class="fas fa-calendar-check"></i> Agendar Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="specialties">
      <div class="container">
        <div class="section-header">
          <span class="section-tag"><i class="fas fa-microscope"></i> OUR SPECIALTIES</span>
          <h2>Áreas de Especialização</h2>
        </div>
        <div class="specialties-grid">
          <div class="specialty-card" v-for="spec in specialties" :key="spec.name">
            <i :class="spec.icon" class="specialty-icon"></i>
            <h4>{{ spec.name }}</h4>
            <p>{{ spec.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <div v-if="showAppointmentModal" class="modal-overlay" @click="showAppointmentModal = false">
      <div class="appointment-modal" @click.stop>
        <div class="modal-header">
          <h3><i class="fas fa-calendar-plus"></i> Agendar Consulta</h3>
          <button class="close-btn" @click="showAppointmentModal = false"><i class="fas fa-times"></i></button>
        </div>
        <div class="modal-body">
          <div class="doctor-info-modal">
            <i :class="selectedDoctor?.icon" class="doctor-icon-modal"></i>
            <div>
              <h4>{{ selectedDoctor?.name }}</h4>
              <p>{{ selectedDoctor?.specialty }}</p>
            </div>
          </div>
          <form @submit.prevent="submitAppointment">
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input type="text" v-model="appointment.name" placeholder="Seu nome completo" required>
            </div>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="appointment.email" placeholder="Seu email" required>
            </div>
            <div class="input-group">
              <i class="fas fa-phone"></i>
              <input type="tel" v-model="appointment.phone" placeholder="Telefone" required>
            </div>
            <div class="input-group">
              <i class="fas fa-calendar"></i>
              <input type="date" v-model="appointment.date" required>
            </div>
            <div class="input-group">
              <i class="fas fa-clock"></i>
              <select v-model="appointment.time" required>
                <option value="">Selecione um horário</option>
                <option value="09:00">09:00</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>
            </div>
            <div class="input-group">
              <i class="fas fa-comment"></i>
              <textarea v-model="appointment.message" placeholder="Descreva seu problema ou sintomas..." rows="3"></textarea>
            </div>
            <button type="submit" class="btn-submit">
              <i class="fas fa-check-circle"></i> Confirmar Agendamento
            </button>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showSuccess" class="toast-success">
      <i class="fas fa-check-circle"></i> Consulta agendada com sucesso! Entraremos em contato em breve.
    </div>
  </div>
</template>

<script>
export default {
  name: 'DoctorsPage',
  data() {
    return {
      showAppointmentModal: false,
      showSuccess: false,
      selectedDoctor: null,
      appointment: {
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
      },
      doctors: [
        { id: 1, name: 'Dr. Mehdi Hasan', specialty: 'Cirurgião Cardíaco', icon: 'fas fa-heart', experience: 15, patients: 3500, rating: 4.9 },
        { id: 2, name: 'Dra. Hamida Jannat', specialty: 'Cardiologista', icon: 'fas fa-heartbeat', experience: 12, patients: 4200, rating: 4.8 },
        { id: 3, name: 'Dr. Haseeb Hossain', specialty: 'Neurologista', icon: 'fas fa-brain', experience: 10, patients: 2800, rating: 4.7 },
        { id: 4, name: 'Dr. Jeroen van der Schoot', specialty: 'Neurocirurgião', icon: 'fas fa-microscope', experience: 18, patients: 2100, rating: 4.9 },
        { id: 5, name: 'Dra. Ana Beatriz', specialty: 'Ortopedista', icon: 'fas fa-bone', experience: 8, patients: 3200, rating: 4.6 },
        { id: 6, name: 'Dr. Ricardo Mendez', specialty: 'Oncologista', icon: 'fas fa-ribbon', experience: 14, patients: 3900, rating: 4.8 },
        { id: 7, name: 'Dra. Patricia Lima', specialty: 'Pediatra', icon: 'fas fa-baby', experience: 11, patients: 5100, rating: 4.9 },
        { id: 8, name: 'Dr. Carlos Eduardo', specialty: 'Gastroenterologista', icon: 'fas fa-stethoscope', experience: 9, patients: 2900, rating: 4.7 }
      ],
      specialties: [
        { name: 'Cardiologia', icon: 'fas fa-heart', description: 'Tratamento do coração e sistema circulatório' },
        { name: 'Neurologia', icon: 'fas fa-brain', description: 'Diagnóstico e tratamento de doenças neurológicas' },
        { name: 'Ortopedia', icon: 'fas fa-bone', description: 'Cuidados com ossos, articulações e músculos' },
        { name: 'Pediatria', icon: 'fas fa-baby', description: 'Saúde infantil da infância à adolescência' },
        { name: 'Oncologia', icon: 'fas fa-ribbon', description: 'Tratamento do câncer e cuidados paliativos' },
        { name: 'Ginecologia', icon: 'fas fa-female', description: 'Saúde feminina e obstetrícia' },
        { name: 'Radiologia', icon: 'fas fa-x-ray', description: 'Diagnóstico por imagem e intervenções' },
        { name: 'Urologia', icon: 'fas fa-tint', description: 'Tratamento do sistema urinário' }
      ]
    }
  },
  methods: {
    scheduleAppointment(doctor) {
      this.selectedDoctor = doctor
      this.showAppointmentModal = true
    },
    submitAppointment() {
      setTimeout(() => {
        this.showAppointmentModal = false
        this.showSuccess = true
        this.resetForm()
        setTimeout(() => {
          this.showSuccess = false
        }, 3000)
      }, 1000)
    },
    resetForm() {
      this.appointment = {
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
.doctors-page {
  padding-top: 80px;
}

.doctors-hero {
  background: linear-gradient(135deg, rgba(0, 242, 255, 0.05), rgba(0, 255, 136, 0.02));
  padding: 4rem 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(0, 242, 255, 0.1);
}

.hero-content h1 {
  font-size: 3rem;
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.hero-content p {
  color: #888;
  font-size: 1.1rem;
}

.team-stats {
  padding: 3rem 2rem;
  background: rgba(0, 242, 255, 0.02);
}

.stats-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 242, 255, 0.3);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #888;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.doctors-grid-section {
  padding: 4rem 2rem;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-tag {
  color: var(--cyber-blue, #00f2ff);
  font-size: 0.85rem;
  letter-spacing: 2px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
}

.section-tag i {
  margin-right: 6px;
}

.section-header h2 {
  font-size: 2.5rem;
  color: #fff;
  margin-bottom: 1rem;
}

.section-header p {
  color: #888;
}

.doctors-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
}

.doctor-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.doctor-card:hover {
  transform: translateY(-10px);
  border-color: rgba(0, 242, 255, 0.3);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.doctor-image {
  position: relative;
  height: 250px;
  background: linear-gradient(135deg, rgba(0, 242, 255, 0.1), rgba(0, 255, 136, 0.05));
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, rgba(0, 242, 255, 0.2), rgba(0, 255, 136, 0.2));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(0, 242, 255, 0.3);
}

.doctor-icon {
  font-size: 4rem;
  color: var(--cyber-blue, #00f2ff);
}

.doctor-social {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.doctor-card:hover .doctor-social {
  opacity: 1;
}

.social-icon {
  width: 35px;
  height: 35px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: var(--cyber-blue, #00f2ff);
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 242, 255, 0.3);
}

.social-icon:hover {
  background: var(--cyber-blue, #00f2ff);
  color: #000;
  transform: translateY(-2px);
}

.doctor-info {
  padding: 1.5rem;
}

.doctor-info h3 {
  color: #fff;
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.specialty {
  color: var(--cyber-blue, #00f2ff);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.doctor-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.75rem;
  color: #888;
}

.doctor-details i {
  margin-right: 4px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 1rem;
}

.rating i {
  color: #ffc107;
  font-size: 0.85rem;
}

.rating i.filled {
  color: #ffc107;
}

.rating-value {
  color: #888;
  font-size: 0.8rem;
  margin-left: 6px;
}

.btn-schedule {
  width: 100%;
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  border: none;
  padding: 10px;
  border-radius: 10px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-schedule:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3);
}

.specialties {
  padding: 4rem 2rem;
  background: rgba(0, 242, 255, 0.02);
}

.specialties-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.specialty-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.specialty-card:hover {
  transform: translateY(-5px);
  background: rgba(0, 242, 255, 0.05);
  border-color: rgba(0, 242, 255, 0.3);
}

.specialty-icon {
  font-size: 2.5rem;
  color: var(--cyber-blue, #00f2ff);
  margin-bottom: 1rem;
}

.specialty-card h4 {
  color: #fff;
  margin-bottom: 0.5rem;
}

.specialty-card p {
  color: #888;
  font-size: 0.85rem;
  line-height: 1.4;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.appointment-modal {
  background: linear-gradient(135deg, #0a0a0f, #050508);
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: var(--cyber-blue, #00f2ff);
  display: flex;
  align-items: center;
  gap: 8px;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: var(--cyber-blue, #00f2ff);
  transform: rotate(90deg);
}

.doctor-info-modal {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 242, 255, 0.05);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.doctor-icon-modal {
  font-size: 2.5rem;
  color: var(--cyber-blue, #00f2ff);
}

.doctor-info-modal h4 {
  color: #fff;
}

.doctor-info-modal p {
  color: var(--cyber-blue, #00f2ff);
  font-size: 0.85rem;
}

.modal-body {
  padding: 1.5rem;
}

.input-group {
  position: relative;
  margin-bottom: 1rem;
}

.input-group i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.input-group textarea ~ i {
  top: 18px;
  transform: none;
}

.modal-body input,
.modal-body select,
.modal-body textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px 14px 10px 42px;
  color: #fff;
  font-family: inherit;
  transition: all 0.3s ease;
}

.modal-body input:focus,
.modal-body select:focus,
.modal-body textarea:focus {
  outline: none;
  border-color: var(--cyber-blue, #00f2ff);
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  border: none;
  padding: 12px;
  border-radius: 10px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3);
}

.toast-success {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: linear-gradient(135deg, var(--emerald, #00ff88), var(--cyber-blue, #00f2ff));
  color: #000;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  z-index: 2000;
  animation: slideIn 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 1200px) {
  .doctors-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .specialties-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .doctors-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  .specialties-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .doctors-grid {
    grid-template-columns: 1fr;
  }
  .stats-container {
    grid-template-columns: 1fr;
  }
  .specialties-grid {
    grid-template-columns: 1fr;
  }
  .hero-content h1 {
    font-size: 2rem;
  }
}
</style>