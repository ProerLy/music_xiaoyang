<template>
    <el-skeleton :loading="loading" animated>
        <template #template>
            <el-row :gutter="20">
                <el-col :span="12" :offset="0">
                    <div class="info">
                        <el-skeleton-item variant="p" style=" height: 30px;"></el-skeleton-item>
                    </div>
                    <div class="info">
                        <el-skeleton-item variant="p" style=" height: 130px;"></el-skeleton-item>
                    </div>
                    <div class="info">
                        <el-skeleton-item variant="p" style="width: 80%; height: 30px;"></el-skeleton-item>
                    </div>
                    <div class="info">
                        <el-skeleton-item variant="p" style="width: 80%; height: 30px;"></el-skeleton-item>
                    </div>
                    <div class="info">
                        <el-skeleton-item variant="p" style="width: 80%; height: 30px;"></el-skeleton-item>
                    </div>
                    <div class="info">
                        <el-skeleton-item variant="button"></el-skeleton-item>
                    </div>
                </el-col>
                <el-col :span="12" :offset="0" style="display: flex; justify-content: center;">
                    <div class="info">
                        <el-skeleton-item variant="image" style="width: 180px; height: 180px;"></el-skeleton-item>
                    </div>
                </el-col>
            </el-row>

        </template>
        <template #default>
            <el-row :gutter="20">
                <el-col :lg="{ span: 12 }" :xs="{ span: 24 }" :offset="0">
                    <!-- 昵称 -->
                    <div class="info">
                        <el-row>
                            <el-col :span="3" :offset="0">昵称：</el-col>
                            <el-col :span="20" :offset="0">
                                <el-input v-model="nowUser.nick_name" placeholder="昵称"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 介绍 -->
                    <div class="info">
                        <el-row>
                            <el-col :span="3" :offset="0">介绍：</el-col>
                            <el-col :span="20" :offset="0">
                                <el-input v-model="nowUser.introduce" type="textarea" maxlength="300" show-word-limit
                                    placeholder="说点什么吧~" :autosize="{ minRows: 6, maxRows: 6 }"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- 性别 -->
                    <div class="gander info">
                        性别：<el-radio-group v-model="nowUser.gender">
                            <el-radio :label="1">女</el-radio>
                            <el-radio :label="2">男</el-radio>
                            <el-radio :label="3">隐藏</el-radio>
                        </el-radio-group>
                    </div>
                    <!-- 生日 -->
                    <div class="birth info">
                        生日：<el-date-picker v-model="nowUser.birth" type="date" placeholder="YYYY年MM月DD日"
                            format="YYYY年MM月DD日" value-format="YYYY年MM月DD日" />
                    </div>
                    <!-- 地址 -->
                    <div class="address info">
                        <!--默认使用-->
                        <!-- <elui-china-area-dht @change="onChange"></elui-china-area-dht> -->
                        <!--带isall参数和leave参数示例-->
                        地区：<elui-china-area-dht isall :leave="3" @change="onChange"
                            :placeholder="nowUser.province + nowUser.city + nowUser.area"></elui-china-area-dht>
                    </div>
                    <!-- 街道 -->
                    <div class="address info">
                        <el-row>
                            <el-col :span="3" :offset="0">街道：</el-col>
                            <el-col :span="20" :offset="0">
                                <el-input clearable v-model="nowUser.street" placeholder="请输入街道"></el-input>
                            </el-col>
                        </el-row>
                    </div>
                </el-col>
                <el-col :lg="{ span: 12 }" :xs="{ span: 24 }" :offset="0"
                    style="padding: 10px 0; display: flex; justify-content: center;">
                    <el-upload class="avatar-uploader" drag :show-file-list="false" :before-upload="beforeAvatarUpload">
                        <img v-if="nowUser.avatar" :src="nowUser.avatar" class="avatar" />
                        <el-icon v-else class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                        <p>点击更换头像</p>
                    </el-upload>
                </el-col>
            </el-row>
            <br>
            <p><el-button type="primary" size="default" @click="finish">保存</el-button></p>
        </template>
    </el-skeleton>
</template>
<script>
export default {
    name: 'DefltSet'
}
</script>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
// 引入方法
import { getData as _getdtl, setData as _setdtl, base } from '@/assets/js'
// 引入elui-china-area-dht
import { EluiChinaAreaDht } from 'elui-china-area-dht'
import { useRouter } from 'vue-router'
import Qs from 'qs'
// 路由
const router = useRouter();
// $emit方法
const emit = defineEmits(['index', 'getavatar']);
// axios方法
const { proxy } = getCurrentInstance();

// 页面渲染完毕
onMounted(() => {
    // nav默认高亮
    emit('index', 0);
    // 获取用户数据
    getDtl();
})

// 加载
let loading = ref(true);
// 获取本地个人数据
const nowUser = ref();
// 获取用户数据
const getDtl = () => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.replace('/login');
        }, 2000);
        return false;
    }
    setTimeout(() => {
        const data = Qs.stringify({
            token: _getdtl('token')
        })
        // 获取用户数据
        proxy.$axios.post('/getUser_info.php', data)
            .then((res) => {
                if (res.status === 200 && res.data.code == 1) {
                    nowUser.value = res.data.data[0];
                    nowUser.value.gender = parseInt(nowUser.value.gender);
                    // 关闭加载
                    loading.value = false;
                }
            }).catch((err) => {
                console.log(err);
            })
    }, 2000);
}

// 获取地址
const chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat;
// 覆盖区县
const onChange = (e) => {
    // 省
    const province = chinaData[e[0]]
    // 市
    const city = chinaData[e[1]]
    // 区
    const area = chinaData[e[2]]
    // console.log(province, city, e)
    nowUser.value.province = province.label;
    nowUser.value.city = city.label;
    nowUser.value.area = area.label;
}

const beforeAvatarUpload = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('头像必须是jpg或png格式~');
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片大小不能超过2MB~');
        return false
    }
    // 转换base64
    base(rawFile, data => {
        // console.log(data.length)
        nowUser.value.avatar = data;
    })
}

// 完成修改
const finish = () => {
    const data = Qs.stringify({
        token: nowUser.value.token,
        nick_name: nowUser.value.nick_name,
        introduce: nowUser.value.introduce,
        gender: nowUser.value.gender,
        birth: nowUser.value.birth,
        province: nowUser.value.province,
        city: nowUser.value.city,
        area: nowUser.value.area,
        street: nowUser.value.street,
        avatar: nowUser.value.avatar
    })
    proxy.$axios.post('/updateUser_info.php', data)
        .then((res) => {
            if (res.data.code == 0) {
                ElMessage.warning(res.data.msg);
                return false;
            }
            ElMessage.success('保存成功~');
            // 传递个父组件
            emit('getavatar', nowUser.value.avatar);
        }).catch((err) => {
            console.log(err);
        })
}
</script>
<style scoped>
.el-row {
    font-size: 15px;
}


.info {
    margin: 10px 0;
}

.avatar-uploader .avatar {
    width: 180px;
    height: 180px;
    display: block;
    margin-top: -20px;
    margin-left: -14px;
}

.el-upload {
    position: relative;
}

.el-upload p {
    position: absolute;
    left: 0;
    bottom: 0px;
    color: rgb(119, 119, 119);
    text-align: center;
    width: 100%;
    background-color: #A49D9D;
    padding: 5px 0;
    font-size: 15px;
}

.el-upload p:hover {
    color: white;
}

:deep(.el-upload-dragger) {
    width: 180px;
    padding: 30px 14px;
    padding-top: 20px;
}

:deep(.el-icon.avatar-uploader-icon) {
    width: 180px;
    height: 180px;
    margin-top: -20px;
    margin-left: -14px;
}

.avatar-uploader {
    width: 180px;
}
</style>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: center;
}
</style>