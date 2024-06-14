<template>
  <div>
    <AppHeader />
    <div class="summary-page container mx-auto p-4 mt-4 bg-white rounded-lg shadow-lg">
      <h2 class="text-3xl font-bold mb-4">Summary</h2>
      <table class="w-full mb-4">
        <thead>
          <tr>
            <th class="text-left p-2">Product</th>
            <th class="text-left p-2">Price</th>
            <th class="text-left p-2">Quantity</th>
            <th class="text-left p-2">Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.id">
            <td class="p-2">
                <div>{{ item.Product.Name }}</div>
                <img :src="item.Product.ImageURL" :alt="item.Product.Name" class="product-image mt-2">
            </td>
            <td class="p-2">Rp. {{ item.Product.Price }}</td>
            <td class="p-2">
              <input type="number" v-model.number="item.Quantity" class="w-16 bg-white text-center" :disabled="true" >
            </td>
            <td class="p-2">Rp. {{ (item.Product.Price * item.Quantity).toFixed(3) }}</td>              
          </tr>
        </tbody>
      </table>
      <div class="cart-footer flex justify-end items-center custom-margin">
        <div class="cart-summary">
          <p class="text-xl font-semibold">Total Kupon: {{ totalCoupons }}</p>
          <p class="text-xl font-semibold">Total Price: Rp. {{ totalPrice }}</p>
          <button class="btn mt-4" @click="confirm">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import AppHeader from '@/components/AppHeader.vue'; // Import AppHeader

const router = useRouter();
const store = useStore();

const cartItems = ref([]);

const fetchCartItems = async () => {
  try {
    const userId = store.getters.userId;
    const IsCheckout = true;
    const IsConfirm = false;
    const response = await axios.post('http://localhost:8083/api/cart/get', { userId, IsCheckout, IsConfirm });
    cartItems.value = response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};

const totalPrice = computed(() => {
  const total = cartItems.value.reduce((acc, item) => acc + (item.Product.Price * item.Quantity), 0);
  return parseFloat(total.toFixed(3));
});

const totalCoupons = computed(() => {
  let couponsFromProducts = cartItems.value.reduce((acc, item) => {
    const couponsForProduct = item.Product.Price > 50000 ? item.Quantity : 0;
    return acc + couponsForProduct;
  }, 0);

  const couponsFromTotalPrice = Math.floor(totalPrice.value / 100000);

  return couponsFromProducts + couponsFromTotalPrice;
});

const confirm = async () => {
  try {
    const userId = store.getters.userId;
    const checkoutPayload = cartItems.value.map(item => ({
      ProductID: item.Product.id,
      Name: item.Product.Name,
      Description: item.Product.Description,
      Price: item.Product.Price,
      ImageURL: item.Product.ImageURL,
      Quantity: item.Quantity,
      IsCheckout: true,
      IsConfirm: false,
    }));

    const response = await axios.post('http://localhost:8083/api/cart/saveconfirm', {
      UserID: userId,
      IsCheckout: true,
      IsConfirm: true,
      Target: checkoutPayload,
      TotalCoupons: totalCoupons.value,
    });
    
    console.log('confrim response:', response.data);
    router.push('/history');
  } catch (error) {
    console.error('Error during confrim:', error);
  }
};


onMounted(() => {
  fetchCartItems();
});
</script>



<style scoped>
.summary-page {
  @apply p-4 bg-white rounded-lg shadow-lg max-w-3xl mx-auto;
}

table {
  @apply w-full mb-4;
}

th, td {
  @apply p-2;
}

input[type="number"] {
  @apply w-16 text-center;
}

.btn {
  @apply inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-300;
}

.btn:hover {
  @apply bg-blue-700;
}

.cart-summary {
  @apply mr-4;
}

.cart-footer {
  @apply flex justify-end items-center mt-4;
}

.custom-margin {
  margin-right: 50px; /* Ganti 50px dengan ukuran yang Anda inginkan */
}

.product-image {
    @apply w-12 h-12 object-fill; /* Sesuaikan ukuran gambar sesuai kebutuhan */
  }
</style>
