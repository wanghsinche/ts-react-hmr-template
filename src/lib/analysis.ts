import * as _ from 'lodash'
import { AntvEleType, FilterListType, RawEleType, RegroupMapType, ErrorType, SummaryType } from './type'
import { rawToAntv, combineCircle, combineBox, createMatcher, paddingZero, createRegroupFunc, summary, groupDimension, antvIntegrate } from './helper'
export class Analysis<T extends RawEleType>{
    /**
     * 除法操作符
     * @param l 左操作数
     * @param r 右操作数
     */
    public static divide<k extends AntvEleType>(l:k, r:k):k{
        if(r.v === 0){
            console.warn(ErrorType.ZeroDivisor)
            return Object.assign({},l,{
                v: 0
            })
        }
        return Object.assign({},l,{
            v: l.v/r.v
        })
    }


    private rawData: T[] = []
    private circle: number
    private everyCircle: number
    private regroupMap?: RegroupMapType
    private tempAntvList: AntvEleType[] = []
    private filter?: FilterListType
    private dirty: boolean = true
    
    constructor(circle: number, everyCircle: number) {
        this.circle = circle
        this.everyCircle = everyCircle
    }
    /**
     * 传入源数据
     * @param data 服务器返回的经过解码的原始数据
     */
    public setData(data: T[]) {
        this.rawData = data
        return this
    }

    /**
     * 复合指标计算
     * @param right 右操作数 
     * @param op 操作符
     */
    public operateWith(right: Analysis<RawEleType>, op: (l:AntvEleType,r:AntvEleType)=>AntvEleType){
        const leftV = this.getTempData()
        const rightV = right.getTempData()
        if(!_.isEqual(right.getFilter(), this.getFilter())){
            throw new Error(ErrorType.NoSameType)
        }
        if(right.getCircle() !== this.getCircle()){
            throw new Error(ErrorType.NoSameType)
        }
        if(right.getEveryCircle() !== this.getEveryCircle()){
            throw new Error(ErrorType.NoSameType)
        }
        if(rightV.length !== leftV.length){
            throw new Error(ErrorType.NoEqualLength)
        }
        
        // 由于antv的数据都不分type，所以需要先重新分组
        const ta = groupDimension(leftV)
        const tb = groupDimension(rightV)
        this.tempAntvList = _.zipWith(ta, tb, (a, b) => {
            if(a.type !== b.type){
                throw new Error(ErrorType.NoSameType)
            }
            else if (a.c !== b.c){
                throw new Error(ErrorType.DifferentTime)
            }
            else{
                return op(a, b)
            }
        })
        this.dirty = false
        return this
    }
    /**
     * 获取中间数据
     */
    public getTempData():AntvEleType[]{
        if(this.dirty){
            this.proccess()
        }
        return this.tempAntvList
    }
    /**
     * 设置周期
     * @param c 
     */
    public setCircle(c: number){
        this.circle = c
        // this.dirty = true 改变周期不用dirty
        return this
    }
    /**
     * 设置一周期等于多少毫秒
     * @param ec 
     */
    public setEveryCircle(ec: number){
        this.everyCircle = ec
        this.dirty = true
        return this
    }
    /**
     * 得到周期
     */
    public getCircle(){
        return this.circle
    }
    /**
     * 得到每周期多少ms
     */
    public getEveryCircle(){
        return this.everyCircle
    }
    /**
     * 设置分组条件
     * @param filter 
     */
    public setFilter(filter?:FilterListType){
        this.dirty = true
        this.filter = filter
        return this
    }
    public getFilter(){
        return this.filter
    }
    /**
     * 设置重新分组的映射关系，传入的是一个分组map，无参数则删除重分组的map 
     * @param map {'OS.iOS':'苹果+安卓','OS.Android':'苹果+安卓','OS.other':'其他'}
     */
    public setRegroupMap(map?: RegroupMapType) {
        if (map) {
            this.regroupMap = map
        }
        else {
            this.regroupMap = void (0)
        }
        this.dirty = true
        return this
    }


    /**
     * 生成antv折线图所需数据
     */
    public extractLineData(): AntvEleType[] {
        console.log(this.getTempData())
        return combineCircle(this.getTempData(), this.circle, this.everyCircle)
    }
    /**
     * 获取箱形图
     */
    public extractBoxData():AntvEleType[]{
        return combineBox(this.getTempData(), this.circle, this.everyCircle)
    }
    /**
     * 获取摘要
     * 老版本的摘要信息总数是按照一个完整周期来计算，而非实际的时间来计算，这会导致计算实时数据时，总体偏低
     */
    public extractSummary():SummaryType[]{
        return summary(this.extractLineData())
    }
    /**
     * 积分计算
     */
    public extractIntegrateData():AntvEleType[]{
        return antvIntegrate(this.extractLineData())
    }

    /**
     * 中间数据处理函数
     */
    private proccess() {
        /* 得到筛选过的单个数据
        */
        // 所以第一步是合并维度，提取唯一的type
        // 有重新分组时，要传入重新分组函数，用于type的重新映射
        if (this.regroupMap) {
            this.tempAntvList = this.rawData.map(raw => rawToAntv(raw, this.filter, createRegroupFunc(this.regroupMap as RegroupMapType)))
        }
        else {
            this.tempAntvList = this.rawData.map(raw => rawToAntv(raw, this.filter))
        }

        // 有筛选时，需要生成一个笛卡尔积筛选器
        if (this.filter) {
            this.tempAntvList = this.tempAntvList.filter(createMatcher(this.filter))
        }
        // 空时间点补零
        this.tempAntvList = paddingZero(this.tempAntvList, this.filter)
        // 得到最小时间单位的数据
        this.tempAntvList = combineCircle(this.tempAntvList, 1, this.everyCircle)
        // 完成基本处理了，不再dirty
        this.dirty = false
        return this
    }
}