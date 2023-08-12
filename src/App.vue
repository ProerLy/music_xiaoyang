<template>
  <div id="app">
    <!-- :key="$route.fullPath" 解决已是默认页面点击不刷新问题 -->
    <router-view @setStyle="getStyle" v-slot="{ Component, route }">
      <transition :name="route.meta.transition">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script>
export default {
  name: 'App'
}
</script>
<script setup>
import { getData, setData } from './func/index';
import { onMounted, getCurrentInstance } from 'vue'
import Qs from 'qs'
const { proxy } = getCurrentInstance();
// 整体的主题数据
let color = {
  color: '#393A3C',
  backgroundColor: 'transparent',
  backgroundImage: '',
  backgroundSize: 'cover',
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat'
};
if (!!getData('styles')) {
  color.backgroundColor = getData('styles').backgroundColor;
  color.backgroundImage = getData('styles').backgroundImage;
  color.color = getData('styles').color;
}
// 获取到body
let body = document.body;
// 初始值
body.style['background-size'] = color.backgroundSize;
body.style['background-repeat'] = color.backgroundRepeat;
body.style['background-attachment'] = color.backgroundAttachment;
// 修改主题
bodyStyle(color);

// 获取子路由传递的参数
function getStyle(event) {
  // console.log(event);
  if (event.bgImg !== undefined) {
    color.backgroundImage = 'url(' + event.bgImg + ')';
  }
  if (event.bgClr !== undefined) {
    color.backgroundColor = event.bgClr;
  }
  if (event.clr !== undefined) {
    color.color = event.clr;
  }
  // 修改主题
  bodyStyle(color);
  // 保存数据
  setData('styles', color);
}

// 修改body样式
function bodyStyle(obj) {
  body.style['background-color'] = obj.backgroundColor;
  body.style['background-image'] = obj.backgroundImage;
  body.style['color'] = obj.color;
}

// 页面关闭时触发的事件,该事件必须在页面进行一定的交互才能触发
const outCode = () => {
  window.addEventListener('beforeunload', function () {
    // 判断是否登录
    if (getData('token')) {
      const params = Qs.stringify({
        token: getData('token'),
        code: 0
      })
      proxy.$axios.post('/code.php', params).then((res) => {
        // console.log(res);
        // setData('code', 0);
      }).catch((err) => {
        console.log(err);
      })
    }
  })
}

// 页面加载完毕后，判断是否登录，登录则修改在线状态
const inCode = () => {
  // 判断是否登录
  if (getData('token')) {
    const params = Qs.stringify({
      token: getData('token'),
      code: 1
    })
    proxy.$axios.post('/code.php', params).then((res) => {
      // console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }
}

onMounted(() => {
  // 页面加载完毕后，判断是否登录，登录则修改在线状态
  inCode();
  // 判断用户是否关闭页面，如果关闭则状态为离线
  outCode();
})
</script>
