<template>
  <div class="login-container flex items-center justify-center min-h-screen bg-gray-100">
    <div class="login bg-white p-8 rounded-lg shadow-lg w-80">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>
      <form @submit.prevent="login">
        <div class="form-group mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username:</label>
          <input type="text" id="username" v-model="username" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div class="form-group mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password:</label>
          <input type="password" id="password" v-model="password" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <button type="submit" class="btn w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">Login</button>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

const username = ref('');
const password = ref('');
const router = useRouter();
const store = useStore();

const login = async () => {
  try {
    const response = await axios.post('http://localhost:8081/login', {
      username: username.value,
      password: password.value
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const token = response.data.token;
    const userId = response.data.userId;
    localStorage.setItem('token', token);
    store.dispatch('login', { id: userId, username: username.value });
    router.push('/');
  } catch (error) {
    console.error('Login failed', error);
  }
};

</script>
<style scoped>
.login-container {
  @apply flex items-center justify-center min-h-screen bg-gray-100;
}

.login {
  @apply bg-white p-8 rounded-lg shadow-lg w-80;
}

h2 {
  @apply text-2xl font-bold mb-4 text-center;
}

.form-group {
  @apply mb-4;
}

.form-group label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.form-group input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md;
}

.btn {
  @apply w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300;
}
</style>
