const router=require('koa-router')(),
      User = require('../../module/user').user,
      fs = require('fs'),
      path = require('path'),
      crypto = require('crypto'),
      url = require('url')

//登陆权限判断
router.use( async (ctx,next) =>{
    let pathname = ctx.url
    if( pathname=== '/user/checkUserName' ||  pathname==='/user/login'||pathname==='/user/register'||pathname==='/user/loginCheck'||pathname==='/user/doRegister'){
      await next()
    }else {
        if(ctx.session.userinfo&&ctx.session.userinfo.type==='user'){
            await  next()
        }else {
            await ctx.redirect('/user/login')
        }
    }
})

router.get('/',async (ctx)=>{
   await ctx.render('user/userLogin')
})

router.get('/login',async (ctx)=> {
    await  ctx.render('user/userLogin')

})

router.get('/register',async (ctx)=>{
    await   ctx.render('user/register')
})

router.post('/loginCheck',async (ctx)=> {
   let {username,password} = ctx.request.body
   function result(){
       return new Promise(( resolve , reject )=>{
           User.findOne({
               username,
               password
           }).then((userinfo)=>{
               if(userinfo){
                   //登陆成功
                   let data = {
                       username : userinfo.username,
                       type : userinfo.type
                   }
                   ctx.session.userinfo = data
                   resolve()
               }else {
                   reject()
               }
           })
       })
   }
   return result().then(()=>{
       console.log('登陆成功');
       ctx.redirect('/user/goods')
   }).catch(()=>{
       console.log('登陆失败');
       ctx.redirect('/user/login')
   })


})

router.get('/loginout', async (ctx)=> {

    ctx.session.userinfo = null
            ctx.redirect('/user/login')
})

router.post('/doRegister',async (ctx)=>{
    let {username,password,passwordRe}=ctx.request.body
    if(!username||!password){
        ctx.redirect('/user/register')
    }else if(passwordRe!==password) {
        ctx.redirect('/user/register')
    }



    let file = await  ctx.request.files.files

    if(file.size!==0){
        //创建可读流
        const  readStream = fs.createReadStream(file.path)

        let filePath = path.join(__dirname,'public/upload/userImg/').replace('routes\\user\\','')+`${file.name}`

        //创建写入流
        const writeStream = fs.createWriteStream(filePath)

        // 可读流通过管道写入可写流
        readStream.pipe(writeStream)
        let user = new User({
            username,
            password,
            img:filePath.replace('E:\\huaruan\\public',''),
            type: 'user',
            status:true
        })

        let result = ()=>{
            return new Promise((resolve, reject)=>{
                user.save( function (err, user) {
                    if(err) reject(err)
                    resolve(user)
                })

            })

        }

        return result().then(()=>{
            ctx.redirect('/user/login')
        })
    }else {
        await  ctx.redirect('/user/register')
    }
})

router.get('/userInfo',async (ctx)=>{
    let username = ctx.session.userinfo.username

    let userInfo = ()=>{
        return new Promise((resolve,reject)=>{
            User.find({username},(err,result)=>{
                if(err){
                    reject(err)
                }
                resolve(result)
            })
        })
    }

    return userInfo()
                     .then(
                            data=>{
                                let info = {
                                    username:data[0].username,
                                    password:data[0].password,
                                    img:data[0].img
                                }
                                ctx.render('user/userinfo',{info})
                                  },
                            err=>{ console.log(err)}
                          )

})

router.post('/userInfo',async (ctx)=>{
    let oldName = ctx.session.userinfo.username
    let {password} = ctx.request.body
    let file = await  ctx.request.files.pic
    let edit = ()=> {
        return new Promise((resolve,reject) => {
            if (file.size !== 0) {
                //创建可读流
                const readStream = fs.createReadStream(file.path)
                let filePath = path.join(__dirname, 'public/upload/userImg/').replace('routes\\user\\', '') + `${file.name}`
                //创建写入流
                const writeStream = fs.createWriteStream(filePath)
                // 可读流通过管道写入可写流
                readStream.pipe(writeStream)

                let userInfo = {
                    password,
                    img: filePath.replace('E:\\huaruan\\public', '')
                }
                resolve(userInfo)
            } else {
                let userInfo = {
                    password
                }
                resolve(userInfo)
            }
        })

    }
    return edit().then((data)=>{
        User.updateOne({username:oldName},{$set:data},(err,s)=>{
            if(err){
                return Promise.reject(err)
            }
            return Promise.resolve()
        })
    })
    .then(
        ()=>{ctx.redirect('/user/userInfo')},
        err=>{ console.log(err)}
         )

})

router.post('/checkUserName',async (ctx)=>{
    let name = await  User.find({username:ctx.request.body.name})
    console.log(name);
    if(name.length!==0){
        ctx.body = '用户已存在'
    }else {
        ctx.body = ''
    }

})



router.use('/goods', require('./goods'))
router.use('/orders', require('./orders'))
module.exports=router.routes()