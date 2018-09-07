import {ChangeNumAction} from './type'

export function changeNumAction(value:number):ChangeNumAction {
    return {
        type:'@@inner/CHANGE_NUM',
        payload: value
    }
}

