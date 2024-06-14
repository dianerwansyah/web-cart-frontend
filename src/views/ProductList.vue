<template>
  <div class="main-container flex">
    <div class="sidebar bg-gray-100 p-4 border-r border-gray-300">
      <h2 class="text-xl font-bold mb-4">Category Product</h2>
      <ul class="list-none p-0">
        <li 
          v-for="category in categories" 
          :key="category.id" 
          @click="toggleCategoryFilter(category.id)"
          :class="{'mb-2 p-2 cursor-pointer hover:bg-gray-200': true, 'active': selectedCategoryId === category.id}"
        >
          {{ category.name }}
        </li>
      </ul>
    </div>
    <div class="products-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
      <div class="product" v-for="(product, index) in products" :key="product.id" :class="{'ml-4': index !== 0}">
        <div class="image-container">
          <img :src="product.ImageURL" :alt="product.Name" class="product-image" @click="viewProductDetails(product)">
        </div>
        <h3 @click="viewProductDetails(product)" class="product-title">{{ product.Name }}</h3>
        <p class="product-price">Rp.{{ product.Price.toFixed(3) }}</p>
        <div v-if="getCartItemQuantity(product.id) > 0" class="flex items-center border border-gray-300 rounded-md w-28 mx-auto">
          <QuantitySelector :productId="product.id" :initialQuantity="getCartItemQuantity(product.id)" :stock="product.Stock" />
        </div>
        <button v-else class="btn" @click="addToCart(product)">Add to Cart</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';
import QuantitySelector from '@/components/QuantitySelector.vue';

const categories = ref([]);
const products = ref([]);
const cartItems = ref([]);
const selectedCategoryId = ref(null);
const router = useRouter();
const store = useStore();

const fetchCategories = async () => {
  try {
    const categoryResponse = await axios.get('http://localhost:8083/api/categories');
    categories.value = categoryResponse.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const fetchProducts = async () => {
  try {
    const response = await axios.post('http://localhost:8083/api/products/get', {
      filtertype: "limit", 
      limit: 16
    });
    products.value = response.data;
    selectedCategoryId.value = null; // Reset selected category
  } catch (error) {
    console.error('Error fetching products:', error);
  }
};

const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await axios.post('http://localhost:8083/api/products/get', {
      filtertype: "category",
      field: "CategoryID",
      value: categoryId,
      limit: 9
    });
    products.value = response.data; // Update products based on category
  } catch (error) {
    console.error('Error fetching products by category:', error);
  }
};

const fetchCartItems = async () => {
  try {
    const userId = store.getters.userId;
    const response = await axios.post('http://localhost:8083/api/cart/get', { userId });
    cartItems.value = response.data;
    store.commit('setCart', response.data); // Update cart in Vuex store
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};

const toggleCategoryFilter = (categoryId) => {
  if (selectedCategoryId.value === categoryId) {
    fetchProducts(); // Reset to default filter
  } else {
    fetchProductsByCategory(categoryId);
    selectedCategoryId.value = categoryId; // Set selected category
  }
};

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

const viewProductDetails = (product) => {
  sessionStorage.setItem('product', JSON.stringify(product));
  router.push({ name: 'ProductDetail' });
};

const getCartItemQuantity = (productId) => {
  const item = cartItems.value.find(item => item.Product.id === productId);
  return item ? item.Quantity : 0;
};

onMounted(() => {
  fetchCategories();
  fetchProducts();
  fetchCartItems();
});
</script>

<style scoped>
.sidebar {
  @apply bg-gray-100 p-4 border-r border-gray-300;
}
.sidebar h2 {
  @apply text-xl font-bold mb-4;
}
.sidebar ul {
  @apply list-none p-0;
}
.sidebar li {
  @apply mb-2 p-2 cursor-pointer hover:bg-gray-200;
}
.sidebar li.active {
  @apply bg-blue-500 text-white;
}
.products-container {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4;
  flex: 1;
}

.product {
  @apply bg-white p-4 rounded-lg shadow-md text-center relative;
  flex: 1;
  box-sizing: border-box;
  margin-left: 10px; /* Ubah nilai sesuai kebutuhan */
}

.image-container {
  @apply w-3/4 mx-auto; /* Menyempitkan lebar gambar dan memusatkannya */
}

.product-image {
  @apply w-full h-32 object-fill mb-2 cursor-pointer;
}

.product-title {
  @apply mb-2 text-gray-800 cursor-pointer;
}

.product-price {
  @apply mb-4 text-blue-500 text-lg;
}

.btn {
  @apply inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition-colors duration-300;
}

.btn:hover {
  @apply bg-blue-700;
}
</style>
