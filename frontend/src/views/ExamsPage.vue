<template>
    <div class="exams">
        <div class="exams-header">
            <h1><i class="fas fa-x-ray"></i> Exames Realizados</h1>
            <button class="btn-new-exam" @click="showUpload = true">
                <i class="fas fa-plus"></i> Novo Exame
            </button>
        </div>
        
        <div class="exams-filters">
            <div class="search-wrapper">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Buscar paciente..." class="search-input" v-model="searchTerm">
            </div>
            <div class="filter-wrapper">
                <i class="fas fa-filter"></i>
                <select class="filter-select" v-model="selectedType">
                    <option value="">Todos os tipos</option>
                    <option value="Raio-X">Raio-X</option>
                    <option value="Tomografia">Tomografia</option>
                    <option value="Ressonância">Ressonância</option>
                    <option value="Ultrassom">Ultrassom</option>
                </select>
            </div>
        </div>
        
        <div class="exams-table">
            <table>
                <thead>
                    <tr>
                        <th><i class="fas fa-user"></i> Paciente</th>
                        <th><i class="fas fa-microscope"></i> Tipo</th>
                        <th><i class="fas fa-calendar"></i> Data</th>
                        <th><i class="fas fa-chart-simple"></i> Status</th>
                        <th><i class="fas fa-cog"></i> Ações</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="exam in filteredExams" :key="exam.id">
                        <td><i class="fas fa-user-circle"></i> {{ exam.patient }}</td>
                        <td><i :class="examIcon(exam.type)"></i> {{ exam.type }}</td>
                        <td><i class="fas fa-calendar-alt"></i> {{ exam.date }}</td>
                        <td><span :class="['status-badge', exam.status]"><i :class="statusIcon(exam.status)"></i> {{ exam.statusText }}</span></td>
                        <td><button class="btn-view" @click="viewExam(exam)"><i class="fas fa-eye"></i> Visualizar</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <UploadModal :isVisible="showUpload" @close="showUpload = false" @upload-success="handleUploadSuccess" />
    </div>
</template>

<script>
import UploadModal from '../components/UploadModal.vue'

export default {
    name: 'Exams',
    components: { UploadModal },
    data() {
        return {
            showUpload: false,
            searchTerm: '',
            selectedType: '',
            exams: [
                { id: 1, patient: 'Maria Silva', type: 'Raio-X', date: '2024-01-15', status: 'completed', statusText: 'Concluído' },
                { id: 2, patient: 'João Santos', type: 'Tomografia', date: '2024-01-14', status: 'pending', statusText: 'Pendente' },
                { id: 3, patient: 'Ana Oliveira', type: 'Ressonância', date: '2024-01-13', status: 'completed', statusText: 'Concluído' },
                { id: 4, patient: 'Carlos Souza', type: 'Ultrassom', date: '2024-01-12', status: 'analyzing', statusText: 'Analisando' }
            ]
        }
    },
    computed: {
        filteredExams() {
            return this.exams.filter(exam => {
                const matchesSearch = exam.patient.toLowerCase().includes(this.searchTerm.toLowerCase())
                const matchesType = !this.selectedType || exam.type === this.selectedType
                return matchesSearch && matchesType
            })
        }
    },
    methods: {
        examIcon(type) {
            const icons = {
                'Raio-X': 'fas fa-lungs',
                'Tomografia': 'fas fa-brain',
                'Ressonância': 'fas fa-heartbeat',
                'Ultrassom': 'fas fa-baby'
            }
            return icons[type] || 'fas fa-microscope'
        },
        statusIcon(status) {
            const icons = {
                completed: 'fas fa-check-circle',
                analyzing: 'fas fa-spinner fa-pulse',
                pending: 'fas fa-clock'
            }
            return icons[status] || 'fas fa-circle'
        },
        viewExam(exam) {
            console.log('Viewing exam:', exam)
        },
        handleUploadSuccess(result) {
            console.log('Upload success:', result)
            // Add new exam to the list
            this.exams.unshift({
                id: result.examId,
                patient: result.patientName,
                type: result.examType,
                date: new Date().toISOString().split('T')[0],
                status: 'completed',
                statusText: 'Concluído'
            })
        }
    }
}
</script>

<style scoped>
.exams {
    padding: 120px 2rem 4rem;
    max-width: 1200px;
    margin: 0 auto;
}

.exams-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.exams-header h1 {
    font-size: 2rem;
    background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    display: flex;
    align-items: center;
    gap: 10px;
}

.btn-new-exam {
    background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    border: none;
    padding: 10px 24px;
    border-radius: 12px;
    color: #000;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
}

.btn-new-exam:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3);
}

.exams-filters {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
}

.search-wrapper, .filter-wrapper {
    position: relative;
    flex: 1;
}

.search-wrapper i, .filter-wrapper i {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
}

.search-input, .filter-select {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px 16px 12px 40px;
    border-radius: 12px;
    color: #fff;
    transition: all 0.3s ease;
}

.search-input:focus, .filter-select:focus {
    outline: none;
    border-color: var(--cyber-blue, #00f2ff);
}

.filter-select {
    cursor: pointer;
}

.filter-select option {
    background: #0a0a0f;
}

.exams-table {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    overflow-x: auto;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 600px;
}

th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

th {
    color: var(--cyber-blue, #00f2ff);
    font-weight: 600;
}

th i {
    margin-right: 6px;
}

td {
    color: #ccc;
}

td i {
    margin-right: 8px;
    color: #666;
}

.status-badge {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.status-badge.completed {
    background: rgba(0, 255, 136, 0.15);
    color: var(--emerald, #00ff88);
    border: 1px solid rgba(0, 255, 136, 0.3);
}

.status-badge.pending {
    background: rgba(255, 165, 0, 0.15);
    color: #ffa500;
    border: 1px solid rgba(255, 165, 0, 0.3);
}

.status-badge.analyzing {
    background: rgba(0, 242, 255, 0.15);
    color: var(--cyber-blue, #00f2ff);
    border: 1px solid rgba(0, 242, 255, 0.3);
}

.btn-view {
    background: rgba(0, 242, 255, 0.1);
    border: 1px solid var(--cyber-blue, #00f2ff);
    padding: 0.25rem 1rem;
    border-radius: 8px;
    color: var(--cyber-blue, #00f2ff);
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.btn-view:hover {
    background: var(--cyber-blue, #00f2ff);
    color: #000;
}

@media (max-width: 768px) {
    .exams-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .exams-filters {
        flex-direction: column;
    }
}
</style>