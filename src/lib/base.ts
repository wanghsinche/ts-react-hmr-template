import {FieldType, AntvEleType, RawEleType, SummaryType, ErrorType} from './type'
import {summary, groupDimension, antvIntegrate} from './helper'
export default abstract class Base<T extends RawEleType>{
    /**
     * 积分计算
     * @param data 
     */
    public static integrate(data:AntvEleType[]):AntvEleType[]{
        return antvIntegrate(data)
    }
    /**
     * 获取摘要
     * @param data 
     */
    public static summary(data:AntvEleType[]):SummaryType[]{
        return summary(data)
    }

    /**
     * 组合指标计算函数
     * @param a 
     * @param b 
     * @param operator 操作方法
     */
    public static doOperate<k extends AntvEleType>(a:k[], b:k[], operator: (l:k,r:k)=>k):k[]{
        if(a.length !== b.length){
            throw(new Error(ErrorType.NoEqualLength))
        }
        // 由于antv的数据都不分type，所以
        const ta = groupDimension(a)
        const tb = groupDimension(b)
        return ta.map((ele:k, i)=>{
            const rEle = tb[i] as k
            if(rEle.c !== ele.c){
                throw(new Error(ErrorType.DifferentTime))
            }
            if(rEle.type !== ele.type){
                throw(new Error(ErrorType.NoSameType))
            }
            return operator(ele, rEle)
        })
    }
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

    public abstract setRawData(data:T[]):void
    public abstract getRawData():T[]
    public abstract setConfig(config:any):this
    public abstract extract(field: FieldType):AntvEleType[]
    
}
