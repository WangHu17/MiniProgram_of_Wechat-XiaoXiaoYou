module.exports = async (ctx, next) => {
  if (ctx.state.$wxInfo.loginState == 1) {
    const query = ctx.query
    const { mysql } = require('../qcloud')
    await mysql('guider_info').insert({ name: query.name, school: query.school, studentId: query.studentId, gender: query.gender, phonenumber: query.phonenumber, QQ: query.QQ, openId: query.openId, id_card: query.id_card, memo: query.memo, userInfo:query.userInfo })
  } else {
    ctx.state.code = -1
  }
}