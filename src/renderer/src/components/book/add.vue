<!--
 * @Author: nijineko
 * @Date: 2024-01-18 22:13:26
 * @LastEditTime: 2024-01-19 21:47:09
 * @LastEditors: nijineko
 * @Description: 添加书籍组件
 * @FilePath: \Epub-Reader\src\renderer\src\components\book\add.vue
-->
<template>
    <div>
        <n-upload :max="1" accept=".epub" :show-file-list="false" v-model:file-list="fileList" :custom-request="bookAdd">
            <div class="w-40 h-60">
                <n-upload-dragger class="w-full h-full">
                    <div class="mt-7">
                        <n-icon size="48" :depth="3">
                            <archive-icon />
                        </n-icon>
                    </div>
                    <n-text class="text-base">
                        点击导入Epub文件
                    </n-text>
                </n-upload-dragger>
            </div>
        </n-upload>
    </div>
</template>

<script setup lang="ts">
import { NUpload, NUploadDragger, NIcon, NText, UploadCustomRequestOptions, useDialog } from 'naive-ui';
import {
    ArchiveOutline as ArchiveIcon
} from '@vicons/ionicons5'
import { useMessage, useLoadingBar } from 'naive-ui';
import book from '@renderer/tools/book';
import { ref } from 'vue';
import { FileInfo } from 'naive-ui/es/upload/src/interface';

const message = useMessage();
const dialog = useDialog();
const loadingBar = useLoadingBar();

// 定义emits
const emits = defineEmits([
    'add',
])

// 定义文件列表
const fileList = ref<FileInfo[]>([])

// 书籍添加
const bookAdd = async (CustomRequest: UploadCustomRequestOptions) => {
    try {
        loadingBar.start()

        if (!CustomRequest.file.file) {
            loadingBar.error()
            throw new Error('文件存在错误')
        }
        if (CustomRequest.file.file.type !== 'application/epub+zip') {
            loadingBar.error()
            throw new Error('只能导入Epub文件')
        }

        // 获取文件ArrayBuffer
        let fileData = await CustomRequest.file.file.arrayBuffer()

        if (!fileData) {
            loadingBar.error()
            throw new Error('文件存在错误')
        }

        // 保存书籍
        let saveState = await book.save(fileData, dialog, loadingBar)
        if (saveState) {
            message.success("导入成功")

            emits('add')
        }

        // 清空文件列表
        fileList.value = []
    } catch (error: any) {
        console.log(error)
        loadingBar.error()
        message.error(error.message)

        // 清空文件列表
        fileList.value = []
    }
}
</script>

<style scoped></style>