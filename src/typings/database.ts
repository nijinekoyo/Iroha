/*
 * @Author: nijineko
 * @Date: 2024-01-17 22:43:24
 * @LastEditTime: 2024-01-19 18:13:36
 * @LastEditors: nijineko
 * @Description: 数据库类型定义
 * @FilePath: \Epub-Reader\src\typings\database.ts
 */
export type books = {
    id?: number, // ID
    name: string, // 书籍名字
    file_path: string, // 文件路径
    file_sha256: string, // 文件SHA256
    type: 'epub', // 文件类型
    cover?: string, // 封面
    author?: string, // 作者
    description?: string, // 描述
    progress: number, // 进度
    created_at?: number, // 创建时间
    updated_at?: number, // 更新时间
}