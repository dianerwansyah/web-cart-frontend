import { createStore } from 'vuex';
import axios from 'axios';

const store = createStore({
  state: {
    isLoggedIn: false,
    user: {
      id: '',
      username: ''
    },
    cart: [],
    products: [] // Tambahkan state untuk produk
  },
  mutations: {
    login(state, user) {
      state.isLoggedIn = true;
      state.user.id = user.id;
      state.user.username = user.username;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user.id = '';
      state.user.username = '';
      state.cart = [];
    },
    addToCart(state, product) {
      const item = state.cart.find(item => item.id === product.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(state, productId) {
      const index = state.cart.findIndex(item => item.id === productId);
      if (index !== -1) {
        state.cart.splice(index, 1);
      }
    },
    updateCartItemQuantity(state, { productId, quantity }) {
      const item = state.cart.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    setProducts(state, products) {
      state.products = products;
    },
    setCart(state, cartItems) {
      state.cart = cartItems.map(item => ({
        id: item.Product._id,
        ...item.Product,
        quantity: item.Quantity
      }));
    }
  },
  actions: {
    login({ commit }, user) {
      commit('login', user);
    },
    logout({ commit }) {
      commit('logout');
      localStorage.removeItem('token');
    },
    addToCart({ commit, dispatch }, product) {
      commit('addToCart', product);
      dispatch('fetchCartItems'); // Refresh cart items after adding a new product
    },
    removeFromCart({ commit, dispatch }, productId) {
      commit('removeFromCart', productId);
      dispatch('fetchCartItems'); // Refresh cart items after removing a product
    },
    updateCartItemQuantity({ commit, dispatch }, payload) {
      commit('updateCartItemQuantity', payload);
      dispatch('fetchCartItems'); // Refresh cart items after updating quantity
    },
    fetchCartItems({ commit }) {
      const userId = store.getters.userId;
      return axios.post('http://localhost:8083/api/cart/get', { userId })
        .then(response => {
          commit('setCart', response.data);
        })
        .catch(error => {
          console.error('Error fetching cart items:', error);
        });
    },
    fetchProducts({ commit }) { // Tambahkan action untuk mengambil produk dari API
      axios.get('/api/products')
        .then(response => {
          commit('setProducts', response.data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  },
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
    username: (state) => state.user.username,
    userId: (state) => state.user.id,
    cartItemCount: (state) => state.cart.reduce((count, item) => count + item.quantity, 0),
    cartItems: (state) => state.cart,
    products: (state) => state.products
  }
});

// Inisialisasi status login dari localStorage
const token = localStorage.getItem('token');
if (token) {
  // Validasi format token sebelum diurai
  if (token.split('.').length === 3) {
    try {
      const parts = token.split('.');
      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decodedToken = JSON.parse(jsonPayload);

      // Check if token has a username and is not expired
      if (decodedToken.username && decodedToken.userId && new Date(decodedToken.exp * 1000) > new Date()) {
        store.dispatch('login', { username: decodedToken.username, id: decodedToken.userId });
      } else {
        throw new Error('Invalid token: Token is expired or does not contain a valid username');
      }
    } catch (error) {
      console.error(error.message);
      localStorage.removeItem('token');
    }
  } else {
    console.error('Invalid token format: Token should have three parts separated by dots');
    localStorage.removeItem('token');
  }
} else {
  console.log('Token not found in localStorage');
}

export default store;
