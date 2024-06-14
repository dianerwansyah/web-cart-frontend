<template>
  <div>
    <div class="quantity-selector">
      <button @click="decreaseQuantity" class="text-xl px-3">-</button>
      <span class="mx-4 text-lg">{{ quantity }}</span>
      <button @click="increaseQuantity" class="text-xl px-3">+</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import { defineProps } from 'vue';
import axios from 'axios';

const props = defineProps({
  productId: Number,
  initialQuantity: Number,
  stock: Number, // Tambahkan properti stock
});

const store = useStore();
const userId = computed(() => store.getters.userId);
const quantity = ref(props.initialQuantity);

watch(() => props.initialQuantity, (newQuantity) => {
  quantity.value = newQuantity;
});

const increaseQuantity = () => {
  if (quantity.value < props.stock) { // Periksa apakah jumlah kurang dari stok
    const payload = {
      ProductId: props.productId,
      Quantity: quantity.value + 1,
      UserID: userId.value,
    };

    axios.post('http://localhost:8083/api/cart/save', payload)
      .then(response => {
        console.log('Update response:', response.data);
        store.dispatch('updateCartItemQuantity', { productId: props.productId, quantity: quantity.value + 1 });
        quantity.value += 1;
      })
      .catch(error => {
        console.error('Error updating cart:', error);
      });
  } else {
    alert('Stok tidak mencukupi, sisa Stok : ' + props.stock);
  }
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    const payload = {
      ProductId: props.productId,
      Quantity: quantity.value - 1,
      UserID: userId.value,
    };

    axios.post('http://localhost:8083/api/cart/save', payload)
      .then(response => {
        console.log('Update response:', response.data);
        store.dispatch('updateCartItemQuantity', { productId: props.productId, quantity: quantity.value - 1 });
        quantity.value -= 1;
      })
      .catch(error => {
        console.error('Error updating cart:', error);
      });
  } else {
    axios.post('http://localhost:8083/api/cart/save', {
      ProductId: props.productId,
      Quantity: 0,
      UserID: userId.value,
    })
    .then(response => {
      console.log('Remove response:', response.data);
      store.dispatch('removeFromCart', props.productId);
      quantity.value = 0;
    })
    .catch(error => {
      console.error('Error removing from cart:', error);
    });
  }
}
</script>

<style scoped>
.quantity-selector {
  @apply flex items-center border border-gray-300 rounded-md w-28;
}

.quantity-selector button {
  @apply text-xl px-3;
}

.quantity-selector span {
  @apply mx-4 text-lg;
}
</style>
