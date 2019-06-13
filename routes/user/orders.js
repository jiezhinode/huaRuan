const router=require('koa-router')()

router.get('/',async  (ctx)=>{
     ctx.render('user/orders')
})


module.exports=router.routes()