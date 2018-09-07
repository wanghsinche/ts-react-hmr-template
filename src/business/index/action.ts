interface IChangeName {
    type: 'CHANGE_NAME',
    value: string
}

interface IChangeTime {
    type: 'CHANGE_TIME',
    value: Date
}

export function changeName(name: string): IChangeName {
    return {
        type: 'CHANGE_NAME',
        value: name
    }
}

export function changeTime(time: Date): IChangeTime {
    return {
        type: 'CHANGE_TIME',
        value: time
    }
}


export type actionTypes = IChangeName | IChangeTime