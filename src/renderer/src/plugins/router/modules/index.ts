/*
 * @Author: nijineko
 * @Date: 2024-01-16 12:12:54
 * @LastEditTime: 2024-01-20 02:23:25
 * @LastEditors: nijineko
 * @Description: 路由注册
 * @FilePath: \Epub-Reader\src\renderer\src\plugins\router\modules\index.ts
 */
import layout from '@renderer/layout/layout.vue'

export default [
    {
        path: '/',
        component: layout,
        children: [
            {
                path: '/',
                name: "home",
                component: () => import('@renderer/pages/home.vue'),
                meta: {
                    title: "书架"
                }
            },
            {
                path: '/book/:id',
                name: "book.read",
                component: () => import('@renderer/pages/book/read.vue'),
            }
        ],
    },
]