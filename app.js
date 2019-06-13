const Koa=require('koa'),
    router=require('koa-router')(),
    render = require('koa-art-template'),
    path=require('path'),
    static = require('koa-static'),
    koaBody = require('koa-body'),
    session = require('koa-session'),
    mongoose = require('mongoose'),
    config = require('./config/config'),
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

//配置session
app.keys = ['some secret hurr'] //cookie签名
const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: false,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: true,
}
app.use(session(CONFIG, app))

//配置路由
router.use('/admin',admin)
router.use('/user',user)

//启动路由
app.use(router.routes()).use(router.allowedMethods())

//连接数据库
mongoose.Promise = require('bluebird');
mongoose.connect(`${config.mongodbpath}`,{ useNewUrlParser: true }).then(()=>{
    console.log('数据库连接成功');
    console.log('http://127.0.0.1:8008');
    app.listen(8008)
}).catch((err)=>{
    console.log('数据库连接失败');
})





