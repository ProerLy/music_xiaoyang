<template>
    <div class="content_box">
        <el-row>
            <el-col class="songs_left" :span="18">
                <el-row>
                    <el-col :span="12" style="display: flex; justify-content: center;">
                        <div class="pang">
                            <el-image style="width: 60%; height: 60%; border-radius: 100%;" :src="music_dtl?.baner_img"
                                fit="fill">
                            </el-image>
                        </div>
                    </el-col>
                    <el-col class="songs_center" :span="12" :offset="0">
                        <div class="songs_title">
                            <span class="mask"></span>
                            <span class="title">
                                {{ music_dtl?.song_name }}
                            </span>
                        </div>
                        <div class="songer">
                            <small>歌手：{{ music_dtl?.songer }}</small>
                        </div>
                        <!-- 播放、添加播放列表 -->
                        <div class="control">
                            <el-button-group>
                                <el-button type="primary" size="mini" @click="play_add(music_dtl?.id, null, null, 'play')"
                                    title="播放"><el-icon>
                                        <VideoPlay />
                                    </el-icon>播放</el-button>
                                <el-button type="primary" size="mini" @click="play_add(music_dtl?.id, null, null, 'add')"
                                    title="添加播放列表"><el-icon>
                                        <Plus />
                                    </el-icon></el-button>
                            </el-button-group>
                            <el-button title="收藏" @click="add_collect(music_dtl?.id)">
                                <el-icon>
                                    <FolderAdd />
                                </el-icon>收藏
                            </el-button>
                            <el-button title="下载"
                                @click="downLoad((music_dtl?.song_name + '-' + music_dtl?.songer), music_dtl?.audio)">
                                <el-icon>
                                    <Bottom />
                                </el-icon>下载
                            </el-button>
                        </div>
                        <div class="songWord">
                            <div class="words" v-html="music_dtl?.lrc" :class="!isShow ? 'isHide' : ''">

                            </div>
                            <div class="show_hide">
                                <a href="javascript:;">
                                    <span @click="isShow = !isShow" v-if="!isShow" title="展开">展开<el-icon>
                                            <CaretBottom />
                                        </el-icon></span>
                                    <span v-else @click="isShow = !isShow" title="收起">收起<el-icon>
                                            <CaretTop />
                                        </el-icon></span>
                                </a>
                            </div>
                        </div>
                    </el-col>
                </el-row>
                <div id="commit">
                    <!-- 评论title -->
                    <div id="commit_title">
                        <h3>评论 <small>共{{ post.total }}条评论</small></h3>
                    </div>
                    <!-- 输入框 -->
                    <div id="speak_input">
                        <el-input v-model="input.input_1" type="textarea" rows="3" :maxlength="150" placeholder="说点什么吧...">
                        </el-input>
                        <!-- 发表评论及表情 -->
                        <div id="commit_btn">
                            <div class="commit_input_happy">
                                <el-icon size="20" color="rgba(0, 0, 0, .6)" @click="dialogVisible.dialogVisible_1 = true">
                                    <Watermelon />
                                </el-icon>
                                <el-dialog v-model="dialogVisible.dialogVisible_1" :modal="false" width="30%" draggable>
                                    <div class="happy_content">
                                        <span @click="demos(it)" v-for="it in demo" :key="it">{{ it }}</span>
                                    </div>
                                </el-dialog>
                            </div>
                            <el-button type="primary" size="mini" @click="speack()">评论</el-button>
                        </div>
                    </div>
                    <!-- 评论内容 -->
                    <div id="commit_content">
                        <h5>评论区</h5>
                        <div class="content_commit" v-loading="loading" element-loading-background="white">
                            <div v-if="post?.data.length > 0">
                                <div class="conten_item" v-for="(it, i) in  post.data " :key="i">
                                    <el-row>
                                        <el-col :span="3">
                                            <el-link type="danger" :underline="false"
                                                @click="$router.push('/other/' + it.post.user_id)">
                                                <el-image :src="it.post.avatar"
                                                    style="width: 60px; height: 60px; box-shadow: 0 0 3px rgba(0,0,0,.4)"
                                                    fit="fill"></el-image>
                                            </el-link>
                                        </el-col>
                                        <el-col :span="21">
                                            <div><span class="thumb_name">{{ it.post.nick_name }}</span>：{{ it.post.content
                                            }}
                                            </div>
                                            <div class="replay" v-if="it.commit.length > 0">
                                                <div v-for="( item, index ) in  it.commit" :key="index">
                                                    <div style="display: flex;">
                                                        <div
                                                            style="display: flex; align-items: center; min-width: max-content;">
                                                            <el-link type="danger" :underline="false"
                                                                @click="$router.push('/other/' + item.user_id)">
                                                                <el-image :src="item.avatar"
                                                                    style="width: 30px; height: 30px; margin-right: 5px; box-shadow: 0 0 3px rgba(0,0,0,.4); border-radius: 100%;"
                                                                    fit="fill"></el-image></el-link>
                                                            <span class="thumb_name">{{ item.nick_name }}：</span>
                                                        </div>
                                                        <div style="padding-top: 7px;">
                                                            <span>{{ item.content }}</span>
                                                        </div>
                                                    </div>
                                                    <div
                                                        style="display: flex; justify-content: flex-end; color: rgba(0,0,0,.1);">
                                                        <small>{{ item.commit_time }}</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style="text-align: right;" class="show_hide" v-if="it.commit.length > 0">
                                                <a href="javascript:;">
                                                    <span @click="show_commit(i)" v-if="isHide.arr[i]" title="查看更多">查看更多（{{
                                                        it?.commit_num }}）<el-icon>
                                                            <CaretBottom />
                                                        </el-icon></span>
                                                    <span v-else @click="show_commit(i)" title="收起更多">收起更多<el-icon>
                                                            <CaretTop />
                                                        </el-icon></span>
                                                </a>
                                            </div>
                                            <div class="thumb_bot">
                                                <div class="creat_time">{{ it.post.create_time }}</div>
                                                <div class="like_replay">
                                                    <span><el-icon :style="it.is_thumb ? 'color: skyblue;' : ''" size="15"
                                                            @click="thumb(it.post.post_id)">
                                                            <Sugar />
                                                        </el-icon> ({{ it.post.thumb_num }})</span>
                                                    <span style="margin: 0 10px;">|</span>
                                                    <span><el-icon size="15" @click="showReplay(i)">
                                                            <ChatLineRound />
                                                        </el-icon></span>
                                                </div>
                                            </div>
                                            <!-- 回复信息框 -->
                                            <div class="replay_box" v-if="!!isReaplay[i]?.isReaplay">
                                                <el-input autofocus v-model="input_2" @input="input_replay" type="textarea"
                                                    rows="3" :maxlength="150" placeholder="说点什么吧...">
                                                </el-input>
                                                <!-- 发表评论及表情 -->
                                                <div id="commit_btn">
                                                    <div class="commit_input_happy">
                                                        <el-icon size="20" @click="dialogVisible.dialogVisible_2 = true">
                                                            <Watermelon />
                                                        </el-icon>
                                                        <el-dialog v-model="dialogVisible.dialogVisible_2" :modal="false"
                                                            width="30%" draggable>
                                                            <div class="happy_content">
                                                                <span @click="demos_replay(it)" v-for=" it  in  demo "
                                                                    :key="it">{{
                                                                        it }}</span>
                                                            </div>
                                                        </el-dialog>
                                                    </div>
                                                    <el-button type="primary" size="mini"
                                                        @click="reaply(i, it.post.post_id)">回复</el-button>
                                                </div>
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                            <div style="margin: 10px 0;" class="conten_item" v-else>
                                暂无评论...
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 分页 -->
                <div id="page">
                    <el-pagination small background layout="prev, pager, next" :page-size="pageDtl.page_size"
                        :total="pageDtl.total" hide-on-single-page @current-change="click" class="mt-4" />
                </div>
            </el-col>
            <el-col class="songs_right" :span="6" :offset="0">
                <userInfo />
            </el-col>
        </el-row>
        <collectNav @close="close" :isCollectSongList="isCollectSongList" :songid="songid" />
    </div>
</template>
<script>
export default {
    name: 'SongS'
}
</script>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { getData as _getdtl, setData as _setdtl, downLoad } from '@/func/index'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import Qs from 'qs'
import collectNav from '@/components/collectNav'
import userInfo from '@/components/userInfo'
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const emit = defineEmits(['getMusic']);
// 页面渲染完毕
onMounted(() => {
    // 获取音乐信息
    getSongs();
    // 获取表情
    getDemo();
    loading.value = true;
    setTimeout(() => {
        // 获取评论信息
        getPost(route.params.id, pageDtl.limit, pageDtl.page_size, _getdtl('token'));
        loading.value = false;
    }, 1500);
})

// 音乐数据信息
const music_dtl = ref()
// 获取音乐信息
const getSongs = () => {
    proxy.$axios.post('/getMusic_song.php',
        Qs.stringify({
            music_id: route.params.id
        })
    ).then((res) => {
        if (res.data.code == 1) {
            music_dtl.value = res.data.data[0];
            get_word(res.data.data[0].lrc);
        }
    }).catch((err) => {
        console.log(err)
    })
}

// 是否收起歌词
let isShow = ref(false);
// 获取歌词
const get_word = (lrc) => {
    proxy.$axios(lrc).
        then((res) => {
            // console.log(res)
            var word = res.data.split(/\s*\n*\[.*?\]\s*/).filter(v => !!v);
            music_dtl.value.lrc = word.join('<br/><br/>');
        }).catch((err) => {
            console.log(err);
        })
}
// 音乐id
const songid = ref();
// 是否打开收藏歌单抽屉
let isCollectSongList = ref(false);
// 打开收藏夹
const add_collect = (n) => {
    if (!!_getdtl('token'))
        isCollectSongList.value = true;
    else {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return;
    }
    songid.value = n;
}

// 播放音乐或添加音乐列表
function play_add(id, list_id, table, type) {
    emit('getMusic', { id, list_id, table, type });
}

// 获取收藏子组件回调
const close = (n) => {
    isCollectSongList.value = n;
    songid.value = null;
}

// 表情数据
const demo = ref();

// 获取表情的方法
const getDemo = () => {
    proxy.$axios('/demo.json')
        .then((inres) => {
            demo.value = inres.data.demo;
        }).catch((err) => {
            console.log(err)
        })
}

// 表情开关
const dialogVisible = reactive({
    dialogVisible_1: false,
    dialogVisible_2: false
})

// 点击表情添加
const demos = (key) => {
    input.input_1 += key;
}

// 评论信息数据
const post = reactive({
    total: 0,
    data: []
});

// 是否显示回复框
const isReaplay = reactive([]);
// 展开收起回复
const isHide = reactive({
    arr: []
});
// 显示和收起回复信息
const show_commit = (n) => {
    isHide.arr[n] = !isHide.arr[n]
    // 获取到评论id
    const post_id = post.data[n].post.post_id;
    get_commit(post_id, n);
}
// 输入框值
const input = reactive({
    input_1: '',
    input_2: '',
    input_2_title: ''
})
// 回复区输入框值
let input_2 = ref();

// 获取评论信息
const getPost = (music_id, limit, page_size, token) => {
    let data = null;
    if (!_getdtl('token')) {
        data = {
            music_id,
            limit,
            page_size
        }
    } else {
        data = {
            music_id,
            limit,
            page_size,
            token
        }
    }
    proxy.$axios.post('/getMusic_post.php',
        Qs.stringify(data)
    ).then((res) => {
        // console.log(res)
        if (res.data.code == 1) {
            post.data = res.data.data;
            post.total = res.data.total;
            pageDtl.total = res.data.total;
            isHide.arr = [];
            for (var i in post.data) {
                isReaplay.push({ isReaplay: false });
                isHide.arr.push(true);
            }
        }
    }).catch((err) => {
        console.log(err);
    })
}

// 获取回复信息
const get_commit = (post_id, index) => {
    // 传递的数据
    let data = Qs.stringify({
        post_id
    })
    if (isHide.arr[index]) {
        data = Qs.stringify({
            post_id,
            page_size: 1
        })
    }
    proxy.$axios.post('/getMusic_commit.php', data)
        .then((res) => {
            if (res.data.code == 1) {
                post.data[index].commit = res.data.data;
            }
        }).catch((err) => {
            console.log(err);
        })
}
// 分页数据
const pageDtl = reactive({
    total: 0,
    limit: 0,
    page_size: 8
})
// 加载评论
const loading = ref(false);

// 点击显示评论
const click = (n) => {
    pageDtl.limit = (n - 1) * pageDtl.page_size;
    post.data = [];
    loading.value = true;
    setTimeout(() => {
        // 获取评论信息
        getPost(route.params.id, pageDtl.limit, pageDtl.page_size, _getdtl('token'));
        loading.value = false;
    }, 1500);
}

// 评论
const speack = () => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return false;
    }
    if (!input.input_1) {
        ElMessage.warning('请输入内容~');
        return false;
    }
    // 评论请求
    proxy.$axios.post('/send_post.php',
        Qs.stringify({
            token: _getdtl('token'),
            music_id: route.params.id,
            content: input.input_1
        })
    ).then((res) => {
        // console.log(res)
        if (res.data.code == 1) {
            // 提示
            ElMessage.success(res.data.msg);
            // 清空输入框
            input.input_1 = '';
            // 重新获取评论
            getPost(route.params.id, pageDtl.limit, pageDtl.page_size, _getdtl('token'));
        } else if (res.data.code == 404) {
            ElMessageBox.alert(res.data.msg, '系统提示', {
                confirmButtonText: 'OK',
                type: 'error',
                showClose: false
            })
        } else {
            // 提示
            ElMessage.warning(res.data.msg);
        }
    }).catch((err) => {
        console.log(err);
    })
}

// 回复信息框
const showReplay = (n) => {
    // 显示当前回复框，关闭其他回复框
    isReaplay[n].isReaplay = !isReaplay[n].isReaplay;
    for (var i in isReaplay) {
        if (i == n) {
            continue;
        }
        isReaplay[i].isReaplay = false;
    }
    // 默认回复信息
    input.input_2_title = '回复' + post.data[n].post.nick_name + '：';
    input_2.value = input.input_2_title + input.input_2;

}

// 分解回复区输入框值
const input_replay = (n) => {
    // 获取title的长度
    const t_length = input.input_2_title.length;
    input.input_2 = n.slice(t_length,);
}

// 回复区点击表情添加
const demos_replay = (key) => {
    input.input_2 += key;
    input_2.value = input.input_2_title + input.input_2;
}

// 回复
const reaply = (n, post_id) => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return false;
    } else if (!input.input_2) {
        ElMessage.warning('请输入内容~');
        return false;
    }
    proxy.$axios.post('/reaply.php',
        Qs.stringify({
            post_id,
            token: _getdtl('token'),
            content: input.input_2
        })
    ).then((res) => {
        // console.log(res)
        if (res.data.code == 0) {
            // 提示
            ElMessage.warning(res.data.msg);
            return;
        } else if (res.data.code == 404) {
            ElMessageBox.alert(res.data.msg, '系统提示', {
                confirmButtonText: 'OK',
                type: 'error',
                showClose: false
            })
            return;
        }
        // 提示
        ElMessage.success(res.data.msg);
        isReaplay[n].isReaplay = false;
        input.input_2 = '';
        // 重新获取评论
        getPost(route.params.id, pageDtl.limit, pageDtl.page_size, _getdtl('token'));
    }).catch((err) => {
        console.log(err);
    })
}

// 点赞
const thumb = (n) => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return false;
    }
    // 点赞请求
    proxy.$axios.post('/thumb.php',
        Qs.stringify({
            token: _getdtl('token'),
            post_id: n
        })
    ).then((res) => {
        // console.log(res)
        if (res.data.code == 1) {
            ElMessage.success(res.data.msg);
            // 重新获取评论
            getPost(route.params.id, pageDtl.limit, pageDtl.page_size, _getdtl('token'));
        } else {
            ElMessage.warning(res.data.msg)
        }
    }).catch((err) => {
        console.log(err)
    })
}
</script>
<style scoped>
.content_box {
    width: 80%;
    min-height: max-content;
    margin: 0 auto;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    background-color: #ffffff;
}

.content_box .el-col {
    padding: 30px 0;
}

.songs_left {
    border-right: 1px solid rgba(0, 0, 0, .3);
}

.pang {
    width: 205px;
    height: 205px;
    background-size: cover;
    background-image: url(https://ts1.cn.mm.bing.net/th/id/R-C.d007b1e908d32decd1061a832bdb30d0?rik=KfCAXglYpJWGlw&riu=http%3a%2f%2fpic.616pic.com%2fys_img%2f00%2f18%2f64%2fK1k3rJ5yNr.jpg&ehk=707gF6XHZ1BXC6OWqw%2fFgMq1IfpsQjIUYEb2KwL2AB8%3d&risl=&pid=ImgRaw&r=0);
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 5px black;
}

.songs_center>div {
    margin-bottom: 15px;
}

.songer {
    font-size: 13px;
}

.songer small {
    color: rgba(0, 0, 0, .4);
}

.songs_title {
    display: flex;
    align-items: center;
}

.mask {
    display: inline-block;
    width: 54px;
    height: 24px;
    background: url(https://s2.music.126.net/style/web2/img/icon.png?75cae89c0400d74200ba366024ebb47a) no-repeat;
    background-position: 0 -463px;
    margin-right: 10px;
}

.songWord {
    font-size: 15px;
    margin-top: 40px;
}

.show_hide {
    margin-top: 10px;
}

.show_hide span {
    color: rgba(0, 0, 0, .3);
    font-size: 13px;
}

.isHide {
    height: 300px;
    width: 100%;
    overflow: hidden;
}

#commit {
    width: 90%;
    margin: auto;
}

#commit_title h3 {
    padding-bottom: 5px;
    border-bottom: 2px solid #C20C0C;
}

#commit_title h3 small {
    margin-left: 30px;
    font-size: 15px;
}

#commit_btn {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
}

#speak_input {
    padding: 10px 0;
}

.happy_content span {
    display: inline-block;
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 25px;
}

.happy_content span:hover {
    background-color: rgba(0, 0, 0, .2);
    cursor: pointer;
}

#commit_content h5 {
    padding-bottom: 10px;
    border-bottom: 1px rgba(0, 0, 0, .2) solid;
}

.content_commit {
    padding: 0 5px;
}

.conten_item {
    font-size: 12px;
    color: rgba(0, 0, 0, .6);
    border-bottom: 1px rgba(0, 0, 0, .2) dashed;
}

.conten_item .el-col {
    padding-top: 20px;
    padding-bottom: 0px;
}

.replay {
    background-color: rgb(236, 250, 255);
    padding: 0px 20px;
    margin-top: 15px;
    box-shadow: 0 0 3px rgba(0, 0, 0, .4);
    position: relative;
    overflow: hidden;
}


.replay::before {
    content: '';
    width: 5px;
    height: 5px;
    background-color: rgb(236, 250, 255);
    position: absolute;
    top: -4px;
    transform: rotate(45deg);
    border: 1px solid #D9D9D9;
    border-bottom: none;
    border-right: none;
}

.replay>div {
    margin: 15px 0;
    padding-bottom: 5px;
    border-bottom: 1px dashed rgba(0, 0, 0, .1);
}

.replay>div:last-child {
    border-bottom: none;
}

.thumb_name {
    color: skyblue;
}

.thumb_bot {
    margin: 20px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.like_replay {
    display: flex;
    align-items: center;
}

.like_replay .el-icon :hover {
    color: skyblue;
}

#page {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 20px;
}
</style>