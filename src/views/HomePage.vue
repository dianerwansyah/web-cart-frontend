<template>
  <div>
    <AppHeader />
    <div class="home bg-gray-100 min-h-screen pt-24">
      <div class="home-content flex flex-col lg:flex-row justify-center items-start max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div class="main-content flex-grow">
          <h2 class="text-2xl font-bold mb-4">Trending Products</h2>
          <ProductList />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppHeader from '@/components/AppHeader.vue';
import ProductList from '@/views/ProductList.vue';
</script>

<style scoped>
.home {
  @apply bg-gray-100 min-h-screen pt-24;
}

.home-content {
  @apply flex flex-col lg:flex-row justify-center items-start max-w-screen-xl mx-auto bg-white p-8 rounded-lg shadow-lg;
}
</style>
