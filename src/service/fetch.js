import axios from "axios"; // https://github.com/mzabriskie/axios
import ERROR_CODE from "CONSTANTS/error_code";
import DEFAULT from "CONSTANTS/default";
import toast from "COMPONENTS/Toast";

const EXTREME_ERR_MSG = {
	INTERNET_ERR: "服务器开小差了，请稍后进行操作",
	SYESTEM_ERROR: "服务器开小差了，请稍后进行操作",
	NO_MATCH: "网络错误",
	OFFLINE_ERR: "网络异常，请稍候重试",
	AUTH_FAIL: "非权限访问",
	AUTHORIZE_TIME_OUT : "授权过期，请重新查询"
};

/*eslint-disable*/
const interNetErrCodeArr = [20000, 30000, 50000];

const NO_INTERNET_ERROR_CODE = -1;
const INTERNET_OTHER_ERR = 0;
const codes = Object.keys(ERROR_CODE).map(key => ERROR_CODE[key]);

/**
 * 拉取网络请求
 * @param  {[type]} url    [description]
 * @param  {[type]} method [description]
 * @return {[type]}        [description]
 */
export default function fetch(url, method) {
	return data => {
		let params = method === 'POST' ? {
			method,
			url,
			data
		} : {
			method,
			url,
			params: data,
		};

		return new Promise((resolve, reject) => {
			axios(params).then(
				response => {
					let responseCode = response.data.code;
					if (responseCode === ERROR_CODE.SUCCESS) {
						resolve(response.data.data);
					} else if (
						interNetErrCodeArr.indexOf(responseCode) !== -1
					) {
						toast.error(EXTREME_ERR_MSG.OFFLINE_ERR);
						reject(response.data);
					} else if(responseCode===ERROR_CODE.AUTHORIZE_TIME_OUT){
                        toast.error({msg:EXTREME_ERR_MSG.AUTHORIZE_TIME_OUT,onClose:()=>{
                            window.location.href = DEFAULT.AUTHORIZE_HREF;
                        }});

                    }else if (codes.indexOf(responseCode) !== -1) {
						reject(response.data);
					} else {
						let msg =
							response.data.msg ||
							EXTREME_ERR_MSG.NO_MATCH +
								(responseCode ? responseCode : '');
						toast.error(msg);
						reject(response.data);
					}
				},
				err => {
					let isOfflineError =
						err.status === NO_INTERNET_ERROR_CODE ||
						err.status === INTERNET_OTHER_ERR;
					toast.error(
						isOfflineError
							? EXTREME_ERR_MSG.OFFLINE_ERR
							: EXTREME_ERR_MSG.INTERNET_ERR
					);
					reject();
				}
			);
		});
	};
}
