import { Action } from 'redux'

export interface GeneralState{
    user: string
}

export interface LoginAction extends Action{
    type: '@@Login'
    payload: string
}
