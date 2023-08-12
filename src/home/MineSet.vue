<template>
    <div class="box">
        <h2>个人设置</h2>
        <!-- 基本设置 -->
        <el-tabs class="demo-tabs" @tab-change="tab_change" v-model="pageIndex">
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon>
                            <Avatar />
                        </el-icon>
                        <span>基本设置</span>
                    </span>
                </template>
                <router-view @index="getIndex" @getavatar="getavatar" />
            </el-tab-pane>
            <!-- 账号设置 -->
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <el-icon>
                            <Unlock />
                        </el-icon>
                        <span>账号设置</span>
                    </span>
                </template>
                <router-view @index="getIndex" />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
export default {
    name: 'MineSet'
}
</script>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { getData as _getdtl, setData as _setdtl } from '@/func/index'
// 清除
_setdtl('openItem', null);
const router = useRouter();
const emit = defineEmits(['getavatar']);
// 选择导航
const tab_change = (name) => {
    if (name == 0) router.push('defltset');
    else router.push('idset');
}

// 默认选中导航
let pageIndex = ref('0');
// 获取子路由传递过来的值
const getIndex = (i) => {
    pageIndex.value = i + '';
}

// 获取子路由的传输的值
const getavatar = (n) => {
    // 传递个父组件
    emit('getavatar', n);
}

</script>
<style scoped>
.box {
    width: 60%;
    min-height: max-content;
    margin: 0 auto;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    padding: 40px;
}
</style>