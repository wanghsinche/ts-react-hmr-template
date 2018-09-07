import { actionTypes } from './action';

const defaultState = {
    name: '',
    time: new Date()
}

export type IState = typeof defaultState


export default function reducer(state: IState = defaultState, action: actionTypes): IState {
    switch (action.type) {
        case 'CHANGE_NAME':
            return Object.assign({}, state, {
                name: action.value
            })
        case 'CHANGE_TIME':
            return Object.assign({}, state, {
                time: action.value
            })
        default:
            return state
    }
}