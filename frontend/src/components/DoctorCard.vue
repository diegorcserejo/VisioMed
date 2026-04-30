<template>
    <div class="doctor-card">
        <div class="doctor-image">
            <div class="image-placeholder">
                <i class="fas fa-user-md"></i>
            </div>
        </div>
        <h3 class="doctor-name">{{ name }}</h3>
        <p class="doctor-specialty">{{ specialty }}</p>
        <div class="doctor-social">
            <a href="#" class="social-link"><i class="fas fa-envelope"></i></a>
            <a href="#" class="social-link"><i class="fab fa-linkedin"></i></a>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DoctorCard',
    props: ['name', 'specialty']
}
</script>

<style scoped>
.doctor-card {
    text-align: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 20px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.doctor-card:hover {
    transform: translateY(-5px);
    background: rgba(0, 242, 255, 0.05);
    border-color: rgba(0, 242, 255, 0.3);
}

.doctor-image {
    width: 150px;
    height: 150px;
    margin: 0 auto 1rem;
}

.image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 242, 255, 0.2), rgba(0, 255, 136, 0.2));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: var(--cyber-blue, #00f2ff);
    border: 2px solid rgba(0, 242, 255, 0.3);
}

.doctor-name {
    color: #fff;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
}

.doctor-specialty {
    color: var(--cyber-blue, #00f2ff);
    font-size: 0.9rem;
    margin-bottom: 1rem;
}

.doctor-social {
    display: flex;
    justify-content: center;
    gap: 1rem;
}

.social-link {
    color: #888;
    text-decoration: none;
    transition: all 0.3s ease;
    font-size: 1.2rem;
}

.social-link:hover {
    color: var(--cyber-blue, #00f2ff);
    transform: translateY(-2px);
}
</style>