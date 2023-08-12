import { createRouter, createWebHashHistory } from 'vue-router'
// 引入ElMessage 
import { ElMessage  } from 'element-plus'
// 引入get方法
import { getData as _getdtl } from '@/assets/js'

// import 
const routes = [
    {
        path: "/login",
        name: "LoginPage",
        component: ()=>import('@/components/LoginPage.vue'),
        meta: {
            title: '登录',
            transition: 'scale-slide'
        }
    }, {
        path: "/regit",
        name: "RegitPage",
        component:  ()=>import('@/components/RegitPage.vue'),
        meta: {
            title: '注册',
            transition: 'scale-slide'
        }
    },
    {
        path: "/home",
        name: "HomePage",
        component:  ()=>import('@/components/HomePage.vue'),
        redirect: '/find',
        meta: {
            title: '七语熙音乐馆'
        },
        children: [
            {
                path: "/find",
                name: "FindPage",
                component:  ()=>import('@/components/home/FindPage.vue'),
                redirect: '/find/tuijian',
                children: [
                    {
                        path: "tuijian",
                        name: "TuiJian",
                        component:  ()=>import('@/components/home/find/TuiJian.vue')
                    },
                    {
                        path: "toplist/:id",
                        name: "TopList",
                        component: ()=>import('@/components/home/find/TopList.vue')
                    },
                    {
                        path: "songs/:id",
                        name: "SongS",
                        component: ()=>import('@/components/home/find/SongS.vue')
                    },
                    {
                        path: "allsongs/:type/:limit",
                        name: "AllSongS",
                        component: ()=>import('@/components/home/find/AllSongS.vue')
                    },
                    {
                        path: "recommend",
                        name: "RecomMend",
                        component: ()=>import('@/components/home/find/RecomMend.vue')
                    }
                ]
            },
            {
                path: "/mymusic/:id",
                name: "MyMusic",
                component: ()=>import('@/components/home/MyMusic.vue')
            },
            {
                path: "/mine",
                name: "MinePage",
                component: ()=>import('@/components/home/MinePage.vue')
            },
            {
                path: "/other/:id",
                name: "otherPage",
                component: ()=>import('@/components/home/otherPage.vue')
            },
            {
                path: "/mineset",
                name: "MineSet",
                component: ()=>import('@/components/home/MinePage.vue'),
                redirect: '/mineset/defltset',
                children: [
                    {
                        path: "defltset",
                        name: "DefltSet",
                        component: ()=>import('@/components/home/mineSet/DefltSet.vue')
                    },
                    {
                        path: "idset",
                        name: "IdSet",
                        component: ()=>import('@/components/home/mineSet/IdSet.vue'),
                    }
                ]
            },
            {
                path: "/check/:key",
                name: "CheckSongs",
                component: ()=>import('@/components/home/CheckSongs.vue')
            },
            {
                path: "/musiclist/:id",
                name: "musicList",
                component: ()=>import('@/components/home/musicList.vue')
            },
            {
                path: "/msg",
                name: "msgPage",
                component: ()=>import('@/components/home/msgPage.vue'),
                redirect: '/msglist',
                children: [
                    {
                        path: "/msglist",
                        name: "msgList",
                        component: ()=>import('@/components/home/msg/msgList.vue')
                    }, {
                        path: "/msginfo/:user_id/:friend_id",
                        name: "msgInfo",
                        component: ()=>import('@/components/home/msg/msgInfo.vue')
                    },
                    {
                        path: "/sysmsg",
                        name: "sysMsg",
                        component: ()=>import('@/components/home/msg/sysMsg.vue')
                    }
                ]
            },
            {
                path: "/follows/:id",
                name: "followsPage",
                component: ()=>import('@/components/home/followsPage.vue')
            },
            {
                path: "/fens/:id",
                name: "fensPage",
                component: ()=>import('@/components/home/fensPage.vue')
            }
        ]
    },
    {
        path: "/",
        redirect: '/home'
    },
    // 404
    {
        path: "/:pathMatch(.*)",
        name: "errorPage",
        component: () => import('@/components/errorPage.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    // 可通过的页面
    if (to.path.indexOf('/mine') > -1 || to.path.indexOf('/mymusic') > -1 || to.path.indexOf('/msglist') > -1 || to.path.indexOf('/mineset') > -1) {
        // 获取本地储存的token
        const token = _getdtl('token');
        if (!token) {
            // 提示
            ElMessage.error('请先登录~');
            setTimeout(() => {
                next('/login');
            }, 1000);
        } else {
            next();
        }
    } else {
        next()
    }

})

export default router