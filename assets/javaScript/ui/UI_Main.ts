import { audioConfig, ccMessage, CurPlatform, levelList } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { TimeTool } from "../framework/TimeTool";
import { UIManager } from "../framework/UIManager";
import UI_Tip from "./UI_Tip";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Main extends cc.Component{


    @property({
        type: cc.AudioClip,
        tooltip: "音乐"
    })
    private swap: cc.AudioClip = null;

    @property({
        type: cc.AudioClip,
        tooltip: "音乐"
    })
    private clxc: cc.AudioClip = null;

    @property({
        type: cc.Label,
        tooltip: "场次文本"
    })
    private ccTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "场次按钮"
    })
    private ccBtn: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "场次提示"
    })
    private cctsLab: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "积分显示"
    })
    private jfTxt: cc.Label = null;

    @property({
        type: cc.Node,
        tooltip: "音乐"
    })
    private musicBtn: cc.Node[] = [];


    private audioID:any;


    onLoad(){
        Observer.on("levelShow",this.upLevelShow,this);
        Observer.on("ini",this.init,this)
    }


    onEnable(){
        // let at = TimeTool.getCurTimeSeconnd();
        // console.log(at)
        this.init();
        
        // cc.audioEngine.play(this.swap, true, 1);

        this.audioID = cc.audioEngine.playMusic(this.swap, true);
    }

    onDestroy(){
        Observer.off("levelShow");
        Observer.off("ini");
    }

    /**刷新 */
    upLevelShow(){
        let jfNum = GameDataMgr.getDataByType(E_GameData_Type.playJFNum)
        this.jfTxt.string = jfNum;
    }

    doBack(){
        location.href = 'http://ldf.vip.hnhxzkj.com?back=0'
    }


    /**初始化 */
    init(){
        GameDataMgr.setDataByType(E_GameData_Type.appScoreNum,0);
        NetWork.getLevelMesssage((res)=>{
            if(res){
                let jfNum = GameDataMgr.getDataByType(E_GameData_Type.playJFNum)
                this.jfTxt.string = jfNum;
            }
        })
        NetWork.getIsMcAddressMesssage((res)=>{
            if(res){

            }
        })
        
        // NetWork.getFieldMessage((res,msg)=>{
            // let a = msg +"";
            // if(res){
            //     this.ccTxt.string = ccMessage.TIME + " 开始";
            //     this.cctsLab.string = a;
            // }else{
            //     this.ccBtn.active = false;
            // }
        // });
    }

    /**关卡点击 */
    private startBtnClick(){
        console.log("开始点击");
        cc.audioEngine.play(this.clxc, false, 1);
        let curpp;
        if(!CurPlatform.GamePlatform){
            curpp = 3;
        }else{
            curpp = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum)
        }
        // if(curpp>levelList.length){
        //     UI_Tip.Instance.showTip("敬请期待");
        //     return;
        // }
        // UIManager.openUI("UI_Fight");

        if(curpp>levelList.length){
            // UI_Tip.Instance.showTip("敬请期待");
            NetWork.getLevelMesssage((res)=>{
                if(res){
                    let jfNum = GameDataMgr.getDataByType(E_GameData_Type.playJFNum)
                    this.jfTxt.string = jfNum;
                    UIManager.openUI("UI_Fight");
                }
            })
            // return;
        }else{
            UIManager.openUI("UI_Fight");
        }
    }

    /**竞技场点击 */
    private ccBtnClick(){
        console.log("场次点击");
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.openUI("UI_Athletics");
        // let pid = GameDataMgr.getDataByType(E_GameData_Type.ccIdNum);
        // NetWork.setFieldMesssage(pid,(res,msg,num)=>{
        //     let a = msg+"";
        //     if(res){
        //         UI_Tip.Instance.showTip("报名成功");
        //         UIManager.openUI("UI_AwaitPage");
        //     }else{
        //         if(num == 100){
        //             UI_Tip.Instance.showTip(a);
        //             return;
        //         }
        //         if(num == 2){
        //             UIManager.openUI("UI_AwaitPage");
        //         }else{
        //             UI_Tip.Instance.showTip("当前场次未开始或已结束");
        //         }
        //     }
        // })
    }

    /**排行榜点击 */
    private rankBtnClick(){
        console.log("排行榜点击");
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.openUI("UI_Rank");
    }

    /**规则点击 */
    private ruleBtnClick(){
        console.log("规则点击");
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.openUI("UI_Rule");
    }

    /**关闭音乐 */
    private closeMusic(){
        console.log("关闭音乐");
        this.musicBtn[0].active = false;
        this.musicBtn[1].active = true;
        cc.audioEngine.pause(this.audioID);
    }
    
    /**开启音乐 */
    private openMusic(){
        console.log("开启音乐");
        this.musicBtn[1].active = false;
        this.musicBtn[0].active = true;
        cc.audioEngine.resume(this.audioID);
    }
}
