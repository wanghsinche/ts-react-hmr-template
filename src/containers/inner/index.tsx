import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../business';

import {changeNumAction} from '../../business/inner/action';
import {ChangeNumAction, InnerState} from '../../business/inner/type';

interface InnerProps {
    onAdd:()=>void
} 

type AllProps = InnerProps & InnerState
type InnerAction = ChangeNumAction

class Inner extends React.Component<AllProps>{
    public render(){
        const {num} = this.props
        return (
            <div>
                <div>{num}</div>
                <button onClick={this.props.onAdd}>+1</button>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch:Dispatch<InnerAction>):InnerProps{
    return {
        onAdd:()=>{
            dispatch(changeNumAction(1))
        }
    }
}

export default connect((state: AppState):InnerState=>state.inner, mapDispatchToProps)(Inner);