/*
 * @Author: nijineko
 * @Date: 2024-01-17 22:43:24
 * @LastEditTime: 2024-01-17 22:43:26
 * @LastEditors: nijineko
 * @Description: 数据库类型定义
 * @FilePath: \Epub-Reader\src\renderer\src\typings\database.ts
 */
export type books = {
    id?: number,
    name: string,
    file_path: string,
    type: 'epub',
    cover?: string,
    author?: string,
    description?: string,
}