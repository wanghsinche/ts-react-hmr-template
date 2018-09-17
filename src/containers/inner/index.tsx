import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../business/type';
import { getComposite } from '../../business/service';
import { Analysis } from '../../lib/analysis';


// @antv/g2
import G2 from '@antv/g2'

import { InnerState, UpdateComposite } from '../../business/inner/type';
import { updateCompositeAction } from '../../business/inner/action';
import { RawEleType } from '../../lib/type';


interface IndexProps {
    requestComposite: () => void
}

type AllProps = IndexProps & InnerState

type IndexAction = UpdateComposite

class Index extends React.Component<AllProps, { summary: string }>{
    public static rainbow = ['red', 'blue', 'yello', 'green', 'purple', 'black']
    public chart: G2.Chart | undefined = undefined
    public chart2: G2.Chart | undefined = undefined
    public chart3: G2.Chart | undefined = undefined
    public chart4: G2.Chart | undefined = undefined
    public pie: G2.Chart | undefined = undefined
    public c1: Analysis<RawEleType> = new Analysis(1, 24 * 60 * 60 * 1000)
    public c2: Analysis<RawEleType> = new Analysis(1, 24 * 60 * 60 * 1000)
    constructor(props: AllProps) {
        super(props);
        this.state = {
            summary: ''
        }
    }

    public componentDidMount() {
        this.props.requestComposite()
    }

    public componentDidUpdate(prevProps: InnerState) {

        if (this.props.composite1 !== prevProps.composite1) {
            this.c1.setData(this.props.composite1)
            this.c2.setData(this.props.composite2)
            this.refleshComposite()
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


    public refleshBox = () => {
        if (this.chart4) {
            this.chart4.destroy()
            this.chart4 = void (0)
        }
        const data = this.c1.extractBoxData()
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

    public refleshComposite = () => {
        const c1c2 = this.c1.operateWith(this.c2, Analysis.divide).extractLineData()
        this.createChart(c1c2, document.querySelector('#com-div') as HTMLDivElement, 'chart2')
    }

    public refleshIntegrate = () => {
        this.createChart(this.c1.extractIntegrateData(), document.querySelector('#integrate-div') as HTMLDivElement, 'chart3')
    }

    public render() {
        return (
            <div className="index-container">
                <h2>Index</h2>
                <div id="chart-div" />
                <div>
                    <pre>{this.state.summary}</pre>
                </div>
                <div id="box-div" />
                <button onClick={this.refleshBox}>refleshBox</button>
                <button onClick={this.refleshComposite}>refleshComposite</button>
                <div id="com-div" />
                <div id="integrate-div" />
                <button onClick={this.refleshIntegrate}>refleshIntegrate</button>
            </div>
        );
    }
}

function mapStateToProps(state: AppState): InnerState {
    return state.inner
}
function mapDispatchToProps(dispatch: Dispatch<IndexAction>): IndexProps {
    return {
        requestComposite: () => {
            getComposite({
                product: 'AF',
                start: 17783,
                end: 17791
            }, 'AF_total_logintimes_1day', 'AF_DAU_1day_all')
                .then(([result1, result2]) => {
                    dispatch(updateCompositeAction({
                        composite1: result1.data.items,
                        composite2: result2.data.items
                    }))
                })
                .catch(alert)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);