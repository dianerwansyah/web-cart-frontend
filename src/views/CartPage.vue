<template>
    <div>
      <AppHeader />
      <div class="cart-page container mx-auto p-4 mt-4 bg-white rounded-lg shadow-lg">
        <h2 class="text-3xl font-bold mb-4">Your Cart</h2>
        <table class="w-full mb-4">
          <thead>
            <tr>
              <th class="text-left p-2">Product</th>
              <th class="text-left p-2">Price</th>
              <th class="text-left p-2">Quantity</th>
              <th class="text-left p-2">Total</th>
              <th class="text-left p-2">Actions</th>
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
                <input type="number" v-model.number="item.Quantity" @change="updateQuantity(item.Product.id, item.Quantity)" class="w-16 text-center">
              </td>
              <td class="p-2">Rp. {{ (item.Product.Price * item.Quantity).toFixed(3) }}</td>
              <td class="p-2">
                <button @click="removeFromCart(item.Product.id)" class="text-red-500">Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="cart-footer flex justify-end items-center custom-margin">
          <div class="cart-summary">
            <p class="text-xl font-semibold">Total Items: {{ totalItems }}</p>
            <p class="text-xl font-semibold">Total Price: Rp. {{ totalPrice }}</p>
            <button class="btn mt-4" @click="checkout">Checkout</button>
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
      const IsCheckout = false;
      const IsConfirm = false;
      const response = await axios.post('http://localhost:8083/api/cart/get', { userId, IsCheckout, IsConfirm });
      cartItems.value = response.data;
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  
  onMounted(() => {
    fetchCartItems();
  });
  
  const totalItems = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + item.Quantity, 0);
  });
  
  const totalPrice = computed(() => {
    const total = cartItems.value.reduce((acc, item) => acc + (item.Product.Price * item.Quantity), 0);
    return parseFloat(total.toFixed(3));
  });
  
  const updateQuantity = async (productId, quantity) => {
    try {
      const userId = store.getters.userId;
      const payload = {
        ProductId: productId,
        Quantity: quantity,
        UserID: userId,
        IsCheckout: false,
        IsConfirm: false,
      };
  
      const response = await axios.post('http://localhost:8083/api/cart/save', payload);
      console.log('Update response:', response.data);
      store.dispatch('updateCartItemQuantity', { productId, quantity });
      fetchCartItems(); // Refresh cart items after updating quantity
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  
  const removeFromCart = async (productId) => {
    try {
      const userId = store.getters.userId;
      const payload = {
        ProductId: productId,
        Quantity: 0,
        UserID: userId,
        IsCheckout: false,
        IsConfirm: false,
      };
  
      const response = await axios.post('http://localhost:8083/api/cart/save', payload);
      console.log('Remove response:', response.data);
      store.dispatch('updateCartItemQuantity', { productId, quantity: 0 });
      fetchCartItems(); // Refresh cart items after removal
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const checkout = async () => {
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

    const response = await axios.post('http://localhost:8083/api/cart/savecheckout', {
      UserID: userId,
      IsCheckout: true,
      IsConfirm: false,
      Target: checkoutPayload,
    });
    
    console.log('Checkout response:', response.data);
    router.push('/summary');
  } catch (error) {
    console.error('Error during checkout:', error);
  }
};

  </script>
  
  <style scoped>
  .cart-page {
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