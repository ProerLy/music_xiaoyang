<template>
  <div class="check_centent">
    <div class="search">
      <el-input @keydown.enter="search(input)" v-model="input" placeholder="搜索歌手或者歌名" clearable>
        <template #append>
          <el-button @click="search(input)" type="danger" :size="mini">
            <el-icon>
              <Search/>
            </el-icon>
          </el-button>
        </template>
      </el-input>
    </div>
    <!-- 搜索的数量 -->
    <p><small>搜索“{{ search_key }}”，共找到{{ songList.total }}首歌曲</small></p>
    <!-- 搜索结果 -->
    <table v-if="songList.total > 0" cellspacing="0">
      <tr>
        <th></th>
        <th>歌曲名称</th>
        <th>时长</th>
        <th>歌手</th>
      </tr>
      <tr v-for="(it, index) in songList.arr" :key="index">
        <td>
          <div class="controls">
            <el-icon :style="music_id == it?.id ? 'color: red;' : ''" size="16px"
                     @click="play_add(it?.id, null, null, 'play')" class="icon" title="播放">
              <VideoPlay/>
            </el-icon>
          </div>
        </td>
        <td>
          <!-- 歌名 -->
          <el-link type="danger" @click="$router.push('/find/songs/' + it?.id)">
            <span class="song_name">{{ it?.song_name ? it.song_name : '歌曲名称' }}</span>
          </el-link>
        </td>
        <td>
          <span class="time">{{ it?.time ? it.time : '0:00' }}</span>
          <div class="control_s">
            <!-- 加入播放列表 -->
            <el-icon class="icon" size="22px" @click="play_add(it?.id, null, null, 'add')" title="加入播放列表">
              <Plus style="margin-left: 5px;"/>
            </el-icon>
            <!-- 加入收藏 -->
            <el-icon class="icon" size="22px" @click="add_collect(it?.id)" title="收藏">
              <FolderAdd style="margin-left: 5px;"/>
            </el-icon>
            <!-- 下载 -->
            <el-icon class="icon" size="17px" style="margin-left:3px;"
                     @click="downLoad((it?.song_name + '-' + it?.songer), it?.audio)" title="下载">
              <Bottom/>
            </el-icon>
          </div>
        </td>
        <td>
          <!-- 歌手 -->
          <el-link type="danger" @click="$router.push('/find/songs/' + it?.id)">
            <span>{{ it?.songer ? it.songer : '歌手名称' }}</span>
          </el-link>
        </td>
      </tr>
    </table>
    <el-empty v-else description="无搜索结果">
    </el-empty>
  </div>
  <collectNav @close="close" :isCollectSongList="isCollectSongList" :songid="songid"/>
</template>
<script>
export default {
  name: 'CheckSongs'
}
</script>
<script setup>
import {ref, reactive, onMounted, watch, getCurrentInstance, toRefs} from 'vue'
import {getData as _getdtl, setData as _setdtl, downLoad} from '@/assets/js'
import {ElMessage} from 'element-plus'
import collectNav from '@/components/component/collectNav.vue'
import {useRouter, useRoute} from 'vue-router'
import Qs from 'qs'

const router = useRouter();
const route = useRoute();
const {proxy} = getCurrentInstance();
const emit = defineEmits(['getMusic']);
const props = defineProps({
  musicId: {
    type: String
  }
})
const {musicId} = toRefs(props);
// 搜索内容
let input = ref();
// 搜索结果名称
let search_key = ref();

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

// 搜索结果
const songList = reactive({
  arr: [],
  total: 0
});
// 获取歌曲方法
const getSongs = () => {
  input.value = route.params.key;
  search_key.value = route.params.key;
  proxy.$axios.post('/search_music.php',
      Qs.stringify({
        key: route.params.key
      })
  ).then((res) => {
    if (res.data.code == 1) {
      songList.arr = res.data.data;
      songList.total = res.data.total;
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
  // console.log(val)
  music_id.value = val;
})
// 播放音乐
const play_add = (id, list_id, table, type) => {
  if (type == 'play') {
    music_id.value = id;
  }
  emit('getMusic', {id, list_id, table, type});
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
  // 拿到音乐id传递给collectNav子组件
  songid.value = n;
}

// 获取收藏子组件回调
const close = (n) => {
  isCollectSongList.value = n;
}

// 监听路由变化
watch(() => route.path, (val) => {
  getSongs();
})

// 页面渲染完毕
onMounted(() => {
  getSongs();
})
</script>
<style scope>
.check_centent {
  width: 70%;
  min-height: max-content;
  margin: 0 auto;
  box-shadow: 0 0 3px rgba(0, 0, 0, .8);
  background-color: #ffffff;
  padding: 40px;
}

.search {
  width: 50%;
  margin: 0 auto;
  margin-bottom: 50px;
}

.search .el-input {
  height: 50px;
}

.check_centent table {
  width: 100%;
}

.check_centent table tr {
  width: 100%;
}

.check_centent table tr:nth-child(1) th {
  background-color: #ffffff;
  border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.check_centent table tr td,
.check_centent table tr th {
  padding: 5px 10px;
  text-align: left;
  font-size: 13px;
  height: 25px;
  line-height: 25px;
}

.check_centent table tr th:nth-child(2),
.check_centent table tr th:nth-child(3),
.check_centent table tr th:nth-child(4) {
  border-left: 1px solid rgba(0, 0, 0, .1);
}

.check_centent table tr th {
  color: rgba(0, 0, 0, .4);
}


.check_centent table td .el-link {
  font-size: 13px;
}

.check_centent table .icon {
  color: rgba(0, 0, 0, .5);
}

.check_centent table .icon:hover {
  color: #C20C0C;
}

.check_centent table tr td:nth-child(1) {
  width: 3%;
}

.check_centent table tr td:nth-child(2) {
  width: 45%;
}

.check_centent table tr td:nth-child(3) {
  width: 20%;
}

.check_centent table tr td:nth-child(4) {
  width: 25%;
}

.check_centent table tr:nth-child(2n) {
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


.check_centent table .index,
.check_centent table .time {
  color: rgba(0, 0, 0, .2);
}


.control_s {
  display: none;
  align-items: center;
}

.content_s .icon:nth-child(2) {
  margin-right: 5px;
}

.check_centent table tr:hover .control_s {
  display: flex;
}

.check_centent table tr:hover .time {
  display: none;
}

.check_centent table tr:hover {
  background-color: #ECF5FF;
}
</style>