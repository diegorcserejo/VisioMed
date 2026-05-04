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
                <AIPredictor @exam-analyzed="handleExamAnalysis" />
            </div>
            <div class="recent-exams">
                <h3><i class="fas fa-history"></i> Exames Recentes</h3>
                <div class="exam-list">
                    <div class="exam-item" v-for="exam in recentExams" :key="exam.id" @click="viewExamDetails(exam)">
                        <div class="exam-info">
                            <span class="exam-name">{{ exam.name }}</span>
                            <span class="exam-date"><i class="fas fa-calendar-alt"></i> {{ exam.date }}</span>
                            <span v-if="exam.analysis" class="exam-findings">
                                <i class="fas fa-stethoscope"></i> {{ exam.analysis.primaryFindings }}
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
                            <span>{{ selectedExam.date }}</span>
                        </div>
                        <div class="detail-group">
                            <label><i class="fas fa-chart-line"></i> Status:</label>
                            <span class="status-badge" :class="selectedExam.status">
                                {{ statusText(selectedExam.status) }}
                            </span>
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

                        <div class="analysis-card">
                            <div class="analysis-header">
                                <i class="fas fa-chart-line"></i>
                                <h4>Parâmetros Técnicos</h4>
                            </div>
                            <div class="technical-params">
                                <div class="param" v-if="selectedExam.analysis.technicalParams">
                                    <span class="param-label">Qualidade da Imagem:</span>
                                    <span class="param-value">{{ selectedExam.analysis.technicalParams.imageQuality }}</span>
                                </div>
                                <div class="param" v-if="selectedExam.analysis.technicalParams">
                                    <span class="param-label">Ruído Detectado:</span>
                                    <span class="param-value">{{ selectedExam.analysis.technicalParams.noiseLevel }}</span>
                                </div>
                                <div class="param" v-if="selectedExam.analysis.technicalParams">
                                    <span class="param-label">Resolução:</span>
                                    <span class="param-value">{{ selectedExam.analysis.technicalParams.resolution }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else class="no-analysis">
                        <i class="fas fa-spinner fa-pulse"></i>
                        <p>Análise em andamento ou não disponível para este exame.</p>
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
            dashboardStats: [
                { icon: 'fas fa-chart-simple', value: '247', label: 'Total de Exames' },
                { icon: 'fas fa-brain', value: '189', label: 'Análises com IA' },
                { icon: 'fas fa-exclamation-triangle', value: '12', label: 'Casos Críticos' },
                { icon: 'fas fa-bullseye', value: '94%', label: 'Precisão da IA' }
            ],
            recentExams: [
                { 
                    id: 1, 
                    name: 'Raio-X Torácico - Maria Silva', 
                    date: '2024-01-15', 
                    status: 'completed',
                    analysis: {
                        primaryFindings: 'Nódulo pulmonar suspeito no lobo superior direito, medindo 1.2cm.',
                        details: [
                            'Massa com bordas espiculadas detectada',
                            'Presença de microcalcificações',
                            'Aumento da densidade tecidual na região',
                            'Sem adenopatias significativas visíveis'
                        ],
                        confidence: 92,
                        severity: 'Moderado',
                        recommendations: [
                            'Realizar tomografia computadorizada de tórax com contraste',
                            'Avaliação com pneumologista em até 7 dias',
                            'Considerar biópsia guiada por imagem',
                            'Acompanhamento radiológico em 3 meses'
                        ],
                        technicalParams: {
                            imageQuality: 'Boa',
                            noiseLevel: 'Baixo',
                            resolution: '300 DPI'
                        }
                    }
                },
                { 
                    id: 2, 
                    name: 'Tomografia - João Santos', 
                    date: '2024-01-14', 
                    status: 'analyzing',
                    analysis: null
                },
                { 
                    id: 3, 
                    name: 'Ressonância - Ana Oliveira', 
                    date: '2024-01-13', 
                    status: 'pending',
                    analysis: null
                },
                { 
                    id: 4, 
                    name: 'Mamografia - Carla Souza', 
                    date: '2024-01-12', 
                    status: 'completed',
                    analysis: {
                        primaryFindings: 'Microcalcificações agrupadas em padrão linear no quadrante súpero-lateral da mama direita.',
                        details: [
                            'Grupo de 5-6 microcalcificações com morfologia suspeita',
                            'Distribuição linear sugerindo ductal',
                            'Parênquima mamário denso',
                            'Sem nódulo associado evidente'
                        ],
                        confidence: 88,
                        severity: 'Alto',
                        recommendations: [
                            'Realizar core biopsy com estereotaxia',
                            'Complementar com ultrassom focalizado',
                            'Avaliação com mastologista em até 5 dias',
                            'Marcação pré-cirúrgica recomendada'
                        ],
                        technicalParams: {
                            imageQuality: 'Ótima',
                            noiseLevel: 'Mínimo',
                            resolution: '400 DPI'
                        }
                    }
                },
                { 
                    id: 5, 
                    name: 'Ultrassom - Roberto Lima', 
                    date: '2024-01-11', 
                    status: 'completed',
                    analysis: {
                        primaryFindings: 'Nódulo hepático hipoecogênico de contornos regulares, medindo 2.5cm.',
                        details: [
                            'Lesão sólida com ecotextura homogênea',
                            'Reforço acústico posterior ausente',
                            'Vascularização periférica ao Doppler',
                            'Fígado de dimensões normais'
                        ],
                        confidence: 95,
                        severity: 'Baixo',
                        recommendations: [
                            'Controle ultrassonográfico em 6 meses',
                            'Realizar TC ou RM para caracterização',
                            'Dosagem de marcadores tumorais'
                        ],
                        technicalParams: {
                            imageQuality: 'Excelente',
                            noiseLevel: 'Muito Baixo',
                            resolution: '250 DPI'
                        }
                    }
                },
                { 
                    id: 6, 
                    name: 'TC Abdômen - Fernanda Costa', 
                    date: '2024-01-10', 
                    status: 'analyzing',
                    analysis: null
                },
                { 
                    id: 7, 
                    name: 'RM Coluna - Paulo Mendes', 
                    date: '2024-01-09', 
                    status: 'completed',
                    analysis: {
                        primaryFindings: 'Hérnia de disco lombar em L4-L5 com compressão radicular.',
                        details: [
                            'Protrusão discal paramediana direita',
                            'Compressão da raiz nervosa L5',
                            'Estreitamento do canal vertebral moderado',
                            'Sinais de degeneração discal associada'
                        ],
                        confidence: 91,
                        severity: 'Moderado',
                        recommendations: [
                            'Fisioterapia especializada',
                            'Avaliação neurocirúrgica para considerar tratamento',
                            'Ressonância de controle em 3 meses se sintomas persistirem'
                        ],
                        technicalParams: {
                            imageQuality: 'Boa',
                            noiseLevel: 'Baixo',
                            resolution: '512x512'
                        }
                    }
                },
                { 
                    id: 8, 
                    name: 'Raio-X Joelho - Luciana Rocha', 
                    date: '2024-01-08', 
                    status: 'pending',
                    analysis: null
                },
                { 
                    id: 9, 
                    name: 'Densitometria - Mariana Dias', 
                    date: '2024-01-07', 
                    status: 'completed',
                    analysis: {
                        primaryFindings: 'Osteopenia moderada em coluna lombar e fêmur proximal.',
                        details: [
                            'T-score: -1.8 em L1-L4',
                            'T-score: -1.6 em colo femoral',
                            'Z-score dentro do esperado para idade',
                            'Risco de fratura moderadamente aumentado'
                        ],
                        confidence: 96,
                        severity: 'Moderado',
                        recommendations: [
                            'Suplementação de cálcio (1200mg/dia)',
                            'Vitamina D (2000UI/dia)',
                            'Exercícios com impacto controlado',
                            'Reavaliação em 1 ano'
                        ],
                        technicalParams: {
                            imageQuality: 'Ótima',
                            noiseLevel: 'Mínimo',
                            resolution: 'Alta resolução'
                        }
                    }
                }
            ]
        }
    },
    methods: {
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
        viewExamDetails(exam) {
            this.selectedExam = exam
        },
        closeModal() {
            this.selectedExam = null
        },
        handleExamAnalysis(analysisData) {
            // Método para receber análises do componente AIPredictor
            console.log('Nova análise recebida:', analysisData)
            // Atualizar exames recentes com a nova análise
            const examIndex = this.recentExams.findIndex(e => e.id === analysisData.examId)
            if (examIndex !== -1) {
                this.recentExams[examIndex].analysis = analysisData.analysis
                this.recentExams[examIndex].status = 'completed'
            }
        }
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
}
</style>