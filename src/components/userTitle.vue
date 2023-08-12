<template>
    <div class="user">
        <el-row :gutter="20">
            <!-- 头像 -->
            <el-col :offset="0" :xl="{ span: 6 }" :lg="{ span: 6 }" :md="{ span: 6 }" :sm="{ span: 22 }" :xs="{ span: 22 }">
                <el-image style="width: 180px; height: 180px; " :src="nowUser?.avatar" fit="fit" />
            </el-col>
            <!-- 个人信息 -->
            <el-col :offset="1" :xl="{ span: 17 }" :lg="{ span: 17 }" :md="{ span: 17 }" :sm="{ span: 22 }"
                :xs="{ span: 22 }">
                <h2 class="userName">
                    <span>{{ nowUser?.nick_name }}</span>
                    <!-- 编辑按钮 -->
                    <el-button v-if="isSelf" type="danger" :size="mini" @click="$router.push('/mineset')">编辑个人资料</el-button>
                </h2>
                <el-divider border-style="dashed" />
                <div class="other">
                    <el-breadcrumb separator="|">
                        <el-breadcrumb-item :to="{ path: '/follows/' + nowUser?.user_id }">关注（{{ nowUser?.concern_count
                        }}）</el-breadcrumb-item>
                        <el-breadcrumb-item :to="{ path: '/fens/' + nowUser?.user_id }">粉丝（{{ nowUser?.fen_count
                        }}）</el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div id="uerinfo">
                    <p>性别：
                        <el-icon size="15" v-if="nowUser?.gender == 2">
                            <Male color="skyblue" />
                        </el-icon>
                        <el-icon size="15" v-else-if="nowUser?.gender == 1">
                            <Female color="pink" />
                        </el-icon>
                        <span v-else-if="nowUser?.gender == 3">隐藏</span>
                        <span v-else>暂无</span>
                    </p>
                    <p>生日：{{ nowUser?.birth ? nowUser.birth : '暂无' }}
                    </p>
                    <p>所在地：{{ (nowUser?.province + nowUser?.city + nowUser?.area + nowUser?.street) ? (nowUser.province
                        + nowUser.city + nowUser.area + nowUser.street) :
                        '暂无' }}
                    </p>
                </div>
                <!-- 私信 -->
                <template v-if="!isSelf">
                    <el-button title="私信" @click="send" style="margin-top: 10px;" type="info" size="default" round><el-icon>
                            <ChatDotRound />
                        </el-icon> 私信</el-button>
                    <el-button title="关注" @click="care" style="margin-top: 10px;" type="primary" size="default"
                        round><el-icon>
                            <Connection />
                        </el-icon> {{ isCare ? '已关注' : '关注' }}</el-button>
                </template>
            </el-col>
        </el-row>
    </div>
    <!-- 私信框 -->
    <sendMsg :is_ary="friend" @close="closes" :isSend="isSend"></sendMsg>
</template>
<script>
export default {
    name: 'userTitle'
}
</script>
<script setup>
import { ref, getCurrentInstance, onMounted, toRefs, watch } from 'vue'
import { getData as _getdtl, setData as _setdtl } from '@/func/index'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
import sendMsg from '@/components/sendMsg'
const router = useRouter();
const route = useRoute();
// axios方法
const { proxy } = getCurrentInstance();
const props = defineProps({
    user_id: {
        type: String
    },
    isGet: {
        type: Boolean
    }
})
const { user_id, isGet } = toRefs(props);
// 默认个人信息
const nowUser = ref()

// 页面渲染完毕
onMounted(() => {
    getData(user_id.value ? user_id.value : route.params.id);
})
// 获取用户数据
const getData = (id) => {
    if (!id) return;
    const params = Qs.stringify({
        id
    })
    proxy.$axios.post('/getUser_info.php', params)
        .then((res) => {
            if (res.data.code == 1) {
                nowUser.value = res.data.data[0];
                is_care();
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 是否关注
const isCare = ref(false);
// 是否是用户自己
const isSelf = ref(false);
// 判断是否关注
const is_care = () => {
    proxy.$axios.post('/get_is_care.php', Qs.stringify({ token: _getdtl('token'), friend_id: nowUser.value.user_id }))
        .then(res => {
            // console.log(res)
            if (res.data.code == 1) {
                getData(user_id.value ? user_id.value : route.params.id);
                if (res.data.no) {
                    isSelf.value = res.data.no;
                    return;
                }
                isCare.value = res.data.data;
            }
        }).catch(err => {
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
const send = () => {
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
        avatar: nowUser.value.avatar,
        friend_id: nowUser.value.user_id,
        nick_name: nowUser.value.nick_name
    }]
    // 打开发送框
    isSend.value = true;
}

// 关注
const care = () => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return;
    }

    // 关注、取消关注
    isCare.value = !isCare.value;
    proxy.$axios.post('/insert_friend.php', Qs.stringify({ token: _getdtl('token'), friend_id: nowUser.value.user_id, code: isCare.value ? 1 : 0 }))
        .then(res => {
            // console.log(res)
            if (res.data.code == 1) {
                ElMessage.success(res.data.msg);
                // 获取数据
                getData();
            }
        }).catch(err => {
            console.log(err);
        })
}

// 监听isGet
watch(() => isGet.value, (key) => {
    getData(user_id.value ? user_id.value : route.params.id);
})
</script>
<style scope>
.userName {
    font-family: '微软雅黑';
    display: flex;
    justify-content: space-between;
}

#uerinfo p {
    padding: 5px 0;
    font-size: 10px;
}
</style>