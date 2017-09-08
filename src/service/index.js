import fetch from './fetch';

const apiService = {
	/**查询页面请求**/
	getUserId : fetch('/api/epc_query', 'GET'),
	getQueryHistory : fetch('/api/query_history', 'POST'),
	/**查询结果页**/
	postQuery : fetch('/api/query_now','POST'),
	getParts : fetch('/api/structure_query','POST'),
	searchLike : fetch('/api/search_like', 'POST'),
	/**配件信息页**/
	/**通过结构图获取配件信息**/
	getPartInfo : fetch('/api/structure_parts_query','POST'),
	/**通过搜索中的结构id获取配件信息**/
	getPartInfoByPart : fetch('/api/search_parts_query','POST'),
    /**获取调用sdk凭据接口**/
    getWxTicket : fetch('/api/epc_share_url','POST')

}

export default apiService;
