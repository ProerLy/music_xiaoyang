<template>
    <div class="page">
        <!-- 顶部导航 -->
        <TopNav @setStyle="getEmit" :msg_is="is_msg" :avatar="avatar" />
        <router-view :musicId="musicId" @setStyle="getEmit" @getMusic="getMusic" @getMusic_list="getMusic_list"
            @getavatar="getavatar" @toMsg_is="toMsg_is" v-slot="{ Component }">
            <transition name="change">
                <component :is="Component" />
            </transition>
        </router-view>
        <a-player :audio="audio" @toMusic_id="toMusic_id"></a-player>
    </div>
</template>
<script>
export default {
    name: 'HomePage'
}
</script>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { setData as _setdtl, getData as _getdtl } from '@/func/index'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import Qs from 'qs'
import aPlayer from '@/components/aPlayer'
import TopNav from '@/components/TopNav'
import { useRouter } from 'vue-router'
const router = useRouter();
const { proxy } = getCurrentInstance();
// emit方法
const emit = defineEmits(['setStyle']);
// 获取到子组件传递的值
const getEmit = (n) => {
    // 传递给父组件
    emit('setStyle', n);
}
// 接收传递的头像
let avatar = ref();
const getavatar = (key) => {
    avatar.value = key;
}
// 接收的音乐数据
const audio = ref();
// 获取子组件传递的音乐数据
const getMusic = (data) => {
    audio.value = data;
}

// 音乐id
const musicId = ref();
// 拿到音乐播放器组件传递的音乐id
const toMusic_id = (id) => {
    // console.log(id)
    musicId.value = id;
}

const is_msg = ref(false);
// 拿到信息子组件传递的值
const toMsg_is = (key) => {
    // console.log(key)
    if (!!key) {
        is_msg.value = key;
    }
}

// 获取用户是否下线
const getControl = () => {
    if (!!_getdtl('token')) {
        // 获取用户状态
        proxy.$axios.post('/get_code.php', Qs.stringify({ token: _getdtl('token') }))
            .then((res) => {
                // console.log(res)
                if (res.data.code == 1) {
                    if (res.data.data[0].is_allow == 0) {
                        let cont = '';
                        if (res.data.data[0].no_allow_time == 0 || !res.data.data[0].no_allow_time) {
                            cont = `由于您的账号存在及其恶劣行为，已被永久封号~`;
                        } else {
                            const time = new Date(res.data.data[0].no_allow_time);
                            const out_time = time.getFullYear() + '年' + (time.getMonth() + 1) + '月' + time.getDate() + '日' + time.getHours() + '时' + time.getMinutes() + '分' + time.getSeconds() + '秒';
                            cont = `由于您的账号存在违规已被封禁，将于${out_time}解封~`;
                        }
                        ElMessageBox.alert(cont, '系统提示', {
                            confirmButtonText: 'OK',
                            type: 'error',
                            showClose: false
                        })
                        setTimeout(() => {
                            // 清除本地数据
                            _setdtl('token', null);
                            // 取消自动登录
                            _setdtl('auto', null);
                            // 离线
                            _setdtl('code', 0);
                            // 跳转登录页面
                            router.replace('/login');
                        }, 5000);
                        return false;
                    } else if (res.data.data[0].is_login == 0) {
                        ElMessageBox.alert('管理员已将您强制下线，请及时联系管理人员~', '系统提示', {
                            confirmButtonText: 'OK',
                            type: 'error',
                            showClose: false
                        })
                        setTimeout(() => {
                            // 清除本地数据
                            _setdtl('token', null);
                            // 取消自动登录
                            _setdtl('auto', null);
                            // 离线
                            _setdtl('code', 0);
                            // 跳转登录页面
                            router.replace('/login');
                        }, 5000);
                        return false;
                    }
                }
            }).catch((err) => {
                console.log(err);
            })
    }
}

// 每十秒获取用户状态
const getCode = () => {
    // 每隔10秒获取一次用户状态
    var set = setInterval(() => {
        getControl();
        clearInterval(set);
        getCode();
    }, 10000);
}

// 页面渲染完毕，判断用户登录，状态为在线
onMounted(() => {
    // 获取用户状态
    getControl();
    // 每十秒获取用户状态
    getCode();
    // 获取用户数据
    if (!!_getdtl('token')) {
        const params = Qs.stringify({
            token: _getdtl('token')
        })
        proxy.$axios.post('/getUser_info.php', params)
            .then((res) => {
                // console.log(res)
                if (res.data.code == 1 && res.data.data[0].is_login == 1) {
                    // 判断是否登录
                    if (!_getdtl('code') || _getdtl('code') == 0) {
                        _setdtl('code', 1);
                        if (res.data.data[0].leavel > 1) {
                            ElNotification({
                                title: '欢迎登录',
                                message: res.data.data[0].type_name + '，' + res.data.data[0].nick_name,
                                type: 'success',
                            })
                        } else {
                            ElNotification({
                                title: '欢迎登录',
                                message: res.data.data[0].nick_name,
                                type: 'success',
                            })
                        }
                    }
                }
            }).catch((err) => {
                console.log(err);
            })
    }
})

</script>
<style scoped></style>