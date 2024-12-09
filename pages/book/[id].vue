Here’s the updated Vue file with the fix for the `書籍詳細` label text color in dark mode:

```vue
<template>
  <div :class="theme">
    <header class="header">
      <button @click="goBack" class="back-button">
        ← <span class="header-label">書籍詳細</span>
      </button>
      <button @click="toggleTheme" class="theme-button">
        {{ theme === 'light' ? 'Dark Mode' : 'Light Mode' }}
      </button>
    </header>

    <section class="container">
      <div class="book-info-card">
        <div class="book-info-card">
          <div class="book-cover">
            <img :src="book.img_url" :alt="book.name_book" />
          </div>
          <div class="book-details">
            <h1 class="book-title">{{ book.name_book }}</h1>
            <div class="meta-item">
              <p class="meta-label"><strong>著者</strong></p>
              <p class="meta-value">{{ book.author }}</p>
            </div>
            <div class="meta-item">
              <p class="meta-label"><strong>出版社</strong></p>
              <p class="meta-value">{{ book.publisher }}</p>
            </div>
            <div class="icons">
              <button @click="toggleMyBooks" class="mybooks-button">
                {{ isInMyBooks ? 'MyBooks削除' : 'MyBooks追加' }}
              </button>
              <button class="yomihoudai-button">読み放題中</button>
            </div>
          </div>
        </div>
      </div>

      <div class="icons-card">
        <div class="icon-buttons">
          <div class="icon-card" v-for="(icon, index) in dynamicIconItems" :key="index">
            <img :src="icon.icon" :alt="icon.name" class="icon-icon" />
            <p class="icon-name">{{ icon.name }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMyBooksStore } from '@/stores/useMyBooksStore';

const route = useRoute();
const router = useRouter();
const bookId = route.params.id;

const book = ref({});
const theme = ref('light');
const store = useMyBooksStore();
const isInMyBooks = ref(false);

//Icons情報
const iconItems = [
  { name: 'アプリ学習', file: 'icon_study_quiz.svg' },
  { name: 'テスト', file: 'icon_study_test.svg' },
  { name: '音声(無料)', file: 'icon_study_sound.svg' },
  { name: 'SWトレ', file: 'icon_study_sw.svg' },
  { name: '単語一覧', file: 'icon_study_vocab.svg' },
  { name: 'マークシート', file: 'icon_study_marksheet.svg' },
  { name: '学習記録', file: 'icon_study_record.svg' },
];

//DynamicallyIconsのpathを取得、Darkとlightのため
const dynamicIconItems = computed(() =>
  iconItems.map((icon) => ({
    ...icon,
    icon: `/icons/${theme.value}/${icon.file}`,
  }))
);

//トップ画面へ移動
const goBack = () => router.push('/');

//Dark mode toggle
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  localStorage.setItem('theme', theme.value);
};

//MyBookに追加または削除（Piniaを使用）
const toggleMyBooks = () => {
  if (isInMyBooks.value) {
    store.removeFromMyBooks(bookId);
  } else {
    store.addToMyBooks(bookId);
  }
  isInMyBooks.value = !isInMyBooks.value;
};

onMounted(() => {
  const bookData = route.query.book ? JSON.parse(route.query.book) : null;

  if (bookData && bookData.id_book === bookId) {
    book.value = bookData;
    isInMyBooks.value = store.myBooks?.includes(bookId) || false;
  } else {
    console.error('Book data not found in query parameters.');
    router.push('/');
  }
  //タスク内容にDarkモードのtoggleについて書いてなかったのでボタンを追加して現在のthemeはLocalstorageで保存
  const savedTheme = localStorage.getItem('theme');
  theme.value = savedTheme ? savedTheme : 'light';
});
</script>

<style scoped>
.light {
  --bg-color: #fff;
  --text-color: #000;
  --header-label-color: #000;
}

.dark {
  --bg-color: #000;
  --text-color: #fff;
  --header-label-color: #fff;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  background-color: var(--bg-color);
  border-bottom: 1px solid var(--text-color);
}

.back-button {
  font-size: 16px;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text-color);
}

.header-label {
  color: var(--header-label-color);
}

.theme-button {
  font-size: 16px;
  cursor: pointer;
  background: none;
  border: none;
  color: var(--text-color);
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding: 16px;
  margin: 16px auto;
  max-width: 1200px;
  flex-wrap: wrap;
}

.book-info-card,
.icons-card {
  flex: 1;
  min-width: 450px;
  padding: 16px;
  border: 1px solid var(--text-color);
  border-radius: 8px;
  background-color: var(--bg-color);
}

.icons-card {
  margin-top: auto;
  margin-bottom: auto;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 16px;
  }
  .book-info-card,
  .icons-card {
    min-width: 100%;
    margin: 0 -18px;
  }
  .book-info-card {
    margin-bottom: 16px;
  }
}

.book-info-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin: 50px 0;
}

.book-cover img {
  width: 90px;
  height: auto;
  border-radius: 4px;
  border: 1px solid var(--text-color);
}

.book-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.book-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-color);
  margin: 0;
}

.meta-item {
  display: flex;
  align-items: center;
  height: 24px;
}

.meta-label {
  background-color: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  margin-right: 8px;
  white-space: nowrap;
  text-align: center;
}

.meta-value {
  font-size: 14px;
  color: var(--text-color);
}

.icons {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}

.mybooks-button {
  padding: 6px 12px;
  border: 2px solid red;
  border-radius: 4px;
  background-color: white;
  color: red;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
}

.yomihoudai-button {
  padding: 6px 12px;
  background-color: red;
  color: white;
  border: 2px solid red;
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
}

.icon-buttons {
  margin: 6px 0px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.icon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 90px;
  padding: 8px;
  border: 1px solid #dcdcdc;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.icon-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 4px;
}

.icon-name {
  font-size: 12px;
  font-weight: bold;
  color: #555;
  text-align: center;
}
</style>