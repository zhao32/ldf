import { ApiUrl, ccMessage, jjcList, levelList, rankList, ruleList} from "../config/Config";
import { E_GameData_Type, GameDataMgr } from "./GameDataMgr";
import MD5 from "./MD5";

/** 网络封装 */
export const NetWork = new class{

   /** 有参数POST接口封装
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
    noTokenParametersPost(url,param, callback){
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        var responseJson = JSON.parse(response);
                        if(responseJson.msgCode == 0){
                            callback(responseJson);
                        }else if(responseJson.msgCode == 1){
                            callback(false,responseJson.msg);
                        }
                    }else{
                        // console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    // console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST",url, true);
        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8'); 
        xhr.send(param);//reqData为字符串形式： "key=value"
    };
    

    /** 有参数POST接口封装
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
     haveParametersPost(url,param, callback){
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        var responseJson = JSON.parse(response);
                        // console.log(responseJson);
                        if(responseJson.msgCode == 0){
                            callback(responseJson,responseJson.msg,0,responseJson);
                        }else if(responseJson.msgCode == 1){
                            callback(false,responseJson.msg,100,responseJson);
                        }else if(responseJson.msgCode == 2){
                            callback(false,responseJson.msg,2,responseJson);
                        }else if(responseJson.msgCode == 3){
                            callback(false,responseJson.msg,3,responseJson);
                        }else if(responseJson.msgCode == 4){
                            callback(false,responseJson.msg,4,responseJson);
                        }
                    }else{
                        // console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    // console.log("请求失败")
                    callback(false);
                }
            }
        };
        xhr.open("POST",url, true);
        let isNeedToken = GameDataMgr.getDataByType(E_GameData_Type.appToken);
        // let isNeedToken = ApiUrl.token;
        if (isNeedToken != "") {
            // xhr.setRequestHeader('Authorization', isNeedToken);
            xhr.setRequestHeader('Authorization', "Bearer " + isNeedToken);
        }
        xhr.setRequestHeader('Content-type', 'application/json;charset=utf-8'); 
        xhr.send(param);//reqData为字符串形式： "key=value"
    };
    

    /** 接口
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
     emptyTokeGet(url, callback){
        //2.发起请求
        var thiss = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        // thiss.wxGetUserInfo()
                        var responseJson = JSON.parse(response);
                        callback(responseJson);
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        }
        
        xhr.open("GET",url, true);
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.send();//reqData为字符串形式： "key=value"
    }
    
    /** 接口
     * @param url 请求地址
     * @param data 请求参数(会签名)
     * @param callback 回调函数
     */
     haveTokeGet(url, callback){
        //2.发起请求
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4){
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    if(response){
                        var responseJson = JSON.parse(response);
                        // console.log(responseJson);
                        if(responseJson.msgCode == 0){
                            callback(responseJson,responseJson.msg);
                        }else if(responseJson.msgCode == 1){
                            callback(false,responseJson.msg);
                        }
                    }else{
                        console.log("返回数据不存在")
                        callback(false);
                    }
                }else{
                    console.log("请求失败")
                    callback(false);
                }
            }
        };
        
        xhr.open("GET",url, true);
        let isNeedToken = GameDataMgr.getDataByType(E_GameData_Type.appToken);
        // let isNeedToken = ApiUrl.token;
        if (isNeedToken != "") {
            xhr.setRequestHeader('Authorization', "Bearer " + isNeedToken);
            // xhr.setRequestHeader('token', isNeedToken);
        }
        xhr.setRequestHeader("Content-Type" , "application/x-www-form-urlencoded");  
        xhr.send();//reqData为字符串形式： "key=value"
    };



    /**获取场次信息 */
    getFieldMessage(callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getlateGame";
        this.haveTokeGet(rbUrl,(res)=>{
            if(res !=null){
                if(res){
                    // console.log(res);
                    console.log("获取成功");
                    let time = res.info.time;
                    let cyNum = res.info.num;
                    let playId = res.info.id;
                    let msg = res.msg;
                    ccMessage.TIME = time;
                    ccMessage.CCNUM = cyNum;
                    ccMessage.PLAYID = playId;
                    GameDataMgr.setDataByType(E_GameData_Type.ccIdNum, playId);
                    callback(true,msg);
                }else{
                    console.log()
                    callback(false);
                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };


    /**场次报名 */ 
    setFieldMesssage(id:number,callback){
        let Pid = id;
        let rbUrl = ApiUrl.appUrl+"/Put/putsignup?id="+Pid;
        let para={
         }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl,param,(res,msg,num,resp)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    // let curNum = res.info.num;
                    // let maxNum = res.info.maxnum;
                    // GameDataMgr.setDataByType(E_GameData_Type.curPeoperNum, curNum);
                    // GameDataMgr.setDataByType(E_GameData_Type.maxPeoperNum, maxNum);
                    callback(true,msg,num,resp);
                }else{
                    if(num == 2){
                        // let curNum = resp.info.num;
                        // let maxNum = resp.info.maxnum;
                        // GameDataMgr.setDataByType(E_GameData_Type.curPeoperNum, curNum);
                        // GameDataMgr.setDataByType(E_GameData_Type.maxPeoperNum, maxNum);
                    }
                    callback(false,msg,num,resp);
                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获取当前场次人数 */ 
    getCurFieldMesssage(callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getnowGame";
        this.haveTokeGet(rbUrl,(res)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    let curNum = res.info.num;
                    let maxNum = res.info.maxnum;
                    let time = Number(res.info.times);
                    let timeLable = res.info.stime;
                    ccMessage.TIMES = time;
                    ccMessage.TIMELABLE = timeLable;
                    // GameDataMgr.setDataByType(E_GameData_Type.playdzsj, time);
                    GameDataMgr.setDataByType(E_GameData_Type.curPeoperNum, curNum);
                    GameDataMgr.setDataByType(E_GameData_Type.maxPeoperNum, maxNum);
                    callback(true);
                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    // 


    /**发送分数信息 */ 
    setScoreMesssage(cid:any,score:any,callback){
        let pwd = this.rbInfoString(score)
        let rbUrl = ApiUrl.appUrl+"/Put/putover?score="+score+"&pwd="+pwd+"&id="+cid;
        let para={
        }
       let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl,param,(res,msg)=>{
            if(res !=null){
                if (res) {
                    callback(true,msg);
                }else{
                    callback(false,msg);
                }
            }else{
                // console.log("系统错误");
                callback();
            }
        })
    };

    /**获取是否被淘汰 */ 
    getIsMortalityMesssage(cid:any,callback){
        // let rbUrl = ApiUrl.appUrl+"/Put/puteliminate";
        let rbUrl = ApiUrl.appUrl+"/Put/puteliminates?id="+cid;
        let para={
        }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl,param,(res,msg,num,resp)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    ccMessage.ISTT =  res.info.state;
                    let tim =  res.info.time;
                    GameDataMgr.setDataByType(E_GameData_Type.playdzsj,tim)
                    callback(true);
                }else{
                    // console.log(res);
                    callback(false,msg,num,resp);

                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获取图片 */ 
    getIsMcAddressMesssage(callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getGameImg";
        this.haveTokeGet(rbUrl,(res)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    let address = res.info.url;
                    ccMessage.MCADDRESS = address;
                    callback(true);
                }else{
                    // console.log(res);
                    callback(false);

                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获取排行榜规则 */ 
    getRankMesssage(callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getRank";
        this.haveTokeGet(rbUrl,(res)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    ccMessage.PANKTS =  res.remark;
                    rankList.length = 0;
                    let rlen = res.info.length;
                    for (let a = 0; a < rlen; a++) {
                        rankList.push(res.info[a]);
                    }
                    callback(true);
                }else{
                    // console.log(res);
                    callback(false);

                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获取场次规则 */ 
    getRuleMesssage(callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getRankDes";
        this.haveTokeGet(rbUrl,(res)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    ruleList.length = 0;
                    let rlen = res.info.length;
                    for (let a = 0; a < rlen; a++) {
                        ruleList.push(res.info[a]);
                    }
                    callback(true);
                }else{
                    // console.log(res);
                    callback(false);

                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获取最高关卡 */ 
    getLevelMesssage(callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getguanqia";
        this.haveTokeGet(rbUrl,(res)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    if(res.info[0] != null && res.info[0] != undefined ){
                        let maxLev =  res.info[0].maxNum;
                        GameDataMgr.setDataByType(E_GameData_Type.curMaxLevelNum, maxLev);
                        let jfNum =  res.info[0].integral;
                        GameDataMgr.setDataByType(E_GameData_Type.playJFNum, jfNum);
                        // ccMessage.LEVTIME = res.info[0].time;
                    }
                    levelList.length = 0;
                    let rlen = res.info.length;
                    for (let a = 0; a < rlen; a++) {
                        levelList.push(res.info[a]);
                    }
                    // console.log(levelList);
                    callback(true);
                }else{
                    // console.log(res);
                    callback(false);

                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**发送关卡信息 */ 
    setLevelMesssage(levId:any,callback){
        let rbUrl = ApiUrl.appUrl+"/Put/putGuanQia?id=" + levId;
        let para={
         }
        let param = JSON.stringify(para);
        this.haveParametersPost(rbUrl,param,(res,msg,num,resp)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    let level = res.info.guanqia;
                    GameDataMgr.setDataByType(E_GameData_Type.curMaxLevelNum, level);
                    let jfNum =  res.info.integral;
                    GameDataMgr.setDataByType(E_GameData_Type.playJFNum, jfNum);
                    callback(true);
                }else{
                    // console.log(res);
                    callback(false,msg,num,resp);

                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获取竞技场 */ 
    getAthleticsMesssage(callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getGamesList";
        this.haveTokeGet(rbUrl,(res)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    jjcList.length = 0;
                    let rlen = res.info.length;
                    for (let a = 0; a < rlen; a++) {
                        jjcList.push(res.info[a]);
                    }
                    callback(true);
                }else{
                    // console.log(res);
                    callback(false);

                }
            }else{
                // console.log("系统错误");
                callback(false);
            }
        })
    };

    /**获取进入场次信息 */ 
    getGoChangMesssage(id:any,callback){
        let rbUrl = ApiUrl.appUrl+"/Query/getnowGames?id="+id;
        this.haveTokeGet(rbUrl,(res,msg)=>{
            if(res !=null){
                if (res) {
                    // console.log(res);
                    let tim = res.info.time;
                    // console.log(tim)
                    callback(true,msg,res);
                }else{
                    // console.log(res);
                    callback(false,msg);

                }
            }else{
                // console.log("系统错误");
                callback(false,msg);
            }
        })
    };



    /**路径加密 */
    rbInfoString(lf){
        let aSing = "s=" + lf;
        let sign = new MD5().hex_md5(aSing).toUpperCase();
        return sign;
    };
    //随机生成16位字符串
    addArr(){
        let arr = [];
        let astr = "";
        for(var i=65;i<91;i++){
            arr.push(String.fromCharCode(i));
        }
        for(var j=97;j<123;j++){
            arr.push(String.fromCharCode(j));
        }
        for(var k=0;k<16;k++){
            let aNum = Math.floor(Math.random()*arr.length);
            astr += arr[aNum];
        }
        return astr;
    };
};

