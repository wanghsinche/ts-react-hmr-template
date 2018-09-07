import {Action} from 'redux';

export interface IndexState{
    name: string
    time: Date
}

export interface ChangeNameAction extends Action{
    type:'@@index/CHANGE_NAME',
    payload: string
}

export interface ChangeTimeAction extends Action{
    type: '@@index/CHANGE_TIME',
    payload: Date
}

