module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    await mysql('user_info').insert({ name: query.name, school: query.school, studentId: query.studentId, gender: query.gender, phonenumber: query.phonenumber, QQ: query.QQ, openId: query.openId, activity_id: query.activity_id, id_card: query.id_card, userInfo: query.userInfo, memo: query.memo})
  } else {
    ctx.state.code = -1
  }
}