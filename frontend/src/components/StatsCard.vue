<template>
    <div class="stats-card">
        <h3 class="stats-value">{{ value }}</h3>
        <p class="stats-label">{{ label }}</p>
    </div>
</template>

<script>
export default {
    name: 'StatsCard',
    props: ['value', 'label']
}
</script>

<style scoped>
.stats-card {
    text-align: center;
    padding: 1rem;
}

.stats-value {
    font-size: 1.8rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--cyber-blue, #00f2ff), var(--emerald, #00ff88));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 0.5rem;
}

.stats-label {
    color: #666;
    font-size: 0.85rem;
}
</style>