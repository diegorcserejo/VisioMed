<template>
    <div class="home">
        <HeroSection @explore="explore" @watchVideo="watchVideo" />
        
        <section class="about">
            <div class="about-container">
                <div class="about-image">
                    <img src="../assests/subcapa.png" alt="Medical Team">
                </div>
                
                <div class="about-content">
                    <span class="section-tag"><i class="fas fa-info-circle"></i> SOBRE NÓS</span>
                    <h2>VisioMed<br>Desde 2023</h2>
                    <p>Combinamos expertise clínica, tecnologia inovadora e uma abordagem centrada no paciente 
                    para garantir diagnóstico preciso e tratamento eficaz. Comprometidos com sua saúde e bem-estar.</p>
                    <button class="btn-learn" @click="$router.push('/doctors')">
                        Conheça Nossos Médicos <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </section>
        
        <section class="departments">
            <div class="container">
                <span class="section-tag center"><i class="fas fa-building"></i> EXPLORE NOSSOS</span>
                <h2 class="section-title">Departamentos Médicos</h2>
                
                <div class="departments-grid">
                    <DepartmentCard 
                        v-for="dept in departments"
                        :key="dept.number"
                        :number="dept.number"
                        :title="dept.title"
                        :description="dept.description"
                    />
                </div>
            </div>
        </section>
        
        <section class="doctors">
            <div class="container">
                <span class="section-tag center"><i class="fas fa-user-md"></i> CONHEÇA NOSSO</span>
                <h2 class="section-title">Time Médico Especializado</h2>
                
                <div class="doctors-grid">
                    <DoctorCard 
                        v-for="doctor in doctors"
                        :key="doctor.name"
                        :name="doctor.name"
                        :specialty="doctor.specialty"
                    />
                </div>
                
                <div class="view-all-container">
                    <button class="btn-view-all" @click="$router.push('/doctors')">
                        Ver Todos os Médicos <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </section>
        
        <section class="dna-testing">
            <div class="dna-content">
                <span class="dna-badge"><i class="fas fa-dna"></i> OFERECEMOS TESTE DE DNA</span>
                <h2>Relatórios de DNA: <span class="count">5.5K+</span></h2>
                <button class="btn-dna" @click="$router.push('/exams')">
                    Começar <i class="fas fa-arrow-right"></i>
                </button>
                <div class="trust-badges">
                    <span><i class="fas fa-shield-alt"></i> Teste Confiável e Seguro</span>
                    <span><i class="fas fa-chart-line"></i> 99.9% de Precisão</span>
                    <span><i class="fas fa-chart-pie"></i> Taxa de Correspondência</span>
                </div>
            </div>
        </section>
        
        <section class="articles">
            <div class="container">
                <span class="section-tag center"><i class="fas fa-newspaper"></i> ÚLTIMAS DO</span>
                <h2 class="section-title">Frentes Médicas</h2>
                
                <div class="articles-grid">
                    <div class="article-card" v-for="article in articles" :key="article.title">
                        <div class="article-img">
                            <i class="fas fa-microscope"></i>
                        </div>
                        <div class="article-content">
                            <p class="article-text">{{ article.text }}</p>
                            <span class="article-author"><i class="fas fa-user"></i> {{ article.author }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import HeroSection from '../components/HeroSection.vue'
import StatsCard from '../components/StatsCard.vue'
import DepartmentCard from '../components/DepartmentCard.vue'
import DoctorCard from '../components/DoctorCard.vue'

export default {
    name: 'Home',
    components: { HeroSection, StatsCard, DepartmentCard, DoctorCard },
    data() {
        return {
            departments: [
                { number: '01', title: 'Cardiologia', description: 'Cuidado cardíaco abrangente incluindo angioplastia, medicamentos e cirurgia de ponte' },
                { number: '02', title: 'Neurologia', description: 'Diagnóstico e tratamento de AVC, lesões nos nervos e medula espinhal' },
                { number: '03', title: 'Ortopedia', description: 'Cuidados com ossos e articulações; fraturas, artrite, substituição de articulações' },
                { number: '04', title: 'Gastroenterologia', description: 'Atendimento especializado para problemas digestivos, fígado e pâncreas' },
                { number: '05', title: 'Pediatria', description: 'Serviços médicos para bebês, crianças e adolescentes' },
                { number: '06', title: 'Ginecologia', description: 'Saúde da mulher, cuidados na gravidez e parto' },
                { number: '07', title: 'Urologia', description: 'Funções renais, bexiga e reprodutivas masculinas avançadas' },
                { number: '08', title: 'Radiologia', description: 'Serviços de imagem de alta tecnologia incluindo MRI, Tomografia e Raio-X' }
            ],
            doctors: [
                { name: 'Dr. Mehdi Hasan', specialty: 'Cirurgião Cardíaco' },
                { name: 'Dra. Hamida Jannat', specialty: 'Cardiologista' },
                { name: 'Dr. Haseeb Hossain', specialty: 'Neurologista' },
                { name: 'Dr. Jeroen van der Schoot', specialty: 'Neurocirurgião' }
            ],
            articles: [
                { text: 'Descubra como diagnósticos alimentados por IA estão transformando avaliações clínicas diárias', author: 'Dra. Ana Silva' },
                { text: 'Explore o papel da medicina de precisão e como a genômica está personalizando o cuidado ao paciente', author: 'Dr. Carlos Mendes' },
                { text: 'Explore nossos últimos artigos sobre avanços médicos, tecnologias inteligentes e cuidado centrado no paciente', author: 'Dra. Paula Costa' }
            ]
        }
    },
    methods: {
        explore() {
            this.$router.push('/exams')
        },
        watchVideo() {
            console.log('Watch video')
        }
    }
}
</script>

<style scoped>
.home {
    padding-top: 80px;
}

.about {
    background: linear-gradient(135deg, rgba(0, 242, 255, 0.03), rgba(0, 255, 136, 0.01));
    padding: 5rem 2rem;
}

.about-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    gap: 4rem;
    align-items: center;
}

.about-image {
    flex: 1;
    position: relative;
    border-radius: 30px;
    overflow: hidden;
}

.about-image img {  
    width: 100%;
    border-radius: 30px;
}

.experience-badge {
    position: absolute;
    bottom: -20px;
    right: -20px;
    background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    padding: 1.5rem;
    border-radius: 20px;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.3);
}

.years {
    font-size: 2rem;
    font-weight: 800;
    color: #000;
    display: block;
    line-height: 1;
}

.text {
    font-size: 0.8rem;
    color: #000;
    font-weight: 500;
}

.about-content {
    flex: 1;
}

.section-tag {
    color: var(--cyber-blue, #00f2ff);
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.section-tag.center {
    display: flex;
    justify-content: center;
}

.about-content h2 {
    font-size: 2.5rem;
    color: #fff;
    margin-bottom: 1.5rem;
}

.about-content p {
    color: #aaa;
    line-height: 1.6;
    margin-bottom: 2rem;
}

.btn-learn {
    background: transparent;
    border: 2px solid var(--cyber-blue, #00f2ff);
    padding: 12px 28px;
    border-radius: 40px;
    color: var(--cyber-blue, #00f2ff);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-learn:hover {
    background: var(--cyber-blue, #00f2ff);
    color: #000;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 242, 255, 0.3);
}

.departments, .doctors, .articles {
    padding: 5rem 2rem;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

.section-title {
    font-size: 2.5rem;
    text-align: center;
    color: #fff;
    margin-bottom: 3rem;
}

.departments-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1.5rem;
}

.doctors-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

.view-all-container {
    text-align: center;
    margin-top: 3rem;
}

.btn-view-all {
    background: transparent;
    border: 2px solid var(--cyber-blue, #00f2ff);
    padding: 12px 32px;
    border-radius: 40px;
    color: var(--cyber-blue, #00f2ff);
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-view-all:hover {
    background: var(--cyber-blue, #00f2ff);
    color: #000;
    transform: translateY(-2px);
}

.dna-testing {
    background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    padding: 4rem 2rem;
    text-align: center;
}

.dna-content {
    max-width: 600px;
    margin: 0 auto;
}

.dna-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.2);
    padding: 0.5rem 1rem;
    border-radius: 30px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
}

.dna-content h2 {
    font-size: 2.5rem;
    color: #000;
    margin-bottom: 1.5rem;
}

.count {
    font-weight: 800;
    font-size: 3rem;
}

.btn-dna {
    background: #000;
    color: #fff;
    border: none;
    padding: 12px 32px;
    border-radius: 40px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 2rem;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
}

.btn-dna:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.trust-badges {
    display: flex;
    justify-content: center;
    gap: 2rem;
    color: #000;
    font-weight: 500;
    flex-wrap: wrap;
}

.trust-badges span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.article-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.article-card:hover {
    transform: translateY(-5px);
    background: rgba(0, 242, 255, 0.05);
    border-color: rgba(0, 242, 255, 0.3);
}

.article-img {
    height: 200px;
    background: linear-gradient(135deg, rgba(0, 242, 255, 0.1), rgba(0, 255, 136, 0.05));
    display: flex;
    align-items: center;
    justify-content: center;
}

.article-img i {
    font-size: 4rem;
    color: var(--cyber-blue, #00f2ff);
}

.article-content {
    padding: 1.5rem;
}

.article-text {
    color: #fff;
    line-height: 1.5;
    margin-bottom: 1rem;
}

.article-author {
    color: var(--cyber-blue, #00f2ff);
    font-size: 0.9rem;
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

@media (max-width: 1024px) {
    .about-container {
        flex-direction: column;
    }
    
    .departments-grid,
    .doctors-grid,
    .articles-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .departments-grid,
    .doctors-grid,
    .articles-grid {
        grid-template-columns: 1fr;
    }
    
    .trust-badges {
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .about-content h2 {
        font-size: 1.8rem;
    }
}
</style>