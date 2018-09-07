import {ChangeNameAction, ChangeTimeAction} from './type'
export function changeNameAction(name: string): ChangeNameAction {
    return {
        type: '@@index/CHANGE_NAME',
        payload: name
    }
}

export function changeTimeAction(time: Date): ChangeTimeAction {
    return {
        type: '@@index/CHANGE_TIME',
        payload: time
    }
}
