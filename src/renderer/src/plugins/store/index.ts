/*
 * @Author: nijineko
 * @Date: 2024-01-20 00:02:45
 * @LastEditTime: 2024-01-20 00:06:04
 * @LastEditors: nijineko
 * @Description: store管理
 * @FilePath: \Epub-Reader\src\renderer\src\plugins\store\index.ts
 */
import { createPinia } from "pinia";
import { useSettingStore } from "@renderer/plugins/store/setting";

export {
    useSettingStore,
}

const pinia = createPinia();
export default pinia;