// import { E_ItemType } from "../ui/UI_Item";
import { TimeTool } from "./TimeTool";

export enum E_GameData_Type{
    Invalid = 0,
    /**最大通关关卡 */
    PassLv = 1,
    /**当前玩的关卡 */
    curLevelNum = 2,
    /**最高关卡 */
    maxLevelNum = 3,
    /**当前最高关卡 */
    curMaxLevelNum = 4,
    /**当前点击关卡 */
    thId = 5,
    /**积分 */
    appScoreNum = 6,
    /**token */
    appToken = 7,
    /**当前人数 */
    curPeoperNum = 8,
    /**最大人数 */
    maxPeoperNum = 9,
    /**场次ID */
    ccIdNum = 10,
    /**玩家积分 */
    playJFNum = 11,

    /**玩家时间 */
    playdzsj = 12,




    /**背景音乐 是否 */
    IsHadAudio_BG = 220,
    /**音效 是否 */
    IsHadAudio_Eff = 230,
}

export const GameDataMgr = new class{
    /**游戏数据 */
    private m_mapGameData: Map<E_GameData_Type,any> = new Map();

    /**获取数据 */
    public getDataByType(eType: E_GameData_Type){
        if(this.m_mapGameData.has(eType)){
            return this.m_mapGameData.get(eType);
        }
    }
    /**设置数据 */
    public setDataByType(eType: E_GameData_Type, vaule){
        this.m_mapGameData.set(eType,vaule);
        let str = this.mapToJson(this.m_mapGameData);
        localStorage.setItem("GameDatt", str);
    }
    /**叠加数据 */
    public addDataByType(eType: E_GameData_Type, vaule: any, max?: any){
        let v = vaule;
        if(this.m_mapGameData.has(eType)){
            v = this.m_mapGameData.get(eType) + vaule;
        }
        if(max){
            v = Math.min(v,max);
        }
        
        this.m_mapGameData.set(eType, v);
        let str = this.mapToJson(this.m_mapGameData);
        localStorage.setItem("GameDatt", str);
    }
    /**减少数据 */
    public subDataByType(eType: E_GameData_Type, vaule: any, min?: any){
        let v = vaule;
        if(this.m_mapGameData.has(eType)){
            v = this.m_mapGameData.get(eType) - vaule;
        }
        if(min){
            v = Math.max(v,min);
        }
        
        this.m_mapGameData.set(eType, v);
        let str = this.mapToJson(this.m_mapGameData);
        localStorage.setItem("GameDatt", str);
    }

    /**加载本地数据 */
    public loadLocalData(){
        let strData = localStorage.getItem("GameDatt");
        if(strData && strData.length > 0){
            this.m_mapGameData = this.jsonToMap(strData);
            // this.setDataByType(E_GameData_Type.appToken, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3NlcmlhbG51bWJlciI6IjI2Nl8xOTA3IiwiZXhwIjoxNjk0MDc0NTc1LCJpc3MiOiJodHRwOi8vMjY2YXBpLnZpcC5obmh4emtqLmNvbS8iLCJhdWQiOiJodHRwOi8vMTkwbS52aXAuaG5oeHprai5jb20vIn0.KyRdRwSWhspEeHApH8q1_o61cYaH0b936U8I0e3MglQ");
            this.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            this.setDataByType(E_GameData_Type.IsHadAudio_Eff, true);
            this.setDataByType(E_GameData_Type.playdzsj, 0);
        }
        else{
            /**初始化数据 */
            this.setDataByType(E_GameData_Type.PassLv, 1);
            this.setDataByType(E_GameData_Type.curLevelNum,1);
            this.setDataByType(E_GameData_Type.maxLevelNum, 100);
            this.setDataByType(E_GameData_Type.curMaxLevelNum, 1);
            this.setDataByType(E_GameData_Type.thId, 1);
            this.setDataByType(E_GameData_Type.appScoreNum, 0);
            this.setDataByType(E_GameData_Type.appToken, "");
            // this.setDataByType(E_GameData_Type.appToken, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3NlcmlhbG51bWJlciI6IjI2Nl8xOTA3IiwiZXhwIjoxNjk0MDc0NTc1LCJpc3MiOiJodHRwOi8vMjY2YXBpLnZpcC5obmh4emtqLmNvbS8iLCJhdWQiOiJodHRwOi8vMTkwbS52aXAuaG5oeHprai5jb20vIn0.KyRdRwSWhspEeHApH8q1_o61cYaH0b936U8I0e3MglQ");
            this.setDataByType(E_GameData_Type.curPeoperNum, 0);
            this.setDataByType(E_GameData_Type.maxPeoperNum, 0);
            this.setDataByType(E_GameData_Type.ccIdNum, 0);
            this.setDataByType(E_GameData_Type.playJFNum, 0);
            this.setDataByType(E_GameData_Type.playdzsj, 0);
            
            

            this.setDataByType(E_GameData_Type.IsHadAudio_BG, true);
            this.setDataByType(E_GameData_Type.IsHadAudio_Eff, true);
        }
        
    }
    /**map转为json */
    private mapToJson(m:Map<any, any>){
        let obj = Object.create(null);
        m.forEach((v, k)=>{
            obj["" + k] = v;
        })
        return JSON.stringify(obj);
    }
    /**json转为map */
    private jsonToMap(jsonStr){
        let str = JSON.parse(jsonStr);
        let strMap = new Map();
        for(let k of Object.keys(str)){
            strMap.set(Number(k),str[k]);
        }
        return strMap;
    }

    private isNumeric(obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj);
    }

    private isNumeric2(str) {
        if (typeof str !== 'string' || str === '') return false;
        const num = Number(str);
        return num < Infinity && num > -Infinity;
    }
}