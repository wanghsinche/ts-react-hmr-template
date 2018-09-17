import { transformStatus, MessageType, FilterListType, RawEleType, AntvEleType, SummaryType, RegroupFunc, RegroupMapType, ErrorType } from './type'
import { cartesianProductOf, devi, integrate, iqr } from './math'
import * as _ from 'lodash'
/**
 * 给axios用的大文件解码函数
 * @param data 
 */
export function transformSearchBlobResponse(data: string): { code: transformStatus, message: MessageType, error?: Error, items?: any[] } {
    // 普通的 json 格式，表示有可能出现错误了
    if (data[0] === '{') {
        return JSON.parse(data)
    }

    // 处理自定义的格式
    const items = []
    try {
        let start = 0
        while (true) {
            const index = data.indexOf('{', start)
            if (index === -1) {
                break
            }
            const offset = parseInt(data.slice(start, index), 16)
            start = index + offset;
            items.push(JSON.parse(data.slice(index, start)))
        }
    } catch (e) {
        return { message: 'FAILED', error: e, code: transformStatus.FAILED }
    }
    return { items, message: 'OK', code: transformStatus.OK }
}

/**
 * 由映射表得到映射函数
 * @param map 维度映射表
 */
export function createRegroupFunc(map: RegroupMapType): RegroupFunc {
    return (key: string, type: string) => {
        const kk = `${key}.${type}`
        return map[kk] || type
    }
}

/**
 * 原始数据转换为antv格式
 * @param ele 原始数据
 * @param field 筛选列表
 * @param mapFunc 维度映射函数
 */
export function rawToAntv(ele: RawEleType, field?: FilterListType, mapFunc?: (key: string, type: string) => string): AntvEleType {
    // 把筛选指标合并，作为type
    let type = ''
    if (field) {
        type = _.keys(field).map(k => {
            if (mapFunc) {
                return mapFunc(k, ele.g[k])
            }
            else {
                return ele.g[k]
            }
        }).join('&')
    }
    else {
        type = 'all'
    }
    return {
        v: ele.v,
        c: ele.c,
        type
    }
}



/**
 * 创建筛选器
 * @param field 
 */
export function createMatcher(field: FilterListType) {
    const ii = _.keys(field).map(k => field[k])
    const filterList = cartesianProductOf(...ii).map((it: string[]) => it.join('&'))
    return (ele: AntvEleType) => {
        return filterList.indexOf(ele.type) > -1
    }
}

/**
 * 缺失数据补零
 * 由于接下来还有不依赖有序数据的合并环节，所以实际应该没问题
 * 所以这里直接填充没问题
 * @param oriData 
 */
export function paddingZero(oriData: AntvEleType[], field?: FilterListType): AntvEleType[] {
    if (oriData.length < 1) {
        return []
    }
    let possibleType = []
    if (field) {
        const ii = _.keys(field).map(k => field[k])
        possibleType = cartesianProductOf(...ii).map((it: string[]) => it.join('&'))
    }
    else {
        possibleType = ['all']
    }

    // const possibleType = _.uniqBy(oriData, 'type').map(ele => ele.type)
    const start = (_.minBy(oriData, o => o.c) || oriData[0]).c
    const end = (_.maxBy(oriData, o => o.c) || oriData[0]).c

    const zeroList: AntvEleType[] = []
    let current = start
    let oriIndex = 0

    // 两个数组merge起来
    while (current <= end) {
        Array.prototype.push.apply(zeroList, possibleType.map((type: string) => {
            return {
                c: current,
                v: 0,
                type
            }
        }))
        // 把原来没超出的也塞进去
        while (oriIndex < oriData.length && oriData[oriIndex].c <= current) {
            zeroList.push({
                c: oriData[oriIndex].c,
                v: oriData[oriIndex].v,
                type: oriData[oriIndex].type
            })
            oriIndex++
        }
        current++
    }
    return zeroList
}

/**
 * 周期合并和时间转换，默认5min，即一个周期，相同时间的v相加，相同时间可以由整除来解决
 * 函数如果一开始改成就是单独维度，时间有序数组，则可以优化，
 * 现在先用简单的版本，即多维度的周期合并, 300000ms即5min
 * @param data 
 * @param circle 
 * @param everyCircle 
 */
export function combineCircle(data: AntvEleType[], circle: number = 1, everyCircle: number = 300000): AntvEleType[] {
    circle = Math.max(Math.floor(circle), 1)
    const minEle = _.minBy(data, 'c')
    const startTime = minEle ? minEle.c : 0
    const map = new Map()
    let tempEle: AntvEleType
    let tempKey: string
    let tempTime: number
    // 同维度相加
    data.forEach(ele => {
        tempTime = Math.floor((ele.c - startTime) / circle)
        tempKey = tempTime + '|' + ele.type
        
        tempEle = map.get(tempKey)
        if (!tempEle) {
            tempEle = {
                c: ele.c,
                v: ele.v,
                time: (startTime + tempTime * circle) * everyCircle, // 再把时间弄成时间戳
                type: ele.type
            }
            map.set(tempKey, tempEle)
        }
        else {
            tempEle.v += ele.v
            // 引用不用set
        }
    })
    return Array.from(map.values())
}
/**
 * 原始antv数组到箱型图的合并函数
 * 老版本的分析系统这里是先把单个最小时间单位的相加，然后再计算箱型图指标。
 * 所以在这个函数之前先进行最小时间单位的合并处理
 * @param data 
 * @param circle 
 * @param everyCircle 
 */
export function combineBox(data: AntvEleType[], circle: number = 1, everyCircle: number = 300000): AntvEleType[] {
    circle = Math.max(Math.floor(circle), 1)
    const minEle = _.minBy(data, 'c')
    const startTime = minEle ? minEle.c : 0
    const map = new Map()
    let tempEle: AntvEleType
    let tempKey: string
    let tempTime: number

    data.forEach(ele => {
        tempTime = Math.floor((ele.c - startTime) / circle)
        tempKey = tempTime + '|' + ele.type
        tempEle = map.get(tempKey)

        if (!tempEle) {
            tempEle = {
                v: ele.v,
                c: ele.c,
                vls: [],
                time: (startTime + tempTime * circle) * everyCircle, // 再把时间弄成时间戳
                type: ele.type
            }
            map.set(tempKey, tempEle)
        }
        // 既然是引用关系
        tempEle.vls.push(ele.v)
    })
    return Array.from(map.values()).map(ele => {
        const p = iqr(ele.vls) || { low: undefined, q1: undefined, median: undefined, q3: undefined, high: undefined }
        const range = [p.low, p.q1, p.median, p.q3, p.high]
        // 删除无用的数组
        ele.vls = ele.vls.sort()
        // delete ele.vls
        return Object.assign(ele, p, { range })
    })
}

/**
 * 抽取摘要
 * @param data 
 */
export function summary(data: AntvEleType[]): SummaryType[] {
    const total = data.reduce((am, cm) => am + cm.v, 0)
    const typeGroup = _.groupBy(data, 'type')
    return _.keys(typeGroup).map(type => {
        const numList = typeGroup[type].map(ele => ele.v)
        const v = _.sum(numList)
        return {
            g: type.split('&'),
            v,
            mean: _.mean(numList),
            sd: devi(numList),
            percentage: v / total
        }
    })
}
/**
 * 按类型整理数据，防止两个指标相互操作时错乱
 * @param data 
 */
export function groupDimension(data: AntvEleType[]): AntvEleType[] {
    const grp = _.groupBy(data, 'type')
    return _.keys(grp).sort().map(k => grp[k]).reduce((pre, cur) => pre.concat(cur))
}

/**
 * 积分
 * @param data 
 */
export function antvIntegrate(data: AntvEleType[]): AntvEleType[] {

    const grp = _.groupBy(data, 'type')
    function addFunc(a: AntvEleType, b: AntvEleType) {
        if (a.type !== b.type) {
            throw (new Error(ErrorType.NoSameType))
        }
        return Object.assign({}, b, { v: a.v + b.v })
    }
    return _.keys(grp).sort().map(k => integrate<AntvEleType, keyof AntvEleType>(grp[k], 'v', addFunc)).reduce((pre, cur) => pre.concat(cur))

}

