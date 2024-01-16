<!--
 * @Author: nijineko
 * @Date: 2024-01-15 22:34:52
 * @LastEditTime: 2024-01-17 01:56:15
 * @LastEditors: nijineko
 * @Description: epub阅读器组件
 * @FilePath: \Epub-Reader\src\renderer\src\components\epub\reader.vue
-->
<template>
    <div class="w-screen h-screen relative">
        <div class="flex flex-col w-full h-full">
            <div class="flex-grow">
                <div id="epub-reader" class="w-full h-full"></div>
            </div>

            <div class="my-2 relative">
                <div class="flex">
                    <div class="flex-1 flex justify-center">
                        <n-tag :bordered="false">
                            {{ paginationData.page }} / {{ paginationData.pageCount }}
                        </n-tag>
                    </div>
                    <div class="flex-1 flex justify-center" v-if="paginationData.displayedTotal == 2">
                        <n-tag :bordered="false">
                            {{ paginationData.page + (paginationData.displayedTotal - 1) }} / {{ paginationData.pageCount }}
                        </n-tag>
                    </div>
                </div>

                <div class="absolute right-3 bottom-0">
                    <n-dropdown trigger="hover" :options="menuOptions" @select="menuHandleSelect">
                        <n-button strong secondary>
                            <n-icon>
                                <menu-icon />
                            </n-icon>
                        </n-button>
                    </n-dropdown>
                </div>
            </div>
        </div>

        <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
            <n-button text @click="prevPage">
                <n-icon :depth="2" :size="40">
                    <left-icon />
                </n-icon>
            </n-button>
        </div>
        <div class="absolute right-4 top-1/2 transform -translate-y-1/2">
            <n-button text @click="nextPage">
                <n-icon :depth="2" :size="40">
                    <right-icon />
                </n-icon>
            </n-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import epub from '@renderer/tools/epub';
import type { pagination } from '@renderer/typings/pagination';
import { Rendition } from 'epubjs';
import { useMessage, NButton, NIcon, NTag, NDropdown } from 'naive-ui';
import { Component, PropType, computed, h, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import {
    ChevronLeft12Filled as leftIcon,
    ChevronRight12Filled as rightIcon,
} from '@vicons/fluent';
import {
    Menu as menuIcon,
    Home as homeIcon,
} from '@vicons/ionicons5';
import { Mutex } from 'async-mutex';

const message = useMessage();
const router = useRouter();

// 定义props
const props = defineProps({
    filePath: {
        type: String,
        required: true,
    },
    pagination: {
        type: Object as PropType<pagination>,
        default: null,
    }
});

// 定义emits
const emits = defineEmits([
    'update:pagination',
]);

// 渲染图标
const renderIcon = (icon: Component) => {
    return () => {
        return h(NIcon, null, {
            default: () => h(icon)
        })
    }
}

// 定义分页数据
const paginationData = computed({
    get() {
        return props.pagination;
    },
    set(newValue) {
        emits('update:pagination', newValue);
    },
});

// 定义渲染器
let rendition: Rendition | null = null;
// 定义菜单选项
const menuOptions = [
    {
        label: '返回主页',
        key: 'home',
        icon: renderIcon(homeIcon),
    },
];

// 渲染epub阅读器
const render = () => {
    // 读取epub文件
    window.fs.readFile(props.filePath, async (err: any, data: Buffer) => {
        if (err) {
            // 读取文件失败
            console.error(err);
            message.error('读取文件失败');

            // 返回上一页
            router.back();
        }

        // 解析epub文件
        let bookData = await epub.parse(data.buffer)
        console.log(bookData);

        // 创建渲染器
        rendition = bookData.book.renderTo("epub-reader", {
            width: '100%',
            height: '100%',
            manager: "continuous", // 布局方式
            flow: "paginated", // 翻页方式
            spread: 'auto', // 双页显示
            resizeOnOrientationChange: true, // 屏幕尺寸变化时自动调整
            allowScriptedContent: true, // 允许脚本
        });

        // 渲染
        await rendition.display();

        let location: any = rendition.currentLocation();
        // 写入分页数据
        paginationData.value = {
            page: 1,
            displayedTotal: location.start.displayed.total,
            pageCount: bookData.spine.length,
        }
    })
};

// 翻页锁
let togglePageLock = new Mutex();

// 下一页
const nextPage = async () => {
    // 上锁
    const release = await togglePageLock.acquire()
    if (rendition) {
        let currentEndPage = paginationData.value.page + (paginationData.value.displayedTotal - 1);
        // 检查是否为最后一页
        if (currentEndPage >= paginationData.value.pageCount) {
            message.warning('已经是最后一页了');
            // 释放锁
            release();
            return;
        }

        // 检查页面总数是否为偶数
        if (paginationData.value.pageCount % 2 == 0) {
            // 更新分页数据
            paginationData.value.page = paginationData.value.page + paginationData.value.displayedTotal;
        } else {
            // 检查是否为倒数第二页
            if (currentEndPage == paginationData.value.pageCount - 1) {
                // 更新分页数据
                paginationData.value.page = paginationData.value.page + 1;
            } else {
                // 更新分页数据
                paginationData.value.page = paginationData.value.page + paginationData.value.displayedTotal;
            }
        }

        console.log(paginationData.value.page - 1);
        await rendition.display(paginationData.value.page - 1);

        // 释放锁
        release();
    }
};

// 上一页
const prevPage = async () => {
    // 上锁
    const release = await togglePageLock.acquire()
    if (rendition) {
        // 检查是否为第一页
        if (paginationData.value.page == 1) {
            message.warning('已经是第一页了');
            // 释放锁
            release();
            return;
        }

        // 更新分页数据
        paginationData.value.page = paginationData.value.page - paginationData.value.displayedTotal;

        await rendition.display(paginationData.value.page - 1);

        // 释放锁
        release();
    }
};

// 菜单选项选择事件
const menuHandleSelect = (key: string) => {
    switch (key) {
        case 'home':
            router.push({
                name: 'home',
            });
            break;
    }
};

// 组件挂载时加载数据
onMounted(() => {
    render();
});

// 离开页面时销毁渲染器
onUnmounted(() => {
    if (rendition) {
        rendition.destroy();
    }
});
</script>

<style scoped></style>