<template>
    <div class="ai-predictor">
        <h3><i class="fas fa-brain"></i> Análise com IA</h3>
        
        <!-- Formulário de Dados do Paciente -->
        <div class="patient-form" v-if="!analyzing && !result">
            <h4><i class="fas fa-user-md"></i> Dados do Paciente</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Nome Completo:</label>
                    <input type="text" v-model="patientData.name" placeholder="Ex: Maria da Silva Santos">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-calendar-alt"></i> Data do Exame:</label>
                    <input type="date" v-model="patientData.examDate">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-stethoscope"></i> Tipo de Exame:</label>
                    <select v-model="patientData.examType">
                        <option value="">Selecione...</option>
                        <option value="Raio-X Torácico">Raio-X Torácico</option>
                        <option value="Tomografia Computadorizada">Tomografia Computadorizada</option>
                        <option value="Ressonância Magnética">Ressonância Magnética</option>
                        <option value="Mamografia">Mamografia</option>
                        <option value="Ultrassom">Ultrassom</option>
                        <option value="Densitometria Óssea">Densitometria Óssea</option>
                        <option value="Ecocardiograma">Ecocardiograma</option>
                    </select>
                </div>
                <div class="form-group">
                    <label><i class="fas fa-venus-mars"></i> Idade:</label>
                    <input type="number" v-model="patientData.age" placeholder="Ex: 45">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-id-card"></i> CPF:</label>
                    <input type="text" v-model="patientData.cpf" placeholder="123.456.789-00">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-phone"></i> Telefone:</label>
                    <input type="text" v-model="patientData.phone" placeholder="(11) 99999-9999">
                </div>
            </div>
        </div>

        <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop" :class="{ 'upload-disabled': analyzing || result }">
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*" hidden>
            <i class="fas fa-cloud-upload-alt upload-icon"></i>
            <p>Arraste ou clique para enviar exame</p>
            <span class="upload-hint"><i class="fas fa-info-circle"></i> Suporta DICOM, PNG, JPG</span>
        </div>
        
        <div v-if="analyzing" class="analyzing">
            <div class="spinner"></div>
            <p><i class="fas fa-microchip"></i> Analisando imagem com IA...</p>
            <div class="progress-steps">
                <div class="step" :class="{ active: step >= 1 }">
                    <i class="fas fa-file-image"></i> Processando imagem
                </div>
                <div class="step" :class="{ active: step >= 2 }">
                    <i class="fas fa-brain"></i> IA analisando
                </div>
                <div class="step" :class="{ active: step >= 3 }">
                    <i class="fas fa-chart-line"></i> Gerando laudo
                </div>
            </div>
        </div>
        
        <div v-if="result" class="result">
            <div class="result-header">
                <i class="fas fa-robot result-icon"></i>
                <h4>Laudo de Análise por IA</h4>
            </div>
            
            <!-- Informações do Paciente -->
            <div class="patient-info">
                <h5><i class="fas fa-user-circle"></i> Dados do Paciente</h5>
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">Nome:</span>
                        <span class="info-value">{{ patientData.name || 'Não informado' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Idade:</span>
                        <span class="info-value">{{ patientData.age || 'Não informada' }} anos</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Exame:</span>
                        <span class="info-value">{{ patientData.examType || 'Não informado' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Data:</span>
                        <span class="info-value">{{ formatDate(patientData.examDate) }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">CPF:</span>
                        <span class="info-value">{{ patientData.cpf || 'Não informado' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Telefone:</span>
                        <span class="info-value">{{ patientData.phone || 'Não informado' }}</span>
                    </div>
                </div>
            </div>

            <div class="result-confidence">
                <span>Confiança da IA</span>
                <div class="confidence-bar">
                    <div class="confidence-fill" :style="{ width: result.confidence + '%' }"></div>
                </div>
                <span class="confidence-value">{{ result.confidence }}%</span>
            </div>
            
            <div class="result-findings">
                <p><strong><i class="fas fa-stethoscope"></i> Diagnóstico / Achados:</strong></p>
                <p class="findings-text">{{ result.diagnosis }}</p>
            </div>
            
            <div class="result-details">
                <p><strong><i class="fas fa-microscope"></i> Detalhes da Análise:</strong></p>
                <ul class="details-list">
                    <li v-for="detail in result.details" :key="detail">
                        <i class="fas fa-check-circle"></i> {{ detail }}
                    </li>
                </ul>
            </div>

            <div class="result-recommendations">
                <p><strong><i class="fas fa-clinic-medical"></i> Recomendações:</strong></p>
                <ul class="recommendations-list">
                    <li v-for="rec in result.recommendationsArray" :key="rec">
                        <i class="fas fa-arrow-right"></i> {{ rec }}
                    </li>
                </ul>
            </div>

            <div class="result-actions">
                <button class="btn-new-exam" @click="resetForm">
                    <i class="fas fa-plus-circle"></i> Novo Exame
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AIPredictor',
    data() {
        return {
            analyzing: false,
            result: null,
            step: 0,
            patientData: {
                name: '',
                examDate: new Date().toISOString().split('T')[0],
                examType: '',
                age: '',
                cpf: '',
                phone: ''
            }
        }
    },
    methods: {
        triggerUpload() {
            if (!this.analyzing && !this.result) {
                this.$refs.fileInput.click()
            }
        },
        handleDrop(e) {
            if (this.analyzing || this.result) return
            const file = e.dataTransfer.files[0]
            if (file && file.type.startsWith('image/')) {
                this.processImage(file)
            } else {
                alert('Por favor, envie apenas arquivos de imagem.')
            }
        },
        handleFile(e) {
            if (this.analyzing || this.result) return
            const file = e.target.files[0]
            if (file) {
                this.processImage(file)
            }
        },
        async processImage(file) {
            // Validar dados do paciente
            if (!this.validatePatientData()) {
                return
            }

            this.analyzing = true
            this.result = null
            this.step = 0
            
            // Simular progresso da análise
            this.step = 1
            await this.sleep(1000)
            this.step = 2
            await this.sleep(1500)
            this.step = 3
            
            // Gerar análise baseada no tipo de exame
            const analysis = this.generateAnalysisByExamType()
            
            setTimeout(() => {
                this.result = analysis
                this.analyzing = false
                
                // Emitir evento para o Dashboard com todos os dados
                this.$emit('exam-analyzed', {
                    examId: Date.now(),
                    patientData: { ...this.patientData },
                    analysis: this.result,
                    date: this.patientData.examDate
                })
            }, 500)
        },
        
        validatePatientData() {
            if (!this.patientData.name) {
                alert('Por favor, informe o nome do paciente.')
                return false
            }
            if (!this.patientData.examType) {
                alert('Por favor, selecione o tipo de exame.')
                return false
            }
            if (!this.patientData.age) {
                alert('Por favor, informe a idade do paciente.')
                return false
            }
            return true
        },
        
        generateAnalysisByExamType() {
            const examAnalyses = {
                'Raio-X Torácico': {
                    confidence: Math.floor(Math.random() * 15) + 82,
                    diagnosis: 'Nódulo pulmonar identificado no lobo superior direito, medindo aproximadamente 1.8cm, com bordas irregulares e leve espiculação.',
                    details: [
                        'Opacidade nodular única em topografia de lobo superior direito',
                        'Bordas levemente irregulares com pequenas espiculações',
                        'Ausência de calcificações grosseiras',
                        'Sem adenopatias hilares evidentes',
                        'Campos pulmonares com boa expansibilidade'
                    ],
                    recommendationsArray: [
                        'Realizar Tomografia Computadorizada de tórax com contraste',
                        'Avaliação pneumológica em até 7 dias',
                        'Considerar PET-CT para estadiamento',
                        'Acompanhamento radiológico seriado'
                    ]
                },
                'Tomografia Computadorizada': {
                    confidence: Math.floor(Math.random() * 10) + 87,
                    diagnosis: 'Processo inflamatório agudo no lobo inferior do pulmão esquerdo, com padrão de consolidação sugestivo de pneumonia.',
                    details: [
                        'Consolidação parenquimatosa em topografia de lobo inferior esquerdo',
                        'Sinal do ar broncograma presente',
                        'Derrame pleural laminar homolateral mínimo',
                        'Linfonodos mediastinais reativos',
                        'Sem evidência de abscessos'
                    ],
                    recommendationsArray: [
                        'Iniciar antibioticoterapia guiada por cultura',
                        'Controle radiológico em 30 dias',
                        'Avaliação clínica com reavaliação de sintomas',
                        'Exames laboratoriais: hemograma, PCR, procalcitonina'
                    ]
                },
                'Ressonância Magnética': {
                    confidence: Math.floor(Math.random() * 12) + 85,
                    diagnosis: 'Hérnia de disco lombar L4-L5 com compressão do saco tecal e raiz nervosa L5 direita.',
                    details: [
                        'Protrusão discal paramediana direita em L4-L5',
                        'Compressão do saco tecal moderada',
                        'Envolvimento da raiz nervosa L5 direita',
                        'Sinais de degeneração discal associada',
                        'Sem alterações inflamatórias significativas'
                    ],
                    recommendationsArray: [
                        'Fisioterapia especializada para coluna',
                        'Avaliação neurocirúrgica para considerar tratamento cirúrgico',
                        'Analgesia controlada para manejo da dor',
                        'RM de controle em 6 meses se sintomas persistirem'
                    ]
                },
                'Mamografia': {
                    confidence: Math.floor(Math.random() * 12) + 86,
                    diagnosis: 'Microcalcificações agrupadas BI-RADS 4A no quadrante súpero-lateral da mama direita, sem nódulo associado.',
                    details: [
                        'Agrupamento de microcalcificações pleomórficas',
                        'Distribuição segmentar no QSL da mama direita',
                        'Parênquima mamário denso tipo C',
                        'Ausência de nódulo ou distorção arquitetural',
                        'Lesões contralaterais sem alterações significativas'
                    ],
                    recommendationsArray: [
                        'Core biopsy guiada por estereotaxia',
                        'Marcação pré-cirúrgica com arpão (se indicado)',
                        'Avaliação com mastologista em até 10 dias',
                        'Complementar com ultrassom focalizado'
                    ]
                },
                'Ultrassom': {
                    confidence: Math.floor(Math.random() * 12) + 88,
                    diagnosis: 'Nódulo hepático benigno - características sugestivas de hemangioma, medindo 2.5cm no segmento VII.',
                    details: [
                        'Lesão sólida hiperecogênica, bem delimitada',
                        'Contornos regulares e formato ovalado',
                        'Reforço acústico posterior ausente',
                        'Vascularização periférica ao Doppler',
                        'Consistência homogênea'
                    ],
                    recommendationsArray: [
                        'Controle ultrassonográfico em 12 meses',
                        'TC ou RM com contraste para confirmação diagnóstica',
                        'Dosagem de marcadores tumorais para segurança',
                        'Manter acompanhamento clínico semestral'
                    ]
                }
            }
            
            const defaultAnalysis = {
                confidence: Math.floor(Math.random() * 20) + 75,
                diagnosis: 'Alterações sugestivas de processo inflamatório/infeccioso, necessitando correlação clínica para elucidação diagnóstica.',
                details: [
                    'Alterações inflamatórias leves identificadas',
                    'Sem sinais de malignidade evidentes',
                    'Estruturas anatômicas preservadas',
                    'Realizar correlação com dados clínicos'
                ],
                recommendationsArray: [
                    'Encaminhar para especialista para correlação clínica',
                    'Complementar exames laboratoriais',
                    'Reavaliação em consulta médica',
                    'Considerar exames complementares conforme sintomas'
                ]
            }
            
            return examAnalyses[this.patientData.examType] || defaultAnalysis
        },
        
        formatDate(date) {
            if (!date) return 'Não informada'
            return new Date(date).toLocaleDateString('pt-BR')
        },
        
        resetForm() {
            this.result = null
            this.patientData = {
                name: '',
                examDate: new Date().toISOString().split('T')[0],
                examType: '',
                age: '',
                cpf: '',
                phone: ''
            }
            this.$refs.fileInput.value = ''
        },
        
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }
    }
}
</script>

<style scoped>
.ai-predictor {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 242, 255, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
}

.ai-predictor h3 {
    color: var(--cyber-blue, #00f2ff);
    margin-bottom: 1rem;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.patient-form {
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 16px;
}

.patient-form h4 {
    color: #fff;
    margin-bottom: 1rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    color: #888;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 6px;
}

.form-group input, .form-group select {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0.6rem;
    color: #fff;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.form-group input:focus, .form-group select:focus {
    outline: none;
    border-color: var(--cyber-blue, #00f2ff);
    background: rgba(0, 242, 255, 0.1);
}

.upload-area {
    border: 2px dashed rgba(0, 242, 255, 0.3);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(0, 242, 255, 0.02);
}

.upload-area.upload-disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

.upload-area:hover:not(.upload-disabled) {
    border-color: var(--cyber-blue, #00f2ff);
    background: rgba(0, 242, 255, 0.08);
    transform: translateY(-2px);
}

.upload-icon {
    font-size: 3rem;
    color: var(--cyber-blue, #00f2ff);
    margin-bottom: 1rem;
}

.upload-area p {
    color: #fff;
    margin-bottom: 0.5rem;
}

.upload-hint {
    color: #666;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.analyzing {
    text-align: center;
    padding: 2rem;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(0, 242, 255, 0.2);
    border-top-color: var(--cyber-blue, #00f2ff);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.progress-steps {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    gap: 1rem;
}

.step {
    flex: 1;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    color: #666;
    font-size: 0.7rem;
    transition: all 0.3s ease;
}

.step.active {
    background: rgba(0, 242, 255, 0.2);
    color: var(--cyber-blue);
}

.step i {
    display: block;
    margin-bottom: 0.25rem;
    font-size: 1rem;
}

.result {
    margin-top: 1.5rem;
    background: rgba(0, 242, 255, 0.05);
    border-radius: 16px;
    animation: fadeInUp 0.5s ease;
    max-height: 600px;
    overflow-y: auto;
    padding: 1rem;
}

.result-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(0, 242, 255, 0.3);
}

.result-icon {
    font-size: 1.5rem;
    color: var(--cyber-blue, #00f2ff);
}

.result-header h4 {
    color: var(--cyber-blue, #00f2ff);
    margin: 0;
}

.patient-info {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 1rem;
    margin-bottom: 1rem;
}

.patient-info h5 {
    color: var(--emerald, #00ff88);
    margin-bottom: 0.75rem;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 6px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.info-label {
    color: #888;
    font-size: 0.7rem;
}

.info-value {
    color: #fff;
    font-size: 0.85rem;
    font-weight: 500;
}

.result-confidence {
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.confidence-bar {
    background: rgba(0, 0, 0, 0.3);
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin: 0.5rem 0;
}

.confidence-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    transition: width 0.5s ease;
}

.confidence-value {
    color: var(--emerald, #00ff88);
    font-weight: bold;
}

.result-findings, .result-details, .result-recommendations {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

.findings-text {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.5;
    margin-top: 0.5rem;
}

.details-list, .recommendations-list {
    margin-top: 0.5rem;
    padding-left: 0;
    list-style: none;
}

.details-list li, .recommendations-list li {
    padding: 0.4rem 0;
    color: #ccc;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.details-list li:last-child, .recommendations-list li:last-child {
    border-bottom: none;
}

.details-list li i, .recommendations-list li i {
    color: var(--emerald, #00ff88);
    font-size: 0.7rem;
}

.result-actions {
    margin-top: 1.5rem;
    text-align: center;
}

.btn-new-exam {
    background: linear-gradient(135deg, var(--cyber-blue), var(--emerald));
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 10px;
    color: #000;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-new-exam:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3);
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
    .form-grid {
        grid-template-columns: 1fr;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
    
    .progress-steps {
        flex-direction: column;
    }
}
</style>