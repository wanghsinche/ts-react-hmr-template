import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../business/type';

import {LoginAction, GeneralState} from '../../business/general/type';
import {loginAction} from '../../business/general/action'

interface InnerProps {
    login:()=>void
} 

type AllProps = InnerProps & GeneralState


class Inner extends React.Component<AllProps>{
    public render(){
        const {user} = this.props
        return (
            <div>
                <div>{user}</div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch:Dispatch<LoginAction>):InnerProps{
    return {
        login:()=>{
            dispatch(loginAction('1'))
        }
    }
}

export default connect((state: AppState):GeneralState=>state.general, mapDispatchToProps)(Inner);