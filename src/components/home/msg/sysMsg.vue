<template>
    <!-- 内容区 -->
    <div v-if="msg.arr.length > 0" class="sys_msg_list">
        <div class="item_list">
            <template v-for="(it, i) in msg.arr" :key="i">
                <div class="time">{{ it?.create_time }}</div>
                <div class="info_item">
                    <div class="items">
                        <el-avatar style="margin-right: 5px;" :icon="BellFilled" />
                        <div>
                            <div style="text-align: left;" class="nick_name">系统通知</div>
                            <div class="ct">{{ it?.content }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <el-empty v-else description="暂无通知" />
</template>
<script>
export default {
    name: 'sysMsg'
}
</script>
<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/assets/js'
import { useRoute } from 'vue-router'
import { BellFilled } from '@element-plus/icons-vue'
const emit = defineEmits(['toMsg_is']);
const { proxy } = getCurrentInstance();
const route = useRoute();
// 页面渲染完毕
onMounted(() => {
    getsys_info();
})

// 对话信息
const msg = reactive({
    arr: []
})
// 获取对话信息
const getsys_info = () => {
    proxy.$axios.get('/get_sys_msg.php')
        .then(res => {
            // console.log(res)
            if (res.data.code == 1) {
                msg.arr = res.data.data;
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
                    } else if (y_now == y && mo_now == mo && d_now - d <= 7) {
                        val.create_time = d_now - d + '天前';
                    } else if (y_now == y && mo_now == mo && d_now - d <= 31) {
                        val.create_time = Math.floor((d_now - d) / 7) + '周前';
                    } else if (y_now == y && mo_now > mo) {
                        val.create_time = (mo_now - mo) + '个月前';
                    } else {
                        val.create_time = y + '年' + mo + '月' + d + '日';
                    }
                });
                // 清理信息量
                if (!!_getdtl('token')) {
                    clear_num(_getdtl('token'));
                }
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
const clear_num = (token) => {
    proxy.$axios.post('/clear_sys_num.php', Qs.stringify({ token }))
        .then(res => {
            // console.log(res)
            if (res.data.code == 1) {
                // 传递父组件值
                emit('toMsg_is', Math.random() * 10);
            }
        }).catch(err => {
            console.log(err);
        })
}

// 触底效果
const bot = () => {
    document.getElementsByClassName('sys_msg_list')[0].scrollTop = document.getElementsByClassName('item_list')[0].offsetHeight;
}

</script>
<style scope lang="less">
.title_name {
    text-align: center;
    padding: 10px 0;
    background-color: rgb(31, 30, 30);
    color: white;
}

.sys_msg_list {
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
                    background-color: rgb(250, 135, 135);
                    color: white;
                }

                .ct::before {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    border: 5px solid transparent;
                    top: 5px;
                    border-right-color: rgb(250, 135, 135);
                    left: -9px;
                }
            }
        }
    }
}
</style>