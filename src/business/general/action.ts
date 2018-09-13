import {LoginAction} from './type'

export function loginAction(value:string):LoginAction {
    return {
        type:'@@Login',
        payload: value
    }
}

