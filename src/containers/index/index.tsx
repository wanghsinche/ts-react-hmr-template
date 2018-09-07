import * as React from 'react';
import {IState} from '../../business/index/reducer';

import * as actions from '../../business/index/action';

import { connect } from 'react-redux';
import {Dispatch} from 'redux';
import {IStore} from '../../business/reducer';

interface IActions {
    changeName: (name: string) => void
    changeDate: (time: Date) => void
}

interface IProps extends IState, IActions {}

class Index extends React.Component<IProps, {tempName: string}>{
    constructor(props: IProps) {
        super(props);
        this.state = {
            tempName: ''
        }
    }
    
    public componentDidMount(){
        this.setState({
            tempName: this.props.name
        })
    }

    public clickHandle = (e: React.MouseEvent) => {
       const oriTime = this.props.time
       const newTime = new Date()
       newTime.setUTCDate(oriTime.getUTCDate() + 1)
       this.props.changeDate(newTime)
    }

    public inputHandle = (e: React.ChangeEvent) => {
        const value = (e.target as HTMLInputElement).value;
        this.props.changeName(value)
        this.setState({
            tempName: value
        })

    }

    public render() {
        const {clickHandle, inputHandle} = this
        const {tempName} = this.state
        const {time,name} = this.props
        const date = time.toUTCString()
        return (
            <div>
                <h2>Index</h2>
                <div>{date}</div>
                <button onClick={clickHandle}>+1 day</button>
                <input type="text" onChange={inputHandle} placeholder="input name" value={tempName}/>
                <div>{name}</div>
            </div>
        );
    }
}

function mapStateToProps(state: IStore):IState{
    return state.index
}
function mapDispatchToProps(dispatch: Dispatch):IActions{
    return {
        changeDate:(time:Date):void=>{
            dispatch(actions.changeTime(time))
        },
        changeName:(name:string):void=>{
            dispatch(actions.changeName(name))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);