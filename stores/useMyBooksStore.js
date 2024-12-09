import { defineStore } from 'pinia';

export const useMyBooksStore = defineStore('myBooks', {
  state: () => ({
    myBooks: [], // Initialize as an empty array
  }),
  actions: {
    addToMyBooks(bookId) {
      if (!this.myBooks.includes(bookId)) {
        this.myBooks.push(bookId);
      }
    },
    removeFromMyBooks(bookId) {
      this.myBooks = this.myBooks.filter(id => id !== bookId);
    },
  },
});
