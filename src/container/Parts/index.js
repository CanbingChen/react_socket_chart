import React from "react";
import Modal from "react-modal";
import Component from "COMPONENTS/base/component";
import View from "COMPONENTS/base/view";
import ImageView from "react-imageview";
import limitWXShare from 'UTILS/limit_Wx_share';
import "react-imageview/dist/react-imageview.min.css";
import toast from "COMPONENTS/Toast";
import copyText from "UTILS/copy";
import {paramsObject,changeBodyTile} from "UTILS";
import apiService from "SERVICE";
import store from "store";
import Clipboard from 'clipboard';
export default class Parts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            options: {
                imagelist: [],
                imgShowViewer: false,
                token: "",
                activeIndex: -1,
                isLoading :true
            },
            sid: "",
            partsId: "",
            queryResults: [],
            structureInfo: {}
        };
        this.header = null;
        ["showImgViewer", "closeImgViewer"].forEach((item) => {
            this[item] = this[item].bind(this);
        });
    }
    showImgViewer() {
        this.setState({
            options: {
                ...this.state.options,
                imgShowViewer: true
            }
        });
    }
    closeImgViewer() {
        this.setState({
            options: {
                ...this.state.options,
                imgShowViewer: false
            }
        });
    }
    componentWillMount() {
        const params = paramsObject(this.props.location.search);
        const token = store.get("token");
        if (!params.sid && !params.partsId) {
            this.props.history.push("/query?token=" + token);
            return;
        }
        this.setState({token: token, sid: params.sid, partsId: params.partsId});
    }
    componentDidMount() {
        let params = {
            token: this.state.token,
            sid: this.state.sid
        };
        this.setState({
	        options : {
                ...this.state.options,
                isLoading :true
            }
		});
        limitWXShare(window.location.href);
        toast.loading();
        if (this.state.partsId) {
            params.partsId = this.state.partsId;
            apiService.getPartInfoByPart(params).then((data) => {
                this.handleData(data);
            }, (err) => {
                this.handleErr(err);
            });
        } else {
            apiService.getPartInfo(params).then((data) => {
                this.handleData(data);
            }, (err) => {
                this.handleErr(err);
            });
        }
        var clipboardDemos = new Clipboard('.copy-button');
        clipboardDemos.on('success', function(e) {
            e.clearSelection();
            toast.success('复制成功');
        });
        clipboardDemos.on('error', function(e) {
            toast.err('复制失败');
        });
    }
    handleData(data) {
        changeBodyTile(data.structureInfo.name);
        window.scroll(0, 0);
        toast.close();
        this.setState({
            queryResults: data.queryResults,
            structureInfo: data.structureInfo,
            options: {
                ...this.state.options,
                imagelist: [data.structureInfo.url],
                isLoading :false
            }
        });
    }
    handleErr(err) {
        toast.close();
        this.setState({
            options: {
                ...this.state.options,
                isLoading :false
            }
        });
    }
    choosePart(obj, index) {
        this.setState({
            options: {
                ...this.state.options,
                activeIndex: index
            }
        });
        if (obj.url !== this.state.structureInfo.url) {
            this.setState({
                structureInfo: {
                    ...this.state.structureInfo,
                    url: obj.url
                },
                options: {
                    ...this.state.options,
                    imagelist: [obj.url]
                }
            });
        }
    }
    renderList() {
        const {queryResults, options} = this.state;
        return queryResults.map((item, index) => {
            return <div key={index} className={this.classNames("item", {
                "active": index === options.activeIndex
            })} onClick={this.choosePart.bind(this, item, index)}>
                <span className="left number">
                    {item.location || '--'}
                </span>
                <div className="middle">
                    <h3 className="name">{item.name}</h3>
                    <span className="OEM">OEM</span>
                    <span className="OEM-number">{item.oem}</span>
                </div>
                <span className="right">
                    <button data-clipboard-action="copy" className="copy-button" data-clipboard-text={item.oem}>复制</button>
                </span>
            </div>;
        });
    }
    render() {
        const {imagelist,isLoading} = this.state.options;
        const {structureInfo} = this.state;
        return (
            <View show={!isLoading}>
                <div className="parts">
                    <div className="header" ref={(ele) => {
                        this.header = ele
                    }}>
                        <div className="img-block">
                            <img src={structureInfo.url} onClick={this.showImgViewer}/>
                        </div>
                        <h3 className="title">
                            <span className="left">位置</span>
                            <span className="middle">名称/OEM</span>
                        </h3>
                    </div>
                    <div className="content">
                        {this.renderList()}
                    </div>
                    {this.state.options.imgShowViewer &&< ImageView imagelist = {
                        imagelist
                    }
                    close = {
                        this.closeImgViewer
                    } />}
                </div>
            </View>

        );
    }
}
