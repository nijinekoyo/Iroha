/*
 * @Author: nijineko
 * @Date: 2024-01-16 12:12:54
 * @LastEditTime: 2024-01-16 12:14:56
 * @LastEditors: nijineko
 * @Description: 路由注册
 * @FilePath: \Epub-Reader\src\renderer\src\plugins\router\modules\index.ts
 */
export default [
    {
        path: '/',
        children: [
            {
                path: '/',
                name: "home",
                component: () => import('@renderer/pages/home.vue'),
            },
        ],
    },
]