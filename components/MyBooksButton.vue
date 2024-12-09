<template>
    <button @click="toggleMyBooks">
      {{ isInMyBooks ? 'Remove from MyBooks' : 'Add to MyBooks' }}
    </button>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  import { useMyBooksStore } from '@/stores/useMyBooksStore';
  
  const myBooksStore = useMyBooksStore();
  
  const book = defineProps({
    book: Object,
  });
  
  const isInMyBooks = computed(() => {
    return myBooksStore.books.some(b => b.id_book === book.id_book);
  });
  
  function toggleMyBooks() {
    if (isInMyBooks.value) {
      myBooksStore.removeBook(book.id_book);
    } else {
      myBooksStore.addBook(book);
    }
  }
  </script>
  