import { Action } from 'redux'

export interface InnerState{
    num: number
}

export interface ChangeNumAction extends Action{
    type: '@@inner/CHANGE_NUM'
    payload: number
}
