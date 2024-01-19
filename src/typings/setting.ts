/*
 * @Author: nijineko
 * @Date: 2024-01-20 00:05:00
 * @LastEditTime: 2024-01-20 00:05:07
 * @LastEditors: nijineko
 * @Description: 设置类型
 * @FilePath: \Epub-Reader\src\typings\setting.ts
 */
// 设置类型
export type setting = {
    theme: 'auto' | 'light' | 'dark' // 主题
    bookSort: 'id ASC' | 'id DESC' | 'name ASC' | 'name DESC' | 'updated_at ASC' | 'updated_at DESC' // 书籍排序
}