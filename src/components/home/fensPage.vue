<template>
    <div class="box">
        <userTitle :isGet="is_get" :user_id="nowUser?.user_id"></userTitle>
        <div class="fens_list">
            <h3 class="songListTitle">他(她)有粉丝{{ fens.total }}人</h3>
            <!-- 列表 -->
            <div class="fens_list" v-if="fens.total > 0">
                <el-row>
                    <el-col class="c_item" v-for="(it, i) in fens.arr" :key="i" :span="12" :offset="0">
                        <el-row>
                            <el-col :span="4" :offset="0">
                                <el-link :underline="false" @click="$router.push('/other/' + it?.data.friend_id)">
                                    <el-image :src="it.data?.avatar" fit="fill"></el-image></el-link>
                            </el-col>
                            <el-col :span="20" :offset="0">
                                <div>{{ it.data?.nick_name }}</div>
                                <div v-if="it?.isC">
                                    <el-button title="私信" @click="send(i)" style="margin-top: 10px;" type="info"
                                        size="default" round><el-icon>
                                            <ChatDotRound />
                                        </el-icon> 私信</el-button>
                                    <el-button title="关注" @click="care(i)" style="margin-top: 10px;" type="primary"
                                        size="default" round><el-icon>
                                            <Connection />
                                        </el-icon> {{ it?.is_care ? '已关注' : '关注' }}</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <!-- 私信框 -->
                <sendMsg :is_ary="friend" @close="closes" :isSend="isSend"></sendMsg>
            </div>
            <el-empty v-else description="暂无粉丝" />
        </div>
    </div>
</template>
<script>
export default {
    name: 'fensPage'
}
</script>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/assets/js'
import { useRouter, useRoute } from 'vue-router'
import userTitle from '@/components/component/userTitle.vue'
import sendMsg from '@/components/component/sendMsg.vue'
const emit = defineEmits(['getPath', 'getMusic']);
const router = useRouter();
const route = useRoute();
const { proxy } = getCurrentInstance();
// 页面渲染完毕时传递父级值
onMounted(() => {
    // 获取高亮
    getpath();
    // 获取用户数据
    getData(route.params.id);
})
// 传递值的方法
const getpath = () => {
    emit('getPath', '')
}
// 默认个人数据
const nowUser = ref();
// 获取用户数据
const getData = (id) => {
    proxy.$axios.post('/getUser_info.php', Qs.stringify({
        id
    }))
        .then((res) => {
            if (res.data.code == 1) {
                nowUser.value = res.data.data[0];
                getfens(nowUser.value.user_id, _getdtl('token'));
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 关注人数据
const fens = reactive({
    total: 0,
    arr: []
});
// 获取关注人信息
const getfens = (id, token) => {
    proxy.$axios.post('/get_fens.php', Qs.stringify({
        id,
        token
    }))
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                fens.total = res.data.total;
                fens.arr = res.data.data;
            }
        }).catch((err) => {
            console.log(err);
        })
}


// 发送私信框开关
const isSend = ref(false);
// 获取私信框组件传递的值
const closes = (key) => {
    isSend.value = key.isSend;
}

// 用户
const friend = ref([]);
// 私信
const send = (index) => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return;
    }
    // 默认选中
    friend.value = [{
        avatar: fens.arr[index].data.avatar,
        friend_id: fens.arr[index].data.user_id,
        nick_name: fens.arr[index].data.nick_name
    }]
    // 打开发送框
    isSend.value = true;
}

// 是否重新加载用户信息子组件
const is_get = ref(false);
// 关注
const care = (index) => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return;
    }

    // 关注、取消关注
    fens.arr[index].is_care = !fens.arr[index].is_care;
    proxy.$axios.post('/insert_friend.php', Qs.stringify({ token: _getdtl('token'), friend_id: fens.arr[index].data.friend_id, code: fens.arr[index].is_care ? 1 : 0 }))
        .then(res => {
            // console.log(res)
            if (res.data.code == 1) {
                ElMessage.success(res.data.msg);
                // 传递值给用户信息子组件重新获取数据
                is_get.value = Math.random()*10;
                // 获取数据
                getfens(nowUser.value.user_id, _getdtl('token'));
            }
        }).catch(err => {
            console.log(err);
        })
}

</script>
<style scoped lang="less">
.box {
    width: 60%;
    min-height: max-content;
    margin: 0 auto;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    padding: 40px;
    background-color: rgba(255, 255, 255, .1);


    :deep(.el-breadcrumb__item .el-breadcrumb__inner) {
        font-weight: bold !important;
        font-size: 15px;
        color: rgba(0, 0, 0, .8) !important;
        cursor: pointer !important;
    }

    :deep(.el-breadcrumb__item .el-breadcrumb__inner):hover {
        color: #529EFF !important;
    }

    .fens_list {
        h3 {
            border-bottom: 2px solid #EEEEEE;
            padding: 5px 0;
            margin-top: 30px;
        }

        .c_item {
            padding: 10px;
            outline: 1px solid rgba(255, 255, 255, .5);

            .el-image {
                margin-right: 10px;
                border-radius: 50%;
            }
        }

        .c_item:hover {
            background-color: rgba(255, 255, 255, .3);
        }
    }
}
</style>