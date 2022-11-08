import { audioConfig, CurPlatform } from "../config/Config";
import { AudioMgr } from "./AudioMgr";
import { E_GameData_Type, GameDataMgr } from "./GameDataMgr";
import { ResourcesMgr } from "./ResourcesMgr";
import { UIManager } from "./UIManager";

const {ccclass, property} = cc._decorator;

export enum E_ClientState{
    /**无效 */
    Invalid = 0,
    /**预加载 */
    Init = 1,
    /**所有数据准备齐*/
    Ready = 2,
}
@ccclass
export default class GameClient extends cc.Component {

    /**单例 */
    public static Instance: GameClient = null;

    /**是否准备就绪 */
    public static isReady: boolean = false;

    /**流程状态引用计数*/
    private m_StateCount = 0;

    /**当前状态 */
    private curClientState: E_ClientState = E_ClientState.Invalid;

    onLoad(){
        GameClient.Instance = this;
        cc.game.addPersistRootNode(this.node);
        cc.game.setFrameRate(30);

        GameClient.isReady = false;
        UIManager.setRoot(this.node);
        UIManager.openUI("UI_Loading");
        
        this.setState(E_ClientState.Init);
    }


    /**帧循环 */
    update(dt: number) {
        switch (this.curClientState) {
            case E_ClientState.Init:
                this.Update_Init();
                break;
            case E_ClientState.Ready:
                break;
        }
    }
    private Update_Init() {
        if (this.m_StateCount == 0)
            this.setState(E_ClientState.Ready);
    }

    /**设置计数器 */
    SetStateCount(count: number) {
        this.m_StateCount += count;
    };

    /**设置状态 */
    setState(state: E_ClientState){
        if(state == this.curClientState) return;
        this.curClientState = state;
        switch (state) {
            case E_ClientState.Invalid:
                break;
            case E_ClientState.Init:
                console.log("进入  Init");
                this.init();
                break;
            case E_ClientState.Ready:
                console.log("进入  Ready");
                this.ready();
                break;
            default:
                break;
        }
    }

    /**所有数据准备齐 */
    ready(){
        // AudioMgr.playBGMusic(audioConfig.BGMusic);
        if(CurPlatform.GamePlatform == true){
            let token = localStorage.getItem("token266");
            GameDataMgr.setDataByType(E_GameData_Type.appToken, token);
        }else{
            GameDataMgr.setDataByType(E_GameData_Type.appToken, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3NlcmlhbG51bWJlciI6IjI2Nl8yMTg3IiwiZXhwIjoxNjk5MTQ2MDUwLCJpc3MiOiJodHRwOi8vMjY2YXBpLnZpcC5obmh4emtqLmNvbS8iLCJhdWQiOiJodHRwOi8vMTkwbS52aXAuaG5oeHprai5jb20vIn0.WY-VEfdyECgkTqOkQR0o5GbUxSCi3klDflY-fDLsHys");
        }
        UIManager.openUI("UI_Main");
    }

    /**初始化 */
    private async init(){
        if(CurPlatform.GamePlatform == false){
            console.log("运行环境  本地运行");
            GameDataMgr.loadLocalData();
        }else{
            GameDataMgr.loadLocalData();
        }
        
        // else{
        //     console.log("运行环境  非本地运行");
        //     /**加载分包 */
        //     let subPackages = ["bundle_1", "bundle_2", "bundle_3"];
        //     this.SetStateCount(subPackages.length);
        //     this.SetStateCount(-1);
        //     GameDataMgr.loadLocalData();

        // }
    }
}
