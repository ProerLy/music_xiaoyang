<template>
    <div>
        <h3>修改密码</h3>
        <br>
        <!-- 旧密码 -->
        <el-row :gutter="20">
            <el-col :span="3" :offset="0">旧密码：</el-col>
            <el-col :span="10" :offset="0">
                <el-input type="password" clearable v-model="userForm.oldPass"
                    @blur="userForm.oldPass === '' ? errors.error_1 = '旧密码不能为空~' : errors.error_1 = ''" />
                <p>{{ errors.error_1 }}</p>
            </el-col>
        </el-row>

        <!-- 新密码 -->
        <el-row :gutter="20">
            <el-col :span="3" :offset="0">新密码：</el-col>
            <el-col :span="10" :offset="0">
                <el-input type="password" clearable v-model="userForm.newPass"
                    @blur="userForm.newPass === '' ? errors.error_2 = '新密码不能为空~' : errors.error_2 = ''" />
                <p>{{ errors.error_2 }}</p>
            </el-col>
        </el-row>
        <!-- 修改按钮 -->
        <el-button type="primary" :disabled="isDisabled" size="default" @click="setPass">
            修改
            <el-icon v-if="!!dre" class="run">
                <Loading />
            </el-icon>
            <el-icon v-if="!!ok">
                <SuccessFilled />
            </el-icon>
            <el-icon v-if="!!no">
                <CircleCloseFilled />
            </el-icon>
            <el-icon v-if="err">
                <WarningFilled />
            </el-icon>
        </el-button>
    </div>
</template>
<script>
export default {
    name: 'IdSet'
}
</script>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Qs from 'qs'
// // 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/func/index'
// $emit方法
const emit = defineEmits(['index']);
// axios代理
const { proxy } = getCurrentInstance();
// 路由
const router = useRouter();
// 导航默认选中
onMounted(() => {
    emit('index', 1);
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.replace('/login');
        }, 2000);
        return false;
    }
})

// 输入框的值
let userForm = reactive({
    oldPass: '',
    newPass: ''
})

// 错误提示
let errors = reactive({
    error_1: '',
    error_2: ''
})

// 延迟
let dre = ref(false);
// 修改成功图标
let ok = ref(false);
// 修改错误图标
let no = ref(false);
// 修改异常图标
let err = ref(false);
// 静止按钮
let isDisabled = ref(false);
// 点击修改方法
const setPass = () => {
    if (userForm.oldPass === '') {
        errors.error_1 = '旧密码不能为空~';
    }
    if (userForm.newPass === '') {
        errors.error_2 = '新密码不能为空~';
    }
    if (userForm.oldPass !== '' && userForm.newPass !== '') {
        // 判断是否符号密码格式
        if (!(/(?=^.{6,16}$)(?=(?:.*?\d){1})(?=.*[a-z])(?=(?:.*?[A-Z]){1})(?=(?:.*?[`·~!@#$%^&*()_+}{|:;'",<.>/?\=\[\]\-\\]){1})(?!.*\s)[0-9a-zA-Z`·~!@#$%^&*()_+}{|:;'",<.>/?\=\[\]\-\\]*$/.test(userForm.newPass))) {
            ElMessage.warning('密码长度 6-16 位，包含至少一个特殊字符，一个数字，一个大写字母和一个小写字母~');
            return false;
        }
        dre.value = true;
        // 禁用按钮
        isDisabled.value = true;
        setTimeout(() => {
            dre.value = false;
            // 请求数据库
            const params = Qs.stringify({
                oldPas: userForm.oldPass,
                newPas: userForm.newPass,
                token: _getdtl('token')
            })
            proxy.$axios.post('/update_password.php', params)
                .then((res) => {
                    // console.log(res)
                    if (res.status !== 200) {
                        // 开启错误图标
                        err.value = true;
                        ElMessage.warning('修改异常~');
                        setTimeout(() => {
                            // 关闭异常图标
                            err.value = false;
                            // 启用按钮
                            isDisabled.value = false;
                        }, 1000);
                    } else {
                        if (res.data.code) {
                            // 登录状态离线
                            const params = Qs.stringify({
                                token: _getdtl('token'),
                                code: 0
                            })
                            proxy.$axios.post('/code.php', params)
                                .then((res) => {
                                    // 离线
                                    _setdtl('code', 0);
                                    console.log(res);
                                }).catch((err) => {
                                    console.log(err);
                                })
                            // 开启成功图标
                            ok.value = true;
                            ElMessage.success('修改成功~');
                            // 清空输入框
                            userForm.newPass = '';
                            userForm.oldPass = '';
                            // 清空储存数据
                            _setdtl('token', null);
                            // 取消自动登录
                            _setdtl('auto', null);
                            // 离线状态
                            _setdtl('code', 0);
                            // 退出登录、跳转登录页面
                            setTimeout(() => {
                                // 关闭正确图标
                                ok.value = false;
                                // 启用按钮
                                isDisabled.value = false;
                                router.replace('/login');
                            }, 1000);
                        } else {
                            // 开启错误图标
                            no.value = true;
                            ElMessage.error(res.data.msg);
                            setTimeout(() => {
                                // 关闭错误图标
                                no.value = false;
                                // 启用按钮
                                isDisabled.value = false;
                            }, 1000);
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
        }, 2000);
    }
}

</script>
<style scoped>
p {
    height: 20px;
    font-size: 15px;
    color: red;
}

.run {
    animation: run 1s infinite linear;
}

@keyframes run {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(180deg);
    }
}
</style>