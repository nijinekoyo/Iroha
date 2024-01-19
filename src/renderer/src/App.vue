<!--
 * @Author: nijineko
 * @Date: 2024-01-15 21:51:16
 * @LastEditTime: 2024-01-16 22:14:49
 * @LastEditors: nijineko
 * @Description: App.vue
 * @FilePath: \Epub-Reader\src\renderer\src\App.vue
-->
<template>
  <n-config-provider>
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { NConfigProvider, NMessageProvider, NDialogProvider, NLoadingBarProvider } from 'naive-ui';
</script>

<style scoped></style>
