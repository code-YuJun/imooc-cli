/**
 * npmlog 定制化封装，让日志输出更符合特定项目
 */
const log = require('npmlog')

// 动态设置日志级别
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'

// 定制日志前缀
log.heading = 'imooc' // 自定义头部

// 添加自定义日志级别
log.addLevel('success', 2000, { fg: 'green', bold: true }) // 自定义success日志
log.addLevel('notice', 2000, { fg: 'blue', bg: 'black' }) // 自定义notice日志

/**
 * log.success('init', '项目创建成功！');
 * log.notice('update', '发现新版本，建议更新');
 * log.info('check', '正在检查环境...');
 */

module.exports = log
