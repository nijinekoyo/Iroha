<!--
 * @Author: nijineko
 * @Date: 2024-01-18 22:13:26
 * @LastEditTime: 2024-01-19 00:23:12
 * @LastEditors: nijineko
 * @Description: 添加书籍组件
 * @FilePath: \Epub-Reader\src\renderer\src\components\book\add.vue
-->
<template>
    <div>
        <n-upload :max="1" directory-dnd accept=".epub" :show-file-list="false" v-model:file-list="fileList"
            :custom-request="bookAdd">
            <div class="w-40 h-60">
                <n-upload-dragger class="w-full h-full">
                    <div class="mt-5">
                        <n-icon size="48" :depth="3">
                            <archive-icon />
                        </n-icon>
                    </div>
                    <n-text class=" text-base">
                        点击或者拖动Epub文件到该区域导入
                    </n-text>
                </n-upload-dragger>
            </div>
        </n-upload>
    </div>
</template>

<script setup lang="ts">
import { NUpload, NUploadDragger, NIcon, NText, UploadCustomRequestOptions, useDialog, NImage } from 'naive-ui';
import {
    ArchiveOutline as ArchiveIcon
} from '@vicons/ionicons5'
import { useMessage } from 'naive-ui';
import epub from '@renderer/tools/epub';
import sha from '@renderer/tools/sha';
import { h, ref } from 'vue';
import { FileInfo } from 'naive-ui/es/upload/src/interface';

const message = useMessage();
const dialog = useDialog();

// 定义emits
const emits = defineEmits([
    'add',
])

// 定义文件列表
const fileList = ref<FileInfo[]>([])

// 书籍添加
const bookAdd = async (CustomRequest: UploadCustomRequestOptions) => {
    try {
        if (!CustomRequest.file.file) {
            throw new Error('文件存在错误')
        }
        if (CustomRequest.file.file.type !== 'application/epub+zip') {
            throw new Error('只能导入Epub文件')
        }

        // 获取文件ArrayBuffer
        let fileData = await CustomRequest.file.file.arrayBuffer()

        if (!fileData) {
            throw new Error('文件存在错误')
        }

        // 解析epub文件
        let bookData = await epub.parse(fileData)
        console.log(bookData)

        // 计算书籍文件的SHA256
        let booksha256 = await sha.sha256(fileData)

        let coverPath: string = ""
        let bookPath: string = ""

        // 获取书籍封面Bolb URL
        let coverBolbURL = await bookData.book.coverUrl()

        const inputDialog = dialog.info({
            title: '导入书籍',
            content: () => {
                return h(
                    'div',
                    {},
                    [
                        h(
                            'div', {},
                            {
                                default: () => '你确定要导入这本书吗？'
                            }
                        ),
                        h(
                            'div',
                            {
                                class: 'flex mt-2'
                            },
                            [
                                h(
                                    'div', {},
                                    h(
                                        NImage,
                                        {
                                            src: String(coverBolbURL),
                                            class: 'w-40'
                                        }
                                    )
                                ),
                                h(
                                    'div', {},
                                    h(
                                        'div',
                                        {},
                                        [
                                            h(
                                                'div', {},
                                                [
                                                    h(
                                                        'span',
                                                        {
                                                            class: 'font-bold'
                                                        },
                                                        {
                                                            default: () => '标题：'
                                                        }
                                                    ),
                                                    h(
                                                        'span',
                                                        {},
                                                        {
                                                            default: () => bookData.metadata.title
                                                        }
                                                    ),
                                                ]
                                            ),
                                            h(
                                                'div', {},
                                                [
                                                    h(
                                                        'span',
                                                        {
                                                            class: 'font-bold'
                                                        },
                                                        {
                                                            default: () => '作者：'
                                                        }
                                                    ),
                                                    h(
                                                        'span',
                                                        {},
                                                        {
                                                            default: () => bookData.metadata.creator
                                                        }
                                                    ),
                                                ]
                                            ),
                                            h(
                                                'div', {},
                                                [
                                                    h(
                                                        'span',
                                                        {
                                                            class: 'font-bold'
                                                        },
                                                        {
                                                            default: () => '简介：'
                                                        }
                                                    ),
                                                    h(
                                                        'span',
                                                        {},
                                                        {
                                                            default: () => bookData.metadata.description
                                                        }
                                                    ),
                                                ]
                                            ),
                                        ]
                                    )
                                ),
                            ]
                        ),
                    ]
                )
            },
            positiveText: '导入',
            negativeText: '取消',
            onPositiveClick: async () => {
                try {
                    if (coverBolbURL) {
                        // 获取书籍封面数据
                        let coverData = await fetch(coverBolbURL)
                        let coverArrayBuffer = await coverData.arrayBuffer()

                        // 获取书籍封面位于Epub的原始文件路径
                        let coverFilePath = await bookData.book.loaded.cover
                        // 获取书籍封面扩展名
                        let coverFileExt = coverFilePath.split('.').pop()!

                        // 保存书籍封面
                        coverPath = await window.bookManagement.saveCover(booksha256, coverArrayBuffer, "." + coverFileExt)
                    }

                    // 保存书籍文件
                    bookPath = await window.bookManagement.saveBook(booksha256, fileData, ".epub")

                    // 保存书籍信息
                    await window.bookManagement.createBook({
                        name: bookData.metadata.title,
                        file_path: bookPath,
                        file_sha256: booksha256,
                        type: 'epub',
                        cover: coverPath,
                        author: bookData.metadata.creator,
                        description: bookData.metadata.description,
                    })

                    message.success('导入成功')
                    emits('add')
                } catch (error: any) {
                    console.log(error)
                    message.error(error.message)
                    inputDialog.destroy()
                }
            },
        })

        // 清空文件列表
        fileList.value = []
    } catch (error: any) {
        console.log(error)
        message.error(error.message)

        // 清空文件列表
        fileList.value = []
    }
}
</script>

<style scoped></style>