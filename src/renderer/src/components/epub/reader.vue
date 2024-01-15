<!--
 * @Author: nijineko
 * @Date: 2024-01-15 22:34:52
 * @LastEditTime: 2024-01-16 00:38:49
 * @LastEditors: nijineko
 * @Description: epub阅读器组件
 * @FilePath: \Epub-Reader\src\renderer\src\components\epub\reader.vue
-->
<template>
    <div id="epub-reader" class="w-screen h-screen"></div>
</template>

<script setup lang="ts">
import ePub from 'epubjs';

// 读取test.epub文件
window.fs.readFile('./test.epub', async (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    // 读取epub文件
    const book = ePub(data.buffer);

    // 获取epub文件的元数据
    book.loaded.metadata.then((PackagingMetadata) => {
        console.log(PackagingMetadata);
    }).catch((err) => {
        console.error(err);
    });

    // 挂载渲染器
    var rendition = book.renderTo("epub-reader", {
        width: '100%',
        height: '100%',
        manager: "continuous", // 布局方式
        flow: "paginated", // 翻页方式
        spread: 'auto', // 双页显示
        resizeOnOrientationChange: true, // 屏幕尺寸变化时自动调整
        allowScriptedContent: true, // 允许脚本
    });

    // 渲染
    await rendition.display();
});
</script>

<style scoped></style>