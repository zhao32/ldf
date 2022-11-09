import { audioConfig, ccMessage, CELL_TYPENUM } from "../config/Config";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
// import {GameMo} from "../ModelTwo/gameModelThree";
import GameMo = require('../ModelTwo/gameModelThree');

import GameController from '../Controller/GameController.js'
import { AudioMgr } from "../framework/AudioMgr";
import UI_Tip from "./UI_Tip";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import { TimeTool } from "../framework/TimeTool";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UI_MultiplayerFight extends cc.Component {
    public static Instance: UI_MultiplayerFight = null;

    @property({
        type: cc.Label,
        tooltip: "得分数",
    })
    dfTxt: cc.Label = null

    @property({
        type: cc.Node,
        tooltip: "倒计时",
    })
    tlTxt: cc.Node = null

    @property({
        type: cc.Node,
        tooltip: "元素Node",
    })
    gqNode: cc.Node = null

    @property({
        type: cc.Label,
        tooltip: "玩家积分",
    })
    jfTxt: cc.Label = null


    @property({
        type: cc.Node,
        tooltip: "遮罩",
    })
    zzNode: cc.Node = null

    @property({
        type: cc.Node,
        tooltip: "广告图",
    })
    ggMc: cc.Node = null

    @property({
        type: cc.Node,
        tooltip: "淘汰图",
    })
    taoTaiMc: cc.Node = null

    @property({
        type: cc.Label,
        tooltip: "淘汰文本",
    })
    taiTaiTxt: cc.Label = null

    public lvNum: number = 0;//绿数量
    private huangNum: number = 0;//黄数量
    private fenNum: number = 0;//粉数量
    private lanNum: number = 0;//蓝数量
    private hongNum: number = 0;//红数量
    private ziNum: number = 0;//紫数量
    private timerNum: number = 0;//倒计时
    private curtimerNum: number = 0;//倒计时

    private allBool: boolean = false;
    private mbTxtNum: number = 0;

    private minScore: number = 15;

    private gameModel: any;

    private ccTime: number = 0;

    private ccScore: number = 0;



    onLoad() {
        UI_MultiplayerFight.Instance = this;
        // Observer.on("mts",this.massageTxtShow,this);
        Observer.on("scoreTxt", this.updataScoreShow, this);
        // Observer.on("txtShow",this.txtShow,this);
        // Observer.on("sxShow",this.initCmd,this);


    }

    onEnable() {
        this.zzNode.active = false;
        this.taoTaiMc.active = false;
        // this.tim = false;
        // GameDataMgr.setDataByType(E_GameData_Type.appScoreNum, 0);
        this.timerNum = Number(GameDataMgr.getDataByType(E_GameData_Type.playdzsj));
        // this.ccTime = ccMessage.TIMES * 1000;
        // this.timerNum = ccMessage.TIMES;
        // this.ccTime = 10000;
        let url = ccMessage.MCADDRESS;
        ResourcesMgr.loadImgByUrl(this.ggMc, url, "png");
        this.txtShow();


    }

    onDestroy() {
        // Observer.off("mts");
        // Observer.off("txtShow");
        Observer.off("scoreTxt");
        // Observer.off("sxShow");
    }

    private selectCell(pos: any) {
        return this.gameModel.selectCell(pos);
    }

    //刷新游戏
    private updaGame() {
        this.gameModel = new GameMo();
        // this.gameModel.node.removeAllChildren();
        this.gameModel.init(5);
        var gridScript = this.gqNode.getComponent("GridViewTwo");
        gridScript.node.removeAllChildren();
        gridScript.node.x = -344.5;
        gridScript.node.y = -646.5
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());
        this.schedule(this.timerFunc, 1);

    }

    private cleanCmd() {
        this.gameModel.cleanCmd();
    }

    /**玩家信息显示 ,cc.macro.REPEAT_FOREVER)*/
    private txtShow() {
        this.curtimerNum = TimeTool.getCurTimeSeconnd();
        // this.tipNode.x = 750;
        this.apBool = false;
        this.allBool = false;
        if(GameDataMgr.getDataByType(E_GameData_Type.appScoreNum)){
            this.dfTxt.string ='得分 '+ GameDataMgr.getDataByType(E_GameData_Type.appScoreNum)
        }else{
            this.dfTxt.string ='得分 0'
        }
        this.timerNum = Number(GameDataMgr.getDataByType(E_GameData_Type.playdzsj));
        console.log(this.timerNum);
        // this.timerNum = ccMessage.TIMES;
        // console.log("bbbbbbbb" + ccMessage.TIMES);
        this.tlTxt.getComponent(cc.Label).string = this.timerNum + "S";
        this.updaGame();
    }

    private timeOutShow() {
        // setTimeout(() => {
        this.zzNode.active = false;
        this.updataScoreShow();
        let id = ccMessage.CCID;
        NetWork.setScoreMesssage(id, this.ccScore, (res, msg) => {
            let a = msg + "";
            if (res) {
                this.zzNode.active = true;
                this.fiveShow();
            } else {
                UI_Tip.Instance.showTip(a);
            }
        })
        // }, this.ccTime);
    }

    private fiveShow() {
        setTimeout(() => {
            // console.log("aaaaaaa");
            let id = ccMessage.CCID;
            NetWork.getIsMortalityMesssage(id, (res, msg, num, resp) => {
                let aa = msg + "";
                if (res) {
                    this.curtimerNum = TimeTool.getCurTimeSeconnd();
                    this.zzNode.active = false;
                    // console.log(ccMessage.TIMES);
                    // this.timerNum = ccMessage.TIMES;
                    // let tim =  resp.info.time;
                    this.timerNum = Number(GameDataMgr.getDataByType(E_GameData_Type.playdzsj));
                    this.tlTxt.getComponent(cc.Label).string = this.timerNum + "S";
                    this.schedule(this.timerFunc, 1);
                    // this.timeOutShow();
                } else {
                    if (num == 3) {
                        console.log("淘汰");
                        this.taoTaiMc.active = true;
                        this.taiTaiTxt.string = aa + "";
                        Observer.emit("ini");

                        // UI_Tip.Instance.showTip(aa);

                        // UIManager.closeUI(this.node.name);
                        // UIManager.closeUI("UI_Athletics");
                        // UIManager.openUI("UI_Main");
                        return;
                    }
                    if (num == 4) {
                        console.log("淘汰");
                        Observer.emit("ini");
                        this.taoTaiMc.active = true;
                        this.taiTaiTxt.string = aa + "";
                        // UI_Tip.Instance.showTip(aa);
                        // UI_Tip.Instance.showTip("游戏结束");
                        // UIManager.closeUI(this.node.name);
                        // UIManager.closeUI("UI_Athletics");
                        // UIManager.openUI("UI_Main");
                        return;
                    }
                    UI_Tip.Instance.showTip(aa);
                }
            })
        }, 10000);
    }


    /**更新积分 */
    private apBool: boolean = false;
    public updataScoreShow() {
        this.ccScore = GameDataMgr.getDataByType(E_GameData_Type.appScoreNum);
        // console.log(this.ccScore);
        this.dfTxt.string = "得分 " + this.ccScore;
    }

    /**玩家信息更新 */
    public massageTxtShow() {
    }


    //返回按钮点击
    backBtnClick() {
        AudioMgr.playAudioEffect(audioConfig.C_Click);
        UIManager.closeUI(this.node.name);
        UIManager.openUI("UI_Main");

    }

    /**计时开始 */
    // private tim:boolean = false;
    private timerFunc() {
        // console.log(this.timerNum);
        let timeStar: number = this.timerNum - (TimeTool.getCurTimeSeconnd() - this.curtimerNum);

        this.tlTxt.getComponent(cc.Label).string = timeStar + "S";
        // if(!this.tim){
        //     this.tim = true;
        //     return;
        // }
        if (timeStar <= 0) {
            this.unschedule(this.timerFunc);
            this.tlTxt.getComponent(cc.Label).string = 0 + "S";
            this.timeOutShow();
            // console.log("游戏结束");
            // let dqscore = GameDataMgr.getDataByType(E_GameData_Type.appScoreNum);
            // let mbNum = this.dfTxt.string;
            // UIManager.openUI("UI_MultiplayerWin");
            return
        }
    }

    /**计时初始化 */
    private timerShow(num: number) {
        this.tlTxt.getComponent(cc.Label).string = this.timerNum + "S";
    }

    /**游戏结束返回 */
    private taoTaiBack(num: number) {
        this.zzNode.active = false;
        this.taoTaiMc.active = false;
        UIManager.closeUI(this.node.name);
        UIManager.closeUI("UI_Athletics");
        UIManager.openUI("UI_Main");
    }



}
