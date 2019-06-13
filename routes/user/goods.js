const router=require('koa-router')(),
    Goods = require('../../module/user').goods,
    fs = require('fs'),
    path  = require('path')

router.get('/',async  (ctx)=>{
    let username = ctx.session.userinfo.username
    let result = await  Goods.find({username}).sort({status: 1})
    await  ctx.render('user/goodsList',{username,result})

})

router.get('/add',async  (ctx)=>{
    ctx.render('user/goodsAdd')
})

router.post('/add',async  (ctx)=>{
    let {goodsName,goodsPrice,goodsContent,optionsRadios} = ctx.request.body
    let files = ctx.request.files.pic
    let img = []
    files.map((value,index)=>{
        if(files[index].size!==0) {
            //创建可读流
            const readStream = fs.createReadStream(files[index].path)
            let filePath = path.join(__dirname, 'public/upload/userImg/').replace('routes\\user\\', '') + `${files[index].name}`
            //创建写入流
            const writeStream = fs.createWriteStream(filePath)
            // 可读流通过管道写入可写流
            readStream.pipe(writeStream)
            img.push(filePath.replace('E:\\huaruan\\public',''))
        }
    })


    let  goods = new Goods({
         username :ctx.session.userinfo.username ,
         goodsName,
         img ,
         goodsContent,
         goodsPrice,
         type : optionsRadios,
         uploadTime : new Date().toLocaleString(),
     })

     let result=()=>{
        return new Promise((resolve, reject)=>{
            goods.save( function (err, user) {
                if(err) reject(err)
                resolve(user)
            })

        })

    }
    return result().then(()=>{
        ctx.redirect('/user/goods/')
    },()=>{
        console.log('上传失败');
    })


})

router.get('/infomation/:id' ,async (ctx) =>{
    await Goods.findById(ctx.params.id.replace('"','').replace('"',''),(err,result)=>{
        if(err) {
            console.log('err');
        }
        ctx.render('user/goodsInfo',{result})
    })
})

router.get('/edit/:id',async  (ctx)=>{

    await Goods.findById(ctx.params.id.replace('"','').replace('"',''),(err,result)=>{
        if(err) {
            console.log('err');
        }
        ctx.render('user/goodsEdit',{result})
    })


})

router.post('/edit/:id',async  (ctx)=>{

    let {goodsName,goodsPrice,goodsContent,optionsRadios} = ctx.request.body
    let files = ctx.request.files.pic

    let quirty = async ()=>{
        let img = await Goods.findById({_id:ctx.params.id.replace('"','').replace('"','')},{img:1})
        return img.img
    }
    return quirty().then((data)=>{
        let img = data
        files.map((value,index)=>{
                  if(files[index].size!==0) {
                      //创建可读流
                      const readStream = fs.createReadStream(files[index].path)
                      let filePath = path.join(__dirname, 'public/upload/userImg/').replace('routes\\user\\', '') + `${files[index].name}`
                      //创建写入流
                      const writeStream = fs.createWriteStream(filePath)
                      // 可读流通过管道写入可写流
                      readStream.pipe(writeStream)
                      img[index]= filePath.replace('E:\\huaruan\\public','')
                  }
          })
        return Promise.resolve(img)
    }).then((data)=>{
        let ob = {
            goodsName,
            img:data,
            goodsContent,
            goodsPrice,
            type : optionsRadios,
        }

        Goods.updateOne({_id:ctx.params.id.replace('"','').replace('"','')},{$set:ob},(err)=>{
            if(err){
               return Promise.reject(err)
            }
               return Promise.resolve()
        })

    })
  .then(()=>{
        ctx.redirect('/user/goods')
    })
  .catch((err)=>{
            console.log(err);
        })

})

router.get('/delete/:id',async  (ctx)=>{
   let del = ()=>{
      return new Promise((resolve,reject)=>{
           Goods.updateOne({_id:ctx.params.id.replace('"','').replace('"','')},{$set:{isDel:true}},(err)=>{
               if(err){
                   reject(err);
               }
                resolve()
           })
       })
    }
    return del().then(()=>{
        ctx.redirect('/user/goods/')
    }).catch((err)=>{
        console.log(err);
    })

})


module.exports=router.routes()