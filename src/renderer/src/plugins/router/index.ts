/*
 * @Author: nijineko
 * @Date: 2024-01-16 12:12:54
 * @LastEditTime: 2024-01-16 12:19:10
 * @LastEditors: nijineko
 * @Description: 路由
 * @FilePath: \Epub-Reader\src\renderer\src\plugins\router\index.ts
 */
import {
    createRouter,
    createWebHashHistory,
} from 'vue-router'
import modules from './modules'

// 创建路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes: modules,
})

export default router;