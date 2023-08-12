<template>
    <div v-if="msg.length > 0">
        <div class="item" v-for="(it, i) in msg" :key="i"
            @click="$router.push('/msginfo/' + it?.user_id + '/' + it?.friend_id)">
            <!-- 头像 -->
            <div class="avatar">
                <el-badge v-if="it?.total != 0" :value="it?.total" :max="99">
                    <el-link :underline="false" @click.stop="$router.push('/other/' + it?.friend_id)">
                        <el-image :src="it?.avatar" fit="fill" style="width: 50px;"></el-image>
                    </el-link>
                </el-badge>
                <el-link v-else :underline="false" @click.stop="$router.push('/other/' + it?.friend_id)">
                    <el-image :src="it?.avatar" fit="fill" style="width: 50px;"></el-image>
                </el-link>
            </div>
            <!-- 内容 -->
            <div class="text_s">
                <div class="left_cont">
                    <p><strong>{{ it?.nick_name }}</strong></p>
                    <p><small>{{ it?.content }}</small></p>
                </div>
                <div class="right_cont">
                    <div class="create_time">{{ it?.create_time }}</div>
                </div>
            </div>
        </div>
    </div>
    <el-empty v-else description="暂无私信" />
</template>
<script>
export default {
    name: 'msgList'
}
</script>
<script setup>
import { ref, onMounted, getCurrentInstance, toRefs, watch } from 'vue'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/func/index'
const { proxy } = getCurrentInstance();
const emit = defineEmits(['paths']);
// 页面渲染完毕
onMounted(() => {
    // 获取私信
    getMsg();
})

const props = defineProps({
    isOk: {
        type: Boolean
    }
})
const { isOk } = toRefs(props);

// 面包屑
let path_arr = ref([{
    path: '/msglist',
    name: '私信'
}])
// 私信数据
const msg = ref([]);
// 获取私信
const getMsg = () => {
    proxy.$axios.post('/get_msg_list.php', Qs.stringify({ token: _getdtl('token') }))
        .then(res => {
            if (res.data.code == 1) {
                msg.value = res.data.data;
                res.data.data.forEach((val, i) => {
                    var time = new Date(val.create_time);
                    msg.value[i].create_time = time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日';
                });
                // 传递父组件
                emit('paths', path_arr.value);
            }
        }).catch(err => {
            console.log(err);
        })
}

// 监听isOk
watch(() => isOk.value, (key) => {
    // console.log(key)
    if (!!key) {
        // 获取私信
        getMsg();
    }
})


</script>
<style scope lang="less">
.item {
    display: flex;
    padding: 15px 10px;
    cursor: pointer;
    border-bottom: 1px dashed rgba(0, 0, 0, .1);

    .avatar {
        width: 70px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding-left: 5px;
    }

    .text_s {
        width: 92%;
        display: flex;
        justify-content: space-between;

        .right_cont {
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            div {
                height: 50%;
            }

            .create_time {
                font-size: 15px;
            }

            .el-button {
                font-size: 10px;
                display: none;
            }
        }
    }
}

.item:hover {
    background-color: rgba(0, 0, 0, .05);
}
</style>