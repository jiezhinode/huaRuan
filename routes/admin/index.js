const router=require('koa-router')()

router.get('/',async (ctx)=>{
    await ctx.render('admin/login')
})


router.get('/list',async (ctx)=>{
    await ctx.render('admin/list')
})


router.get('/userlist',async (ctx)=>{
     await ctx.render('admin/userlist')
})

router.post('/loginCheck',async (ctx)=>{
    ctx.body = ctx.request.body;
})




router.use('/user', require('./user'))

module.exports=router.routes()