<template>
    <!-- 顶部导航栏 -->
    <el-menu id="menu" background-color="#242424" class="el-menu-demo" text-color="#E5EAF3" active-text-color="#ffffff"
        :style="scrollTop >= 100 ? 'width: 100%;background-color: #B90B0B;position: fixed;left: 0;top: 0;z-index: 1024;' : 'width: 100%;z-index: 1024;'"
        router :default-active="activePath" mode="horizontal" :ellipsis="false">
        <div class="flex-grow" />
        <!-- logo -->
        <div id="logo"><router-link to="/home">七语熙音乐馆</router-link></div>
        <el-menu-item index="/find">发现音乐</el-menu-item>
        <el-menu-item :index="'/mymusic/null'">我的音乐</el-menu-item>
        <div class="flex-grow" />
        <div class="sys_msg">
            <div id="box">
                <p id="tip"><el-icon>
                        <BellFilled />
                    </el-icon><span v-for=" it in msg" :key="it?.id">{{ it?.content }}</span></p>
            </div>
        </div>
        <div class="flex-grow" />
        <!-- 搜索框 -->
        <el-col :span="4" class="check">
            <el-input @keydown.enter="search(input)" v-model="input" placeholder="搜索歌手或者歌名" clearable />
            <el-button @click="search(input)" type="danger" :size="mini"><el-icon>
                    <Search />
                </el-icon></el-button>
        </el-col>
        <div class="flex-grow" />
        <div class="msg">
            <template v-if="msg_num != 0 && !!msg_num">
                <el-badge :value="msg_num" class="item">
                    <el-button size="mini" round @click="$router.push('/msg')"><el-icon>
                            <Message />
                        </el-icon>消息</el-button>
                </el-badge>
            </template>
            <template v-else>
                <el-button size="mini" round @click="$router.push('/msg')"><el-icon>
                        <Message />
                    </el-icon>消息</el-button>
            </template>
        </div>
        <div class="flex-grow" />
        <!-- 设置及其他 -->
        <div class="avatar">
            <div class="flex flex-wrap items-center" v-if="!!nowUser">
                <el-dropdown>
                    <el-avatar :src="avatar ? avatar : nowUser.avatar" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="mineHome()"><el-icon>
                                    <Avatar />
                                </el-icon>我的主页</el-dropdown-item>
                            <el-dropdown-item @click="mineOwn()"><el-icon>
                                    <Postcard />
                                </el-icon>个人设置</el-dropdown-item>
                            <el-dropdown-item @click="table = true"><el-icon>
                                    <Tools />
                                </el-icon>设置</el-dropdown-item>
                            <el-dropdown-item @click="outLogin()"><el-icon>
                                    <SwitchButton />
                                </el-icon>退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="flex flex-wrap items-center" v-else>
                <el-dropdown>
                    <el-avatar
                        src="https://ts1.cn.mm.bing.net/th/id/R-C.bb71355719f61882ee48893cf225188b?rik=%2bx5SkgKGdJXGKw&riu=http%3a%2f%2fwx3.sinaimg.cn%2fbmiddle%2f78b88159ly1g3noy6sipjg208c08cqcm.gif&ehk=nHuJ39BAjfw0JujLpa1SRtxXoK2lRX%2fpiQ7SqZ4aVyI%3d&risl=&pid=ImgRaw&r=0" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="table = true"><el-icon>
                                    <Tools />
                                </el-icon>设置</el-dropdown-item>
                            <el-dropdown-item @click="$router.push({ path: '/login' })">
                                <el-icon>
                                    <Fold />
                                </el-icon>
                                前往登录</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
        </div>
        <div class="flex-grow" />
    </el-menu>
    <!-- 设置抽屉 -->
    <el-drawer v-model="table" direction="rtl" size="50%">
        <template #header>
            <h2>设置</h2>
            <!-- 切换账号 -->
            <el-button v-if="!!nowUser" type="success" size="default" @click="selectId">切换账号</el-button>
        </template>
        <!-- 主题 -->
        <div id="style">
            <el-divider border-style="double"><el-tag type="success" :size="large" effect="plain">主题</el-tag></el-divider>
            <div>
                <el-tag type="success" class="mx-1" effect="dark" round>
                    风景背景图
                </el-tag>
                <br>
                <br>
                <el-row :gutter="20">
                    <el-col :lg="{ span: 6 }" :md="{ span: 8 }" :sm="{ span: 12 }" :xs="{ span: 24 }" :offset="0"
                        v-for="(it, index) in backgrounds.scenery" :key="index">
                        <el-image class="img" :src="it.image" fit="fit" />
                        <br>
                        <el-switch @change="checks(it.index)" v-model="it.isCheck" />
                    </el-col>
                </el-row>
            </div>
            <el-divider border-style="dashed" />
            <div>
                <el-tag type="danger" class="mx-1" effect="dark" round>
                    动漫背景图
                </el-tag>
                <br>
                <br>
                <el-row :gutter="20">
                    <el-col :lg="{ span: 6 }" :md="{ span: 8 }" :sm="{ span: 12 }" :xs="{ span: 24 }" :offset="0"
                        v-for="(it, index) in backgrounds.cartoon" :key="index">
                        <el-image class="img" :src="it.image" fit="fit" />
                        <br>
                        <el-switch @change="checks(it.index)" v-model="it.isCheck" />
                    </el-col>
                </el-row>
            </div>
            <el-divider border-style="dashed" />
            <div>
                <el-tag type="primary" class="mx-1" effect="dark" round>
                    自定义背景颜色
                </el-tag>
                <br>
                <br>
                <el-color-picker @change="changeBgColor()" v-model="bgcolor" show-alpha :predefine="predefineColors" />
            </div>
            <el-divider border-style="dashed" />
            <div>
                <el-tag type="warning" class="mx-1" effect="dark" round>
                    自定义字体颜色
                </el-tag>
                <br>
                <br>
                <el-color-picker @change="changeColor()" v-model="color" show-alpha :predefine="predefineColors" />
            </div>
            <el-divider border-style="dashed" />
            <div>
                <el-tag type="info" class="mx-1" effect="dark" round>
                    默认
                </el-tag>
                <br>
                <br>
                <el-row :gutter="20">
                    <el-col :span="6" :offset="0">
                        <div class="img">
                        </div>
                        <el-switch @change="deflt()" v-model="defaults.isCheck" />
                    </el-col>
                </el-row>
            </div>
        </div>
    </el-drawer>
    <!-- 回到顶部 -->
    <el-backtop title="回到顶部" :right="50" :bottom="100">
        <el-icon>
            <Upload />
        </el-icon>
    </el-backtop>
</template>
<script>
export default {
    name: 'TopNav'
}
</script>
<script setup>
// 引入route(this.$route)、router(this.$router)
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { ref, reactive, onMounted, onBeforeUnmount, getCurrentInstance, toRefs, watch } from 'vue'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import Qs from 'qs'
// 引入方法
import { getData as _getdtl, setData as _setdtl } from '@/func/index'
const { proxy } = getCurrentInstance();
// 页面渲染完毕时的操作
onMounted(() => {
    handScroll();
    getData();
    getAllway();
    getSys_msg();
    load();
})

// 离开页面时，移除监听
onBeforeUnmount(() => {
    window.removeEventListener('scroll', () => { });
})
// 路由
const route = useRoute();
const router = useRouter();
// $emit方法
const emit = defineEmits(['setStyle']);
// props
const props = defineProps({
    avatar: {
        type: String
    },
    msg_is: {
        type: Boolean
    }
})
const { avatar, msg_is } = toRefs(props);
// 默认路由
let activePath = ref(route.path.split('/')[1] === 'mymusic' ? '/' + route.path.split('/')[1] + '/' + route.path.split('/')[2] : '/' + route.path.split('/')[1]);
// 路由守卫
onBeforeRouteUpdate((to) => {
    activePath.value = to.path.split('/')[1] === 'mymusic' ? '/' + to.path.split('/')[1] + '/' + to.path.split('/')[2] : '/' + to.path.split('/')[1];
});

// 滑动距离
let scrollTop = ref(0);
// 滑动事件
const handScroll = () => {
    window.addEventListener('scroll', () => {
        scrollTop.value = window.scrollY;
    });
}

// 获取本地个人信息
const nowUser = ref();
// 获取用户数据
const getData = () => {
    if (!!_getdtl('token')) {
        const params = Qs.stringify({
            token: _getdtl('token')
        })
        proxy.$axios.post('/getUser_info.php', params)
            .then((res) => {
                // console.log(res)
                if (res.data.code == 1) {
                    nowUser.value = res.data.data[0];
                    // 获取私信
                    get_message(_getdtl('token'));
                }
            }).catch((err) => {
                console.log(err);
            })
    }
}

// 系统信息
const msg = ref('');
// 获取系统信息
const getSys_msg = () => {
    proxy.$axios.get('/get_sys_msg.php')
        .then(res => {
            // console.log(res)
            if (res.data.code == 1) {
                msg.value = res.data.data;
            }
        }).catch(err => {
            console.log(err);
        })
}

// 每10秒刷新一次信息
const getAllway = () => {
    if (!!_getdtl('token')) {
        var time = setInterval(() => {
            get_message(_getdtl('token'));
            // 刷新信息
            getSys_msg();
            clearInterval(time);
            getAllway();
        }, 10000);
    }
}

// 系统信息滚动
const action = () => {
    // 字幕
    var tip = $('#tip');
    // 字幕宽度
    const width = tip.outerWidth();
    // 容器宽度
    const box_w = $('#box').outerWidth();
    tip.animate({ left: `-${width}px` }, 20000, () => {
        tip.css('left', `${box_w}px`);
        action();
    })
}

// 页面加载
const load = () => {
    $(function () {
        setTimeout(() => {
            action();
        }, 100);
    })
}

// 搜索框数据
let input = ref('');
// 搜索方法
const search = (key) => {
    // 判断是否为空
    if (!key) {
        ElMessage.warning('请输入搜索的内容~');
        return false;
    }
    // 跳转页面
    router.push('/check/' + key);
}

// 私信数量
const msg_num = ref(0);
// 获取私信数量
const get_message = (token) => {
    proxy.$axios.post('/get_msg_num.php', Qs.stringify({ token }))
        .then((res) => {
            // console.log(res)
            if (res.data.code == 1) {
                let num = res.data.total;
                // console.log(num)
                if ( num != 0 && !!num && num > msg_num.value) {
                    msg_num.value = res.data.total;
                    ElNotification({
                        title: '信息提醒',
                        dangerouslyUseHTMLString: true,
                        onClick: msg_to,
                        message: '<spna>您有新的消息，<a href="javascript:;">点击前往查看</a>~</spna>',
                        type: 'info',
                    })
                } else {
                    msg_num.value = res.data.total;
                }
            }
        }).catch((err) => {
            console.log(err);
        })
}

// 点击跳转页面
const msg_to = () => {
    router.push('/msg');
}

// 监听msg_is变化
watch(() => msg_is.value, (key) => {
    // console.log(key)
    if (!!key) {
        get_message(_getdtl('token'));
    }
})


// 跳转个人主页
function mineHome() {
    router.push({ path: '/mine' });
};
// 跳转个人设置
function mineOwn() {
    router.push({ path: '/mineset' });
};

// 退出登录
function outLogin() {
    ElMessageBox.confirm('确定退出吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    })
        .then(_ => {
            const params = Qs.stringify({
                token: _getdtl('token'),
                code: 0
            })
            proxy.$axios.post('/code.php', params)
                .then((res) => {
                    // console.log(res)
                    if (res.data.code == 1) {
                        // 清除本地数据
                        _setdtl('token', null);
                        // 取消自动登录
                        _setdtl('auto', null);
                        // 离线
                        _setdtl('code', 0);
                        ElMessage.success('退出成功~');
                        // 跳转页面
                        setTimeout(() => {
                            router.replace({ path: '/login' });
                        }, 1000);
                    }
                }).catch((err) => {
                    console.log(err)
                })
        }).catch(_ => {
            ElMessage.info('我相信您应该是手滑了~');
        })
}

// 是否显示设置抽屉
let table = ref(false);

// 切换账号
const selectId = () => {
    // 取消自动登录
    _setdtl('auto', null);
    // 跳转登录页面
    router.push('/login');
}

// 设置中背景图片的值
let backgrounds = reactive({
    scenery: [
        {
            image: 'https://ts1.cn.mm.bing.net/th/id/R-C.987f582c510be58755c4933cda68d525?rik=C0D21hJDYvXosw&riu=http%3a%2f%2fimg.pconline.com.cn%2fimages%2fupload%2fupc%2ftx%2fwallpaper%2f1305%2f16%2fc4%2f20990657_1368686545122.jpg&ehk=netN2qzcCVS4ALUQfDOwxAwFcy41oxC%2b0xTFvOYy5ds%3d&risl=&pid=ImgRaw&r=0',
            isCheck: false,
            index: 1
        }, {
            image: 'https://pic4.zhimg.com/v2-0dd8d43103ba47961c96b2a2782b3733_r.jpg?source=1940ef5c',
            isCheck: false,
            index: 2
        }, {
            image: 'https://ts1.cn.mm.bing.net/th/id/R-C.0c8bf36e099654aadaf5f127ef1a3f1b?rik=uHrB%2blGez03%2fAA&riu=http%3a%2f%2fi3.img.969g.com%2fdown%2fimgx2014%2f10%2f24%2f289_102445_a1cff.jpg&ehk=EeF%2fioqRM6NfQqkCgXw%2bwLvO1%2fxZgeZ2pof7ALNLGsg%3d&risl=&pid=ImgRaw&r=0',
            isCheck: false,
            index: 3
        }, {
            image: 'https://ts1.cn.mm.bing.net/th/id/R-C.0b10c2b8abae5557d767f78345c7c3b9?rik=5l29y7G8trIggg&riu=http%3a%2f%2fi3.img.969g.com%2fdown%2fimgx2014%2f02%2f08%2f289_093214_13ee6.jpg&ehk=Dz0E1RuS%2fO0MM4sqy3TBm9fhMKtoEti9THnsNH%2buZY0%3d&risl=&pid=ImgRaw&r=0',
            isCheck: false,
            index: 4
        }
    ],
    cartoon: [
        {
            image: 'https://ts1.cn.mm.bing.net/th/id/R-C.57a05fcafaec1212e5c393ace0e5d957?rik=jx4FMa4HXHknqg&riu=http%3a%2f%2fpic.rmb.bdstatic.com%2f57a05fcafaec1212e5c393ace0e5d957.jpeg&ehk=OG3yy6GRS8Jj9ODlMArjrlPxOb4z2%2fV5vyYoWRWZpcM%3d&risl=&pid=ImgRaw&r=0',
            isCheck: false,
            index: 5
        }, {
            image: 'https://img.zcool.cn/community/015d3a5dc24dbba801209e1fc5fd86.jpg@1280w_1l_2o_100sh.jpg',
            isCheck: false,
            index: 6
        }, {
            image: 'https://ts1.cn.mm.bing.net/th/id/R-C.10357f220c6092131c5da02d84c0c674?rik=%2b389tj%2fqn%2byjmA&riu=http%3a%2f%2fpic.616pic.com%2fbg_w1180%2f00%2f04%2f05%2fP3JOV5GhZy.jpg!%2ffw%2f1120&ehk=d6qZQLX9X3AZyDhnqyyl6j31ROYS7qwKEToRxjwtyXc%3d&risl=&pid=ImgRaw&r=0',
            isCheck: false,
            index: 7
        }, {
            image: 'https://ts1.cn.mm.bing.net/th/id/R-C.031ea3c956f1e9287c185ec6ab843978?rik=7sCwqChaO6MSIA&riu=http%3a%2f%2fimage.qianye88.com%2fpic%2fd1b695b4de959325be6e7d41889a5ff4&ehk=2szZwYr%2f9ytxNAiSetE8aR93b5PzzPMSx100C%2bN7yuk%3d&risl=&pid=ImgRaw&r=0',
            isCheck: false,
            index: 8
        }
    ]
})

// 默认的样式
let defaults = reactive({
    isCheck: true
})

// 默认背景图片
let index = 0;
if (!!_getdtl('index')) {
    index = _getdtl('index');
    // 只勾选一个
    oneCheck(index);
    // 默认取消勾选
    defltDown();;
}

// 设置中背景颜色的值
let bgcolor = ref('');
if (!!_getdtl('bgcolor')) {
    // 默认背景颜色
    bgcolor.value = _getdtl('bgcolor');
    // 默认取消勾选
    defltDown();
}

// 设置中字体颜色的值
let color = ref('');
if (!!_getdtl('color')) {
    // 默认字体颜色
    color.value = _getdtl('color');
    // 默认取消勾选
    defltDown();
}

// 预定义颜色
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

// 选择背景的方法
function checks(n) {
    index = n;
    // 储存本选中的主题
    _setdtl('index', index);
    // 只勾选一个
    oneCheck(index);
    // 默认取消勾选
    defltDown();
    // 清除背景颜色
    _setdtl('bgcolor', null);
    bgcolor.value = '';
    let bgImg;
    // 获取背景图
    for (let i in backgrounds) {
        for (var j = 0; j < backgrounds[i].length; j++) {
            if (backgrounds[i][j].isCheck) {
                if (!backgrounds[i][j].image) {
                    bgImg = '';
                } else {
                    bgImg = backgrounds[i][j].image;
                }
                break;
            }
        }
    }
    // 修改主题
    change(bgImg, '', undefined);
}

// 只允许一个被勾选
function oneCheck(index) {
    // 只允许一个被勾选
    for (let i in backgrounds) {
        for (var j = 0; j < backgrounds[i].length; j++) {
            if (backgrounds[i][j].index === index) {
                backgrounds[i][j].isCheck = true;
                // 跳过此循环
                continue;
            }
            backgrounds[i][j].isCheck = false;
        }
    }
}

// 背景颜色发生改变时的方法
function changeBgColor() {
    // console.log(bgcolor.value)
    change('none', bgcolor.value, undefined);
    // 储存数据
    _setdtl('bgcolor', bgcolor.value);
    // 清除背景图片
    bgImageDown();
    // 默认取消勾选
    defltDown();
}

// 字体颜色发生改变时的方法
function changeColor() {
    change(undefined, undefined, color.value);
    // 储存数据
    _setdtl('color', color.value);
    // 默认取消勾选
    defltDown();
}

// 关闭背景图
function bgImageDown() {
    for (let i in backgrounds) {
        for (var j = 0; j < backgrounds[i].length; j++) {
            backgrounds[i][j].isCheck = false;
        }
    }
    index = 0;
    // 清理默认选中的背景图
    _setdtl('index', index);
}

// 默认方法
function deflt() {
    // 修改默认勾选
    defaults.isCheck = true;
    // 将颜色背景图片背景颜色修改为初始值
    color.value = null;
    bgcolor.value = null;
    // 清除本地储存的默认样式
    bgImageDown();
    _setdtl('bgcolor', null);
    _setdtl('color', null);
    // 修改为默认
    change('', '', '');
}

// 取消默认勾选
function defltDown() {
    // 默认取消勾选
    if (defaults.isCheck) defaults.isCheck = false;
}

// 修改主题
function change(bgImg, bgClr, clr) {
    emit('setStyle', { bgImg: bgImg, bgClr: bgClr, clr: clr });
}
</script>
<style scope lang="less">
.el-menu#menu {
    width: 100%;
    height: 65px;
}

#logo {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 20px;
}

#logo a {
    color: #ffffff;
    font-size: 25px;
    font-family: '华文彩云';
}

.flex-grow {
    flex-grow: 1;
}

.check {
    display: flex;
    justify-content: center;
    align-items: center;
}

.msg {
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar {
    display: flex;
    justify-content: center;
    align-items: center;
}

.img {
    width: 140px;
    height: 140px;
    background-color: white;
    box-shadow: 0 0 3px rgba(0, 0, 0, 5);
}

.msg {
    .el-badge__content.is-fixed {
        top: 15px !important;
        right: 20px !important;
    }
}

.sys_msg {
    width: 30%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

    div {
        width: 100%;
        border-radius: 20px;
        background-color: rgba(0, 0, 0, .3);
        height: 70%;
        position: relative;

        p {
            display: flex;
            align-items: center;
            white-space: nowrap;
            padding: 5px 10px;
            position: absolute;
            left: 0;
            top: 5px;

            span {
                margin-right: 15px;
                color: red;
            }

            .el-icon {
                color: yellow;
            }
        }
    }
}
</style>