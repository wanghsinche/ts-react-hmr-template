import './style.css';
import * as React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { AppState } from '../../business/type';
import { getData, getComposite } from '../../business//service';
import { SingleData } from '../../lib/single';


// @antv/g2
import G2 from '@antv/g2'

import { IndexState, UpdateBson, UpdateData, UpdateComposite } from '../../business/index/type';
import { updateDataAction, updateCompositeAction } from '../../business/index/action';
import { RawEleType } from '../../lib/type';

// import { lineData } from '../../mock'

interface IndexProps {
    requestData: () => void,
    requestComposite: () => void
}

type AllProps = IndexProps & IndexState

type IndexAction = UpdateBson | UpdateData | UpdateComposite

class Index extends React.Component<AllProps, { summary: string }>{
    public static rainbow = ['red', 'blue', 'yello', 'green', 'purple', 'black']
    public chartContainer: HTMLDivElement | undefined = undefined
    public pieContainer: HTMLDivElement | undefined = undefined
    public chart: G2.Chart | undefined = undefined
    public chart2: G2.Chart | undefined = undefined
    public chart3: G2.Chart | undefined = undefined
    public chart4: G2.Chart | undefined = undefined
    public pie: G2.Chart | undefined = undefined
    public extractedData: SingleData<RawEleType> = new SingleData({
        circle: 12, everyCircle: 300000
    })
    public composite1Data: SingleData<RawEleType> = new SingleData({
        circle: 1, everyCircle: 24 * 60 * 60 * 1000
    })
    public composite2Data: SingleData<RawEleType> = new SingleData({
        circle: 1, everyCircle: 24 * 60 * 60 * 1000
    })
    constructor(props: AllProps) {
        super(props);
        this.state = {
            summary: ''
        }
    }

    public componentDidMount() {
        this.props.requestData()
        this.props.requestComposite()
    }

    public componentDidUpdate(prevProps: IndexState) {
        if (this.props.data !== prevProps.data) {
            const finalData = this.extractedData.setRawData(this.props.data).setConfig({
                circle: 6
            })
                .regroup({
                    'mm_utype.0': '无法获取，游客',
                    'mm_utype.1': '无法获取，游客',
                    'mm_utype.2': '手机',
                    'mm_utype.3': '陌陌号'
                })
                // .extract({
                //     'mm_utype': ['无法获取，游客']
                // })
                .extract()
            this.setState({
                summary: SingleData.summary(finalData).reduce((am, cm) => am + '\n' + JSON.stringify(cm), '')
            })
            this.createChart(finalData, (this.chartContainer as HTMLDivElement), this.chart)

        }

        if (this.props.composite1 !== prevProps.composite1) {
            this.refleshComposite()
        }

    }

    public createPie(summary: Array<{ name: string, value: number }>) {
        if (this.pie) {
            this.pie.destroy()
            this.pie = void (0)
        }

        this.pie = new G2.Chart({
            container: this.pieContainer,
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


    public createChart(data: any[], container: HTMLDivElement, chart?: G2.Chart) {
        if (this.props.data.length < 1) {
            return
        }
        if (chart) {
            chart.destroy()
            chart = void (0)
        }

        chart = new G2.Chart({
            container,
            width: 800,
            height: 300
        })

        chart.source(data, {
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
        chart.line().position('time*v').color('type')

        chart.render()
    }

    public bindRef = (c: HTMLDivElement) => {
        this.chartContainer = c
    }
    public bindPieRef = (c: HTMLDivElement) => {
        this.pieContainer = c
    }

    public reflesh = () => {
        this.props.requestData()
    }

    public refleshBox = () => {
        if (this.chart4) {
            this.chart4.destroy()
            this.chart4 = void (0)
        }
        const data = this.extractedData.extractBox({ 'OS': ['iOS','Android'] })
        console.log(data)
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
        .style({
            stroke: '#545454',
            fill: '#1890FF',
            fillOpacity: 0.3
        });
        this.chart4.render();
    }

    public refleshComposite = () => {
        const c1 = this.composite1Data.setRawData(this.props.composite1).setConfig({ circle: 3 }).extract({ 'Level': ['2', '1'], 'OS': ['Android', 'iOS'] })
        const c2 = this.composite2Data.setRawData(this.props.composite2).setConfig({ circle: 3 }).extract({ 'Level': ['2', '1'], 'OS': ['Android', 'iOS'] })
        const c1c2 = SingleData.doOperate(c1, c2, SingleData.divide)
        this.createChart(c1c2, this.pieContainer as HTMLDivElement, this.chart2)
    }

    public refleshIntegrate = () => {
        const c1 = this.composite1Data.setRawData(this.props.composite1).setConfig({ circle: 3 }).extract({ 'Level': ['2', '1'], 'OS': ['Android', 'iOS'] })
        const c2 = this.composite2Data.setRawData(this.props.composite2).setConfig({ circle: 3 }).extract({ 'Level': ['2', '1'], 'OS': ['Android', 'iOS'] })
        const c1c2 = SingleData.doOperate(c1, c2, SingleData.divide)
        this.createChart(SingleData.integrate(c1c2), document.querySelector('#integrate-div') as HTMLDivElement, this.chart3)
    }

    public render() {
        return (
            <div className="index-container">
                <h2>Index</h2>
                <button onClick={this.reflesh}>update</button>
                <div className="chart-div" ref={this.bindRef} />
                <div>
                    <pre>{this.state.summary}</pre>
                </div>
                <div id="box-div" />
                <button onClick={this.refleshBox}>refleshBox</button>
                <button onClick={this.refleshComposite}>refleshComposite</button>
                <div className="pie-div" ref={this.bindPieRef} />
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
                start: 5122368,
                end: 5122656
            }).then((result) => {
                dispatch(updateDataAction(result.data.items))
            }).catch(alert)
        },
        requestComposite: () => {
            getComposite({
                product: 'AF',
                start: 17779,
                end: 17787
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