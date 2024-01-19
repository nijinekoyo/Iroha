<!--
 * @Author: nijineko
 * @Date: 2024-01-16 12:15:37
 * @LastEditTime: 2024-01-20 01:35:08
 * @LastEditors: nijineko
 * @Description: 首页
 * @FilePath: \Epub-Reader\src\renderer\src\pages\home.vue
-->
<template>
    <n-layout :native-scrollbar="false" class="h-screen">
        <div class="m-3 flex">
            <n-input v-model:value="filterForm.name" type="text" placeholder="搜索书籍" clearable class="mr-2">
                <template #prefix>
                    <n-icon :component="searchIcon" />
                </template>
            </n-input>
            <n-dropdown trigger="hover" :options="sortOptions" @select="sortHandleSelect">
                <n-button>
                    <template #icon>
                        <n-icon>
                            <sort-icon />
                        </n-icon>
                    </template>
                </n-button>
            </n-dropdown>
        </div>

        <div class="m-3">
            <div class="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3 justify-items-center">
                <book-add @add="getBooks()" />
                <book-list-item v-for="book in bookDatas" :key="book.id" :book="book" @update="getBooks()" />
            </div>
        </div>
    </n-layout>
</template>

<script setup lang="ts">
import { Component, computed, h, onMounted, ref, watch } from 'vue';
import type { books } from '@/typings/database';
import { useMessage, NLayout, NInput, NIcon, NDropdown, NButton } from 'naive-ui';
import bookAdd from '@renderer/components/book/add.vue';
import bookListItem from '@renderer/components/book/list/item.vue';
import { useSettingStore } from '@renderer/plugins/store';
import {
    Search as searchIcon,
    ArrowUp as upIcon,
    ArrowDown as downIcon,
} from '@vicons/ionicons5'
import {
    ArrowSortDownLines24Regular as sortIcon,
} from '@vicons/fluent'

const message = useMessage();
const settingStore = useSettingStore();

const renderIcon = (icon: Component) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}

// 定义筛选条件
const filterForm = ref<{
    name?: string
    order: 'id ASC' | 'id DESC' | 'updated_at ASC' | 'updated_at DESC'
}>({
    order: settingStore.setting.bookSort
})

// 定义排序选项
const sortOptions = computed(() => [
    {
        label: '添加时间',
        key: filterForm.value.order == 'id ASC' ? 'id DESC' : 'id ASC',
        icon: filterForm.value.order.includes('id') ? filterForm.value.order.includes('ASC') ? renderIcon(upIcon) : renderIcon(downIcon) : undefined
    },
    {
        label: '最后阅读时间',
        key: filterForm.value.order == 'updated_at ASC' ? 'updated_at DESC' : 'updated_at ASC',
        icon: filterForm.value.order.includes('updated_at') ? filterForm.value.order.includes('ASC') ? renderIcon(upIcon) : renderIcon(downIcon) : undefined
    },
])

// 定义书籍列表
const bookDatas = ref<books[]>([])

// 获取书籍列表
const getBooks = async () => {
    try {
        bookDatas.value = await window.bookManagement.getBooks(filterForm.value.name, filterForm.value.order)
    } catch (error: any) {
        console.log(error)
        message.error(error.message)
    }
}

// 排序选项选择事件
const sortHandleSelect = (value: 'id ASC' | 'id DESC' | 'updated_at ASC' | 'updated_at DESC') => {
    console.log(sortOptions)
    filterForm.value.order = value
}

// 监听筛选条件变化
watch(filterForm, () => {
    getBooks()

    // 保存筛选条件
    settingStore.setSetting({
        theme: settingStore.setting.theme,
        bookSort: filterForm.value.order
    })
}, { deep: true })

// 页面挂载时加载数据
onMounted(() => {
    getBooks()
})
</script>

<style scoped></style>