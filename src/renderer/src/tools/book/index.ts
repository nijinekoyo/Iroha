/*
 * @Author: nijineko
 * @Date: 2024-01-19 01:25:06
 * @LastEditTime: 2024-01-19 21:47:24
 * @LastEditors: nijineko
 * @Description: 书籍工具封装
 * @FilePath: \Epub-Reader\src\renderer\src\tools\book\index.ts
 */
import { NImage } from "naive-ui";
import epub from '@renderer/tools/epub';
import sha from "@renderer/tools/sha";
import { VNodeChild, h } from "vue";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { Book } from "epubjs";
import { PackagingMetadataObject } from "epubjs/types/packaging";
import Navigation from "epubjs/types/navigation";
import { SpineItem } from "epubjs/types/section";
import { LoadingBarInst } from "naive-ui/es/loading-bar/src/LoadingBarProvider";

/**
 * @description: 保存书籍
 * @param {ArrayBuffer} fileData 书籍文件数据
 * @return {Promise<Boolean>} 保存结果
 */
const save = async (fileData: ArrayBuffer, dialog?: DialogApiInjection, loadingBar?: LoadingBarInst): Promise<Boolean> => {
    return new Promise<Boolean>(async (resolve, reject) => {
        try {
            // 解析epub文件
            let bookData = await epub.parse(fileData)

            // 计算书籍文件的SHA256
            let booksha256 = await sha.sha256(fileData)

            let coverPath: string = ""
            let bookPath: string = ""

            // 获取书籍封面Bolb URL
            let coverBolbURL = await bookData.book.coverUrl()

            // 保存书籍
            const saveBook = async () => {
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
                        progress: 1,
                    })

                    resolve(true)
                } catch (error: any) {
                    reject(error)
                }
            }

            if (loadingBar) {
                loadingBar.finish()
            }

            // 检查是否注入了Dialog，如果有则弹出提示框，否则直接保存
            if (dialog) {
                dialog.info({
                    closeOnEsc: false,
                    title: '导入书籍',
                    content: () => dialogContentRendering(coverBolbURL, bookData),
                    positiveText: '导入',
                    negativeText: '取消',
                    onPositiveClick: async () => {
                        await saveBook()
                    },
                    onNegativeClick: () => {
                        resolve(false)
                    },
                    onMaskClick: () => {
                        resolve(false)
                    },
                    onClose: () => {
                        resolve(false)
                    }
                })
            } else {
                // 直接保存书籍
                saveBook()
            }
        } catch (error: any) {
            reject(error)
        }
    })
}

/**
 * @description: 弹出框内容渲染
 * @param {string} coverURL 书籍封面Bolb URL
 * @param {Object} bookData 书籍数据
 * @return {VNodeChild} 返回渲染结果
 */
const dialogContentRendering = (coverURL: string | null, bookData: {
    book: Book;
    metadata: PackagingMetadataObject;
    navigation: Navigation;
    spine: SpineItem[];
}): VNodeChild => {
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
                                src: String(coverURL),
                                class: 'w-40'
                            }
                        )
                    ),
                    h(
                        'div',
                        {
                            class: 'ml-2'
                        },
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
}

const book = {
    save
}

export default book