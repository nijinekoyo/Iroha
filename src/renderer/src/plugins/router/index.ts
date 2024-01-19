/*
 * @Author: nijineko
 * @Date: 2024-01-16 12:12:54
 * @LastEditTime: 2024-01-20 02:58:10
 * @LastEditors: nijineko
 * @Description: 路由
 * @FilePath: \Epub-Reader\src\renderer\src\plugins\router\index.ts
 */
import {
    createRouter,
    createWebHashHistory,
} from 'vue-router'
import modules from './modules'
import pinia, { useSettingStore } from '@renderer/plugins/store'

let settingStore = useSettingStore(pinia)

// 创建路由对象
const router = createRouter({
    history: createWebHashHistory(),
    routes: modules,
})

// 定义页面标题
let title = "Iroha"

// 注册路由前置守卫
router.beforeEach(async (to, _from, next) => {
    // 判断是否有标题
    if (to.meta.title) {
        document.title = title + " - " + to.meta.title.toString()
    } else {
        document.title = title
    }

    // 更新设置信息
    await settingStore.updateSetting()

    next()// 执行进入路由
})

export default router;