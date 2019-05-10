const router=require('koa-router')()


router.get('/',async  (ctx)=>{
    ctx.body = 'goods'
})

router.get('/add',async  (ctx)=>{
    ctx.body = 'goods add'
})

router.get('/upload',async  (ctx)=>{
    ctx.body = 'goods upload '
})

router.get('/delete',async  (ctx)=>{
    ctx.body = 'goods  delete'
})

module.exports=router.routes()