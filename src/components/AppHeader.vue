<template>
  <header class="header bg-blue-600 text-white py-4">
    <div class="container mx-auto flex justify-between items-center px-4">
      <div class="logo flex items-center">
        <img src="@/assets/logo.png" alt="Logo" class="h-8 w-8 mr-2"/>
        <span class="text-lg font-bold">Web Cart</span>
      </div>
      <nav class="nav">
        <ul class="flex space-x-4">
          <li><router-link to="/" class="hover:underline">Products</router-link></li>
          <li><router-link to="/summary" class="hover:underline">Summary</router-link></li>
          <li><router-link to="/history" class="hover:underline">History</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/login" class="hover:underline">Login</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/register" class="hover:underline">Register</router-link></li>
          <li v-if="isLoggedIn"><router-link to="/profile" class="hover:underline">{{ username }}</router-link></li>
          <li v-if="isLoggedIn">
            <router-link to="/cart" class="hover:underline">Cart ({{ cartItemCount }})</router-link>
          </li>
          <li v-if="isLoggedIn"><button @click="logout" class="hover:underline">Logout</button></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isLoggedIn = computed(() => store.getters.isLoggedIn);
const username = computed(() => store.getters.username);
const cartItemCount = computed(() => store.getters.cartItemCount);

const logout = () => {
  store.dispatch('logout');
};
</script>

<style scoped>
.header {
  @apply bg-blue-600 text-white py-4;
}

.container {
  @apply mx-auto flex justify-between items-center px-4;
}

.logo {
  @apply flex items-center;
}

.nav ul {
  @apply flex space-x-4;
}

.nav li .hover\:underline:hover {
  @apply underline;
}

button.hover\:underline:hover {
  @apply underline;
}
</style>
