<template>
  <div>
    <AppHeader />
    <div class="history-page container mx-auto p-4 mt-4 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold mb-4">Purchase History</h2>
      <div v-for="(transactions, idTrx) in groupedHistoryItems" :key="idTrx" class="transaction-group mb-4">
        <h3 class="transaction-id text-2xl font-semibold mb-2">Transaction ID: {{ idTrx }}</h3>
        <p class="transaction-date mb-2">Date: {{ formatDate(transactions[0].Created) }}</p>    
        <table class="w-full mb-4">
          <thead>
            <tr>
              <th class="text-left p-2">Product</th>
              <th class="text-left p-2">Price</th>
              <th class="text-left p-2">Quantity</th>
              <th class="text-left p-2">Total</th>
              <th class="text-left p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in transactions" :key="item.id">
              <td class="p-2">
                <div>{{ item.Product.Name }}</div>
                <img :src="item.Product.ImageURL" :alt="item.Product.Name" class="product-image mt-2">
              </td>
              <td class="p-2">Rp. {{ item.Product.Price }}</td>
              <td class="p-2 text-center">{{ item.Quantity }}</td>
              <td class="p-2">Rp. {{ (item.Product.Price * item.Quantity).toFixed(3) }}</td>
              <td class="p-2">
                <span :class="getStatusClass(item.Created)">
                  {{ getStatus(item.Created) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import AppHeader from '@/components/AppHeader.vue'; // Import AppHeader

const store = useStore();
const historyItems = ref([]);

const fetchHistoryItems = async () => {
  try {
    const userId = store.getters.userId;
    const response = await axios.post('http://localhost:8083/api/history/get', { userId });
    historyItems.value = response.data;
  } catch (error) {
    console.error('Error fetching history items:', error);
  }
};

// Group history items by transaction ID (IDTrx)
const groupedHistoryItems = computed(() => {
  return historyItems.value.reduce((acc, item) => {
    const idTrx = item.IDTrx;
    if (!acc[idTrx]) {
      acc[idTrx] = [];
    }
    acc[idTrx].push(item);
    return acc;
  }, {});
});

// Get status based on the creation date
const getStatus = (createdDate) => {
  const now = new Date();
  const created = new Date(createdDate);
  const hoursDiff = Math.abs(now - created) / 36e5;
  return hoursDiff >= 3 ? 'Closed' : 'Open';
};

// Get status class based on the status
const getStatusClass = (createdDate) => {
  return getStatus(createdDate) === 'Closed' ? 'text-red-500' : 'text-green-500';
};

// Format date to a readable format
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(date).toLocaleDateString('en-US', options);
};

onMounted(() => {
  fetchHistoryItems();
});

</script>

<style scoped>
.history-page {
  padding: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  max-width: 768px;
  margin: 0 auto;
}
.transaction-group {
  margin-bottom: 1rem;
}

.transaction-id {
  background-color: #f0f0f0; /* Warna latar belakang */
  padding: 0.5rem;
  border-radius: 0.25rem;
}

table {
  width: 100%;
  margin-bottom: 1rem;
}

th, td {
  padding: 0.5rem;
}

.product-image {
  width: 3rem;
  height: 3rem;
  object-fit: fill;
}


.text-center {
  text-align: center;
}

.text-red-500 {
  color: #f56565;
}

.text-green-500 {
  color: #48bb78;
}
</style>
