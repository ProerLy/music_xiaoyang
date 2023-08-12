<template>
  <!-- 轮播图 -->
  <el-carousel @change="auto" :style="'background-image:url(' + carousel.arr[backIndex]?.baner_img + ');'"
               trigger="click"
               :interval="4000" type="card" height="350px">
    <el-carousel-item v-for="item in carousel.arr" :key="item.id">
      <a style="width: 100%; height: 100%; display: block;" @click="$router.push('songs/' + item?.music_id + '')">
        <el-image style="width: 100%; height: 100%;" :src="item?.baner_img" fit="fill"></el-image>
      </a>
    </el-carousel-item>
  </el-carousel>
  <div class="content">
    <el-row>
      <el-col class="left" :span="18" :offset="0">
        <!-- 热门推荐 -->
        <div class="hot lists">
          <div class="cont_box">
            <div class="title_list">
              <!-- title -->
              <div class="title">
                <el-icon color="red">
                  <Aim/>
                </el-icon>
                <span>热门推荐</span>
                <!-- 热门推荐列表分类 -->
                <el-breadcrumb separator="|">
                  <el-breadcrumb-item v-for="it in 8" :key="it">
                    <el-link :underline="false"
                             @click="$router.push('/find/allsongs/' + types.arr[it]?.id + '/0')">{{
                        types.arr[it]?.type_name
                      }}
                    </el-link>
                  </el-breadcrumb-item>
                </el-breadcrumb>
              </div>
              <div class="more">
                <el-link @click="$router.push('/find/allsongs/0/0')" type="danger">
                  更多
                  <el-icon color="red">
                    <Right/>
                  </el-icon>
                </el-link>
              </div>
            </div>
            <!-- 内容区 -->
            <div class="cont_content">
              <el-row>
                <el-col style="margin: 10px 0;" :lg="{ span: 6 }" :md="{ span: 8 }" :sm="{ span: 12 }"
                        :xs="{ span: 24 }" :offset="0" v-for="(it, index) in tuijian.arr" :key="index">
                  <div class="cont_item">
                    <div class="cont_items">
                      <!-- 图片 -->
                      <el-link @click="$router.push('songs/' + it?.id + '')" type="danger"
                               :underline="false" :title="it?.song_name ? it?.song_name : '歌曲名称'">
                        <el-image :src="it?.baner_img" fit="fill"></el-image>
                      </el-link>
                      <div class="control">
                        <!-- 听取人数 -->
                        <span class="hear" title="听取次数">
                                                    <el-icon>
                                                        <Headset/>
                                                    </el-icon>
                                                    <span>{{ it?.hear ? it?.hear : 0 }}</span>
                                                </span>
                        <!-- 播放按钮 -->
                        <span>
                                                    <el-icon :style="music_id == it.id ? 'color: red;' : ''"
                                                             @click="play_add(it.id, null, null, 'play')" class="icon"
                                                             title="播放">
                                                        <VideoPlay/>
                                                    </el-icon>
                                                </span>
                      </div>
                    </div>
                    <!-- 歌名 -->
                    <div class="song_name">
                      <el-link @click="$router.push('songs/' + it?.id + '')" type="danger"
                               :title="it?.song_name ? it?.song_name : '歌曲名称'">{{
                          it?.song_name ? it?.song_name : '歌曲名称'
                        }}
                      </el-link>
                    </div>
                  </div>
                </el-col>
              </el-row>

            </div>
          </div>
        </div>
        <!-- 每日推荐 -->
        <div class="tuijian lists">
          <div class="cont_box">
            <div class="title_list">
              <!-- title -->
              <div class="title">
                <el-icon color="red">
                  <Clock/>
                </el-icon>
                <span>每日推荐</span>
              </div>
            </div>
            <!-- 内容区 -->
            <div class="cont_content">
              <el-row>
                <el-col :lg="{ span: 6 }" :md="{ span: 8 }" :sm="{ span: 12 }" :xs="{ span: 24 }"
                        :offset="0" class="tuijian_title">
                  <div class="cont_item">
                    <el-link @click="$router.push('recommend')" :underline="false">
                      <div class="cont_items" title="每日歌曲推荐">
                        <div class="top_icon">星期{{ week }}</div>
                        <div class="icon_center">
                          <div class="text">{{ day }}</div>
                          <div class="center"></div>
                          <div class="bottom"></div>
                        </div>
                      </div>
                    </el-link>
                    <!-- 歌单名 -->
                    <div class="song_name">
                      <el-link @click="$router.push('recommend')" type="danger"
                               title="每日歌曲推荐">每日歌曲推荐
                      </el-link>
                    </div>
                    <div>
                      <small title="根据你的口味生成，每天6:00更新"
                             style="color: rgba(0,0,0,.5); font-size: 10px;">
                        根据你的口味生成，每天6:00更新
                      </small>
                    </div>
                  </div>
                </el-col>
                <el-col :lg="{ span: 6 }" :md="{ span: 8 }" :sm="{ span: 12 }" :xs="{ span: 24 }"
                        :offset="0" v-for="(it, index) in recomment.arr" :key="index">
                  <div class="cont_item">
                    <div class="cont_items">
                      <!-- 图片 -->
                      <el-link @click="$router.push('songs/' + it?.music_id + '')" type="danger"
                               :underline="false" :title="it?.song_name ? it?.song_name : '歌曲名称'">
                        <el-image :src="it?.baner_img" fit="fill"></el-image>
                      </el-link>
                      <div class="control">
                        <!-- 听取人数 -->
                        <span class="hear" title="听取次数">
                                                    <el-icon>
                                                        <Headset/>
                                                    </el-icon>
                                                    <span>{{ it?.hear ? it?.hear : 0 }}</span>
                                                </span>
                        <!-- 播放按钮 -->
                        <span>
                                                    <el-icon :style="music_id == it?.music_id ? 'color: red;' : ''"
                                                             @click="play_add(it?.music_id, null, null, 'play')"
                                                             class="icon"
                                                             title="播放">
                                                        <VideoPlay/>
                                                    </el-icon>
                                                </span>
                      </div>
                    </div>
                    <!-- 歌单名 -->
                    <div class="song_name">
                      <el-link @click="$router.push('songs/' + it?.music_id + '')" type="danger"
                               :title="it?.song_name ? it?.song_name : '歌曲名称'">{{
                          it?.song_name ? it?.song_name : '歌曲名称'
                        }}
                      </el-link>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
        <!-- 排行榜 -->
        <div class="toplist lists">
          <div class="cont_box">
            <div class="title_list">
              <!-- title -->
              <div class="title">
                <el-icon color="red">
                  <Histogram/>
                </el-icon>
                <span>排行榜</span>

              </div>
              <div class="more">
                <el-link @click="$router.push('/find/toplist/1')" type="danger">
                  更多
                  <el-icon color="red">
                    <Right/>
                  </el-icon>
                </el-link>
              </div>
            </div>
            <!-- 内容区 -->
            <div class="cont_content">
              <el-row>
                <el-col :span="8" :offset="0" v-for="(it, index) in toplist_name" :key="index">
                  <ul class="top_list">
                    <li>
                      <el-row>
                        <el-col :lg="{ span: 12 }" :md="{ span: 24 }" :offset="0">
                          <el-link class="a" :title="it.type_name" :underline="false"
                                   @click="$router.push('/find/toplist/' + it.id)">
                            <div class="top_img">
                              {{ it.type_name }}
                            </div>
                            <div class="mask"></div>
                          </el-link>
                        </el-col>
                        <el-col class="top-title-box" :lg="{ span: 12 }" :md="{ span: 24 }"
                                :offset="0">
                          <div class="top-title">
                            <el-link :title="it?.type_name" type="danger"
                                     @click="$router.push('/find/toplist/' + it?.id)">
                              {{ it?.type_name }}
                            </el-link>
                          </div>
                          <div class="top_control">
                            <el-icon class="icon" size="25px"
                                     @click="play_add(toplist[index][0].music_id, it?.id, 'toplist', 'play')"
                                     title=播放>
                              <VideoPlay/>
                            </el-icon>
                            <el-icon class="icon" size="25px"
                                     @click="toplist_add_collect(it.id)" title="收藏">
                              <FolderAdd/>
                            </el-icon>
                          </div>
                        </el-col>
                      </el-row>
                    </li>
                    <li class="song_list_item" v-for="(it, index) in toplist[index]" :key="index">
                      <div class="song_index_name">
                                                <span class="index" :style="index < 3 ? 'color:color: red;;' : ''">
                                                    {{ index + 1 }}
                                                </span>
                        <a href="javascript:;" @click="$router.push('songs/' + it.music_id + '')"
                           :title="it.song_name ? it.song_name : '歌曲名称'">
                          {{ it.song_name ? it.song_name : '歌曲名称' }}
                        </a>
                      </div>
                      <div class="top_list_control">
                        <el-icon :style="music_id == it.music_id ? 'color: red;' : ''" class="icon"
                                 @click="play_add(it.music_id, null, null, 'play')" title="播放">
                          <VideoPlay/>
                        </el-icon>
                        <el-icon class="icon" @click="play_add(it.music_id, null, 'toplist', 'add')"
                                 title="添加播放列表">
                          <Plus/>
                        </el-icon>
                        <el-icon class="icon" @click="add_collect(it.music_id)" title="收藏">
                          <FolderAdd/>
                        </el-icon>
                        <el-icon class="icon"
                                 @click="downLoad((it?.song_name + '-' + it?.songer), it?.audio)"
                                 title="下载">
                          <Bottom/>
                        </el-icon>
                      </div>
                    </li>
                    <li style="text-align: right;">
                      <el-link @click="$router.push('/find/toplist/' + it.id)"
                               type=danger>查看全部
                        <el-icon color="red">
                          <DArrowRight/>
                        </el-icon>
                      </el-link>
                    </li>
                  </ul>
                </el-col>
              </el-row>
            </div>
          </div>
        </div>
      </el-col>
      <el-col class="right" :span="6" :offset="0">
        <userInfo/>
      </el-col>
    </el-row>
  </div>
  <collectNav @close="close" :isCollectSongList="isCollectSongList" :songid="songid" :table="table"
              :listid="toplistid"/>
</template>
<script>
export default {
  name: 'TuiJian'
}
</script>
<script setup>
// 引入ref、reactive
import {ref, reactive, getCurrentInstance, onMounted, toRefs, watch} from 'vue'
import {getData as _getdtl, downLoad} from '../../../assets/js'
import {ElMessage} from 'element-plus'
import collectNav from '@/components/component/collectNav.vue'
import userInfo from '@/components/component/userInfo.vue'
import Qs from 'qs'
import {useRouter} from 'vue-router'

const router = useRouter();
const {proxy} = getCurrentInstance();
const emit = defineEmits(['getMusic']);
const props = defineProps({
  musicId: {
    type: String
  }
})
const {musicId} = toRefs(props);
// 页面加载完毕
onMounted(() => {
  // 获取轮播图信息
  get_carousel();
  // 获取类型
  getType();
  // 获取热门推荐数据
  tuijian_fun();
  // 获取每日推荐数据
  recomment_fun();
  // 获取排行榜信息
  getToplist();
  if (musicId.value) {
    console.log(musicId.value)
    music_id.value = musicId.value;
  }
})

// 轮播图数据
const carousel = reactive({
  arr: []
})

// 获取轮播图数据
const get_carousel = () => {
  proxy.$axios.post('/get_table.php',
      Qs.stringify({
        table: 'view_carousel'
      })
  ).then((res) => {
    if (res.data.code == 1) {
      carousel.arr = res.data.data;
    }
  }).catch((err) => {
    console.log(err)
  })
}

let backIndex = ref(0);
// 轮播图自动切换时触发
const auto = (index) => {
  // 更换轮播图背景
  backIndex.value = index;
}

// 热门数据
const tuijian = reactive({
  arr: []
});
// 获取热门推荐
const tuijian_fun = () => {
  proxy.$axios.post('/getMusic_tuijian_kh.php',
      Qs.stringify({
        page_size: 8
      })
  ).then((res) => {
    if (res.data.code == 1) {
      tuijian.arr = res.data.data;
    }
  }).catch((err) => {
    console.log(err);
  })
}

// 类型
const types = reactive({
  arr: []
})
// 获取类型
const getType = () => {
  proxy.$axios.post('/get_table.php',
      Qs.stringify({
        table: 'music_type'
      }))
      .then((res) => {
        if (res.data.code == 1) {
          types.arr = res.data.data;
        }
      }).catch((err) => {
    console.log(err);
  })
}

// 每日推荐数据
const recomment = reactive({
  arr: []
});
// 获取每日推荐
const recomment_fun = () => {
  proxy.$axios.post('/getMusic_recomment_kh.php',
      Qs.stringify({
        page_size: 3
      })
  ).then((res) => {
    if (res.data.code == 1) {
      recomment.arr = res.data.data;
    }
  }).catch((err) => {
    console.log(err);
  })
}
// 获取当前的日期
let date = new Date();
// 天
let day = ref(date.getDate());
let weeks = ['日', '一', '二', '三', '四', '五', '六'];
// 周
let week = ref(weeks[date.getDay()]);

// 排行榜数据
const toplist = reactive([]);
// 排行榜名称
const toplist_name = reactive([]);

// 获取排行榜信息方法
const getToplist = () => {
  proxy.$axios.post('/get_table.php',
      Qs.stringify({
        table: 'music_toplist'
      })
  )
      .then((res) => {
        if (res.data.code == 1) {
          for (var i = 0; i < 3; i++) {
            toplist_name.push(res.data.data[i]);
          }
          toplist_name.forEach((val, index) => {
            proxy.$axios.post('/getMusic_toplist.php',
                Qs.stringify({
                  page_size: 6,
                  type: val.id
                })
            ).then((res) => {
              if (res.data.code == 1) {
                toplist[index] = res.data.data;
              }
            }).catch((err) => {
              console.log(err);
            })
          });
        }
      }).catch((err) => {
    console.log(err);
  })
}

// 歌曲的
const music_id = ref();
// 监听musicId变化
watch(() => musicId.value, (val) => {
  music_id.value = val;
})

// 播放音乐或添加音乐列表
function play_add(id, list_id, table, type) {
  if (type == 'play') {
    music_id.value = id;
  }
  emit('getMusic', {id, list_id, table, type});
}

// 是否打开收藏歌单抽屉
let isCollectSongList = ref(false);

// 排行榜id
const toplistid = ref();
const table = ref();
// 添加整个排行榜入收藏
const toplist_add_collect = (n) => {
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
  // 排行榜id
  toplistid.value = n;
  table.value = 'view_music_toplist';
}

// 音乐id
const songid = ref();
// 添加单个音乐入收藏
const add_collect = (n) => {
  // console.log(n)
  if (!!_getdtl('token'))
    isCollectSongList.value = true;
  else {
    ElMessage.warning('请先登录~');
    // 跳转登录页面
    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
  songid.value = n;
}

// 获取收藏子组件回调
const close = (n) => {
  isCollectSongList.value = n;
  songid.value = null;
  toplistid.value = null;
  table.value = null;
}
</script>
<style scoped>
.content {
  height: auto;
}

.el-carousel {
  padding: 20px 0;
  background-size: 6000px;
  background-position: center center;
}

.el-carousel__item {
  background-color: white;
  box-shadow: 0 0 3px black;
}

/* 需要改变vue自带的样式时需要在元素前面加上::v-deep*/
/* 左箭头 */
:deep(.el-carousel__arrow--left) {
  color: transparent;
  /* 设置背景图片 */
  background: url("https://s1.chu0.com/src/img/png/d7/d78cfb204f3a4a63beed67cbe80bb79b.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:GWnNQGtsikQ9cSXTvjRwE0aVDow=") no-repeat;
  background-size: cover;
}

/* 右箭头 */
:deep(.el-carousel__arrow--right) {
  color: transparent;
  background: url("https://s1.chu0.com/src/img/png/d7/d78cfb204f3a4a63beed67cbe80bb79b.png?e=1735488000&token=1srnZGLKZ0Aqlz6dk7yF4SkiYf4eP-YrEOdM1sob:GWnNQGtsikQ9cSXTvjRwE0aVDow=") no-repeat;
  transform: rotateY(180deg);
  background-size: cover;
}

/* 水平指示器 */
:deep(.el-carousel__indicators--horizontal) {
  /* background: transparent; */
  position: absolute;
  bottom: 30px;
  left: 30%;
}

/* 将轮播图指示器变成圆点 */
:deep(.el-carousel__indicator--horizontal .el-carousel__button) {
  width: 8px;
  height: 8px;
  /* background: transparent; */
  background: white;
  border-radius: 50%;
  /*不透明度 */
  opacity: 1;
  box-shadow: 0 0 3px black;
  margin: 0 5px;
}

:deep(.el-carousel__indicator--horizontal .el-carousel__button):hover {
  background: #B90B0B;
  opacity: 1;
  box-shadow: 1px 1.5px 3px black;
}

/* 当前被选中的指示器样式 */
:deep(.el-carousel__indicator--horizontal.is-active .el-carousel__button) {
  background: #B90B0B;
  opacity: 1;
  box-shadow: 1px 1.5px 3px black;
}

:deep(.el-carousel__container) {
  width: 100%;
}

.content {
  width: 80%;
  margin: 0 auto;
  background-color: #ffffff;
  box-shadow: 0 0 3px rgba(0, 0, 0, .8);
}

.content > .el-row > .el-col {
  padding: 20px 0;
}

.content .left {
  border-right: 1px solid rgba(0, 0, 0, .3);
  padding: 20px 35px !important;
  padding-right: 5px !important;
}

.content .right {
  padding-left: 0 !important;
}

.lists {
  width: 100%;
  margin-bottom: 10px;
}

.lists .cont_box {
  width: 100%;
}

.title_list {
  padding: 5px 0;
  border-bottom: 2px solid red;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  display: flex;
  align-items: center;
  font-size: 20px;
}

.title > span {
  margin-right: 25px;
}

.title .el-icon {
  margin-right: 5px;
}

:deep(.el-breadcrumb__separator) {
  margin: 0 15px;
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner) {
  font-weight: bold !important;
  color: rgb(75, 75, 75) !important;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner a) {
  font-weight: bold !important;
  color: rgb(75, 75, 75) !important;
  cursor: pointer !important;
}

:deep(.el-breadcrumb__item:last-child .el-breadcrumb__inner a):hover {
  color: black !important;
}

:deep(.el-breadcrumb__item .el-breadcrumb__inner):hover {
  color: black !important;
}

.cont_item {
  width: 150px;
}

.cont_items {
  width: 150px;
  height: 150px;
  position: relative;
  box-shadow: 0 0 3px black;
}

.control {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  padding: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.control .el-icon {
  padding: 0 10px;
}

.control .hear i {
  padding-right: 0 !important;
}

.cont_content .el-col {
  margin: 20px 0;
}

.song_name {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-top: 5px;
}

.icon:hover {
  color: #B90B0B;
}

.tuijian_title .cont_items {
  border-radius: 10px;
  overflow: hidden;
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
  font-size: 85px;
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

.el-link {
  color: rgba(0, 0, 0, .6);
}

.el-link:hover {
  color: black;
}

.top_list {
  list-style-type: none;
  border: 1px solid rgba(0, 0, 0, .3);
  border-right: none;
}

.icon,
.hear {
  color: rgba(0, 0, 0, .6);
}

.hear {
  display: flex;
  align-items: center;
}

.top_list li:nth-child(2n) {
  background-color: #E8E8E8;
}

.top_list .icon {
  margin-right: 10px;
}

.top_list .top-title-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.top_list_3 {
  border-right: 1px solid rgba(0, 0, 0, .3);
}

.top_list li {
  padding: 10px 0px;
  position: relative;
}

.top_img {
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  box-shadow: 0 3px 5px rgba(0, 0, 0, .8);
}

.cont_content > .el-row > .el-col:nth-of-type(1) .top_img {
  background: linear-gradient(to left bottom, #F6B0CB, #B7427E);
}

.cont_content > .el-row > .el-col:nth-of-type(2) .top_img {
  background: linear-gradient(to left bottom, #66B1FF, #409EFF);
}

.cont_content > .el-row > .el-col:nth-of-type(3) .top_img {
  background: linear-gradient(to left bottom, #409EFF, #3375B9);
}

.a {
  position: relative;
  margin-left: 30px;
}

.mask {
  width: 100%;
  height: 100%;
  background-image: url(https://s2.music.126.net/style/web2/img/coverall.png?425c12c8a01af7bf33a919fdb39b4535);
  background-position: -145px -57px;
  background-repeat: no-repeat;
  position: absolute;
  top: 0;
  left: 0;
}

.song_list_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.song_index_name {
  display: flex;
  align-items: center;
  width: 100%;
}

.song_list_item:hover .song_index_name{
  width: 60%;
}

.song_index_name a {
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: rgba(0, 0, 0, .6);
  font-size: 10px;
}

.top_list_control {
  align-items: center;
  display: none;
}

.top_list_control .icon {
  margin: 0 3px;
}

.index {
  padding: 0px 15px 0px 20px;
}

.song_list_item:hover .top_list_control {
  display: flex;
}

.song_list_item:hover a {
  text-decoration: underline;
  color: black;
  text-decoration-color: #B90B0B;
}

.user {
  display: flex;
  padding: 10px 0px 10px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, .3);
}

.userinfo {
  font-size: 10px;
  padding: 0 10px;
}

.user_name {
  font-size: 15px;
}

.address {
  margin-bottom: 5px;
}

.el-divider {
  margin: 10px 0;
}
</style>