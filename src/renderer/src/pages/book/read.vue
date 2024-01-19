<!--
 * @Author: nijineko
 * @Date: 2024-01-19 20:36:11
 * @LastEditTime: 2024-01-19 21:01:10
 * @LastEditors: nijineko
 * @Description: 阅读器页面
 * @FilePath: \Epub-Reader\src\renderer\src\pages\book\read.vue
-->
<template>
    <div v-if="book">
        <epub-reader :filePath="book.file_path" v-model:pagination="paginationData"></epub-reader>
    </div>
    <div v-else class="w-screen h-screen flex justify-center items-center">
        <n-spin size="large">
            <template #description>
                加载中...
            </template>
        </n-spin>
    </div>
</template>

<script setup lang="ts">
import { books } from '@/typings/database';
import { useMessage, NSpin } from 'naive-ui';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { pagination } from '@renderer/typings/pagination';
import epubReader from '@renderer/components/epub/reader.vue';

const route = useRoute();
const router = useRouter();
const message = useMessage();

// 定义书籍数据
const book = ref<books>();
// 定义分页数据
const paginationData = ref<pagination>({
    page: 1,
    displayedTotal: 1,
    pageCount: 1,
});

// 获取书籍数据
const getBook = async () => {
    try {
        // 获取书籍数据
        let bookData = await window.bookManagement.getBook(Number(route.params.id));

        // 赋值阅读进度
        paginationData.value.page = bookData.progress;

        // 赋值书籍数据
        book.value = bookData;
    } catch (error: any) {
        console.log(error);
        message.error(error.message);

        // 返回上一页
        router.back();
    }
};

// 监听分页数据变化
watch(paginationData, () => {
    if (!book.value) return;

    // 更新阅读进度
    window.bookManagement.updateBookProgress(book.value.id!, paginationData.value.page);
}, { deep: true });

// 页面挂载时获取数据
onMounted(() => {
    getBook();
});
</script>

<style scoped></style>