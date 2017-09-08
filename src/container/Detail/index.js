import React from "react";
import Modal from "react-modal";
import Component from "COMPONENTS/base/component";
import View from "COMPONENTS/base/view";
import Change from "SVGS/icon-qiehuan.svg?fill=#5e91fa";
import searchIcon from "SVGS/icon-fangdajing.svg?fill=#bfc1d9";
import {paramsObject,paramsString,changeBodyTile} from "UTILS";
import limitWXShare from 'UTILS/limit_Wx_share';
import toast from "COMPONENTS/Toast";
import Tab from "./Tab.js";
import Parts from "./part.js";
import inputField from "COMPONENTS/AutoComplete";
import apiService from "SERVICE";
import store from "store";
import Swiper from "swiper";
import PullMore from "COMPONENTS/PullMore";
import AutoComplete from "./autoComplete.js";
import DEFAULT from "CONSTANTS/default";
import NoDataBgImg from 'IMAGES/nodata.png';
import Footer from '../Query//footer';
const noDataElement = <div className="search-no-data">
		查询无结果
	</div>;
const debounceFn = (fn, time = 500) => {
	let timer;
	return function(value) {
		timer && clearTimeout(timer);
		timer = setTimeout(() => {
			timer && clearTimeout(timer);
			fn(value);
		}, time);
	}
}


export default class Detail extends Component{
	constructor(props){
		super(props);
		this.state = {
			postParams : {
				token : "",
				vin : ""
			},
			isLoading : true,
            isComplete : false,
            isNoData : false,
			carName : "",
			carPicUrl : "",
			tab : {
				selectedIndex : 0,
				showType : false,
			},
			search : {
				isSearchActive : false,
				value : "",
				options : [],
			},
			structureInfo : [{
				canLoad : false,
				structureP : []
			}]
		};
		["changeState", "selectTab", "changeShowType", "getParts", "searchLike", 'getSearchData','orientationchange','swiperTap','translateSwiper','moveSwiper', 'queryAgain'].forEach((item)=>{
			this[item] = this[item].bind(this);
		});
        this.mySwiper = null;
        this.activeIndex = 0;
		this.debounce = debounceFn(this.getSearchData);
	}
	componentWillMount(){
		const params = paramsObject(this.props.location.search);
		const token = store.get("token");
		this.setState({
			postParams : {
				...this.state.postParams,
				token : token,
				vin : params.vin
			}

		});
	}
	searchLike(value){
		this.setState({
			search : {
				...this.state.search,
				value: value,
                options : [],
			},
			isSearchLoading: true,
		});
        if (!value) return;
        this.debounce(value);
	}

	getSearchData(value) {
		apiService.searchLike({
			paraStr: value,
            token : this.state.postParams.token
		}).then(data => {
			this.setState({
				isSearchLoading: false,
				search : {
					...this.state.search,
					options: data.searchResult,
				}
			});
		});
	}

	componentDidMount(){
		if(!this.state.postParams.vin){
			toast.error("请从正规路径访问");
			return ;
		}
        changeBodyTile('EPC结构图');
        limitWXShare(window.location.href);
		this.setState({
			isLoading : true,
            isComplete : false,
		});
		toast.loading();
		apiService.postQuery(this.state.postParams).then((data)=>{
            const params = paramsObject(this.props.location.search);
			data.structureInfo.forEach((item, index)=>{
				if(item.structureP.length >= DEFAULT.count){
					item.canLoad = true;
				}
                else{
					item.canLoad = false;
				}
				item.page = 2;
			});
			this.setState({
				isLoading : false,
                isComplete : true,
			});
			toast.close();
			if(data.carName){
				this.setState({
					carName : data.carName,
					carPicUrl : data.carPicUrl,
					structureInfo : data.structureInfo,
                    tab :{
                        ...this.state.tab,
                        selectedIndex : params.selectedIndex?~~params.selectedIndex:0
                    }
				});
			}else{
                this.setState({
                    isNoData : true,
                });
                return false;
			}
			if(data.structureInfo.length >= 5){
				this.mySwiper = new Swiper(".swiper-container", {
                    touchMoveStopPropagation:true,
                    iOSEdgeSwipeDetection:true,
                    iOSEdgeSwipeThreshold:100,
					slidesPerView: "auto",
				});
                this.moveSwiper();
				this.mySwiper.on("tap",this.swiperTap);
                window.addEventListener("resize",this.orientationchange);
			}
		}, (err)=>{
			this.setState({
				isLoading : false,
                isComplete : false,
			});
		});

	}
    moveSwiper(){
        const {selectedIndex} = this.state.tab;
        let swiperWidth = this.mySwiper.width,
            maxTranslate = this.mySwiper.maxTranslate(),
            maxWidth = -maxTranslate + swiperWidth / 2;
        let slide = this.mySwiper.slides[selectedIndex],
            slideLeft = slide.offsetLeft,
            slideWidth = slide.clientWidth,
            slideCenter = slideLeft + slideWidth / 2;
        this.mySwiper.setWrapperTransition(0);
        this.translateSwiper(slideCenter,swiperWidth,maxWidth,maxTranslate);
    }
    translateSwiper(slideCenter,swiperWidth,maxWidth,maxTranslate){
        if (slideCenter < swiperWidth / 2) {
            this.mySwiper.setWrapperTranslate(0);
        } else if (slideCenter > maxWidth) {
            this.mySwiper.setWrapperTranslate(maxTranslate);
        } else {
            let nowTlanslate = slideCenter - swiperWidth / 2;
            this.mySwiper.setWrapperTranslate(-nowTlanslate);
        }
    }
    componentWillUnmount(){
         window.removeEventListener("resize",this.orientationchange);
         if(this.mySwiper)this.mySwiper.destroy(true);

    }
    swiperTap(swiper, e){
        let swiperWidth = this.mySwiper.width,
            maxTranslate = this.mySwiper.maxTranslate(),
            maxWidth = -maxTranslate + swiperWidth / 2;
        let slide = swiper.slides[swiper.clickedIndex],
            slideLeft = slide.offsetLeft,
            slideWidth = slide.clientWidth,
            slideCenter = slideLeft + slideWidth / 2;
        this.mySwiper.setWrapperTransition(300);
        this.translateSwiper(slideCenter,swiperWidth,maxWidth,maxTranslate);
    }
    orientationchange(e){
        setTimeout(()=>{
            this.mySwiper.update(true);
        },500)
    }
	changeState(){
		const {token} = this.state.postParams;
		this.props.history.push("/query?token=" + token);
	}
	selectTab(index){
		this.setState({
			tab : {
				...this.state.tab,
				selectedIndex : index
			}
		});
        this.props.history.push(`/detail?vin=${this.state.postParams.vin}&selectedIndex=${index}`);
	}
	changeShowType(){
		this.setState({
			tab : {
				...this.state.tab,
				showType : !this.state.tab.showType
			}
		});
	}
    queryAgain(){
        const token = store.get('token');
		this.props.history.push(`/query?token=${token}`);
	}
    renderNoData(){
        return <div className="query">
            <div className="no-data-img">
                <img src={NoDataBgImg}/>
            </div>
            <div className="content no-data">
                <button className="query-again-button" onClick={this.queryAgain}>再次查询</button>
                <Footer/>
            </div>
        </div>
    }
	renderSearch(){
		const {isSearchActive, options, value} = this.state.search;
        const {selectedIndex} = this.state.tab;
		return isSearchActive ? <AutoComplete
				options={options}
				multiSection
				onCancel={() =>
					this.setState({
						search : {
							...this.state.search,
							isSearchActive: false,
                            value:''
						}
					})}
				autoHighlight={false}
				inputProps={{
					placeholder: "请输入配件名称",
					type: "text"
				}}
				value={value}
				onChange={this.searchLike}
				onSelect={option => this.props.history.push(`/parts?partsId=${option.partsId}&sid=${option.sid}&selectedIndex=${selectedIndex}`)}
				clearInput={() => {
					this.setState({
						search : {
							...this.state.search,
							value: "",
							options: []
						}
					});
				}}
				isLoading={this.state.isSearchLoading}
				noDataElement={noDataElement}
			/>
        : <div className="search-block" onClick={() => {
            let params = paramsObject(this.props.location.search);
            params.isSearchActive = '0';
            params = paramsString(params);
            this.props.history.push(`${this.props.location.pathname}?${params}`);
            this.setState({
                search : {
                   ...this.state.search,
                   isSearchActive: true
               }})
            }
        }>
				<svg viewBox={searchIcon.viewBox} >
					<use xlinkHref={`#${searchIcon.id}`} />
				</svg>
				<span>请输入配件名称</span>
			</div>;
	}
    componentWillReceiveProps(nextProps){
        const params = paramsObject(nextProps.location.search);
        if(params.isSearchActive&&this.state.search.isSearchActive){
            this.setState({
                search : {
                   ...this.state.search,
                   isSearchActive: false,
                   value : '',
               }
           })
        }
    }
	getParts(){
		const {tab, structureInfo, postParams} = this.state;
		const part = structureInfo[tab.selectedIndex];
		const params = {
			count : DEFAULT.count,
			page : part.page,
			structurePId : part.structurePId,
			token : postParams.token,
		};
		return apiService.getParts(params).then((data)=>{
			const {selectedIndex} = this.state.tab;
			const {structureInfo} = this.state;
			structureInfo[selectedIndex].structureP = structureInfo[selectedIndex].structureP.concat(data.structureCInfo);
			structureInfo[selectedIndex].page++;
			if(data.structureCInfo.length < DEFAULT.count){
				structureInfo[selectedIndex].canLoad = false;
			}
			this.setState({
				structureInfo : structureInfo
			});
		}, ()=>{

		});
	}
	render(){
		const {carName, structureInfo, tab, isLoading, carPicUrl,isComplete,isNoData} = this.state;
		const {isSearchActive} = this.state.search;
		const {vin} = this.state.postParams;
		return (
            isNoData?this.renderNoData():<PullMore handleLoadMore={this.getParts} show={!isSearchActive&&isComplete} canLoad={structureInfo[tab.selectedIndex].canLoad && !isSearchActive}>
				<View show={!isLoading}>
					<div className="detail">
						<div className="dis-scroll">
						{this.renderSearch()}
					</div>
						<View show={!isSearchActive}>
							<div className="content">
								<div className="dis-scroll">
									<div className="header">
										<span className="header-label">VIN码</span>
										<span className="vin">{vin}</span>
										<span className="change" onClick={this.changeState}>
											<svg viewBox={Change.viewBox} >
												<use xlinkHref={`#${Change.id}`} />
											</svg>
											切换
										</span>
									</div>
									<div className="car-name">
										<div className="img-block">
											<img src={carPicUrl} />
										</div>
										<p className="text-block">{carName}</p>
									</div>
								</div>
								<Tab changeTab={this.selectTab} changeShowType={this.changeShowType} tabs={structureInfo} showType={tab.showType} selectedIndex={tab.selectedIndex}/>
								{structureInfo.length > 0 && <Parts {...this.props} showType={tab.showType} list={structureInfo[tab.selectedIndex].structureP}/>}
							</div>
						</View>
					</div>
				</View>
			</PullMore>
		);
	}
}
