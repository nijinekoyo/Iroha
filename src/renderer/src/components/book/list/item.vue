<!--
 * @Author: nijineko
 * @Date: 2024-01-19 12:08:40
 * @LastEditTime: 2024-01-19 12:57:52
 * @LastEditors: nijineko
 * @Description: 图书列表项
 * @FilePath: \Epub-Reader\src\renderer\src\components\book\list\item.vue
-->
<template>
    <div class="w-40 h-60">
        <div class="h-4/5 flex justify-center">
            <img :src="'iroha-file://' + book.cover" class="h-full">
        </div>
        <div class="h-1/5 flex flex-wrap justify-center items-end">
            <div class="truncate">
                {{ book.name }}
            </div>
            <div class="truncate">
                <n-text :depth="3">
                    {{ book.author }}
                </n-text>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { books } from '@/typings/database';
import { NText } from 'naive-ui';

// 定义props
defineProps({
    book: {
        type: Object as PropType<books>,
        required: true
    }
})
</script>

<style scoped></style>