import * as _ from 'lodash'
import { AntvEleType, FieldType, RawEleType, RegroupMapType } from './type'
import Base from './base'
import { rawToAntv, combineCircle, combineBox, createMatcher, paddingZero, createRegroupFunc} from './helper'
export class Analysis<T extends RawEleType> extends Base<T>{
    private data: T[] = []
    private circle: number
    private everyCircle: number
    private regroupMap: RegroupMapType|undefined
    constructor(config: {
        circle: number,
        everyCircle: number
    }) {
        super()
        this.setConfig(config)
    }
    /**
     * 传入源数据
     * @param data 服务器返回的经过解码的原始数据
     */
    public setRawData(data: T[]) {
        this.data = data
        return this
    }
    public getRawData(): T[] {
        return this.data
    }
    /**
     * 设置转换器的参数
     * @param info 
     */
    public setConfig(info: {
        circle?: number,
        everyCircle?: number
    }) {
        this.circle = info.circle||this.circle
        this.everyCircle = info.everyCircle||this.everyCircle
        return this
    }

    /**
     * 重新分组的方法，传入的是一个分组map，无参数则删除重分组的map 
     * @param map {'OS.iOS':'苹果+安卓','OS.Android':'苹果+安卓'}
     */
    public regroup(map?:RegroupMapType){
        if(map){
            this.regroupMap = map
        }
        else{
            this.regroupMap = void(0)
        }
        return this
    }
    /**
     * 生成antv所需数据
     * @param field {Age:['0','1','3'], Sex: ['0','1']}
     */
    public extract(field?: FieldType): AntvEleType[] {
        const antvList = this.basicProcess(field)
        // 周期合并
        return combineCircle(antvList, this.circle, this.everyCircle)
    }
    /**
     * 获取箱形图
     * @param field {Age:['0','1','3'], Sex: ['0','1']}
     */
    public extractBox(field?: FieldType): AntvEleType[] {
        /* 老版本的分析系统这里是先把单个最小时间单位的相加，然后再计算箱型图指标。 */
        const antvList = combineCircle(this.basicProcess(field), 1, this.everyCircle)
        return combineBox(antvList, this.circle, this.everyCircle)
    }
    /**
     * 基本处理
     * @param field {Age:['0','1','3'], Sex: ['0','1']}
     */
    private basicProcess(field?:FieldType): AntvEleType[] {
        /* 得到筛选过的单个数据
        */
       let antvList

       // 所以第一步是合并维度，提取唯一的type
       // 有重新分组时，要传入重新分组函数，用于type的重新映射
       if(this.regroupMap){
           antvList = this.data.map(raw => rawToAntv(raw, field, createRegroupFunc(this.regroupMap as RegroupMapType)))
       }
       else{
           antvList = this.data.map(raw => rawToAntv(raw, field))
       }

       // 有筛选时，需要生成一个笛卡尔积筛选器
       if (field) {
           antvList = antvList.filter(createMatcher(field))
       }
       // 空时间点补零
       return paddingZero(antvList, field)
    }
}