export function changeName(name:string){
    return{
        type: 'CHANGE_NAME',
        value: name
    }
}

export function changeTime(time:Date){
    return{
        type: 'CHANGE_TIME',
        value: time
    }
}