<template>
    <div class="page">
        <div class="box">
            <!-- 土味情话 -->
            <h4>{{ word ? word : '' }}</h4>
            <h4>
                <el-button type="success" @click="getWord()" circle>
                    <el-icon>
                        <Refresh />
                    </el-icon>
                </el-button>
            </h4>
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
                <h2><span>七语熙音乐馆</span><span>注册</span></h2>
                <el-row>
                    <el-col :span="6">
                        <!-- 用户头像 -->
                        用户头像：
                        <el-upload class="avatar-uploader" :show-file-list="false" :before-upload="beforeAvatarUpload">
                            <img v-if="ruleForm.avatar" :src="ruleForm.avatar" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </el-upload>
                    </el-col>
                    <el-col :span="18">
                        <el-row>
                            <!-- 账号 -->
                            <el-col :span="12">
                                <el-form-item label="账号" :rules="[{ required: true, message: '账号不能为空~' }]" prop="userid" label-width="68px">
                                    <!-- 账号 -->
                                    <el-input clearable v-model="ruleForm.userid" placeholder="请输入账号"></el-input>
                                </el-form-item>
                            </el-col>
                            <!-- 密码 -->
                            <el-col :span="11" :offset="1">
                                <el-form-item label="密码" :rules="[{ required: true, message: '密码不能为空~' }]" prop="password" label-width="54px">
                                    <!-- 密码 -->
                                    <el-input type="password" clearable v-model="ruleForm.password"
                                        placeholder="请输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                            <!-- 确认密码 -->
                            <el-col :span="12">
                                <el-form-item label="确认密码" :rules="[{ required: true, message: '二次密码不能为空~' }]" prop="password2">
                                    <!-- 确认密码 -->
                                    <el-input type="password" clearable v-model="ruleForm.password2"
                                        placeholder="请再次输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                            <!-- 用户名 -->
                            <el-col :span="11" :offset="1" class="infos">
                                <el-form-item label="用户名">
                                    <!-- 用户名 -->
                                    <el-input clearable v-model="ruleForm.nick_name" placeholder="请输入用户名"></el-input>
                                </el-form-item>
                            </el-col>
                            <!-- 地址 -->
                            <el-col :span="12" class="infos">
                                <el-form-item label="省市区" label-width="70px">
                                    <!--默认使用-->
                                    <!-- <elui-china-area-dht @change="onChange"></elui-china-area-dht> -->
                                    <!--带isall参数和leave参数示例-->
                                    <elui-china-area-dht isall :leave="3" @change="onChange"
                                        placeholder="请选择省市区"></elui-china-area-dht>
                                </el-form-item>
                            </el-col>
                            <!-- 街道 -->
                            <el-col :span="11" :offset="1" class="infos">
                                <el-form-item label="街道" label-width="54px">
                                    <el-input clearable v-model="ruleForm.street" placeholder="请输入街道"></el-input>
                                </el-form-item>
                            </el-col>
                            <!-- 性别 -->
                            <el-col :span="12" class="infos">
                                <el-form-item label="性别" label-width="70px">
                                    <!-- 性别 -->
                                    <el-radio-group v-model="ruleForm.gender">
                                        <el-radio :label="1">女</el-radio>
                                        <el-radio :label="2">男</el-radio>
                                        <el-radio :label="3">隐藏</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <!-- 生日 -->
                            <el-col :span="11" :offset="1">
                                <el-form-item label="生日" label-width="54px">
                                    <el-date-picker v-model="ruleForm.birth" type="date" placeholder="YYYY年MM月DD日"
                                        format="YYYY年MM月DD日" value-format="YYYY年MM月DD日" />
                                </el-form-item>
                            </el-col>
                            <!-- 个性签名 -->
                            <el-col>
                                <el-form-item label="个性签名">
                                    <!-- 个性签名 -->
                                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="300"
                                        show-word-limit clearable v-model="ruleForm.introduce"
                                        placeholder="说点什么吧..."></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
                <p style="text-align: right; margin-bottom: 10px;">
                    <small><router-link to="/login">已有账号？前往登录……</router-link></small>
                </p>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button style="width: 30%; margin: 0 auto;" type="primary"
                        @click="submitForm('ruleForm')">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { ElLoading, ElMessage } from 'element-plus'
// 引入elui-china-area-dht
import { EluiChinaAreaDht } from 'elui-china-area-dht'
import Qs from 'qs'
import { getData as _getdtl, setData as _setdtl, base } from '@/func/index'
export default {
    name: 'RegitPage',
    components: {
        EluiChinaAreaDht
    },
    data() {
        // 验证方法
        var validateId = (rule, value, callback) => {
            if (value === '' || !value) {
                callback(new Error('请输入手机号'));
            } else if (!(/^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/.test(value))) {
                callback(new Error('请输入正确的手机号'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '' || !value) {
                callback(new Error('请输入密码'));
            } else if (!(/(?=^.{6,16}$)(?=(?:.*?\d){1})(?=.*[a-z])(?=(?:.*?[A-Z]){1})(?=(?:.*?[`·~!@#$%^&*()_+}{|:;'",<.>/?\=\[\]\-\\]){1})(?!.*\s)[0-9a-zA-Z`·~!@#$%^&*()_+}{|:;'",<.>/?\=\[\]\-\\]*$/.test(value))) {
                callback(new Error('密码长度 6-16 位，包含至少一个特殊字符，一个数字，一个大写字母和一个小写字母'));
            } else {
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '' || !value) {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.ruleForm.password) {
                callback(new Error('两次密码不一致'));
            } else {
                callback();
            }
        };
        return {
            // 验证框的值
            ruleForm: {
                nick_name: '',
                userid: '',
                password: '',
                password2: '',
                avatar: '',
                gender: 3,
                province: '',
                birth: '',
                city: '',
                area: '',
                street: '',
                introduce: ''
            },
            chinaData: [],
            // 规则
            rules: {
                userid: [
                    { validator: validateId, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                password2: [
                    { validator: validatePass2, trigger: 'blur' }
                ]
            },
            // 土味情话
            word: ''
        };
    },
    // 元素渲染完成后获取土味情话
    mounted() {
        this.getWord();
        this.getAddress();
        // 取消自动登录
        _setdtl('auto', null);
    },
    methods: {
        // 注册事件
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 创建加载
                    const loading = ElLoading.service({
                        target: '.el-form',
                        lock: true,
                        text: '注册中，请稍后……',
                        background: 'rgba(255, 255, 255, 0.8)',
                    })
                    setTimeout(() => {
                        // 判断是否注册成功
                        const params = Qs.stringify({
                            nick_name: this.ruleForm.nick_name ? this.ruleForm.nick_name : '用户名',
                            mobile: this.ruleForm.userid,
                            password: this.ruleForm.password,
                            avatar: this.ruleForm.avatar,
                            gender: this.ruleForm.gender,
                            birth: this.ruleForm.birth,
                            province: this.ruleForm.province,
                            city: this.ruleForm.city,
                            area: this.ruleForm.area,
                            street: this.ruleForm.street,
                            introduce: this.ruleForm.introduce,
                            user_type_id: 1
                        })
                        this.$axios.post('/setUser_info.php', params)
                            .then((res) => {
                                // console.log(res)
                                // 关闭加载
                                loading.close();
                                const data = res.data;
                                if (res.status == 200 && data.code == 1) {
                                    // 注册成功
                                    // 创建新的加载
                                    const loadingg = ElLoading.service({
                                        target: '.el-form',
                                        lock: true,
                                        text: '注册通过~',
                                        spinner: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>',
                                        background: 'rgba(0, 255, 0, 0.5)',
                                    })
                                    ElMessage.success(data.msg);
                                    setTimeout(() => {
                                        // 关闭加载
                                        loadingg.close();
                                        // 跳转主页面
                                        this.$router.replace({ path: '/login' });
                                    }, 2000);
                                } else {
                                    // 创建新的加载
                                    const loadings = ElLoading.service({
                                        target: '.el-form',
                                        lock: true,
                                        text: '注册失败~',
                                        spinner: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>',
                                        background: 'rgba(255,0,0, 0.5)',
                                    })
                                    ElMessage.warning(data.msg);
                                    setTimeout(() => {
                                        // 关闭加载
                                        loadings.close();
                                    }, 2000);
                                }
                            }).catch((err) => {
                                // 关闭加载
                                loading.close();
                                // 创建新的加载
                                const loadings = ElLoading.service({
                                    target: '.el-form',
                                    lock: true,
                                    text: '注册失败~',
                                    spinner: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>',
                                    background: 'rgba(255,0,0, 0.5)',
                                })
                                ElMessage.warning('系统错误，请联系工作人员~');
                                setTimeout(() => {
                                    // 关闭加载
                                    loadings.close();
                                }, 2000);
                            })
                    }, 2000);
                }
            });
        },// 获取土味情话
        getWord() {
            this.$axios.get('/word.php')
                .then(res => {
                    // console.log(res)
                    this.word = res.data;
                }).catch(err => {
                    console.log(err);
                })
        },
        getAddress() {
            // 获取地址
            this.chinaData = new EluiChinaAreaDht.ChinaArea().chinaAreaflat;
        },
        // 覆盖区县
        onChange(e) {
            // 省
            const province = this.chinaData[e[0]]
            // 市
            const city = this.chinaData[e[1]]
            // 区
            const area = this.chinaData[e[2]]
            this.ruleForm.province = province.label;
            this.ruleForm.city = city.label;
            this.ruleForm.area = area.label;
        },
        // 用户头像上传
        beforeAvatarUpload(rawFile) {
            if (rawFile.type !== 'image/jpeg') {
                ElMessage.error('头像必须为image/jpeg格式!')
                return false
            } else if (rawFile.size / 1024 / 1024 > 2) {
                ElMessage.error('头像大小不能超过2MB!')
                return false
            }
            base(rawFile, data=>{
                this.ruleForm.avatar = data;
            })
        }
    }
}
</script>
<style scoped>
h2 {
    text-align: center;
    font-family: '华文琥珀';
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 30px;
}

h4:last-of-type {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 10px 0;
}

h4:first-of-type {
    font-family: '华文琥珀';
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    text-shadow: 0 0 3px white
}

.box {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 50px;
}

.el-form {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    padding: 40px;
    width: 50%;
    background-color: white;
}

a {
    color: rgba(0, 0, 0, .6);
}

.avatar-uploader .avatar {
    width: 150px;
    height: 150px;
    display: block;
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