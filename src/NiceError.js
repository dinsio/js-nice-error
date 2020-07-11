/**
 * 自定义异常处理类
 */

import 'js-makeup'
import { EOL } from 'os'

const eol = EOL.replace('\\','\\\\')
const NiceError = function(message,options) {
    // 错误名称
    this.name = (options && options.name) ? options.name : 'NiceError'
    // 错误提示信息
    this.message = message || ''
    // 错误上下文环境信息
    this.info = (options && options.info) ? options.info : {}
    // 子错误对象
    this.cause = (options && options.cause) ? options.cause : null
    // 错误栈
    let stackInfo = (new Error).stack
    // 允许自定义 stack 传入
    if (options && options.stack !== undefined) stackInfo = options.stack
    // 将默认错误信息替换为完整错误信息链条
    stackInfo = stackInfo.replace('Error:', this.fullMessage())
    // 优化代码文件路径的显示
    stackInfo = stackInfo.replaceAll(process.cwd(),'').replaceAll('file://','')
    // 替换掉 stack 中 /NiceError.js 相关的行
    let regExp = /\s*at[\s|\S]*\(\S*\/NiceError.js:\S*\)\s/gm
    stackInfo = stackInfo.replace(regExp,eol)
    this.stack = stackInfo
}
NiceError.prototype = Object.create(Error.prototype)
NiceError.prototype.constructor = NiceError
// 递归获取完整的错误路径信息
NiceError.prototype.fullMessage = function(){
    function _getCauseMessage(ne){
        let result = undefined;
        // 如果是原生 Error 或者 NiceError
        if (ne instanceof NiceError || ne instanceof Error) result = '[' + ne.name + ']: ' + ne.message
        // 如果是没有继承 Error 原型的第三方封装错误或者其它对象
        else {
            result = '[Throw]: type = ' + Object.prototype.toString.call(ne)
            let str = JSON.stringify(ne)
            if (str.length <= 100) result = result + ', content = ' + str
        }
        // 如果有子错误则继续下潜
        if (ne.cause) result += ' <= ' + _getCauseMessage(ne.cause)
        return result
    }
    return _getCauseMessage(this)
}
// 递归获取完整的错误stack
NiceError.prototype.fullStack = function(){
    function _getFullStack(ne,first){
        let result = undefined
        let causedBy = ''
        if (!first) causedBy = 'Caused by '
        if (ne instanceof NiceError) result = causedBy + ne.stack
        else if (ne instanceof Error) result = causedBy + ne.stack.replace(ne.name,'[' + ne.name + ']').replaceAll(process.cwd(),'').replaceAll('file://','')
        // 兼容那些没有继承 Error 原型的第三方封装错误
        else if (ne.stack) result = causedBy + ne.stack.replaceAll(process.cwd(),'').replaceAll('file://','')
        else {
            // 为对象添加 stack 属性
            ne = { value: ne }
            Error.captureStackTrace(ne)
            let str = JSON.stringify(ne.value)
            let desc = '[Throw]: type = ' + Object.prototype.toString.call(ne)
            if (str.length <= 100) desc += ', content = ' + str
            let stackInfo = ne.stack.replace('Error:', desc)
            result = causedBy + stackInfo.replaceAll(process.cwd(),'').replaceAll('file://','')
            // 替换掉 stack 中 /NiceError.js 相关的行
            let regExp = /\s*at[\s|\S]*\(\S*\/NiceError.js:\S*\)\s/gm
            result = result.replace(regExp,eol)
        }
        if (ne.cause) result += EOL + _getFullStack(ne.cause)
        return result
    }
    return _getFullStack(this,true)
}
// 递归获取完整的错误上下文环境信息
NiceError.prototype.fullInfo = function(){
    function _getFullInfo(ne){
        // 递归获取子错误的信息然后合并
        let result = {}
        if (ne instanceof NiceError) {
            let keys = Object.keys(ne.info)
            for (let i=0; i<keys.length; i++) {
                let key = keys[i]
                result[key] = ne.info[key]
            }
        }
        // 如果在一个 NE 链条的不同层实例设置了同名 info，内层的会覆盖外层的
        if (ne.cause) {
            let subInfo = _getFullInfo(ne.cause)
            let keys = Object.keys(subInfo)
            for (let i=0; i<keys.length; i++) {
                let key = keys[i]
                result[key] = subInfo[key]
            }
        }
        return result
    }
    return _getFullInfo(this)
}

module.exports = NiceError