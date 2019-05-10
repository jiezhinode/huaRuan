const router=require('koa-router')()

router.get('/',async  (ctx)=>{
    ctx.body = '订单信息'
})


module.exports=router.routes()