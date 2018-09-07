import * as React from 'react';
import {connect} from 'react-redux';
import {Dispatch} from 'redux';
import {changeNum} from '../../business/inner/action';
import {IState} from '../../business/inner/reducer';
import {IStore} from '../../business/reducer';

interface IAction {
    onAdd:()=>void
} 
interface IProps extends IAction, IState{

}

class Inner extends React.Component<IProps>{
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

function mapDispatchToProps(dispatch:Dispatch):IAction{
    return {
        onAdd:()=>{
            dispatch(changeNum(1))
        }
    }
}

export default connect((state: IStore):IState=>state.inner, mapDispatchToProps)(Inner);