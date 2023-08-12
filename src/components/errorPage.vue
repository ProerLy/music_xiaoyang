<template>
    <div style="background-color: #F1F1F1; height: 100%;">
        <el-empty
            image="https://img.zcool.cn/community/01da295b2749baa8012034f792b59f.jpg@2o.jpg"
            :image-size="800" description="网页丢失了......">
            <p style="color: red;"><el-icon><WarnTriangleFilled /></el-icon>请检查您的网络路径是否拼写正确或者网络状态是否正常......</p><br>
            <p>
                <el-button size="default" round><router-link to="/home">返回首页</router-link></el-button>
            </p>
        </el-empty>
    </div>
</template>
<script>
export default {
    name: 'errorPage'
}
</script>
<style scoped>
a{
    text-decoration: none;
}
</style>