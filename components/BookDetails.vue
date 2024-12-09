<template>
    <div v-if="book">
      <img :src="book.img_url" :alt="book.name_book" />
      <h1>{{ book.name_book }}</h1>
      <p>Author: {{ book.author }}</p>
      <p>Publisher: {{ book.publisher }}</p>
      <button @click="addToMyBooks(book)">Add to MyBooks</button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { useMyBooksStore } from '@/stores/useMyBooksStore';
  
  const route = useRoute();
  const book = ref(null);
  const myBooksStore = useMyBooksStore();
  
  async function fetchBookDetails() {
    const { data } = await axios.get('https://dev-app-api.abceed.com/mock/book/all');
    const books = data.top_category_list.flatMap(category =>
      category.sub_category_list.flatMap(subCategory => subCategory.book_list)
    );
    book.value = books.find(b => b.id_book === route.params.id);
  }
  
  function addToMyBooks(book) {
    myBooksStore.addBook(book);
  }
  
  fetchBookDetails();
  </script>  