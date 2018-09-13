import * as _ from 'lodash'
/**
 * 笛卡儿积，抄自 http://stackoverflow.com/questions/1266402#5626737
 * @param arg 
 */
export function cartesianProductOf(...arg: any[]) {
    return Array.prototype.reduce.call(arg, (a: any[], b: any[]) => {
        const ret: any[] = [];
        a.forEach((x) => {
            b.forEach((y) => {
                ret.push(x.concat([y]));
            });
        });
        return ret;
    }, [[]]);
};



/**
 * 总体方差
 * @param aArray 
 */
export function vari(aArray:number[]) {
    const average = _.mean(aArray);
    const sigmaElements = (value:number)=>{
        return Math.pow(value - average, 2);
    };
    return _.mean(aArray.map(sigmaElements));
};

/**
 * 总体标准差
 * @param aArray 
 */
export function devi(aArray:number[]) {
    return Math.sqrt(vari(aArray));
};

/**
 * 积分
 * @param data 
 */
export function integrate<T, K extends keyof T>(data: T[], y:K, addFunc:(a:T, b:T)=>T): T[]{
    if(data.length < 1){
        return data
    }
    let prev:T
    return data.map((v, i)=>{
        if(i===0){
            prev = data[0]
        }
        else{
            prev = addFunc(prev, v)
        }
        return Object.assign({}, v, prev)
    })
}


/**
 *  计算四分距，抄自老代码
 * https://zh.wikipedia.org/zh-cn/四分差
 * 输入 iqr([6, 47, 49, 15, 42, 41, 7, 39, 43, 40, 36])
 * 输出 [15, 43, 6, 49]
 * 跟维基百科示例一致
 * @param originValues 
 */
export function iqr (originValues:number[]) {

    if (!originValues || originValues.length === 0) {
        return null;
    }

    const values = originValues.sort((a, b) => a - b);
    const length = values.length;

    function find (index:number) {
        let v;
        if (_.isInteger(index)) {
            v = (values[index - 1] + values[index]) / 2;
        } else {
            index = Math.ceil(index);
            v = values[index - 1];
        }
        return v;
    };

    // median 其实就是中位数
    const q1 = find(length / 4);
    const median = find(length / 2)
    const q3 = find((3 * length) / 4);
    const high = _.max(values);
    const low = _.min(values);
    return {q1, median, q3, low, high};
};