<template>
    <div class="department-card">
        <div class="dept-number">{{ number }}</div>
        <h3 class="dept-title">{{ title }}</h3>
        <p class="dept-desc">{{ description }}</p>
        <a href="#" class="dept-link">
            Saiba Mais <i class="fas fa-arrow-right"></i>
        </a>
    </div>
</template>

<script>
export default {
    name: 'DepartmentCard',
    props: ['number', 'title', 'description']
}
</script>

<style scoped>
.department-card {
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.department-card:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 242, 255, 0.3);
    box-shadow: 0 10px 30px rgba(0, 242, 255, 0.1);
    background: rgba(0, 242, 255, 0.05);
}

.dept-number {
    font-size: 2rem;
    font-weight: 800;
    color: var(--cyber-blue, #00f2ff);
    margin-bottom: 1rem;
}

.dept-title {
    font-size: 1.3rem;
    color: #fff;
    margin-bottom: 0.75rem;
}

.dept-desc {
    color: #888;
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 0.9rem;
}

.dept-link {
    color: var(--cyber-blue, #00f2ff);
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.dept-link:hover {
    color: var(--emerald, #00ff88);
    gap: 12px;
}
</style>