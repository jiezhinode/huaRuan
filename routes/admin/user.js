const  router=require('koa-router')()


router.get('/',async  (ctx)=>{
    ctx.body = 'user'
})

router.get('/add',async  (ctx)=>{
    ctx.body = 'user add'
})

router.get('/upload',async  (ctx)=>{
    ctx.body = 'user upload '
})

router.get('/delete',async  (ctx)=>{
    ctx.body = 'user  delete'
})

module.exports=router.routes()