<template>
    <div class="dashboard">
        <div class="dashboard-header">
            <h1><i class="fas fa-chart-line"></i> Dashboard de Radiologia IA</h1>
            <p><i class="fas fa-microchip"></i> Análise avançada de exames com inteligência artificial</p>
        </div>
        
        <div class="dashboard-stats">
            <div class="stat-card" v-for="stat in dashboardStats" :key="stat.label">
                <i :class="stat.icon" class="stat-icon"></i>
                <div class="stat-info">
                    <h3>{{ stat.value }}</h3>
                    <p>{{ stat.label }}</p>
                </div>
            </div>
        </div>
        
        <div class="dashboard-grid">
            <div class="ai-predictor-wrapper">
                <AIPredictor @exam-analyzed="addNewExam" />
            </div>
            <div class="recent-exams">
                <h3><i class="fas fa-history"></i> Exames Recentes</h3>
                <div class="exam-list">
                    <div v-if="recentExams.length === 0" class="no-exams">
                        <i class="fas fa-folder-open"></i>
                        <p>Nenhum exame encontrado</p>
                        <span>Adicione um exame no painel ao lado</span>
                    </div>
                    <div class="exam-item" v-for="exam in recentExams" :key="exam.id" @click="viewExamDetails(exam)">
                        <div class="exam-info">
                            <span class="exam-name">{{ exam.name }}</span>
                            <span class="exam-date"><i class="fas fa-calendar-alt"></i> {{ formatDate(exam.date) }}</span>
                            <span v-if="exam.status === 'completed' && exam.analysis" class="exam-findings">
                                <i class="fas fa-stethoscope"></i> {{ exam.analysis.primaryFindings.substring(0, 60) }}...
                            </span>
                        </div>
                        <span class="exam-status" :class="exam.status">
                            <i :class="statusIcon(exam.status)"></i> {{ statusText(exam.status) }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Detalhes do Exame -->
        <div v-if="selectedExam" class="modal" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-file-medical"></i> {{ selectedExam.name }}</h2>
                    <button class="close-btn" @click="closeModal">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="exam-details">
                        <div class="detail-group">
                            <label><i class="fas fa-calendar"></i> Data do Exame:</label>
                            <span>{{ formatDate(selectedExam.date) }}</span>
                        </div>
                        <div class="detail-group">
                            <label><i class="fas fa-chart-line"></i> Status:</label>
                            <span class="status-badge" :class="selectedExam.status">
                                {{ statusText(selectedExam.status) }}
                            </span>
                        </div>
                    </div>

                    <!-- Dados do Paciente -->
                    <div v-if="selectedExam.patientData" class="analysis-section">
                        <h3><i class="fas fa-user-circle"></i> Dados do Paciente</h3>
                        <div class="patient-details-card">
                            <div class="patient-detail-row">
                                <div class="patient-detail-item">
                                    <span class="detail-label"><i class="fas fa-user"></i> Nome:</span>
                                    <span class="detail-value">{{ selectedExam.patientData.name }}</span>
                                </div>
                                <div class="patient-detail-item">
                                    <span class="detail-label"><i class="fas fa-calendar-alt"></i> Idade:</span>
                                    <span class="detail-value">{{ selectedExam.patientData.age }} anos</span>
                                </div>
                            </div>
                            <div class="patient-detail-row">
                                <div class="patient-detail-item">
                                    <span class="detail-label"><i class="fas fa-stethoscope"></i> Tipo de Exame:</span>
                                    <span class="detail-value">{{ selectedExam.patientData.examType }}</span>
                                </div>
                                <div class="patient-detail-item">
                                    <span class="detail-label"><i class="fas fa-id-card"></i> CPF:</span>
                                    <span class="detail-value">{{ selectedExam.patientData.cpf || 'Não informado' }}</span>
                                </div>
                            </div>
                            <div class="patient-detail-row">
                                <div class="patient-detail-item">
                                    <span class="detail-label"><i class="fas fa-phone"></i> Telefone:</span>
                                    <span class="detail-value">{{ selectedExam.patientData.phone || 'Não informado' }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="selectedExam.analysis" class="analysis-section">
                        <h3><i class="fas fa-brain"></i> Análise Detalhada da IA</h3>
                        
                        <div class="analysis-card">
                            <div class="analysis-header">
                                <i class="fas fa-microscope"></i>
                                <h4>Hallazgos Principales</h4>
                            </div>
                            <p>{{ selectedExam.analysis.primaryFindings }}</p>
                        </div>

                        <div class="analysis-card">
                            <div class="analysis-header">
                                <i class="fas fa-list-ul"></i>
                                <h4>Detalhes da Análise</h4>
                            </div>
                            <ul class="findings-list">
                                <li v-for="(detail, index) in selectedExam.analysis.details" :key="index">
                                    <i class="fas fa-check-circle"></i> {{ detail }}
                                </li>
                            </ul>
                        </div>

                        <div class="analysis-card">
                            <div class="analysis-header">
                                <i class="fas fa-chart-bar"></i>
                                <h4>Métricas e Confiança</h4>
                            </div>
                            <div class="metrics-grid">
                                <div class="metric">
                                    <span class="metric-label">Precisão da Análise:</span>
                                    <div class="progress-bar">
                                        <div class="progress-fill" :style="{width: selectedExam.analysis.confidence + '%'}"></div>
                                    </div>
                                    <span class="metric-value">{{ selectedExam.analysis.confidence }}%</span>
                                </div>
                                <div class="metric">
                                    <span class="metric-label">Severidade:</span>
                                    <span class="severity-badge" :class="selectedExam.analysis.severity.toLowerCase()">
                                        {{ selectedExam.analysis.severity }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="analysis-card">
                            <div class="analysis-header">
                                <i class="fas fa-stethoscope"></i>
                                <h4>Recomendações Clínicas</h4>
                            </div>
                            <ul class="recommendations-list">
                                <li v-for="(rec, index) in selectedExam.analysis.recommendations" :key="index">
                                    <i class="fas fa-arrow-right"></i> {{ rec }}
                                </li>
                            </ul>
                        </div>

                        <div class="analysis-card" v-if="selectedExam.analysis.technicalParams">
                            <div class="analysis-header">
                                <i class="fas fa-chart-line"></i>
                                <h4>Parâmetros Técnicos</h4>
                            </div>
                            <div class="technical-params">
                                <div class="param">
                                    <span class="param-label">Qualidade da Imagem:</span>
                                    <span class="param-value">{{ selectedExam.analysis.technicalParams.imageQuality }}</span>
                                </div>
                                <div class="param">
                                    <span class="param-label">Ruído Detectado:</span>
                                    <span class="param-value">{{ selectedExam.analysis.technicalParams.noiseLevel }}</span>
                                </div>
                                <div class="param">
                                    <span class="param-label">Resolução:</span>
                                    <span class="param-value">{{ selectedExam.analysis.technicalParams.resolution }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="selectedExam.status === 'analyzing'" class="no-analysis">
                        <i class="fas fa-spinner fa-pulse"></i>
                        <p>Análise em andamento...</p>
                    </div>

                    <div v-else-if="selectedExam.status === 'pending'" class="no-analysis">
                        <i class="fas fa-clock"></i>
                        <p>Exame aguardando análise</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AIPredictor from '../components/AIPredictor.vue'

export default {
    name: 'Dashboard',
    components: { AIPredictor },
    data() {
        return {
            selectedExam: null,
            recentExams: [], // Array para armazenar os exames
            // Valores iniciais das estatísticas
            statsData: {
                totalExams: 0,
                aiAnalyses: 0,
                criticalCases: 0,
                aiAccuracy: 98 // Mantém a precisão fixa em 98%
            }
        }
    },
    computed: {
        dashboardStats() {
            return [
                { icon: 'fas fa-chart-simple', value: this.statsData.totalExams.toLocaleString(), label: 'Total de Exames' },
                { icon: 'fas fa-brain', value: this.statsData.aiAnalyses.toLocaleString(), label: 'Análises com IA' },
                { icon: 'fas fa-exclamation-triangle', value: this.statsData.criticalCases.toLocaleString(), label: 'Casos Críticos' },
                { icon: 'fas fa-bullseye', value: `${this.statsData.aiAccuracy}%`, label: 'Precisão da IA' }
            ]
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return 'Data não informada'
            return new Date(date).toLocaleDateString('pt-BR')
        },
        
        statusIcon(status) {
            const icons = {
                completed: 'fas fa-check-circle',
                analyzing: 'fas fa-spinner fa-pulse',
                pending: 'fas fa-clock'
            }
            return icons[status] || 'fas fa-circle'
        },
        
        statusText(status) {
            const texts = {
                completed: 'Concluído',
                analyzing: 'Analisando',
                pending: 'Pendente'
            }
            return texts[status] || status
        },
        
        addNewExam(examData) {
            console.log('Novo exame recebido:', examData)
            
            // Adicionar o novo exame no início da lista
            this.recentExams.unshift(examData)
            
            // Atualizar estatísticas baseado nos exames reais
            this.updateStatistics()
            
            // Salvar no localStorage para persistência
            this.saveToLocalStorage()
            
            // Feedback visual
            this.showNotification(`Exame de ${examData.patientData.name} adicionado com sucesso!`)
        },
        
        updateStatistics() {
            // Atualiza o total de exames
            this.statsData.totalExams = this.recentExams.length
            
            // Atualiza análises com IA (exames concluídos)
            this.statsData.aiAnalyses = this.recentExams.filter(e => e.status === 'completed').length
            
            // Atualiza casos críticos (severidade Alta)
            this.statsData.criticalCases = this.recentExams.filter(e => 
                e.analysis && e.analysis.severity === 'Alto'
            ).length
        },
        
        viewExamDetails(exam) {
            this.selectedExam = exam
        },
        
        closeModal() {
            this.selectedExam = null
        },
        
        saveToLocalStorage() {
            localStorage.setItem('recentExams', JSON.stringify(this.recentExams))
            localStorage.setItem('statsData', JSON.stringify(this.statsData))
        },
        
        loadFromLocalStorage() {
            const savedExams = localStorage.getItem('recentExams')
            const savedStats = localStorage.getItem('statsData')
            
            if (savedExams) {
                this.recentExams = JSON.parse(savedExams)
            }
            
            if (savedStats) {
                this.statsData = JSON.parse(savedStats)
            } else {
                // Se não tem estatísticas salvas, calcula baseado nos exames
                this.updateStatistics()
            }
            
            console.log('Exames carregados:', this.recentExams.length)
        },
        
        showNotification(message) {
            // Criar notificação temporária
            const notification = document.createElement('div')
            notification.className = 'notification'
            notification.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`
            document.body.appendChild(notification)
            
            setTimeout(() => {
                notification.remove()
            }, 3000)
        }
    },
    mounted() {
        // Carregar exames salvos ao iniciar
        this.loadFromLocalStorage()
    }
}
</script>

<style scoped>
.dashboard {
    padding: 120px 2rem 4rem;
    max-width: 1400px;
    margin: 0 auto;
}

.dashboard-header {
    text-align: center;
    margin-bottom: 3rem;
}

.dashboard-header h1 {
    font-size: 2.5rem;
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

.dashboard-header p {
    color: #888;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.dashboard-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
    margin-bottom: 3rem;
}

.stat-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 242, 255, 0.3);
    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.1);
}

.stat-icon {
    font-size: 2.5rem;
    color: var(--cyber-blue, #00f2ff);
}

.stat-info h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.25rem;
}

.stat-info p {
    color: #888;
    font-size: 0.9rem;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 2rem;
}

.ai-predictor-wrapper {
    min-width: 0;
}

.recent-exams {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.recent-exams h3 {
    color: #fff;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.recent-exams h3 i {
    color: var(--cyber-blue, #00f2ff);
}

.exam-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-height: 600px;
    overflow-y: auto;
}

.no-exams {
    text-align: center;
    padding: 3rem 1rem;
    color: #666;
}

.no-exams i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #444;
}

.no-exams p {
    margin-bottom: 0.5rem;
    color: #888;
}

.no-exams span {
    font-size: 0.8rem;
}

.exam-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    transition: all 0.3s ease;
    border-left: 2px solid transparent;
    cursor: pointer;
}

.exam-item:hover {
    background: rgba(0, 242, 255, 0.05);
    border-left-color: var(--cyber-blue, #00f2ff);
    transform: translateX(5px);
}

.exam-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
}

.exam-name {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
}

.exam-date {
    color: #666;
    font-size: 0.75rem;
    display: flex;
    align-items: center;
    gap: 4px;
}

.exam-findings {
    color: var(--cyber-blue, #00f2ff);
    font-size: 0.7rem;
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.exam-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
}

.exam-status.completed {
    background: rgba(0, 255, 136, 0.15);
    color: var(--emerald, #00ff88);
    border: 1px solid rgba(0, 255, 136, 0.3);
}

.exam-status.analyzing {
    background: rgba(0, 242, 255, 0.15);
    color: var(--cyber-blue, #00f2ff);
    border: 1px solid rgba(0, 242, 255, 0.3);
}

.exam-status.pending {
    background: rgba(255, 165, 0, 0.15);
    color: #ffa500;
    border: 1px solid rgba(255, 165, 0, 0.3);
}

/* Modal Styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: linear-gradient(135deg, rgba(20, 20, 30, 0.95), rgba(10, 10, 15, 0.95));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(0, 242, 255, 0.2);
    border-radius: 20px;
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
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
    margin: 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.close-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 2rem;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
}

.close-btn:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.1);
}

.modal-body {
    padding: 1.5rem;
}

.exam-details {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
}

.detail-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-group label {
    color: #888;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 6px;
}

.detail-group span {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
}

.analysis-section h3 {
    color: #fff;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.patient-details-card {
    background: rgba(0, 242, 255, 0.05);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.patient-detail-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.patient-detail-row:last-child {
    margin-bottom: 0;
}

.patient-detail-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.detail-label {
    color: #888;
    font-size: 0.75rem;
}

.detail-value {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
}

.analysis-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.analysis-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 0.75rem;
    color: var(--cyber-blue, #00f2ff);
}

.analysis-header h4 {
    margin: 0;
    color: #fff;
}

.findings-list, .recommendations-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.findings-list li, .recommendations-list li {
    padding: 0.5rem 0;
    color: #ccc;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.findings-list li:last-child, .recommendations-list li:last-child {
    border-bottom: none;
}

.findings-list li i, .recommendations-list li i {
    color: var(--emerald, #00ff88);
    font-size: 0.8rem;
}

.metrics-grid {
    display: grid;
    gap: 1rem;
}

.metric {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.metric-label {
    color: #888;
    font-size: 0.8rem;
}

.progress-bar {
    background: rgba(255, 255, 255, 0.1);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
}

.progress-fill {
    background: linear-gradient(90deg, var(--cyber-blue), var(--emerald));
    height: 100%;
    border-radius: 4px;
    transition: width 0.3s ease;
}

.metric-value {
    color: var(--emerald);
    font-size: 0.8rem;
    font-weight: bold;
}

.severity-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
}

.severity-badge.alto {
    background: rgba(255, 0, 0, 0.2);
    color: #ff4444;
    border: 1px solid rgba(255, 0, 0, 0.3);
}

.severity-badge.moderado {
    background: rgba(255, 165, 0, 0.2);
    color: #ffa500;
    border: 1px solid rgba(255, 165, 0, 0.3);
}

.severity-badge.baixo {
    background: rgba(0, 255, 136, 0.2);
    color: #00ff88;
    border: 1px solid rgba(0, 255, 136, 0.3);
}

.technical-params {
    display: grid;
    gap: 0.5rem;
}

.param {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.param-label {
    color: #888;
    font-size: 0.8rem;
}

.param-value {
    color: #fff;
    font-size: 0.8rem;
    font-weight: 500;
}

.no-analysis {
    text-align: center;
    padding: 3rem;
    color: #888;
}

.no-analysis i {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: var(--cyber-blue);
}

/* Notification */
.notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, var(--cyber-blue), var(--emerald));
    color: #000;
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-weight: bold;
    z-index: 2000;
    animation: slideInRight 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

@keyframes slideInRight {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from { transform: translateY(50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}

@media (max-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .dashboard {
        padding: 100px 1rem 2rem;
    }
    
    .dashboard-stats {
        grid-template-columns: 1fr;
    }
    
    .dashboard-header h1 {
        font-size: 1.8rem;
    }
    
    .modal-content {
        width: 95%;
        margin: 1rem;
    }
    
    .exam-details {
        grid-template-columns: 1fr;
    }
    
    .patient-detail-row {
        grid-template-columns: 1fr;
        gap: 0.5rem;
    }
}
</style>