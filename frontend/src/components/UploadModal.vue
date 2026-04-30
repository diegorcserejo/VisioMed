<template>
  <div v-if="isVisible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2><i class="fas fa-cloud-upload-alt"></i> Novo Exame</h2>
        <button class="close-btn" @click="closeModal"><i class="fas fa-times"></i></button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label><i class="fas fa-user"></i> Paciente</label>
          <select v-model="form.patientId" class="form-input">
            <option value="">Selecione um paciente</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} - {{ patient.cpf }}
            </option>
          </select>
        </div>
        
        <div class="form-group">
          <label><i class="fas fa-microscope"></i> Tipo de Exame</label>
          <div class="exam-types">
            <button 
              v-for="type in examTypes" 
              :key="type.value"
              :class="['exam-type-btn', { active: form.examType === type.value }]"
              @click="form.examType = type.value"
            >
              <i :class="type.icon" class="exam-icon"></i>
              <span>{{ type.label }}</span>
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label><i class="fas fa-image"></i> Imagem do Exame</label>
          <div 
            class="upload-area"
            :class="{ 'drag-over': isDragOver, 'has-file': uploadedImage }"
            @dragover.prevent="isDragOver = true"
            @dragleave.prevent="isDragOver = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input 
              type="file" 
              ref="fileInput" 
              @change="handleFileSelect" 
              accept="image/*"
              hidden
            />
            
            <div v-if="!uploadedImage" class="upload-placeholder">
              <i class="fas fa-cloud-upload-alt upload-icon"></i>
              <p>Arraste e solte uma imagem aqui</p>
              <span>ou clique para selecionar</span>
              <small><i class="fas fa-info-circle"></i> Suporta PNG, JPG, JPEG até 10MB</small>
            </div>
            
            <div v-else class="upload-preview">
              <img :src="uploadedImage" alt="Preview">
              <button class="remove-image" @click.stop="removeImage"><i class="fas fa-trash"></i></button>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label><i class="fas fa-notes-medical"></i> Observações (opcional)</label>
          <textarea 
            v-model="form.notes" 
            rows="3" 
            class="form-input"
            placeholder="Adicione observações clínicas relevantes..."
          ></textarea>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn-cancel" @click="closeModal">
          <i class="fas fa-times"></i> Cancelar
        </button>
        <button 
          class="btn-upload" 
          @click="uploadExam" 
          :disabled="!canUpload"
          :class="{ loading: isUploading }"
        >
          <span v-if="!isUploading"><i class="fas fa-rocket"></i> Enviar para Análise IA</span>
          <span v-else><i class="fas fa-spinner fa-spin"></i> Processando...</span>
        </button>
      </div>
      
      <div v-if="isUploading" class="progress-modal">
        <div class="progress-content">
          <div class="spinner"></div>
          <h3><i class="fas fa-microchip"></i> Analisando imagem com IA</h3>
          <p>{{ progressMessage }}</p>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'upload-success'],
  data() {
    return {
      patients: [
        { id: 1, name: 'Maria Silva', cpf: '123.456.789-00' },
        { id: 2, name: 'João Santos', cpf: '987.654.321-00' },
        { id: 3, name: 'Ana Oliveira', cpf: '456.789.123-00' }
      ],
      examTypes: [
        { value: 'xray', label: 'Raio-X', icon: 'fas fa-lungs' },
        { value: 'ct', label: 'Tomografia', icon: 'fas fa-brain' },
        { value: 'mri', label: 'Ressonância', icon: 'fas fa-heartbeat' },
        { value: 'ultrasound', label: 'Ultrassom', icon: 'fas fa-baby' }
      ],
      form: {
        patientId: '',
        examType: 'xray',
        notes: ''
      },
      uploadedImage: null,
      uploadedFile: null,
      isDragOver: false,
      isUploading: false,
      progress: 0,
      progressMessage: 'Preparando imagem...'
    }
  },
  computed: {
    canUpload() {
      return this.form.patientId && this.form.examType && this.uploadedFile && !this.isUploading
    }
  },
  methods: {
    closeModal() {
      if (!this.isUploading) {
        this.resetForm()
        this.$emit('close')
      }
    },
    triggerFileInput() {
      this.$refs.fileInput.click()
    },
    handleFileSelect(e) {
      const file = e.target.files[0]
      if (file) {
        this.processFile(file)
      }
    },
    handleDrop(e) {
      this.isDragOver = false
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        this.processFile(file)
      }
    },
    processFile(file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Arquivo muito grande! Máximo 10MB.')
        return
      }
      
      this.uploadedFile = file
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImage = e.target.result
      }
      reader.readAsDataURL(file)
    },
    removeImage() {
      this.uploadedImage = null
      this.uploadedFile = null
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = ''
      }
    },
    async uploadExam() {
      if (!this.canUpload) return
      
      this.isUploading = true
      this.progress = 0
      
      const steps = [
        { progress: 20, message: 'Carregando imagem...' },
        { progress: 40, message: 'Pré-processando imagem...' },
        { progress: 60, message: 'IA analisando padrões...' },
        { progress: 80, message: 'Detectando anomalias...' },
        { progress: 100, message: 'Gerando laudo...' }
      ]
      
      for (const step of steps) {
        await this.delay(800)
        this.progress = step.progress
        this.progressMessage = step.message
      }
      
      const aiResult = {
        examId: Date.now(),
        patientName: this.patients.find(p => p.id === this.form.patientId)?.name,
        examType: this.examTypes.find(t => t.value === this.form.examType)?.label,
        diagnosis: this.getRandomDiagnosis(),
        confidence: Math.floor(Math.random() * 20) + 75,
        detections: [
          { label: 'Nódulo', confidence: 0.92, severity: 'high' },
          { label: 'Calcificação', confidence: 0.78, severity: 'medium' }
        ],
        recommendations: 'Recomenda-se tomografia contrastada para avaliação detalhada'
      }
      
      this.isUploading = false
      this.$emit('upload-success', aiResult)
      this.closeModal()
    },
    getRandomDiagnosis() {
      const diagnoses = [
        'Presença de nódulo pulmonar com características suspeitas',
        'Calcificações benignas observadas na região mamária',
        'Sinais de pneumonia na região inferior do pulmão direito',
        'Espessamento das vias aéreas - sugestivo de bronquite',
        'Derrame pleural identificado - necessidade de acompanhamento'
      ]
      return diagnoses[Math.floor(Math.random() * diagnoses.length)]
    },
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    resetForm() {
      this.form = {
        patientId: '',
        examType: 'xray',
        notes: ''
      }
      this.uploadedImage = null
      this.uploadedFile = null
      this.progress = 0
      this.isUploading = false
    }
  },
  watch: {
    isVisible(newVal) {
      if (!newVal) {
        this.resetForm()
      }
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: linear-gradient(135deg, #0a0a0f, #050508);
  border: 1px solid rgba(0, 242, 255, 0.2);
  border-radius: 24px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-header h2 i {
  color: var(--cyber-blue, #00f2ff);
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: var(--cyber-blue, #00f2ff);
  transform: rotate(90deg);
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  color: var(--cyber-blue, #00f2ff);
  margin-bottom: 0.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 10px 14px;
  color: #fff;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--cyber-blue, #00f2ff);
  box-shadow: 0 0 0 2px rgba(0, 242, 255, 0.1);
}

select.form-input option {
  background: #0a0a0f;
}

.exam-types {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.exam-type-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.exam-type-btn:hover {
  background: rgba(0, 242, 255, 0.1);
  border-color: rgba(0, 242, 255, 0.3);
  transform: translateY(-2px);
}

.exam-type-btn.active {
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  border-color: transparent;
  color: #000;
}

.exam-type-btn.active .exam-icon {
  color: #000;
}

.exam-type-btn.active span {
  color: #000;
}

.exam-icon {
  font-size: 1.5rem;
  color: var(--cyber-blue, #00f2ff);
}

.exam-type-btn span:last-child {
  font-size: 0.8rem;
  color: #ccc;
}

.upload-area {
  border: 2px dashed rgba(0, 242, 255, 0.3);
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area.drag-over {
  border-color: var(--cyber-blue, #00f2ff);
  background: rgba(0, 242, 255, 0.08);
  transform: scale(1.02);
}

.upload-area.has-file {
  padding: 0;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  font-size: 3rem;
  color: var(--cyber-blue, #00f2ff);
  margin-bottom: 0.5rem;
}

.upload-placeholder p {
  color: #fff;
  margin-bottom: 0.25rem;
}

.upload-placeholder span {
  color: #888;
  font-size: 0.85rem;
}

.upload-placeholder small {
  display: block;
  color: #666;
  margin-top: 0.5rem;
  font-size: 0.75rem;
}

.upload-preview {
  position: relative;
  width: 100%;
}

.upload-preview img {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  border-radius: 14px;
}

.remove-image {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: #ff0066;
  transform: scale(1.1);
}

.modal-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-cancel, .btn-upload {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.btn-upload {
  background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  border: none;
  color: #000;
}

.btn-upload:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 242, 255, 0.3);
}

.btn-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-upload.loading {
  opacity: 0.8;
}

.progress-modal {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.progress-content {
  text-align: center;
  padding: 2rem;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 3px solid rgba(0, 242, 255, 0.2);
  border-top-color: var(--cyber-blue, #00f2ff);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-content h3 {
  color: var(--cyber-blue, #00f2ff);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-content p {
  color: #888;
  margin-bottom: 1rem;
}

.progress-bar {
  width: 300px;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
  transition: width 0.5s ease;
}

textarea.form-input {
  resize: vertical;
  font-family: inherit;
}

@media (max-width: 600px) {
  .exam-types {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .progress-bar {
    width: 200px;
  }
}
</style>