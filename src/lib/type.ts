export enum transformStatus { OK, FAILED }
export type MessageType = 'OK' | 'FAILED'

/**
 * 筛选列表类型
 */
export interface FieldType {
    [key: string]: string[]
}

/**
 * 输出的给antv使用的数据
 */
export interface AntvEleType {
    type: string
    v: number
    c: number
    time?: number
    [x: string]: any
}
export interface AntvMapType {
    [key:string]: AntvEleType[]
}
/**
 * 输入的原始数据格式
 */
export interface RawEleType {
    g: {
        [key: string]: string
    } // field
    v: number // value
    c: number // time
}

/**
 * 摘要格式
 */
export interface SummaryType {
    g: string[]
    v: number // value
    mean: number // 均值，老系统平均值没计算0的情况，导致偏高？
    sd: number // 标准差
    percentage: number
}

/** 重新分组的map 
 *  表示方法为 {
 *    'OS.0':'iOS，Android',
 *    'OS.1':'iOS，Android',
 *    'OS.3': '未知'
 *    }
 */
export interface RegroupMapType { 
    [k: string]: string 
}
/**
 * 维度映射函数类型
 */
export type RegroupFunc = (key:string, type:string)=>string
/**
 * 错误类型
 */
export const ErrorType = {
    NoEqualLength: '长度不相等',
    NoSameType: '维度不同',
    ZeroDivisor: '除数为零',
    DifferentTime: '时间戳不同',
    EmptyArray: '不支持空数组'
}
