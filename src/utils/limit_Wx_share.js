import apiService from 'SERVICE';
export default function limitWXShare(url) {
    let params = {
        url
    };
    apiService.getWxTicket(params).then((data) => {
        const {appId, nonceStr, signature, timestamp} = data;
        wx.config({
            debug: true,
            appId,
            nonceStr,
            signature,
            timestamp,
            jsApiList: [
                'checkJsApi',
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'hideMenuItems',
                'showMenuItems',
                'hideAllNonBaseMenuItem',
                'showAllNonBaseMenuItem',
                'translateVoice',
                'startRecord',
                'stopRecord',
                'onVoiceRecordEnd',
                'playVoice',
                'onVoicePlayEnd',
                'pauseVoice',
                'stopVoice',
                'uploadVoice',
                'downloadVoice',
                'chooseImage',
                'previewImage',
                'uploadImage',
                'downloadImage',
                'getNetworkType',
                'openLocation',
                'getLocation',
                'hideOptionMenu',
                'showOptionMenu',
                'closeWindow',
                'scanQRCode',
                'chooseWXPay',
                'openProductSpecificView',
                'addCard',
                'chooseCard',
                'openCard'
            ]
        });
        wx.ready(() => {
            setTimeout(()=>{
                wx.onMenuShareAppMessage({
                    title: 'EPC车查查',
                    desc: '',
                    link: 'http://epcqry.test.cdecube.com/api/epc_query',
                    imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                });
                wx.onMenuShareTimeline({
                    title: 'EPC车查查',
                    desc: '',
                    link: 'http://epcqry.test.cdecube.com/api/epc_query',
                    imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                });
                wx.onMenuShareQQ({
                    title: 'EPC车查查',
                    desc: '',
                    link: 'http://epcqry.test.cdecube.com/api/epc_query',
                    imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                });
                wx.onMenuShareQZone({
                    title: 'EPC车查查',
                    desc: '',
                    link: 'http://epcqry.test.cdecube.com/api/epc_query',
                    imgUrl: 'http://demo.open.weixin.qq.com/jssdk/images/p2166127561.jpg',
                });
            },500);

        });

    });
}
