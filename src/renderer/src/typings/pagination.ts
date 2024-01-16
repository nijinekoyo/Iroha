/*
 * @Author: nijineko
 * @Date: 2024-01-16 21:52:05
 * @LastEditTime: 2024-01-16 22:34:06
 * @LastEditors: nijineko
 * @Description: 分页类型
 * @FilePath: \Epub-Reader\src\renderer\src\typings\pagination.ts
 */
export type pagination = {
    page: number, // 当前页
    displayedTotal: number, // 显示的页数
    pageCount: number, // 总页数
}