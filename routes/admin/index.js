const router=require('koa-router')()


router.get('/',async (ctx)=>{
    await ctx.render('index')
})


router.get('/userlist',async (ctx)=>{
    await ctx.render('userlist')
})


router.get('/login',async (ctx)=>{
     await ctx.render('login')
})

router.post('/loginCheck',async (ctx)=>{
    ctx.body = ctx.request.body;
})




router.use('/user', require('./user'))

module.exports=router.routes()