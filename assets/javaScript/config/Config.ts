
/**当前运行环境 */
export const CurPlatform = {
    /**开发测试环境 */
    GamePlatform: true,
    /**本地测试环境 */
    // GamePlatform: false,
};
/**访问地址 */
export const ApiUrl = {
    /**测试地址 */
    appUrl: "http://266api.vip.hnhxzkj.com",//测试地址
    appId:"",

};

/**规则信息*/
export const ruleList = [];

/**排行榜信息*/
export const rankList = [];

/**关卡信息*/
export const levelList = [];

/**竞技场信息*/
export const jjcList = [];

//场次属性
export let ccMessage = {
    TIME: 0,
    CCNUM: 0,
    PLAYID: 0,
    TIMES: 0,
    ISTT: 0,//是否被淘汰
    MCADDRESS: "",//是否被淘汰
    TIMELABLE: 0,//时间戳
    LEVTIME: 0,//关卡倒计时时间
    PANKTS: 0,//排行榜提示
    CCID: 0,//场次ID

} 

//种类计数
export let CELL_TYPENUM = {
    KONG: 0,
    LI: 0,
    NINGMENG: 0,
    NIUYOUGUO: 0,
    XIHONGSHI: 0,
    BINGKUAI: 0,
} 

/**音效配置表 */
export const audioConfig = {
    /**主页面背景音乐 */
    BGMusic: "audio/BGMusic",
    C_Click: "audio/Click1",
}