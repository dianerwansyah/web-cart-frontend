<template>
    <div class="register-container flex items-center justify-center min-h-screen bg-gray-100">
      <div class="form-container bg-white p-8 rounded-lg shadow-lg w-80 text-center">
        <h2 class="text-2xl font-bold mb-4">User Register</h2>
        <form @submit.prevent="register">
          <div class="input-group mb-4 text-left">
            <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username:</label>
            <input type="text" v-model="username" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div class="input-group mb-4 text-left">
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Password:</label>
            <input type="password" v-model="password" required class="w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <button type="submit" class="btn w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300">Register</button>
        </form>
        <p class="mt-4 text-sm">Already have an account? <router-link to="/" class="text-blue-600 hover:underline">Login here</router-link>.</p>
      </div>
    </div>
  </template>
<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const role = ref('user'); // default role
const router = useRouter();

const register = async () => {
    try {
        await axios.post('http://localhost:8081/register', {
            username: username.value,
            password: password.value,
            role: role.value
        });
        alert('Registration successful');
        router.push('/');
    } catch (error) {
        alert('Registration failed');
    }
};
</script>
<style scoped>
.register-container {
  @apply flex items-center justify-center min-h-screen bg-gray-100;
}

.form-container {
  @apply bg-white p-8 rounded-lg shadow-lg w-80 text-center;
}

h2 {
  @apply text-2xl font-bold mb-4;
}

.input-group {
  @apply mb-4 text-left;
}

.input-group label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}

.input-group input,
.input-group select {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md;
}

.btn {
  @apply w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300;
}

p {
  @apply mt-4 text-sm;
}

.router-link-active {
  @apply text-blue-600 hover:underline;
}
</style>
  