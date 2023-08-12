<template>
    <!-- 标题 -->
    <h4 class="title_name">{{ msg.title }}</h4>
    <!-- 内容区 -->
    <div class="msg_info_list">
        <div class="item_list">
            <template v-for="(it, i) in msg.arr" :key="i">
                <div class="time">{{ it?.create_time }}</div>
                <div class="info_item item_left" v-if="it?.user_id != $route.params.friend_id">
                    <div class="items">
                        <el-image :src="it?.avatar" fit="fill" style="width: 50px; margin-right: 10px;"
                            @click="$router.push('/other/' + it?.friend_id)"></el-image>
                        <div>
                            <div style="text-align: left;" class="nick_name">{{ it?.nick_name }}</div>
                            <div class="ct ct_left">{{ it?.content }}</div>
                        </div>
                    </div>
                </div>
                <div class="info_item item_right" v-else>
                    <div class="items">
                        <div>
                            <div style="text-align: right;" class="nick_name">{{ it?.nick_name }}</div>
                            <div class="ct ct_right">{{ it?.content }}</div>
                        </div>
                        <el-image :src="it?.avatar" fit="fill" style="width: 50px; margin: 0px 10px;"
                            @click="$router.push('/other/' + it?.friend_id)"></el-image>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <!-- 发送信息 -->
    <div class="speack">
        <el-input v-model="input" clearable>
            <template #prepend>
                <!-- 表情包 -->
                <div class="commit_input_happy">
                    <el-icon size="20" color="rgba(0, 0, 0, .6)" @click="dialogVisible.dialogVisible_1 = true">
                        <Watermelon />
                    </el-icon>
                    <el-dialog v-model="dialogVisible.dialogVisible_1" :modal="false" width="20%" draggable>
                        <div class="happy_content">
                            <span @click="demos(it)" v-for="it in demo" :key="it">{{ it }}</span>
                        </div>
                    </el-dialog>
                </div>
            </template>
            <template #append>
                <el-button type="primary" size="default" @click="send(input)">发送</el-button>
            </template>
        </el-input>
    </div>
</template>
<script>
export default {
    name: 'msgInfo'
}
</script>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/assets/js'
import { useRoute } from 'vue-router'
const { proxy } = getCurrentInstance();
const emit = defineEmits(['toMsg_is', 'paths']);
const route = useRoute();
// 页面渲染完毕
onMounted(() => {
    getData();
    getDemo();
})

// 面包屑
let path_arr = ref([{
    path: '/msglist',
    name: '私信'
}])

// 个人信息
const user = ref();
// 获取个人信息
const getData = () => {
    proxy.$axios.post('/getUser_info.php', Qs.stringify({ id: route.params.user_id }))
        .then(res => {
            if (res.data.code == 1) {
                user.value = res.data.data[0];
                // 获取聊天信息
                getMsg_info(res.data.data[0].user_id);
                // 读取数据
                clear_num(res.data.data[0].user_id);
            }
        }).catch(err => {
            console.log(err);
        })
}

// 对话信息
const msg = reactive({
    title: null,
    arr: []
})
// 获取对话信息
const getMsg_info = (user_id) => {
    proxy.$axios.post('/get_msg.php', Qs.stringify({ user_id, friend_id: route.params.friend_id }))
        .then(res => {
            if (res.data.code == 1) {
                msg.title = res.data.nick_name;
                msg.arr = res.data.data;
                path_arr.value.push({
                    path: '',
                    name: res.data.nick_name
                })
                // 传递父组件
                emit('paths', path_arr.value);
                // 当前时间
                const time_now = new Date();
                const y_now = time_now.getFullYear();
                const mo_now = time_now.getMonth() + 1;
                const d_now = time_now.getDate();
                const h_now = time_now.getHours();
                const mi_now = time_now.getMinutes();
                res.data.data.forEach(val => {
                    // 发送时间
                    const time = new Date(val.create_time);
                    const y = time.getFullYear();
                    const mo = time.getMonth() + 1;
                    const d = time.getDate();
                    const h = time.getHours();
                    const mi = time.getMinutes();
                    const s = time.getSeconds();
                    if (y_now == y && mo_now == mo && d_now == d && h_now == h && mi == mi_now && s <= 60) {
                        val.create_time = '刚刚';
                    } else if (y_now == y && mo_now == mo && d_now == d && h_now == h && mi <= 60) {
                        val.create_time = mi_now - mi + '分钟前';
                    } else if (y_now == y && mo_now == mo && d_now == d && h <= 24) {
                        val.create_time = h_now - h + '小时前';
                    } else if (y_now == y && mo_now == mo && d <= 7) {
                        val.create_time = d_now - d + '天前';
                    } else if (y_now == y && mo_now == mo && d <= 30) {
                        val.create_time = Math.ceil((d_now - d) / 7) + '周前';
                    } else {
                        val.create_time = y + '年' + mo + '月' + d + '日';
                    }
                });
                // 触底
                setTimeout(() => {
                    bot();
                }, 100);
            }
        }).catch(err => {
            console.log(err);
        })
}

// 清理信息量
const clear_num = (user_id) => {
    proxy.$axios.post('/clear_msg_num.php', Qs.stringify({ user_id, friend_id: route.params.friend_id }))
        .then(res => {
            if (res.data.code == 1) {
                // 传递父组件值
                emit('toMsg_is', Math.random()*10);
            }
        }).catch(err => {
            console.log(err);
        })
}

// 表情开关
const dialogVisible = reactive({
    dialogVisible_1: false,
    dialogVisible_2: false
})
// 表情数据
const demo = ref();
// 获取表情的方法
const getDemo = () => {
    proxy.$axios('/demo.json')
        .then((inres) => {
            demo.value = inres.data.demo;
        }).catch((err) => {
            console.log(err)
        })
}

// 点击表情添加
const demos = (key) => {
    input.value += key;
}

// 输入框数据
const input = ref('');

// 发送信息
const send = (key) => {
    if (!key) {
        ElMessage.warning('请输入内容~');
        return;
    }
    proxy.$axios.post('/insert_msg.php',
        Qs.stringify({
            token: _getdtl('token'),
            friend_id: [{ friend_id: route.params.friend_id }],
            content: key
        })
    ).then((res) => {
        if (res.data.code == 0) {
            ElMessage.warning(res.data.msg);
            return;
        }
        const time = new Date();
        // 添加信息
        msg.arr.push({
            avatar: user.value.avatar,
            content: key,
            friend_id: user.value.user_id,
            user_id: route.params.friend_id,
            nick_name: user.value.nick_name,
            create_time: '刚刚'
        })
        input.value = '';
        // 触底
        setTimeout(() => {
            bot();
        }, 100);
    }).catch((err) => {
        console.log(err)
    })
}

// 触底效果
const bot = () => {
    document.getElementsByClassName('msg_info_list')[0].scrollTop = document.getElementsByClassName('item_list')[0].offsetHeight;
}

</script>
<style scope lang="less">
.title_name {
    text-align: center;
    padding: 10px 0;
    background-color: rgb(31, 30, 30);
    color: white;
}

.msg_info_list {
    padding: 20px 10px;
    height: 380px;
    overflow: auto;

    .item_list {
        .time {
            text-align: center;
        }

        .info_item {
            display: flex;

            .items {
                display: flex;
                align-items: flex-start;
                padding: 10px 0;

                .ct {
                    border-radius: 5px;
                    padding: 8px 10px;
                    margin: 5px 0;
                    position: relative;
                }

                .ct_left {
                    background-color: black;
                    color: white;
                }

                .ct_right {
                    background-color: rgb(2, 255, 2);
                    color: black;
                }

                .ct::before {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    border: 5px solid transparent;
                    top: 5px;
                }

                .ct_left::before {
                    border-right-color: black;
                    left: -9px;
                }

                .ct_right::before {
                    border-left-color: rgb(2, 255, 2);
                    right: -9px;
                }
            }
        }

        .item_left {
            justify-content: flex-start;
        }

        .item_right {
            justify-content: flex-end;
        }

        .el-image{
            cursor: pointer !important;
        }
    }
}

.speack {
    padding: 20px 10px;
    background-color: white;
    box-shadow: 0px -1px 3px rgba(0, 0, 0, .3);

    .commit_input_happy {
        display: flex;
        align-items: center;

        .happy_content {
            height: 200px;
            display: flex;
            flex-wrap: wrap;
            overflow: auto;
        }

        .happy_content span {
            display: inline-block;
            width: 25px;
            height: 25px;
            text-align: center;
            line-height: 25px;
        }

        .happy_content span:hover {
            background-color: rgba(0, 0, 0, .2);
            cursor: pointer;
        }
    }

    .el-input-group__append button {
        background-color: #529EFF !important;
        color: white !important;
    }
}
</style>