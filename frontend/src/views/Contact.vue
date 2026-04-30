<template>
  <div class="contact">
    <div class="contact-container">
      <h1><i class="fas fa-envelope-open-text"></i> Entre em Contato</h1>
      <p>Estamos aqui para ajudar você com suas dúvidas e agendamentos</p>
      
      <div class="contact-grid">
        <div class="contact-info">
          <div class="info-card">
            <i class="fas fa-map-marker-alt info-icon"></i>
            <h3>Endereço</h3>
            <p>Av. Paulista, 1000<br>São Paulo - SP, 01310-100</p>
          </div>
          
          <div class="info-card">
            <i class="fas fa-phone-alt info-icon"></i>
            <h3>Telefone</h3>
            <p>(11) 4000-0000<br>(11) 98765-4321</p>
          </div>
          
          <div class="info-card">
            <i class="fas fa-envelope info-icon"></i>
            <h3>Email</h3>
            <p>contato@visiomed.com.br<br>suporte@visiomed.com.br</p>
          </div>
          
          <div class="info-card">
            <i class="fas fa-clock info-icon"></i>
            <h3>Horário de Funcionamento</h3>
            <p>Segunda a Sexta: 8h às 20h<br>Sábado: 9h às 15h</p>
          </div>
        </div>
        
        <div class="contact-form">
          <h2><i class="fas fa-paper-plane"></i> Envie uma Mensagem</h2>
          <form @submit.prevent="sendMessage">
            <div class="input-group">
              <i class="fas fa-user"></i>
              <input type="text" v-model="form.name" placeholder="Seu nome" required>
            </div>
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input type="email" v-model="form.email" placeholder="Seu email" required>
            </div>
            <div class="input-group">
              <i class="fas fa-phone"></i>
              <input type="tel" v-model="form.phone" placeholder="Telefone">
            </div>
            <div class="input-group">
              <i class="fas fa-tag"></i>
              <select v-model="form.subject">
                <option value="">Assunto</option>
                <option value="consulta">Agendar Consulta</option>
                <option value="duvida">Dúvidas sobre Exames</option>
                <option value="reclamacao">Reclamação/Sugestão</option>
              </select>
            </div>
            <div class="input-group">
              <i class="fas fa-comment"></i>
              <textarea v-model="form.message" rows="5" placeholder="Sua mensagem..." required></textarea>
            </div>
            <button type="submit" class="btn-submit">
              <i class="fas fa-paper-plane"></i> Enviar Mensagem
            </button>
          </form>
          
          <div v-if="submitted" class="success-message">
            <i class="fas fa-check-circle"></i> Mensagem enviada com sucesso! Entraremos em contato em breve.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContactPage',
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      },
      submitted: false
    }
  },
  methods: {
    sendMessage() {
      this.submitted = true
      setTimeout(() => {
        this.submitted = false
        this.form = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        }
      }, 3000)
    }
  }
}
</script>

<style scoped>
.contact {
  padding: 120px 2rem 4rem;
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(0, 242, 255, 0.02), rgba(0, 255, 136, 0.01));
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-container h1 {
  font-size: 2.5rem;
  text-align: center;
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

.contact-container > p {
  text-align: center;
  color: #888;
  margin-bottom: 3rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.info-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 242, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 242, 255, 0.1);
}

.info-icon {
  font-size: 2rem;
  color: var(--cyber-blue, #00f2ff);
  margin-bottom: 1rem;
}

.info-card h3 {
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.info-card p {
  color: #aaa;
  line-height: 1.5;
  font-size: 0.9rem;
}

.contact-form {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.contact-form:hover {
  border-color: rgba(0, 242, 255, 0.2);
}

.contact-form h2 {
  color: #fff;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.contact-form h2 i {
  color: var(--cyber-blue, #00f2ff);
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
  font-size: 1rem;
  pointer-events: none;
}

.input-group textarea ~ i {
  top: 20px;
  transform: none;
}

.contact-form input,
.contact-form select,
.contact-form textarea {
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 12px 16px 12px 42px;
  color: #fff;
  font-family: inherit;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.contact-form textarea {
  padding-top: 12px;
}

.contact-form input:focus,
.contact-form select:focus,
.contact-form textarea:focus {
  outline: none;
  border-color: var(--cyber-blue, #00f2ff);
  box-shadow: 0 0 0 2px rgba(0, 242, 255, 0.1);
}

.contact-form input::placeholder,
.contact-form textarea::placeholder {
  color: #666;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  border: none;
  padding: 12px;
  border-radius: 12px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1rem;
}

.btn-submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 242, 255, 0.3);
}

.success-message {
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid var(--emerald, #00ff88);
  border-radius: 12px;
  color: var(--emerald, #00ff88);
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: fadeInUp 0.5s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .contact-info {
    grid-template-columns: 1fr;
  }
  
  .contact-container h1 {
    font-size: 1.8rem;
  }
}
</style>