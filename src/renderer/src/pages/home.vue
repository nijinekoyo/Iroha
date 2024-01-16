<!--
 * @Author: nijineko
 * @Date: 2024-01-16 12:15:37
 * @LastEditTime: 2024-01-16 12:16:24
 * @LastEditors: nijineko
 * @Description: 首页
 * @FilePath: \Epub-Reader\src\renderer\src\pages\home.vue
-->
<template>
    <epub-reader file-path="./test.epub" v-model:pagination="pagination"></epub-reader>
</template>

<script setup lang="ts">
import epubReader from '@renderer/components/epub/reader.vue';
import { ref } from 'vue';
import type { pagination } from '@renderer/typings/pagination';

const pagination = ref<pagination>({
    page: 1,
    displayedTotal: 1,
    pageCount: 1,
})
</script>

<style scoped></style>