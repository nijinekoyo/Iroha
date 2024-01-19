<!--
 * @Author: nijineko
 * @Date: 2024-01-15 21:51:16
 * @LastEditTime: 2024-01-20 02:07:19
 * @LastEditors: nijineko
 * @Description: App.vue
 * @FilePath: \Epub-Reader\src\renderer\src\App.vue
-->
<template>
  <n-config-provider :theme="theme">
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <setting-provider>
            <router-view />
          </setting-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NLoadingBarProvider, darkTheme, GlobalTheme, useOsTheme } from 'naive-ui';
import SettingProvider from '@renderer/components/setting/provider.vue';
import { useSettingStore } from '@renderer/plugins/store';
import { ref, watch } from 'vue';

const settingStore = useSettingStore();
const osTheme = useOsTheme();

// 定义主题
const theme = ref<GlobalTheme | null | undefined>(null);

// 监听主题设置
watch(() => settingStore.setting.theme, (newValue) => {
  // 如果是自动模式，根据系统主题设置
  if (newValue === 'auto') {
    if (osTheme.value == 'dark') {
      theme.value = darkTheme;
    } else {
      theme.value = undefined;
    }
    return
  }

  if (newValue === 'dark') {
    theme.value = darkTheme;
    return
  }

  theme.value = undefined;
});
</script>

<style scoped></style>
