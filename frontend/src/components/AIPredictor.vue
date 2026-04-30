<template>
    <div class="ai-predictor">
        <h3><i class="fas fa-brain"></i> Análise com IA</h3>
        <div class="upload-area" @click="triggerUpload" @dragover.prevent @drop.prevent="handleDrop">
            <input type="file" ref="fileInput" @change="handleFile" accept="image/*" hidden>
            <i class="fas fa-cloud-upload-alt upload-icon"></i>
            <p>Arraste ou clique para enviar exame</p>
            <span class="upload-hint"><i class="fas fa-info-circle"></i> Suporta DICOM, PNG, JPG</span>
        </div>
        
        <div v-if="analyzing" class="analyzing">
            <div class="spinner"></div>
            <p><i class="fas fa-microchip"></i> Analisando imagem com IA...</p>
        </div>
        
        <div v-if="result" class="result">
            <div class="result-header">
                <i class="fas fa-robot result-icon"></i>
                <h4>Resultado da Análise</h4>
            </div>
            <div class="result-confidence">
                <span>Confiança</span>
                <div class="confidence-bar">
                    <div class="confidence-fill" :style="{ width: result.confidence + '%' }"></div>
                </div>
                <span class="confidence-value">{{ result.confidence }}%</span>
            </div>
            <div class="result-findings">
                <p><strong><i class="fas fa-stethoscope"></i> Diagnóstico:</strong> {{ result.diagnosis }}</p>
            </div>
            <div class="result-recommendations">
                <p><strong><i class="fas fa-clinic-medical"></i> Recomendações:</strong> {{ result.recommendations }}</p>
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
            result: null
        }
    },
    methods: {
        triggerUpload() {
            this.$refs.fileInput.click()
        },
        handleDrop(e) {
            const file = e.dataTransfer.files[0]
            if (file && file.type.startsWith('image/')) {
                this.processImage(file)
            }
        },
        handleFile(e) {
            const file = e.target.files[0]
            if (file) {
                this.processImage(file)
            }
        },
        processImage(file) {
            this.analyzing = true
            this.result = null
            
            setTimeout(() => {
                this.result = {
                    confidence: Math.floor(Math.random() * 20) + 75,
                    diagnosis: this.getRandomDiagnosis(),
                    recommendations: this.getRandomRecommendations()
                }
                this.analyzing = false
            }, 3000)
        },
        getRandomDiagnosis() {
            const diagnoses = [
                "Presença de nódulo pulmonar com características suspeitas",
                "Calcificações benignas observadas na região mamária",
                "Sinais de pneumonia na região inferior do pulmão direito",
                "Espessamento das vias aéreas - sugestivo de bronquite",
                "Derrame pleural identificado - necessidade de acompanhamento"
            ]
            return diagnoses[Math.floor(Math.random() * diagnoses.length)]
        },
        getRandomRecommendations() {
            const recommendations = [
                "Recomenda-se tomografia contrastada para avaliação detalhada",
                "Acompanhamento em 6 meses para monitoramento",
                "Biópsia sugerida devido à alta suspeita",
                "Iniciar tratamento com antibióticos e reavaliar em 30 dias",
                "Encaminhar para especialista em pneumologia"
            ]
            return recommendations[Math.floor(Math.random() * recommendations.length)]
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

.upload-area {
    border: 2px dashed rgba(0, 242, 255, 0.3);
    border-radius: 16px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background: rgba(0, 242, 255, 0.02);
}

.upload-area:hover {
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

.result {
    margin-top: 1.5rem;
    padding: 1rem;
    background: rgba(0, 242, 255, 0.05);
    border-radius: 16px;
    border-left: 3px solid var(--cyber-blue, #00f2ff);
    animation: fadeInUp 0.5s ease;
}

.result-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
}

.result-icon {
    font-size: 1.5rem;
    color: var(--cyber-blue, #00f2ff);
}

.result-header h4 {
    color: var(--cyber-blue, #00f2ff);
    margin: 0;
}

.result-confidence {
    margin-bottom: 1rem;
}

.confidence-bar {
    background: rgba(255, 255, 255, 0.1);
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

.result-findings, .result-recommendations {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.result-findings p, .result-recommendations p {
    color: #ccc;
    font-size: 0.9rem;
    line-height: 1.5;
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
</style>