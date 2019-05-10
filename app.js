const Koa=require('koa'),
    router=require('koa-router')(),
    render = require('koa-art-template'),
    path=require('path'),
    static = require('koa-static'),
    koaBody = require('koa-body'),
    //引入子模块
    admin=require('./routes/admin/index.js'),
    user=require('./routes/user/index.js')
const app=new Koa()

//配置koa-art-template 模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
})

//配置静态服务器
app.use(static(__dirname + '\\public'))


app.use(koaBody({
    multipart: true,
    formidable: {
        maxFileSize: 2000*1024*1024*10   // 设置上传文件大小最大限制，默认2M
    }
}))

//配置路由
router.use('/admin',admin)
router.use('/user',user)


//启动路由
app.use(router.routes()).use(router.allowedMethods())
app.listen(8008)