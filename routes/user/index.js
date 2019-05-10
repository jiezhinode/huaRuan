const router=require('koa-router')()

router.get('/',async (ctx)=>{
    ctx.render('user/userLogin')
})

router.get('/login',async (ctx)=>{
    ctx.body='login'
})

router.post('/doLogin',async (ctx)=>{
    ctx.body='doLgin'
})

router.get('/register',async (ctx)=>{
    ctx.render('user/register')
})

router.use('/goods', require('./goods'))
router.use('/order', require('./orders'))
module.exports=router.routes()