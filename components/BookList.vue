<template>
  <div>
    <h1 class="page-title">書籍一覧画面</h1>
    <div class="tabs">
      <button
        v-for="category in ['すべて', ...categories.map(c => c.name_category).filter(c => c !== 'すべて')]"
        :key="category"
        :class="{ active: selectedCategory === category }"
        @click="selectCategory(category)"
      >
        {{ category }}
      </button>
    </div>
    <div v-if="selectedCategory === 'すべて' || selectedCategory">
      <div
        v-for="subcategory in displayedSubcategories"
        :key="subcategory.id_category"
        class="subcategory"
        ref="subcategoryRefs"
      >
        <h2 class="subcategory-title">{{ subcategory.name_category }}</h2>
        <div class="books-container">
          <div class="books" :id="`books-container-${subcategory.id_category}`">
            <div
              v-for="book in subcategory.book_list"
              :key="book.id_book"
              class="book-item"
              @click="viewDetails(book)"
            >
              <img :src="book.img_url" :alt="book.name_book" loading="lazy" />
              <p class="book-title">{{ book.name_book }}</p>
            </div>
          </div>
          <div
            class="scroll-arrow left-arrow"
            @click="scrollLeft(subcategory.id_category)"
          >
            ❮
          </div>
          <div
            class="scroll-arrow right-arrow"
            @click="scrollRight(subcategory.id_category)"
          >
            ❯
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const categories = ref([]);
const selectedCategory = ref('すべて');
const displayedSubcategories = ref([]);
const router = useRouter();
const runtimeConfig = useRuntimeConfig();
const APIUrl = runtimeConfig.public.apiUrl;

// Intersection Observer for lazy loading subcategories
const observer = ref(null);
const subcategoryRefs = ref([]);

// Fetch book data
const fetchBooks = async () => {
  const { data } = await axios.get(APIUrl);
  categories.value = data.top_category_list;
  updateDisplaySubcategories();
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  updateDisplaySubcategories();
};

// Filter and display subcategories based on selected tab
const updateDisplaySubcategories = () => {
  if (selectedCategory.value === 'すべて') {
    displayedSubcategories.value = categories.value.flatMap(c => c.sub_category_list);
  } else {
    const selected = categories.value.find(c => c.name_category === selectedCategory.value);
    displayedSubcategories.value = selected ? selected.sub_category_list : [];
  }
};

// Navigate to book details page
const viewDetails = (book) => {
  router.push({
    path: `/book/${book.id_book}`,
    query: { book: JSON.stringify(book) },
  });
};

// Scroll left
const scrollLeft = (subcategoryId) => {
  const container = document.getElementById(`books-container-${subcategoryId}`);
  if (container) {
    container.scrollBy({ left: -200, behavior: 'smooth' });
  }
};

// Scroll right
const scrollRight = (subcategoryId) => {
  const container = document.getElementById(`books-container-${subcategoryId}`);
  if (container) {
    container.scrollBy({ left: 200, behavior: 'smooth' });
  }
};

// Lazy load subcategories when they come into view
const observeSubcategories = () => {
  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const subcategory = displayedSubcategories.value.find(
          (sc) => sc.id_category === entry.target.getAttribute('data-id')
        );
        if (subcategory && !subcategory.isLoaded) {
          subcategory.isLoaded = true;
        }
      }
    });
  });

  nextTick(() => {
    subcategoryRefs.value.forEach((ref) => {
      observer.value.observe(ref);
    });
  });
};

// Cleanup observer
const cleanupObserver = () => {
  if (observer.value) {
    observer.value.disconnect();
  }
};

onMounted(() => {
  fetchBooks();
  observeSubcategories();
});

onUnmounted(() => {
  cleanupObserver();
});
</script>

<style scoped>
.page-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 24px;
}

.tabs {
  display: flex;
  justify-content: left;
  overflow-x: auto;
  gap: 16px;
  margin-bottom: 20px;
  border-bottom: 2px solid #ccc;
  padding: 0 16px;
}

.tabs button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  font-size: 16px;
  font-weight: bold;
  color: #666;
  white-space: nowrap;
}

.tabs button.active {
  color: red;
}

.tabs button.active::after {
  content: '';
  display: block;
  height: 2px;
  background: red;
  margin-top: 4px;
}

.subcategory {
  margin-bottom: 32px;
  padding: 0 16px;
}

.subcategory-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.books-container {
  position: relative;
}

.books {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 8px 0;
}

.books::-webkit-scrollbar {
  display: none;
}

.book-item {
  flex: 0 0 auto;
  width: 120px;
  text-align: center;
  cursor: pointer;
}

.book-item img {
  width: 100%;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
}

.book-title {
  font-size: 14px;
  color: #333;
}

.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 24px;
  cursor: pointer;
}

.left-arrow {
  left: 0;
}

.right-arrow {
  right: 0;
}
</style>