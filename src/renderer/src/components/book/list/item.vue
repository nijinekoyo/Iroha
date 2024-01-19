<!--
 * @Author: nijineko
 * @Date: 2024-01-19 12:08:40
 * @LastEditTime: 2024-01-19 20:24:06
 * @LastEditors: nijineko
 * @Description: 图书列表项
 * @FilePath: \Epub-Reader\src\renderer\src\components\book\list\item.vue
-->
<template>
    <div class="w-40 h-60 cursor-pointer" @click="toReader" @contextmenu="handleContextMenu">
        <div class="h-4/5 flex justify-center">
            <img :src="'iroha-file://' + book.cover" class="h-full" v-if="book.cover">
            <div v-else class="w-full flex items-center justify-center bg-gray-100">
                <n-empty description="无封面">
                    <template #icon>
                        <n-icon>
                            <image-off-icon />
                        </n-icon>
                    </template>
                </n-empty>
            </div>
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

    <n-dropdown placement="bottom-start" trigger="manual" :x="contextMenuCoordinates.x" :y="contextMenuCoordinates.y"
        :options="contextMenuOptions" :show="showContextMenu" :on-clickoutside="() => showContextMenu = false"
        @select="contextMenuHandleSelect" />
</template>

<script setup lang="ts">
import { Component, PropType, h, nextTick, ref } from 'vue';
import type { books } from '@/typings/database';
import { NText, NEmpty, NIcon, NDropdown, useMessage, useDialog } from 'naive-ui';
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface';
import {
    ImageOff24Regular as imageOffIcon,
    Open24Filled as openIcon,
    Delete24Regular as deleteIcon,
} from '@vicons/fluent'

const message = useMessage();
const dialog = useDialog();

// 定义props
const props = defineProps({
    book: {
        type: Object as PropType<books>,
        required: true
    }
})

// 定义emits
const emits = defineEmits([
    'update',
])

const renderIcon = (icon: Component, color?: string) => {
    return () => {
        return h(NIcon,
            {
                color: color
            },
            {
                default: () => h(icon)
            }
        )
    }
}

// 定义上下文菜单显示状态
const showContextMenu = ref(false)
// 定义上下文菜单坐标
const contextMenuCoordinates = ref({ x: 0, y: 0 })
// 定义上下文菜单选项
const contextMenuOptions = ref<DropdownMixedOption[]>([
    {
        label: '打开书籍',
        key: 'open',
        icon: renderIcon(openIcon)
    },
    {
        label: '删除书籍',
        key: 'delete',
        icon: renderIcon(deleteIcon, 'red'),
        props: {
            style: {
                color: 'red'
            }
        }
    }
])

// 跳转到阅读器
const toReader = () => {
}

// 删除书籍
const deleteBook = () => {
    dialog.warning({
        title: '删除书籍',
        content: '确定要删除这本书吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
            try {
                // 删除书籍文件
                window.bookManagement.deleteBookFile(props.book.id!)
                // 删除书籍
                window.bookManagement.deleteBook(props.book.id!)

                // 提示删除成功
                message.success('删除成功')

                // 触发更新事件
                emits('update')
            } catch (error: any) {
                console.log(error)
                message.error(error.message)
            }
        }
    })
}

// 右键菜单处理
const handleContextMenu = async (event: MouseEvent) => {
    event.preventDefault()

    showContextMenu.value = false
    await nextTick()

    contextMenuCoordinates.value.x = event.clientX
    contextMenuCoordinates.value.y = event.clientY
    showContextMenu.value = true
}

// 右键菜单选择回调
const contextMenuHandleSelect = (key: string) => {
    switch (key) {
        case 'open':
            toReader()
            break
        case 'delete':
            deleteBook()
            break
    }

    showContextMenu.value = false
}
</script>

<style scoped></style>