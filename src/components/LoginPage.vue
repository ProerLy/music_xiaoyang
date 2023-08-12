<template>
    <div class="page">
        <div class="box">
            <!-- 土味情话 -->
            <h4>{{ word ? word : '' }}</h4>
            <h4><el-button type="success" @click="getWord()" circle>
                    <el-icon>
                        <Refresh />
                    </el-icon>
                </el-button>
            </h4>
            <!-- 登录框 -->
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
                <h2><span>七语熙音乐馆</span><span>登录</span></h2>
                <!-- 账号 -->
                <el-form-item label="账号：" prop="mobile">
                    <el-input type="mobile" v-model="ruleForm.mobile" autocomplete="off" clearable></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码：" prop="password">
                    <el-input type="password" v-model="ruleForm.password" autocomplete="off" clearable></el-input>
                </el-form-item>
                <div style="display: flex;">
                    <el-col :span="8" :offset="0">
                        <el-form-item label="验证码：" prop="ma">
                            <el-input type="text" v-model="ruleForm.ma" autocomplete="off" clearable></el-input>
                        </el-form-item>
                    </el-col>
                    <!-- 验证码 -->
                    <el-col :span="8" :offset="0" style="display: flex;">
                        <el-image src="http://localhost:81/music_qyx/api/set_ma.php" id="ma" fit="fill" :lazy="false"></el-image>
                        <el-button type="info" size="mini" @click="getMa()">
                            换一张
                        </el-button>
                    </el-col>
                </div>
                <p style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <!-- 自动登录、记住密码勾选框 -->
                    <span>
                        <el-checkbox @change="setAuto()" v-model="auto" label="自动登录" size="large" />
                        <el-checkbox @change="setRemenber()" v-model="remenber" label="记住密码" size="large" />
                    </span>
                    <small><router-link to="/regit">没有账号？前往注册……</router-link></small>
                </p>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button style="width: 50%; margin: 0 auto;" type="primary"
                        @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { ElLoading, ElMessageBox } from 'element-plus'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/assets/js'
export default {
    name: 'LoginPage',
    data() {
        // 验证方法
        var validateId = (rule, value, callback) => {
            if (value === '' || !value) {
                callback(new Error('请输入账号'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            if (value === '' || !value) {
                callback(new Error('请输入密码'));
            } else {
                callback();
            }
        };
        var validateMa = (rule, value, callback) => {
            if (value === '' || !value) {
                callback(new Error('请输入验证码'));
            } else {
                this.$axios.post('/form.php', Qs.stringify({ authcode: value })).
                    then(res => {
                        // console.log(res)
                        if (res.data.code == 1) {
                            callback();
                        } else {
                            callback(new Error(res.data.msg));
                        }
                    }).catch(err => {
                        console.log(err);
                    })
            }
        };
        return {
            // 验证框的值
            ruleForm: {
                mobile: '',
                password: '',
                ma: ''
            },
            // 验证规则
            rules: {
                mobile: [
                    { validator: validateId, trigger: 'blur' }
                ],
                password: [
                    { validator: validatePass, trigger: 'blur' }
                ],
                ma: [
                    { validator: validateMa, trigger: 'blur' }
                ]
            },
            // 土味情话
            word: '',
            // 验证码
            ma: '',
            // 自动登录
            auto: false,
            // 记住密码
            remenber: false
        };
    },
    // 元素渲染完成后获取土味情话、验证码
    mounted() {
        this.getWord();
        this.getDtl();
        setTimeout(() => {
            this.getAuto_remenber();
        }, 1000);
    },
    methods: {
        // 获取本地数据
        getDtl() {
            const user = _getdtl('maustorUser_local');
            if (!!user) {
                this.ruleForm.mobile = user.mobile;
                this.ruleForm.password = user.password;
            }
        },
        // 验证码
        async getMa() {
            document.getElementById('ma').src = 'http://localhost:81/music_qyx/api/set_ma.php';
        },
        getAuto_remenber() {
            const auto = _getdtl('auto');
            const remenber = _getdtl('remenber');
            // 判断是否存在
            if (auto !== null) {
                this.auto = auto;
                if (auto) {
                    this.ruleForm.ma = this.ma;
                    // 自动登录
                    this.loginIn();
                }
            }
            if (remenber !== null) {
                this.remenber = remenber;
            }
        },
        setAuto() {
            // 保存数据
            _setdtl('auto', this.auto);
        },
        setRemenber() {
            // 保存数据
            _setdtl('remenber', this.remenber);
        },
        // 登录事件
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 登录
                    this.loginIn();
                }
            });
        },
        // 获取土味情话
        getWord() {
            this.$axios.get('/word.php')
                .then(res => {
                    // console.log(res)
                    this.word = res.data;
                }).catch(err => {
                    console.log(err);
                })
        },
        loginIn() {
            // 创建加载
            const loading = ElLoading.service({
                target: '.el-form',
                lock: true,
                text: '验证账号中，请稍后……',
                background: 'rgba(255, 255, 255, 0.8)',
            })
            setTimeout(() => {
                // 获取数据库进行判断用户
                // 判断是否注册成功
                const params = Qs.stringify({
                    mobile: this.ruleForm.mobile,
                    password: this.ruleForm.password
                })
                this.$axios.post('/login.php', params)
                    .then((res) => {
                        // 关闭加载
                        loading.close();
                        // console.log(res)
                        if (res.data.code == 404) {
                            const loadings = ElLoading.service({
                                target: '.el-form',
                                lock: true,
                                text: '验证失败~',
                                spinner: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>',
                                background: 'rgba(255,0,0,.5)',
                            })
                            ElMessageBox.alert(res.data.msg, '系统提示', {
                                confirmButtonText: 'OK',
                                type: 'error',
                                showClose: false
                            })
                            setTimeout(() => {
                                // 注销加载
                                loadings.close();
                                // 更换验证码
                                this.getMa();
                            }, 2000);
                        } else if(res.data.code == 0){
                            const loadings = ElLoading.service({
                                target: '.el-form',
                                lock: true,
                                text: '验证失败~',
                                spinner: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>',
                                background: 'rgba(255,0,0,.5)',
                            })
                            // 错误提示
                            this.$message.warning(res.data.msg);
                            setTimeout(() => {
                                // 注销加载
                                loadings.close();
                                // 更换验证码
                                this.getMa();
                            }, 2000);
                        } else {
                            const data = res.data.data;
                            // 创建新的加载
                            const loadingss = ElLoading.service({
                                target: '.el-form',
                                lock: true,
                                text: '验证通过~',
                                spinner: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>',
                                background: 'rgba(0, 255, 0, 0.5)',
                            })
                            // 用户登录状态
                            this.downCode(data.token);
                            // 将个人数据保存至本地
                            _setdtl('token', data.token);
                            // 判断是否是记住密码
                            if (this.remenber)
                                _setdtl('maustorUser_local', { password: this.ruleForm.password, mobile: this.ruleForm.mobile });
                            this.$message.success('登陆成功~');
                            setTimeout(() => {
                                loadingss.close();
                                // 跳转主页面
                                this.$router.replace({ path: '/home' });
                            }, 2000);
                        }
                    }).catch((err) => {
                        // 关闭加载
                        loading.close();
                        console.log(err);
                        const loadings = ElLoading.service({
                            target: '.el-form',
                            lock: true,
                            text: '验证失败~',
                            spinner: '<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" data-v-ea893728=""><path fill="currentColor" d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32zm0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32zm448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32zm-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32zM195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0zm-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"></path></svg>',
                            background: 'rgba(255,0,0,.5)',
                        })
                        this.$message.error('系统错误，请联系工作人员~');
                        setTimeout(() => {
                            // 注销加载
                            loadings.close();
                            // 更换验证码
                            this.getMa();
                        }, 2000);
                    })
            }, 2000);
        },
        // 用户登录的状态
        downCode(key) {
            // 判断是否登录
            // 下线之前登录的用户
            if (_getdtl('token')) {
                const params = Qs.stringify({
                    token: _getdtl('token'),
                    code: 0
                })
                this.$axios.post('/code.php', params).then((res) => {
                    // 离线
                    _setdtl('code', 0);
                    // console.log(res);
                }).catch((err) => {
                    console.log(err);
                })
            }

            // 上线正在登录的用户
            const params = Qs.stringify({
                token: key,
                code: 1
            })
            this.$axios.post('/code.php', params).then((res) => {
                // console.log(res);
            }).catch((err) => {
                console.log(err);
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
    width: 90%;
    font-family: '华文琥珀';
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    text-shadow: 0 0 3px white;
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

.el-form .el-image {
    width: 100px;
    height: 30px;
}
</style>