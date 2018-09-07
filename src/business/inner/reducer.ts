import {ChangeNumAction, InnerState} from './type'

const initState:InnerState = {
    num: 0
}

export default function reducer(state: InnerState=initState, action:ChangeNumAction):InnerState{
    switch(action.type){
        case '@@inner/CHANGE_NUM':
        return Object.assign({}, state, {
            num: state.num + action.payload
        })
        default:
        return state
    }
}