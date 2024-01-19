/*
 * @Author: nijineko
 * @Date: 2024-01-20 01:40:54
 * @LastEditTime: 2024-01-20 01:41:00
 * @LastEditors: nijineko
 * @Description: 设置模态框注入
 * @FilePath: \Epub-Reader\src\renderer\src\components\setting\setting.ts
 */
import { inject } from "vue";

// 设置模态框提供类型
export type settingProvider = {
    open(): void;
    close(): void;
}

export default function useSetting() {
    const api = inject<settingProvider | null>('useSetting', null);
    if (api === null) {
        throw new Error('useSetting must be used after setting modal provider');
    }
    return api;
};