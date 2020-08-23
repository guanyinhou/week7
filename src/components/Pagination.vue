<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{ disabled: pages.current_page === 1 }">
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="updatePage(pages.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        class="page-item"
        v-for="(item, idx) in pages.total_pages"
        :key="idx"
        :class="{ active: item === pages.current_page }"
      >
        <a class="page-link" href="#" @click.prevent="updatePage(item)">
          {{ item }}
        </a>
      </li>
      <li
        class="page-item"
        :class="{ disabled: pages.current_page === pages.total_pages }"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="updatePage(pages.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: ["pages"],
  methods: {
    updatePage(item) {
      this.$emit("update", item);
    }
  }
};
</script>
