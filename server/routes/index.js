/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口 /weapp/login
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态） /weapp/user
router.get('/user', validationMiddleware, controllers.user)
router.get('/upload_feedback', validationMiddleware, controllers.upload_feedback)
router.get('/upload_activity', validationMiddleware, controllers.upload_activity)
router.get('/get_city_activity', validationMiddleware, controllers.get_city_activity)
router.get('/get_province_activity', validationMiddleware, controllers.get_province_activity)
router.get('/get_activity_id', validationMiddleware, controllers.get_activity_id)
router.get('/upload_activity_id', validationMiddleware, controllers.upload_activity_id)
router.get('/get_activity_info', validationMiddleware, controllers.get_activity_info)
router.get('/get_user_info_activity', validationMiddleware, controllers.get_user_info_activity)
router.get('/upload_user_info', validationMiddleware, controllers.upload_user_info)
router.get('/upload_guider_info', validationMiddleware, controllers.upload_guider_info)
router.get('/get_guide_info', validationMiddleware, controllers.get_guide_info)
router.get('/get_guider_info', validationMiddleware, controllers.get_guider_info)
router.get('/get_user_info', validationMiddleware, controllers.get_user_info)
router.get('/get_book_info', validationMiddleware, controllers.get_book_info)
router.get('/update_guider_info', validationMiddleware, controllers.update_guider_info)
router.get('/update_user_info', validationMiddleware, controllers.update_user_info)
router.get('/get_guider_info_activity', validationMiddleware, controllers.get_guider_info_activity)
router.get('/get_search_info', validationMiddleware, controllers.get_search_info)
// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中 /weapp/upload
router.post('/upload', controllers.upload)
// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的 /weapp/tunnel
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求 /weapp/message
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

module.exports = router
