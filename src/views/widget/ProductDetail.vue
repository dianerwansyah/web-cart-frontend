<template>
  <div>
    <AppHeader />
    <div class="product-detail container mx-auto p-4 mt-4 bg-white rounded-lg shadow-lg flex">
      <div class="product-image-container mr-4">
        <img :src="product.ImageURL" :alt="product.Name" class="product-image mb-4 rounded-md">
      </div>
      <div class="product-info">
        <h2 class="text-3xl font-bold mb-4">{{ product.Name }}</h2>
        <p class="mb-4 text-gray-700 break-words" v-html="product.Description"></p>        
        <p class="mb-4 text-xl font-semibold text-blue-500">Price: Rp.{{ product.Price }}</p>
        <div class="actions-container">
        <div v-if="getCartItemQuantity(product.id) > 0">
          <QuantitySelector :productId="product.id" :initialQuantity="getCartItemQuantity(product.id)" :stock="product.Stock" />
        </div>
        <button v-else class="btn" @click="addToCart(product)">Add to Cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AppHeader from '@/components/AppHeader.vue';
import QuantitySelector from '@/components/QuantitySelector.vue';
import axios from 'axios';

const router = useRouter();
const store = useStore();

const product = ref({});
const cartItems = ref([]);

onMounted(() => {
  const storedProduct = sessionStorage.getItem('product');
  if (storedProduct) {
    product.value = JSON.parse(storedProduct);
  } else {
    router.push('/');
  }
});

const addToCart = (product) => {
  if (!store.getters.isLoggedIn) {
    router.push('/login');
  } else {
    const payload = {
      ProductId: product.id,
      Quantity: 1,
      UserID: store.getters.userId,
    };
    
    axios.post('http://localhost:8083/api/cart/save', payload)
      .then(response => {
        console.log('Product added to cart:', response.data);
        fetchCartItems(); // Refresh cart items after adding a new product
      })
      .catch(error => {
        console.error('Error adding product to cart:', error);
      });
  }
};

const fetchCartItems = async () => {
  try {
    const userId = store.getters.userId;
    const response = await axios.post('http://localhost:8083/api/cart/get', { userId });
    cartItems.value = response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};


const getCartItemQuantity = (productId) => {
  const item = cartItems.value.find(item => item.Product.id === productId);
  return item ? item.Quantity : 0;
};

onMounted(() => {
  fetchCartItems();
});

</script>

<style scoped>
.product-detail {
  @apply p-2 flex max-w-3xl mx-auto;
}

.product-image-container {
  @apply flex-shrink-0 mr-4;
}
.product-image {
  @apply w-48 h-48 object-fill mb-4 rounded-md;
}

.product-info {
  @apply flex-1;
}

h2 {
  @apply text-3xl font-bold mb-4;
}

p {
  @apply mb-2;
}

.description {
  word-wrap: break-word;
  word-break: break-word;
}

.btn {
  @apply inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-300;
}

.btn:hover {
  @apply bg-blue-700;
}

.actions-container {
  @apply mt-4;
}
</style>
