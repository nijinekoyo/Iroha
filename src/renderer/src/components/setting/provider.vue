<!--
 * @Author: nijineko
 * @Date: 2024-01-20 01:38:38
 * @LastEditTime: 2024-01-20 01:58:58
 * @LastEditors: nijineko
 * @Description: 设置模态框提供器
 * @FilePath: \Epub-Reader\src\renderer\src\components\setting\provider.vue
-->
<template>
    <n-modal v-model:show="show" title="设置" preset="card" size="huge" :bordered="false" style="width: 75%;">
        <n-form :model="settingForm">
            <n-form-item path="theme" label="主题">
                <n-radio-group v-model:value="settingForm.theme">
                    <n-space>
                        <n-radio value="auto">
                            自动
                        </n-radio>
                        <n-radio value="light">
                            浅色
                        </n-radio>
                        <n-radio value="dark">
                            深色
                        </n-radio>
                    </n-space>
                </n-radio-group>
            </n-form-item>
        </n-form>
    </n-modal>

    <slot />
</template>

<script setup lang="ts">
import { NModal, NForm, NFormItem, NRadio, NRadioGroup, NSpace } from 'naive-ui';
import { provide, ref, watch } from 'vue';
import { useSettingStore } from '@renderer/plugins/store';
import { setting } from '@/typings/setting';

let settingStore = useSettingStore();

const show = ref(false);

// 初始化设置
settingStore.updateSetting();
const settingForm = ref<setting>(settingStore.setting);

// 打开设置框
const open = () => {
    show.value = true;
}

// 关闭设置框
const close = () => {
    show.value = false;
}

// 向子组件提供方法
provide('useSetting', {
    open,
    close
})

// 监听设置表单变化
watch(settingForm.value, (newValue) => {
    newValue.bookSort = settingStore.setting.bookSort;

    settingStore.setSetting(newValue);
}, { deep: true })
</script>

<style scoped></style>