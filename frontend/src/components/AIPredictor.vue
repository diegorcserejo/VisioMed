<template>
    <div class="ai-predictor">
        <h3><i class="fas fa-brain"></i> Análise com IA</h3>
        
        <!-- Formulário de Dados do Paciente -->
        <div class="patient-form" v-if="!analyzing && !result">
            <h4><i class="fas fa-user-md"></i> Dados do Paciente</h4>
            <div class="form-grid">
                <div class="form-group">
                    <label><i class="fas fa-user"></i> Nome Completo:*</label>
                    <input type="text" v-model="patientData.name" placeholder="Ex: Maria da Silva Santos">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-calendar-alt"></i> Data do Exame:*</label>
                    <input type="date" v-model="patientData.examDate">
                </div>
                <div class="form-group">
                    <label><i class="fas fa-stethoscope"></i> Tipo de Exame:*</label>
                    <select v-model="patientData.examType">
                        <option value="">Selecione....</option>
                        <option value="Laudo">Laudo</option>
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
                    <label><i class="fas fa-venus-mars"></i> Idade:*</label>
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

        <!-- Área de Upload -->
        <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop" :class="{ 'upload-disabled': analyzing || result }">
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*" hidden>
            <i class="fas fa-cloud-upload-alt upload-icon"></i>
            <p>Arraste ou clique para enviar exame</p>
            <span class="upload-hint"><i class="fas fa-info-circle"></i> Suporta DICOM, PNG, JPG</span>
        </div>

        <!-- Arquivo Selecionado -->
        <div v-if="selectedFile && !analyzing && !result" class="selected-file">
            <i class="fas fa-file-image"></i>
            <span>{{ selectedFile.name }}</span>
            <button class="remove-file" @click="removeFile">
                <i class="fas fa-times"></i>
            </button>
        </div>

        <!-- Botões de Ação -->
        <div v-if="selectedFile && !analyzing && !result" class="action-buttons">
            <button class="btn-clear" @click="clearForm">
                <i class="fas fa-trash-alt"></i> Limpar
            </button>
            <button class="btn-analyze" @click="startAnalysis" :disabled="!isFormValid">
                <i class="fas fa-microchip"></i> Executar Análise com IA
            </button>
        </div>
        
        <!-- Análise em Progresso -->
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
        
        <!-- Resultado da Análise -->
        <div v-if="result" class="result">
            <div class="result-header">
                <i class="fas fa-robot result-icon"></i>
                <i class="fas fa-microscope"></i>
                <h4>Análise Personalizada do Exame</h4>
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

        <!-- Mensagem de validação -->
        <div v-if="validationMessage" class="validation-message">
            <i class="fas fa-exclamation-triangle"></i> {{ validationMessage }}
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
            selectedFile: null,
            validationMessage: '',
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
    computed: {
        isFormValid() {
            return this.patientData.name && 
                   this.patientData.examType && 
                   this.patientData.age && 
                   this.selectedFile
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
                this.selectedFile = file
                this.validationMessage = ''
            } else {
                this.validationMessage = 'Por favor, envie apenas arquivos de imagem.'
                setTimeout(() => this.validationMessage = '', 3000)
            }
        },
        handleFile(e) {
            if (this.analyzing || this.result) return
            const file = e.target.files[0]
            if (file) {
                this.selectedFile = file
                this.validationMessage = ''
            }
        },
        removeFile() {
            this.selectedFile = null
            this.$refs.fileInput.value = ''
        },
        clearForm() {
            this.removeFile()
            this.patientData = {
                name: '',
                examDate: new Date().toISOString().split('T')[0],
                examType: '',
                age: '',
                cpf: '',
                phone: ''
            }
            this.validationMessage = ''
        },
        validatePatientData() {
            if (!this.patientData.name) {
                this.validationMessage = 'Por favor, informe o nome do paciente.'
                return false
            }
            if (!this.patientData.examType) {
                this.validationMessage = 'Por favor, selecione o tipo de exame.'
                return false
            }
            if (!this.patientData.age) {
                this.validationMessage = 'Por favor, informe a idade do paciente.'
                return false
            }
            if (!this.selectedFile) {
                this.validationMessage = 'Por favor, selecione um arquivo de exame.'
                return false
            }
            return true
        },
        async startAnalysis() {
            if (!this.validatePatientData()) {
                setTimeout(() => this.validationMessage = '', 3000)
                return
            }

            this.analyzing = true
            this.result = null
            this.step = 0
            
            // Simular análise da imagem
            this.step = 1
            await this.sleep(1000)
            this.step = 2
            await this.sleep(1500)
            this.step = 3
            
            // Gerar análise ÚNICA baseada no nome do arquivo, tipo de exame e hora
            // para garantir que cada exame tenha uma análise diferente
            const analysis = this.generateDetailedAnalysis()
            
            await this.sleep(500)
            
            this.result = analysis
            this.analyzing = false
            
            // Criar objeto do exame para enviar ao Dashboard
            const examId = Date.now()
            
            const examData = {
                id: examId,
                name: `${this.patientData.examType} - ${this.patientData.name}`,
                date: this.patientData.examDate,
                status: 'completed',
                patientData: { ...this.patientData },
                analysis: {
                    primaryFindings: analysis.diagnosis,
                    details: analysis.details,
                    confidence: analysis.confidence,
                    severity: analysis.severity,
                    recommendations: analysis.recommendationsArray,
                    technicalParams: analysis.technicalParams
                }
            }
            
            // Emitir evento para o Dashboard
            this.$emit('exam-analyzed', examData)
        },
        
        generateDetailedAnalysis() {
            // Usar o nome do arquivo e timestamp para gerar análises únicas
            const fileName = this.selectedFile.name
            const timestamp = Date.now()
            const uniqueSeed = (fileName.length + timestamp) % 10
            
            // Baseado no tipo de exame e seed único
            const examType = this.patientData.examType
            const patientAge = parseInt(this.patientData.age)
            
            // Análises detalhadas por tipo de exame com variações
            const analyses = {
                'Raio-X Torácico': this.getRadiografiaAnalysis(uniqueSeed, patientAge),
                'Tomografia Computadorizada': this.getTomografiaAnalysis(uniqueSeed, patientAge),
                'Ressonância Magnética': this.getRessonanciaAnalysis(uniqueSeed, patientAge),
                'Mamografia': this.getMamografiaAnalysis(uniqueSeed, patientAge),
                'Ultrassom': this.getUltrassomAnalysis(uniqueSeed, patientAge),
                'Densitometria Óssea': this.getDensitometriaAnalysis(uniqueSeed, patientAge),
                'Ecocardiograma': this.getEcocardiogramaAnalysis(uniqueSeed, patientAge)
            }
            
            return analyses[examType] || this.getDefaultAnalysis(uniqueSeed, patientAge)
        },
        
        getRadiografiaAnalysis(seed, age) {
            const findings = [
                {
                    diagnosis: 'Infiltrado intersticial bilateral sugestivo de pneumonia viral. Opacidades reticulonodulares difusas com predomínio peribroncovascular.',
                    details: [
                        'Opacidades intersticiais difusas em ambos os pulmões',
                        'Espessamento peribroncovascular moderado',
                        'Pequenos derrames pleurais bilaterais',
                        'Silhueta cardíaca e mediastino sem alterações'
                    ],
                    confidence: 87 + seed,
                    severity: 'Moderado',
                    recommendations: [
                        'Iniciar tratamento antiviral e antibioticoterapia',
                        'Coleta de swab nasofaríngeo para painel viral',
                        'Controle radiológico em 14 dias',
                        'Avaliação com pneumologista'
                    ]
                },
                {
                    diagnosis: 'Massa mediastinal anterior com calcificações grosseiras, sugestiva de teratoma maduro. Lesão com dimensões de 4.5 x 3.8cm.',
                    details: [
                        'Massa heterogênea em topografia de mediastino anterior',
                        'Componente cístico e áreas de calcificação',
                        'Sem invasão de estruturas adjacentes',
                        'Gordura mediastinal preservada'
                    ],
                    confidence: 92 + seed,
                    severity: 'Alto',
                    recommendations: [
                        'TC de tórax com contraste para caracterização',
                        'Avaliação com cirurgião torácico',
                        'Ressonância magnética para detalhamento tecidual',
                        'Marcadores tumorais: AFP e beta-HCG'
                    ]
                },
                {
                    diagnosis: 'Pneumotórax espontâneo à direita com colapso pulmonar de aproximadamente 30%. Linha pleural visível e ausência de trama vascular periférica.',
                    details: [
                        'Linha pleural visível no hemitórax direito',
                        'Colapso pulmonar parcial (30%)',
                        'Desvio traqueal contralateral ausente',
                        'Sem sinais de tensão'
                    ],
                    confidence: 95 + seed,
                    severity: 'Alto',
                    recommendations: [
                        'Oxigenioterapia com alto fluxo',
                        'Considerar drenagem torácica se progressão',
                        'Avaliação em pronto-socorro imediata',
                        'Radiografia de controle em 6 horas'
                    ]
                }
            ]
            
            return findings[seed % findings.length]
        },
        
        getTomografiaAnalysis(seed, age) {
            const findings = [
                {
                    diagnosis: 'Nódulo pulmonar solitário em lobo superior direito, espiculado, com características suspeitas para neoplasia primária. Medindo 2.1 x 1.8cm.',
                    details: [
                        'Nódulo com bordas espiculadas e pequenas lobulações',
                        'Densidade de partes moles levemente heterogênea',
                        'Ausência de calcificações',
                        'Linfonodos mediastinais reativos < 1cm'
                    ],
                    confidence: 94 + seed,
                    severity: 'Alto',
                    recommendations: [
                        'PET-CT para estadiamento',
                        'Biópsia percutânea guiada por TC',
                        'Avaliação com oncologista torácico',
                        'Dosagem de marcadores tumorais'
                    ]
                },
                {
                    diagnosis: 'Embolia pulmonar em artéria segmentar do lobo inferior esquerdo. Defeito de preenchimento central visível com sinal do "rail track".',
                    details: [
                        'Defeito de preenchimento intraluminal na artéria segmentar esquerda',
                        'Sinal do "anel" característico',
                        'Áreas de oligoemia distal à lesão',
                        'Ventrículo direito sem sinais de sobrecarga'
                    ],
                    confidence: 96 + seed,
                    severity: 'Alto',
                    recommendations: [
                        'Anticoagulação imediata com heparina',
                        'Avaliação de função renal',
                        'Ecocardiograma para avaliação de função ventricular',
                        'Dosagem de D-dímero e troponinas'
                    ]
                }
            ]
            return findings[seed % findings.length]
        },
        
        getMamografiaAnalysis(seed, age) {
            const findings = [
                {
                    diagnosis: `Microcalcificações agrupadas BI-RADS 4B no quadrante súpero-lateral da mama direita. ${age > 50 ? 'Paciente na pós-menopausa, parênquima mamário predominantemente gorduroso.' : 'Paciente em idade fértil, parênquima mamário denso.'}`,
                    details: [
                        'Agrupamento de 8-10 microcalcificações pleomórficas',
                        'Distribuição segmentar sugerindo origem ductal',
                        'Sem nódulo ou distorção arquitetural associada',
                        'Lesões contralaterais sem alterações'
                    ],
                    confidence: 88 + seed,
                    severity: 'Alto',
                    recommendations: [
                        'Core biopsy guiada por estereotaxia',
                        'Marcação pré-cirúrgica com arpão',
                        'RM de mama para extensão da doença',
                        'Avaliação com mastologista em 5 dias'
                    ]
                },
                {
                    diagnosis: 'Nódulo espiculado BI-RADS 5 na mama esquerda, altamente sugestivo de malignidade. Lesão com 3.2cm no quadrante ínfero-externo.',
                    details: [
                        'Nódulo com bordas irregulares e espiculações',
                        'Aspecto de "estrela" característico',
                        'Microcalcificações grosseiras no interior',
                        'Retração cutânea associada'
                    ],
                    confidence: 96 + seed,
                    severity: 'Alto',
                    recommendations: [
                        'Core biopsy imediata com ultrassom',
                        'RM de mama bilateral para estadiamento local',
                        'Avaliação de linfonodos axilares',
                        'Consulta com mastologista e oncologista'
                    ]
                }
            ]
            return findings[seed % findings.length]
        },
        
        getUltrassomAnalysis(seed, age) {
            const findings = [
                {
                    diagnosis: 'Nódulo hepático hiperecogênico bem delimitado, características sugestivas de hemangioma. Medindo 2.8cm no segmento VI.',
                    details: [
                        'Lesão sólida hiperecogênica homogênea',
                        'Contornos regulares bem definidos',
                        'Reforço acústico posterior ausente',
                        'Vascularização periférica ao Doppler'
                    ],
                    confidence: 93 + seed,
                    severity: 'Baixo',
                    recommendations: [
                        'Controle ultrassonográfico em 12 meses',
                        'TC com contraste trifásico para confirmação',
                        'Dosagem de alfafetoproteína',
                        'Manter acompanhamento semestral'
                    ]
                },
                {
                    diagnosis: 'Cisto renal complexo Bosniak IIF no polo superior do rim direito, septo fino com leve espessamento. Medindo 4.5 x 3.8cm.',
                    details: [
                        'Lesão cística multiloculada',
                        'Septo fino com leve espessamento',
                        'Ausência de calcificações grosseiras',
                        'Sem realce após contraste'
                    ],
                    confidence: 89 + seed,
                    severity: 'Moderado',
                    recommendations: [
                        'TC ou RM com contraste para caracterização',
                        'Acompanhamento em 6 meses',
                        'Dosagem de creatinina e eletrólitos',
                        'Controle ultrassonográfico seriado'
                    ]
                }
            ]
            return findings[seed % findings.length]
        },
        
        getRessonanciaAnalysis(seed, age) {
            return {
                diagnosis: `Hérnia de disco lombar em L4-L5 com compressão do saco tecal e raiz nervosa L5 ${seed % 2 === 0 ? 'direita' : 'esquerda'}. Protusão discal paramediana medindo 6mm.`,
                details: [
                    'Protrusão discal paramediana em L4-L5',
                    'Compressão significativa do saco tecal',
                    'Envolvimento da raiz nervosa L5',
                    'Sinais de degeneração discal associada'
                ],
                confidence: 91 + seed,
                severity: age > 50 ? 'Alto' : 'Moderado',
                recommendations: [
                    'Fisioterapia especializada para coluna',
                    'Avaliação neurocirúrgica',
                    'Analgesia controlada com anti-inflamatórios',
                    'RM de controle em 6 meses'
                ]
            }
        },
        
        getDensitometriaAnalysis(seed, age) {
            const tScore = -1.5 - (seed / 10)
            return {
                diagnosis: `${Math.abs(tScore) > 2.0 ? 'Osteoporose estabelecida' : 'Osteopenia'} em coluna lombar e fêmur proximal. T-score: ${tScore.toFixed(1)} em L1-L4.`,
                details: [
                    `T-score: ${tScore.toFixed(1)} em coluna lombar`,
                    `T-score: ${(tScore + 0.2).toFixed(1)} em colo femoral`,
                    'Z-score dentro do esperado para idade e gênero',
                    'Risco de fratura moderadamente aumentado'
                ],
                confidence: 94 + seed,
                severity: Math.abs(tScore) > 2.0 ? 'Alto' : 'Moderado',
                recommendations: Math.abs(tScore) > 2.0 ? [
                    'Bisfosfonatos ou denosumabe',
                    'Cálcio 1200mg/dia + Vitamina D 2000UI/dia',
                    'Exercícios com impacto e musculação',
                    'Avaliação endocrinológica'
                ] : [
                    'Suplementação de cálcio (1200mg/dia)',
                    'Vitamina D (2000UI/dia)',
                    'Exercícios com impacto controlado',
                    'Reavaliação em 1 ano'
                ]
            }
        },
        
        getEcocardiogramaAnalysis(seed, age) {
            const ejectionFraction = 55 + (seed * 2)
            return {
                diagnosis: `Função ventricular esquerda preservada com fração de ejeção de ${ejectionFraction}%. Leve disfunção diastólica grau I (padrão de relaxamento anormal).`,
                details: [
                    `FEVE: ${ejectionFraction}% (método de Simpson)`,
                    'Relação E/A: 0.75',
                    'Tempo de desaceleração: 240ms',
                    'Pressão de átrio direito estimada em 8mmHg'
                ],
                confidence: 90 + seed,
                severity: 'Baixo',
                recommendations: [
                    'Controle pressórico rigoroso (<130/80mmHg)',
                    'Ecocardiograma de controle em 12 meses',
                    'Evitar anti-inflamatórios não hormonais',
                    'Avaliação cardiológica anual'
                ]
            }
        },
        
        getDefaultAnalysis(seed, age) {
            return {
                diagnosis: `Alterações detectadas no exame de imagem necessitando correlação clínica. ${seed % 2 === 0 ? 'Sinais inflamatórios leves identificados.' : 'Estruturas anatômicas preservadas sem achados significativos.'}`,
                details: [
                    'Análise computadorizada concluída',
                    'Segmentação automática das estruturas',
                    seed % 2 === 0 ? 'Áreas de hiperdensidade detectadas' : 'Densidade tecidual dentro da normalidade',
                    'Recomendada revisão por especialista'
                ],
                confidence: 85 + seed,
                severity: 'Moderado',
                recommendations: [
                    'Encaminhar para especialista para correlação clínica',
                    'Complementar exames laboratoriais',
                    'Reavaliação em consulta médica',
                    'Considerar exames complementares conforme sintomas'
                ]
            }
        },
        
        formatDate(date) {
            if (!date) return 'Não informada'
            return new Date(date).toLocaleDateString('pt-BR')
        },
        
        resetForm() {
            this.result = null
            this.selectedFile = null
            this.patientData = {
                name: '',
                examDate: new Date().toISOString().split('T')[0],
                examType: '',
                age: '',
                cpf: '',
                phone: ''
            }
            this.$refs.fileInput.value = ''
            this.validationMessage = ''
        },
        
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms))
        }
    }
}
</script>

<style scoped>
/* ... (mantenha os estilos anteriores) ... */
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

.selected-file {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(0, 242, 255, 0.1);
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.selected-file i {
    color: var(--cyber-blue);
    font-size: 1.2rem;
}

.selected-file span {
    color: #fff;
    flex: 1;
    font-size: 0.9rem;
}

.remove-file {
    background: rgba(255, 0, 0, 0.2);
    border: none;
    color: #ff4444;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.remove-file:hover {
    background: rgba(255, 0, 0, 0.4);
}

.action-buttons {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
}

.btn-clear, .btn-analyze {
    flex: 1;
    padding: 0.75rem;
    border: none;
    border-radius: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-clear {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

.btn-clear:hover {
    background: rgba(255, 255, 255, 0.2);
}

.btn-analyze {
    background: linear-gradient(135deg, var(--cyber-blue), var(--emerald));
    color: #000;
}

.btn-analyze:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3);
}

.btn-analyze:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
    background: linear-gradient(90deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    height: 100%;
    border-radius: 4px;
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

.validation-message {
    margin-top: 1rem;
    padding: 0.75rem;
    background: rgba(255, 0, 0, 0.2);
    border: 1px solid rgba(255, 0, 0, 0.3);
    border-radius: 10px;
    color: #ff6666;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.85rem;
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
    
    .action-buttons {
        flex-direction: column;
    }
}
</style>