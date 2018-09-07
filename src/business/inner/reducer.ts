import {actionType} from './action'

const initState = {
    num: 0
}

export type IState = typeof initState

export default function reducer(state: IState=initState, action:actionType):IState{
    switch(action.type){
        case 'CHANGE_NUM':
        return Object.assign({}, state, {
            num: state.num + action.value
        })
        default:
        return state
    }
}