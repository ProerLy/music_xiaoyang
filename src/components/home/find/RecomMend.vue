<template>
    <div class="recommend_content">
        <div class="recommend_top">
            <div class="cont_items" title="每日歌曲推荐">
                <div class="top_icon">星期{{ week }}</div>
                <div class="icon_center">
                    <div class="text">{{ day }}</div>
                    <div class="center"></div>
                    <div class="bottom"></div>
                </div>
            </div>
            <div class="recommend_text">
                <h3>每日推荐歌曲</h3>
                <h5>根据你的口味生成，每天6:00更新</h5>
            </div>
        </div>
        <div class="control">
            <el-button-group>
                <el-button type="primary" size="mini" @click="play_add(recomment.arr[0].music_id, 1, 'recomment', 'play')"
                    title="播放"><el-icon>
                        <VideoPlay />
                    </el-icon>播放</el-button>
                <el-button type="primary" size="mini" @click="play_add(null, 1, 'recomment', 'add')"
                    title="添加播放列表"><el-icon>
                        <Plus />
                    </el-icon></el-button>
            </el-button-group>
            <el-button title="收藏全部" @click="recomment_add_collect('music_recomment')">
                <el-icon>
                    <FolderAdd />
                </el-icon>收藏全部
            </el-button>
        </div>
        <h3 class="songlist_list">
            <span class="title">歌曲列表</span>
            <small>共{{ recomment.total }}首</small>
        </h3>
        <!-- 歌曲列表 -->
        <table cellspacing="0" v-if="recomment.total > 0">
            <tr>
                <th></th>
                <th>歌曲名称</th>
                <th>时长</th>
                <th>歌手</th>
            </tr>
            <tr v-for="(it, index) in recomment.arr" :key="index">
                <td>
                    <div class="controls">
                        <span class="index">{{ index + 1 }}</span>
                        <el-icon :style="music_id == it?.music_id ? 'color: red;' : ''" size="16px"
                            @click="play_add(it?.music_id, null, null, 'play')" class="icon" title="播放">
                            <VideoPlay />
                        </el-icon>
                    </div>
                </td>
                <td>
                    <!-- 歌名 -->
                    <el-link type="danger" @click="$router.push('songs/' + it?.music_id + '')">
                        <span class="song_name">{{ it?.song_name ? it.song_name : '歌曲名称' }}</span>
                    </el-link>
                </td>
                <td>
                    <span class="time">{{ it?.time ? it.time : '0:00' }}</span>
                    <div class="control_s">
                        <!-- 加入播放列表 -->
                        <el-icon class="icon" size="22px" @click="play_add(it?.music_id, null, 'add')" title="加入播放列表">
                            <Plus style="margin-left: 5px;" />
                        </el-icon>
                        <!-- 加入收藏 -->
                        <el-icon class="icon" style="margin-right:5px;" size="22px" @click="add_collect(it?.music_id)"
                            title="收藏">
                            <FolderAdd style="margin-left: 5px;" />
                        </el-icon>
                        <!-- 删除 -->
                        <el-icon class="icon" size="16px" @click="del(it?.music_id)" title="删除">
                            <Delete />
                        </el-icon>
                        <!-- 下载 -->
                        <el-icon class="icon" size="22px" @click="downLoad((it?.song_name + '-' + it?.songer), it?.audio)"
                            title="下载">
                            <Bottom style="margin-left: 5px;" />
                        </el-icon>
                    </div>
                </td>
                <td>
                    <!-- 歌手 -->
                    <el-link type="danger" @click="$router.push('songs/' + it?.id + '')">
                        <span>{{ it?.songer ? it.songer : '歌手名称' }}</span>
                    </el-link>
                </td>
            </tr>
        </table>
        <el-empty v-else description="暂无歌曲"></el-empty>
    </div>
    <collectNav @close="close" :isCollectSongList="isCollectSongList" :songid="songid" :table="table" />
    <!-- 删除提示弹窗 -->
    <el-dialog v-model="delDtl.del_dialog" title="提示" width="30%">
        <span>此操作不可逆，是否删除？</span>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="delDtl.del_dialog = false">取消</el-button>
                <el-button type="primary" @click="del_ok">
                    确定
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<script>
export default {
    name: 'RecomMend'
}
</script>
<script setup>
import { ref, reactive, onMounted, getCurrentInstance, toRefs, watch } from 'vue'
import { ElMessage } from 'element-plus'
import collectNav from '@/components/component/collectNav.vue'
import Qs from 'qs'
import { useRouter } from 'vue-router'
import { getData as _getdtl, downLoad } from '@/assets/js'
const router = useRouter();
const { proxy } = getCurrentInstance();
const emit = defineEmits(['getMusic'])
const props = defineProps({
    musicId: {
        type: String
    }
})
const { musicId } = toRefs(props);
// 页面加载完毕
onMounted(() => {
    // 获取每日推荐
    recomment_fun();
})
// 获取当前的日期
let date = new Date();
// 天
let day = ref(date.getDate());
let weeks = ['日', '一', '二', '三', '四', '五', '六'];
// 周
let week = ref(weeks[date.getDay()]);

// 每日推荐数据
const recomment = reactive({
    arr: [],
    total: 0
});
// 获取每日推荐
const recomment_fun = () => {
    proxy.$axios.post('/getMusic_recomment_kh.php',
        Qs.stringify({
            msg: null
        })
    ).then((res) => {
        if (res.data.code == 1) {
            recomment.arr = res.data.data;
            recomment.total = res.data.total;
            if (musicId.value) {
                music_id.value = musicId.value;
            }
        }
    }).catch((err) => {
        console.log(err);
    })
}

// 歌曲id
const music_id = ref();
// 监听musicId变化
watch(() => musicId.value, (val) => {
    music_id.value = val;
})
// 播放音乐
const play_add = (id, list_id, table, type) => {
    if (type == 'play') {
        music_id.value = id;
    }
    emit('getMusic', { id, list_id, table, type });
}

// 是否打开收藏歌单抽屉
let isCollectSongList = ref(false);
// 音乐id
const songid = ref();
// 单个添加收藏夹
const add_collect = (n) => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return;
    }
    songid.value = n;
    isCollectSongList.value = true;
}

// 表名
const table = ref();
// 全部推荐音乐添加收藏夹
const recomment_add_collect = (key) => {
    if (!_getdtl('token')) {
        ElMessage.warning('请先登录~');
        // 跳转登录页面
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        return;
    }
    table.value = key;
    isCollectSongList.value = true;
}

// 删除数据
const delDtl = reactive({
    del_dialog: false,
    music_id: null
});
// 删除歌单里面的歌曲
const del = (n) => {
    delDtl.music_id = n;
    delDtl.del_dialog = true;
}
// 确认删除
const del_ok = () => {
    // 删除音乐
    proxy.$axios.post('/delet_recomment.php',
        Qs.stringify({
            music_id: delDtl.music_id
        })
    ).then((res) => {
        if (res.data.code == 0) {
            // 提示
            ElMessage.warning(res.data.msg);
            return;
        }
        // 提示
        ElMessage.success(res.data.msg);
        delDtl.del_dialog = false;
        // 重新加载数据
        recomment_fun();
    }).catch((err) => {
        console.log(err);
    })
}

// 播放音乐
function play(index) {
    console.log(index)
}

// 获取收藏子组件回调
const close = (n) => {
    isCollectSongList.value = n;
    songid.value = null;
    table.value = null;
}
</script>
<style scope>
.recommend_content {
    width: 70%;
    min-height: max-content;
    box-shadow: 0 0 3px rgba(0, 0, 0, .8);
    margin: 0 auto;
    padding: 40px;
    background-color: #ffffff;
}

.recommend_top {
    width: 100%;
    height: 300px;
    background: url(https://bpic.588ku.com/back_water_img/19/04/20/e43d13486b1fd4f007e791aaf075b492.jpg!/fw/750/quality/99/unsharp/true/compress/true) no-repeat;
    background-size: contain;
    background-position: center;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
}


.cont_items {
    width: 150px;
    height: 150px;
    position: relative;
    box-shadow: 0 0 3px black;
    border-radius: 10px;
    overflow: hidden;
    background-color: #ffffff;
    margin-right: 20px;
}


.top_icon {
    width: 100%;
    height: 25%;
    top: 0;
    left: 0;
    background: linear-gradient(to bottom, #DC4646, #B90B0B);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 10px;
    color: #ffffff;
}

.icon_center {
    width: 100%;
    height: 75%;
    position: relative;
}

.text {
    width: 100%;
    height: 100%;
    font-size: 90px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;
}

.center {
    width: 100%;
    height: 50%;
    top: 0;
    left: 0;
    background-color: rgba(135, 207, 235, 0.3);
    position: absolute;
}

.bottom {
    width: 100%;
    height: 50%;
    position: absolute;
    top: 50%;
    left: 0;
    background-color: rgba(135, 207, 235, 0.2);
}

.recommend_content .control {
    margin: 20px 50px;
}

.control .el-icon {
    margin-right: 3px;
}

.el-button-group {
    margin: 0 10px;
}


.songlist_list {
    border-bottom: 2px solid #C20C0C;
    margin-top: 50px;
    padding: 5px 30px;
}

.songlist_list small {
    font-size: 15px;
}

.songlist_list .title {
    margin-right: 10px;
}

table {
    width: 100%;
}

table tr {
    width: 100%;
}

table tr:nth-child(1) th {
    background-color: #ffffff;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

table tr td,
table tr th {
    padding: 5px 10px;
    text-align: left;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
}

table tr th:nth-child(2),
table tr th:nth-child(3),
table tr th:nth-child(4) {
    border-left: 1px solid rgba(0, 0, 0, .1);
}

table tr th {
    color: rgba(0, 0, 0, .4);
}

table td .el-link {
    font-size: 13px;
}

table .icon {
    color: rgba(0, 0, 0, .5);
}

table .icon:hover {
    color: #C20C0C;
}

table tr td:nth-child(1) {
    width: 10%;
}

table tr td:nth-child(2) {
    width: 45%;
}

table tr td:nth-child(3) {
    width: 20%;
}

table tr td:nth-child(4) {
    width: 25%;
}

table tr:nth-child(2n) {
    background-color: #ECF5FF;
}

.controls {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.controls span {
    font-size: 10px;
}

table .index,
table .time {
    color: rgba(0, 0, 0, .2);
}


.control_s {
    display: none;
    align-items: center;
}

.content_s .icon {
    margin-right: 2px;
}

table tr:hover .control_s {
    display: flex;
}

table tr:hover .time {
    display: none;
}

table tr:hover {
    background-color: #ECF5FF;
}
</style>