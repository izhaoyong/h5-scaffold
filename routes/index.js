const router = require('koa-router')()


router.get('/', async function (ctx, next) {
	// 直接返回view目录下的某个文件，这个文件是服务端渲染的
	await ctx.render('pages/reflow/www/index.html', {})


	// ctx.body = 'Hello World';
	// 或者直接返回数据
});





module.exports = router
