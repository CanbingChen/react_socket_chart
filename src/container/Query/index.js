import React from 'react';
import Component from 'COMPONENTS/base/component';
import View from 'COMPONENTS/base/view';
import limitWXShare from 'UTILS/limit_Wx_share';
import {paramsObject,changeBodyTile} from 'UTILS';
import toast from 'COMPONENTS/Toast';
import BgImg from 'IMAGES/title.png';
import apiService from 'SERVICE';
import SelectInput from './select_input';
import store from 'store';
import Footer from './footer';
const SELECT_INPUT_OPTION = {
    label: '车架号',
    placeholder: '请输入17位VIN码(车架号)'
}
const ModalStyle = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        zIndex: 100001
    },
    content: {
        position: 'absolute',
        top: '2.666667rem',
        left: '50%',
        bottom: 'auto',
        width: '7.866667rem',
        height: 'auto',
        marginLeft: '-3.933333rem',
        background: '#fff',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        borderRadius: '30px',
        outline: 'none',
        padding: '0.506667rem 0.64rem'
    }
};
export default class Query extends Component {
    constructor(props) {
        super(props);
        this.state = {
            option: {
                isModalOpen: false,
                inputFocus: false,
                token: ''
            },
            queryHistory: [],
            postParams: {
                vin: ''
            }
        };
        ['inputChange', 'getQueryHistory', 'postQuery'].forEach((item) => {
            this[item] = this[item].bind(this);
        });
    }
    componentWillMount() {}

    IsEffectiveVin(vin) {
        return /^(?!\d+$)(?![A-Za-z]+$)[a-zA-Z0-9]{17}$/.test(vin);
    }
    postQuery() {
        if (!this.IsEffectiveVin(this.state.postParams.vin)) {
            toast.error('请输入正确的vin码');
            return;
        }
        this.props.history.push(`/detail?vin=${this.state.postParams.vin}`);
    }
    getQueryHistory(token) {
        apiService.getQueryHistory({token: token}).then((data) => {
            this.setState({queryHistory: data.vins});
        });
    }

    inputChange(value) {
        const vin = value;
        this.setState({
            postParams: {
                ...this.state.postParams,
                vin: vin
            }
        });
    }
    componentDidMount() {
        const params = paramsObject(this.props.location.search);
        if (!params.token) {
            toast.error('请关注微信公众号查询');
            return;
        }
        limitWXShare(window.location.href);
        changeBodyTile('EPC查询');
        store.set('token', params.token);
        this.getQueryHistory(params.token);
    }
    render() {
        return (
            <div className="query">
                <div className="bg-img-block">
                    <img src={BgImg}/>
                </div>
                <div className="content">
                    <SelectInput option={SELECT_INPUT_OPTION} options={this.state.queryHistory} change={this.inputChange}/>
                    <button disabled={!this.state.postParams.vin} className="post-button" onClick={this.postQuery}>立即查询</button>
                    <Footer/>
                </div>
            </div>
        )
    }
}
