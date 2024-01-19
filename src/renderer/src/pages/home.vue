<!--
 * @Author: nijineko
 * @Date: 2024-01-16 12:15:37
 * @LastEditTime: 2024-01-19 12:12:51
 * @LastEditors: nijineko
 * @Description: 首页
 * @FilePath: \Epub-Reader\src\renderer\src\pages\home.vue
-->
<template>
    <n-layout>
        <div class="m-3">
            <div class="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3 justify-items-center">
                <book-add @add="getBooks()" />
                <book-list-item v-for="book in bookDatas" :key="book.id" :book="book" />
            </div>
        </div>
    </n-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { books } from '@/typings/database.ts';
import { useMessage, NLayout } from 'naive-ui';
import bookAdd from '@renderer/components/book/add.vue';
import bookListItem from '@renderer/components/book/list/item.vue';

const message = useMessage()

// 定义书籍列表
const bookDatas = ref<books[]>([])

// 获取书籍列表
const getBooks = async () => {
    try {
        bookDatas.value = await window.bookManagement.getBooks()
    } catch (error: any) {
        console.log(error)
        message.error(error.message)
    }
}

// 页面挂载时加载数据
onMounted(() => {
    getBooks()
})
</script>

<style scoped></style>