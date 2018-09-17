import './style.css';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../business/type';
import { getData } from '../../business/service';
import { Analysis } from '../../lib/analysis';


// @antv/g2
import G2 from '@antv/g2'

import { IndexState, UpdateBson, UpdateData } from '../../business/index/type';
import { updateDataAction } from '../../business/index/action';
import { RawEleType } from '../../lib/type';

// import { lineData } from '../../mock'

interface IndexProps {
    requestData: () => void
}

type AllProps = IndexProps & IndexState

type IndexAction = UpdateBson | UpdateData 

class Index extends React.Component<AllProps, { summary: string }>{
    public static rainbow = ['red', 'blue', 'yello', 'green', 'purple', 'black']
    public chart: G2.Chart | undefined = undefined
    public chart2: G2.Chart | undefined = undefined
    public chart3: G2.Chart | undefined = undefined
    public chart4: G2.Chart | undefined = undefined
    public pie: G2.Chart | undefined = undefined
    public data: Analysis<RawEleType> = new Analysis(6, 300000)
    constructor(props: AllProps) {
        super(props);
        this.state = {
            summary: ''
        }
    }

    public componentDidMount() {
        this.props.requestData()
    }

    public componentDidUpdate(prevProps: IndexState) {
        if (this.props.data !== prevProps.data) {
            this.data.setData(this.props.data)
            this.reflesh()
        }

    }

    public createPie(summary: Array<{ name: string, value: number }>) {
        if (this.pie) {
            this.pie.destroy()
            this.pie = void (0)
        }

        this.pie = new G2.Chart({
            container: document.querySelector('#pie-div') as HTMLDivElement,
            forceFit: true
        })

        this.pie.source(summary, {
            value: {
                formatter: function formatter(val: number) {
                    return val * 100 + '%'
                }
            }
        })

        this.pie.coord('theta', {
            radius: 0.75,
            innerRadius: 0,
            startAngle: 0,
            endAngle: 2 * Math.PI
        });

        this.pie.intervalStack().position('percent').color('item').style({
            lineWidth: 1,
            stroke: '#fff'
        });

        this.pie.render()
    }


    public createChart(data: any[], container: HTMLDivElement, key:string) {
        if (this.props.data.length < 1) {
            return
        }
        if (this[key]) {
            this[key].destroy()
            this[key] = void (0)
        }

        this[key] = new G2.Chart({
            container,
            width: 800,
            height: 300
        })

        this[key].source(data, {
            time: {
                type: 'time',
                // min: 5122080*300000,
                // max: 5122368*300000,
                tickCount: 5,
                mask: 'MM-DD HH:mm'
            },
            v: {
                type: 'linear',
                nice: true,
                tickCount: 5
            }
        })
        this[key].line().position('time*v').color('type')

        this[key].render()
    }


    public reflesh = () => {
        const finalData = this.data.setCircle(6).setFilter({'OS': ['iOS', 'Android']}).extractLineData()
        this.setState({
            summary: this.data.extractSummary().reduce((am, cm) => am + '\n' + JSON.stringify(cm), '')
        })
        this.createChart(finalData, document.querySelector('#chart-div') as HTMLDivElement, 'chart')
    }

    public refleshBox = () => {
        if (this.chart4) {
            this.chart4.destroy()
            this.chart4 = void (0)
        }
        const data = this.data.extractBoxData()
        this.chart4 = new G2.Chart({
            container: 'box-div',
            forceFit: true
        });
        this.chart4.source(data,{
            time: {
                type: 'time',
                tickCount: 5,
                mask: 'MM-DD HH:mm'
            },
            range: {
                type: 'linear',
                min: 0
            }
        })
        this.chart4.schema().position('time*range').shape('box').tooltip('time*low*q1*median*q3*high').color('type')
        
        this.chart4.render();
    }



    public refleshIntegrate = () => {
        this.createChart(this.data.extractIntegrateData(), document.querySelector('#integrate-div') as HTMLDivElement, 'chart3')
    }

    public render() {
        return (
            <div className="index-container">
                <h2>Index</h2>
                <button onClick={this.reflesh}>update</button>
                <div id="chart-div" />
                <div>
                    <pre>{this.state.summary}</pre>
                </div>
                <div id="box-div" />
                <button onClick={this.refleshBox}>refleshBox</button>
                <div id="integrate-div" />
                <button onClick={this.refleshIntegrate}>refleshIntegrate</button>
            </div>
        );
    }
}

function mapStateToProps(state: AppState): IndexState {
    return state.index
}
function mapDispatchToProps(dispatch: Dispatch<IndexAction>): IndexProps {
    return {
        requestData: () => {
            getData({
                name: 'AF_DNU_5min',
                product: 'AF',
                start: 5123520,
                end: 5123808
            }).then((result) => {
                dispatch(updateDataAction(result.data.items))
            }).catch(alert)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);