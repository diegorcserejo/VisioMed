<template>
    <div class="dashboard">
        <div class="dashboard-header">
            <h1><i class="fas fa-chart-line"></i> Dashboard de Radiologia IA</h1>
            <p><i class="fas fa-microchip"></i> Análise de exames com inteligência artificial</p>
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
                <AIPredictor />
            </div>
            <div class="recent-exams">
                <h3><i class="fas fa-history"></i> Exames Recentes</h3>
                <div class="exam-list">
                    <div class="exam-item" v-for="exam in recentExams" :key="exam.id">
                        <div class="exam-info">
                            <span class="exam-name">{{ exam.name }}</span>
                            <span class="exam-date"><i class="fas fa-calendar-alt"></i> {{ exam.date }}</span>
                        </div>
                        <span class="exam-status" :class="exam.status">
                            <i :class="statusIcon(exam.status)"></i> {{ statusText(exam.status) }}
                        </span>
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
            dashboardStats: [
                { icon: 'fas fa-chart-simple', value: '1,234', label: 'Total de Exames' },
                { icon: 'fas fa-brain', value: '892', label: 'Análises com IA' },
                { icon: 'fas fa-exclamation-triangle', value: '45', label: 'Casos Críticos' },
                { icon: 'fas fa-bullseye', value: '98%', label: 'Precisão da IA' }
            ],
            recentExams: [
                { id: 1, name: 'Raio-X Torácico - Maria Silva', date: '2024-01-15', status: 'completed' },
                { id: 2, name: 'Tomografia - João Santos', date: '2024-01-14', status: 'analyzing' },
                { id: 3, name: 'Ressonância - Ana Oliveira', date: '2024-01-13', status: 'pending' },
                { id: 4, name: 'Mamografia - Carla Souza', date: '2024-01-12', status: 'completed' },
                { id: 5, name: 'Ultrassom - Roberto Lima', date: '2024-01-11', status: 'completed' },
                { id: 6, name: 'TC Abdômen - Fernanda Costa', date: '2024-01-10', status: 'analyzing' },
                { id: 7, name: 'RM Coluna - Paulo Mendes', date: '2024-01-09', status: 'completed' },
                { id: 8, name: 'Raio-X Joelho - Luciana Rocha', date: '2024-01-08', status: 'pending' },
                { id: 9, name: 'Densitometria - Mariana Dias', date: '2024-01-07', status: 'completed' },
                { id: 10, name: 'Ecocardiograma - Carlos Eduardo', date: '2024-01-06', status: 'analyzing' },
                { id: 11, name: 'Mamografia - Vera Lúcia', date: '2024-01-05', status: 'completed' },
                { id: 12, name: 'Tomografia Crânio - Rafael Alves', date: '2024-01-04', status: 'pending' },
                { id: 13, name: 'Raio-X Abdômen - Simone Nunes', date: '2024-01-03', status: 'completed' },
                { id: 14, name: 'Ressonância Joelho - Ricardo Teixeira', date: '2024-01-02', status: 'analyzing' },
                { id: 15, name: 'Ultrassom Tireoide - Patrícia Gomes', date: '2024-01-01', status: 'completed' },
                { id: 16, name: 'TC Tórax - André Campos', date: '2023-12-31', status: 'completed' },
                { id: 17, name: 'RM Ombro - Tatiana Reis', date: '2023-12-30', status: 'analyzing' },
                { id: 18, name: 'Raio-X Punho - Gustavo Martins', date: '2023-12-29', status: 'pending' },
                { id: 19, name: 'Ecografia - Helena Nogueira', date: '2023-12-28', status: 'completed' }
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
}

.exam-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    transition: all 0.3s ease;
    border-left: 2px solid transparent;
}

.exam-item:hover {
    background: rgba(0, 242, 255, 0.05);
    border-left-color: var(--cyber-blue, #00f2ff);
}

.exam-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
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

.exam-status {
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
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

@media (max-width: 1024px) {
    .dashboard-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-stats {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .dashboard-stats {
        grid-template-columns: 1fr;
    }
    
    .dashboard-header h1 {
        font-size: 1.8rem;
    }
}
</style>