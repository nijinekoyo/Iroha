<!--
 * @Author: nijineko
 * @Date: 2024-01-20 02:21:07
 * @LastEditTime: 2024-01-20 02:22:14
 * @LastEditors: nijineko
 * @Description: 布局
 * @FilePath: \Epub-Reader\src\renderer\src\layout\layout.vue
-->
<template>
  <n-layout :native-scrollbar="false" class="h-screen">
    <router-view />
  </n-layout>
</template>

<script setup lang="ts">
import {NLayout } from 'naive-ui';
</script>

<style scoped>
</style>