/*
 * @Author: nijineko
 * @Date: 2024-01-18 23:13:24
 * @LastEditTime: 2024-01-18 23:15:46
 * @LastEditors: nijineko
 * @Description: sha计算
 * @FilePath: \Epub-Reader\src\renderer\src\tools\sha\index.ts
 */
/**
 * @description: sha256计算
 * @param {BufferSource} data 待计算数据
 * @return {string} sha256值
 */
const sha256 = async (data: BufferSource): Promise<string> => {
    let hashBuffer = await crypto.subtle.digest('SHA-256', data);

    let hashArray = Array.from(new Uint8Array(hashBuffer));
    let hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');

    return hashHex;
}

const sha = {
    sha256
}

export default sha;