<template>
    <div class="user">
        <el-row style="width: 100%;">
            <el-col :lg="{ span: 11 }" :md="{ span: 24 }" :offset="0">
                <div class="user_avatar">
                    <el-link @click="gotoUser" :underline="false"><el-image
                            style="width: 100px; height: 100px; border: 1px solid rgba(0,0,0,.3);"
                            :src="nowUser?.avatar ? nowUser?.avatar : ''" fit="fill" /></el-link>
                </div>
            </el-col>
            <el-col :lg="{ span: 12 }" :md="{ span: 24 }" :offset="0">
                <div class="userinfo">
                    <div class="user_name">
                        {{ nowUser?.nick_name ? nowUser.nick_name : '用户名' }}
                    </div>
                    <el-divider border-style="double" />
                    <div class="address">
                        地址：{{ (nowUser?.province + nowUser?.city + nowUser?.area + nowUser?.street) ? (nowUser?.province +
                            nowUser?.city + nowUser?.area + nowUser?.street) : '暂无' }}
                    </div>
                    <div class="gender">
                        性别：<el-icon size="15" v-if="nowUser?.gender == 2">
                            <Male color="skyblue" />
                        </el-icon>
                        <el-icon size="15" v-else-if="nowUser?.gender == 1">
                            <Female color="pink" />
                        </el-icon>
                        <span v-else-if="nowUser?.gender == 3">隐藏</span>
                        <span v-else>暂无</span>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    name: 'userInfo'
}
</script>
<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getData as _getdtl, setData as _setdtl } from '@/assets/js'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Qs from 'qs'
const router = useRouter();
// axios方法
const { proxy } = getCurrentInstance();
// 默认个人信息
const nowUser = ref()

// 页面渲染完毕
onMounted(() => {
    getData();
})
// 获取用户数据
const getData = () => {
    if (!_getdtl('token')) return;
    const params = Qs.stringify({
        token: _getdtl('token')
    })
    proxy.$axios.post('/getUser_info.php', params)
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1 && res.status == 200) {
                nowUser.value = res.data.data[0];
            }
        }).catch((err) => {
            console.log(err);
        })
}
// 跳转个人信息页面
const gotoUser = () => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return false;
    }
    router.push('/mine');
}
</script>
<style scope>
.user {
    padding: 10px 0px 10px 10px;
    border-bottom: 1px solid rgba(0, 0, 0, .3);
}

.userinfo {
    width: 100%;
    font-size: 10px;
}

.user_name {
    font-size: 15px;
}

.address {
    margin-bottom: 5px;
}

.el-divider--horizontal {
    margin: 10px 0 !important;
}
</style>