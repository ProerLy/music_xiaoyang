<template>
    <div class="cont">
        <el-row>
            <el-col :span="3" :offset="0">
                <el-menu router :default-active="activePath" class="el-menu-vertical-demo">
                    <el-menu-item index="/sysmsg">
                        <el-badge v-if="msg_num.sys_num != 0" :value="msg_num.sys_num" :max="99">
                            <el-icon>
                                <ChatDotRound />
                            </el-icon>
                            <span>通知</span>
                        </el-badge>
                        <template v-else>
                            <el-icon>
                                <ChatDotRound />
                            </el-icon>
                            <span>通知</span>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="/msglist">
                        <el-badge v-if="msg_num.fri_num != 0 && !!msg_num.fri_num" :value="msg_num.fri_num" :max="99">
                            <el-icon>
                                <Message />
                            </el-icon>
                            <span>私信</span>
                        </el-badge>
                        <template v-else>
                            <el-icon>
                                <Message />
                            </el-icon>
                            <span>私信</span>
                        </template>
                    </el-menu-item>
                </el-menu>
            </el-col>
            <el-col :span="21" :offset="0">
                <!-- title -->
                <div class="title">
                    <el-breadcrumb separator=">">
                        <el-breadcrumb-item v-for="(it, i) in path_arr" :key="i" :to="{ path: it?.path }">{{ it?.name
                        }}</el-breadcrumb-item>
                    </el-breadcrumb>
                    <div>
                        <el-button size="mini" @click="clear" round><el-icon>
                                <Pointer />
                            </el-icon>一键已读</el-button>
                        <el-button v-if="path_arr.length == 1" type="primary" size="mini" @click="isSend = !isSend"
                            round><el-icon>
                                <Message />
                            </el-icon>发送新私信</el-button>
                    </div>
                </div>
                <!-- 内容 -->
                <div class="cont_s">
                    <router-view :isOk="isOk" @toMsg_is="toMsg_is" @paths="getPath"></router-view>
                </div>
            </el-col>
        </el-row>
    </div>
    <sendMsg @close="close" :isSend="isSend"></sendMsg>
</template>
<script>
export default {
    name: 'msgPage'
}
</script>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/func/index'
import sendMsg from '@/components/sendMsg'
import { useRoute } from 'vue-router'
const route = useRoute();
const { proxy } = getCurrentInstance();
const emit = defineEmits(['toMsg_is']);
onMounted(() => {
    // 获取信息数量
    getMsg_num();
})
// 默认高亮
const activePath = ref('/' + route.path.split('/')[1]);
// 监听路由变化
watch(() => route.path, (key) => {
    activePath.value = '/' + key.split('/')[1];
    if (activePath.value == '/msginfo') {
        activePath.value = '/msglist';
    }
    if (key.split('/')[1] == 'sysmsg') {
        path_arr.value = [{
            path: '/sysmsg',
            name: '通知'
        }]
    } else {
        path_arr.value = [{
            path: '/msglist',
            name: '私信'
        }]
    }
})

// 信息数量
const msg_num = reactive({
    sys_num: 0,
    fri_num: 0
})
// 获取信息数量
const getMsg_num = () => {
    if (!!_getdtl('token')) {
        proxy.$axios.post('/get_msg_num.php', Qs.stringify({ token: _getdtl('token') }))
            .then(res => {
                if (res.data.code == 1) {
                    msg_num.sys_num = res.data.data.sys_num;
                    msg_num.fri_num = res.data.data.fri_num;
                }
            }).catch(err => {
                console.log(err);
            })
    }
}

// 面包屑
let path_arr = ref([{
    path: '/msglist',
    name: '私信'
}])

// 获取子组件传递的值
const getPath = (key) => {
    path_arr.value = key;
}

// 一键已读
const clear = () => {
    proxy.$axios.post('/update_msg_num.php', Qs.stringify({ token: _getdtl('token') }))
        .then(res => {
            if (res.data.code == 1) {
                // 传递值给子组件
                isOk.value = true;
                // 传递信息给父组件
                emit('toMsg_is', Math.random() * 10);
                ElMessage({
                    type: 'success',
                    message: res.data.msg,
                })
                // 重新获取数量
                getMsg_num();
            } else {
                ElMessage({
                    type: 'warning',
                    message: res.data.msg,
                })
            }
        }).catch(err => {
            console.log(err);
        })
}

// 发送私信框开关
const isSend = ref(false);
const isOk = ref(false);
// 获取私信框组件传递的值
const close = (key) => {
    isSend.value = key.isSend;
    if (!!key.isOk) {
        isOk.value = key.isOk;
    }
}

// 获取信息列表组件传递的值
const toMsg_is = (key) => {
    if (!!key) {
        emit('toMsg_is', key);
        // 获取信息数量
        getMsg_num();
    }
}

</script>
<style scope lang="less">
.cont {
    width: 80%;
    background-color: white;
    margin: 0 auto;
    padding: 5px 0px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .5);

    .el-row {
        .el-col {
            .title {
                height: 45px;
                padding: 5px 0;
                border-bottom: 2px solid red;
                display: flex;
                justify-content: space-between;
                align-items: flex-end;
            }
        }

        .el-col:nth-child(2) {
            padding: 0 10px;
        }

        .el-badge__content.is-fixed {
            top: 15px !important;
        }
    }
}
</style>