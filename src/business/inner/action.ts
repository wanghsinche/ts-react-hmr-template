interface IChangeNum{
    type: 'CHANGE_NUM',
    value: number
}

export function changeNum(value:number):IChangeNum {
    return {
        type:'CHANGE_NUM',
        value
    }
}

export type actionType = IChangeNum


