import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../business';

import { IndexState, ChangeNameAction, ChangeTimeAction } from '../../business/index/type';
import * as actions from '../../business/index/action';

interface IndexProps {
    changeName: (name: string) => void
    changeDate: (time: Date) => void
}

type AllProps = IndexProps & IndexState

type IndexAction = ChangeNameAction | ChangeTimeAction

class Index extends React.Component<AllProps, { tempName: string }>{
    constructor(props: AllProps) {
        super(props);
        this.state = {
            tempName: ''
        }
    }

    public componentDidMount() {
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
        this.setState({
            tempName: value
        })
        this.props.changeName(value)
    }

    public render() {
        const { clickHandle, inputHandle } = this
        const { tempName } = this.state
        const { time, name } = this.props
        const date = time.toUTCString()
        return (
            <div>
                <h2>Index</h2>
                <div>{date}</div>
                <button onClick={clickHandle}>+1 day</button>
                <input type="text" onChange={inputHandle} placeholder="input name" value={tempName} />
                <div>{name}</div>
            </div>
        );
    }
}

function mapStateToProps(state: AppState): IndexState {
    return state.index
}
function mapDispatchToProps(dispatch: Dispatch<IndexAction>): IndexProps {
    return {
        changeDate: (time: Date): void => {
            dispatch(actions.changeTimeAction(time))
        },
        changeName: (name: string): void => {
            dispatch(actions.changeNameAction(name))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);