const Koa = require('koa')
const app = new Koa()
const router = require('koa-router')()
const views = require('koa-views')

const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const serve = require('koa-static')
const path = require('path')
const nunjucks = require('nunjucks')

const index = require('./routes/index')

// middlewares
app.use(bodyparser())
app.use(json())
app.use(serve(path.join(__dirname, 'public')))

// handle error
onerror(app)

// setup view
app.use(views(path.join(__dirname, 'views'), {
	extension: 'html',
	map: {
		html: 'nunjucks'
	}
}))
nunjucks.configure(path.join(__dirname, 'views'), {
	autoescape: true
})

app.use(async (ctx, next) => {
	const start = new Date();
	console.log('start time>', ctx.path)
	await next();
	const ms = new Date() - start;
	console.log('end time>', ms)

})

// routes definition
router.use('*', index.routes(), index.allowedMethods());

// mount root routes
app.use(router.routes()).use(router.allowedMethods())

module.exports = app
