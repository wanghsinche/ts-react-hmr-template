import {LoginAction, GeneralState} from './type'

const initState:GeneralState = {
    user: ''
}

export default function reducer(state: GeneralState=initState, action:LoginAction):GeneralState{
    switch(action.type){
        case '@@Login':
        return Object.assign({}, state, {
            user: action.payload
        })
        default:
        return state
    }
}