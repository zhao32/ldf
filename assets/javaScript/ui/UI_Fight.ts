import { audioConfig, ccMessage, CELL_TYPENUM, CurPlatform, levelList } from "../config/Config";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
// import GameM from "../Model/GameModel";
import GameM = require('../Model/GameModel');


import GameController from '../Controller/GameController.js'
import { AudioMgr } from "../framework/AudioMgr";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import { TimeTool } from "../framework/TimeTool";
import UI_Tip from "./UI_Tip";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Fight extends cc.Component {
    public static Instance: UI_Fight = null;
    
    @property({
        type: cc.Label,
        tooltip: "目标分数",
    })
    mbTxt: cc.Label = null


    @property({
        type: cc.Label,
        tooltip: "得分数",
    })
    dfTxt: cc.Label = null

    @property({
        type: cc.Label,
        tooltip: "倒计时",
    })
    tlTxt: cc.Label = null

    @property({
        type: cc.Label,
        tooltip: "关卡数",
    })
    gqTxt: cc.Label = null

    @property({
        type: cc.Node,
        tooltip: "元素Node",
    })
    gqNode: cc.Node = null


    @property({
        type: cc.Node,
        tooltip: "进度条",
    })
    tiaoNode: cc.Node = null

    @property({
        type: cc.Node,
        tooltip: "进度条遮罩",
    })
    dtNode: cc.Node = null

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

    public lvNum:number = 0;//绿数量
    private huangNum:number = 0;//黄数量
    private fenNum:number = 0;//粉数量
    private lanNum:number = 0;//蓝数量
    private hongNum:number = 0;//红数量
    private ziNum:number = 0;//紫数量
    private timerNum:number = 60;//倒计时

    private curtimerNum:number = 30;//系统时间
    

    private allBool:boolean = false;
    private mbTxtNum:number = 0;

    private minScore:number = 15;

    

    private gameModel:any;

    onLoad () {
        UI_Fight.Instance = this;
        Observer.on("mts",this.massageTxtShow,this);
        Observer.on("scoreTxt",this.updataScoreShow,this);
        Observer.on("txtShow",this.txtShow,this);
        Observer.on("sxShow",this.initCmd,this);

        
    }

    onEnable(){
        
        // let url = ccMessage.MCADDRESS;
        // console.log(url);
        // ResourcesMgr.loadImgByUrl(this.ggMc,url,"png");
        this.getImgShow();
        this.txtShow();
        // this.updateGame();
        // this.gameModel = new GameModel();
        // this.gameModel.node.removeAllChildren();
        // this.gameModel.init(5);
        // var gridScript = this.gqNode.getComponent("GridView");
        // gridScript.node.removeAllChildren();
        // gridScript.node.x = -344.5;
        // gridScript.node.y = -646.5
        // gridScript.setController(this);
        // gridScript.initWithCellModels(this.gameModel.getCells());

        // cc.tween(this.tipNode)
        //     .to(0.8, {x : 0}, {easing: 'backOut'})
        //     .to(1.5, {x : 0})
        //     .call(() => {
        //         cc.tween(this.tipNode)
        //             .to(0.8, {x : -750}, {easing: 'backOut'})
        //             .call(() => {
        //                 this.tipNode.x = 750;
        //                 this.schedule(this.timerFunc, 1);
        //             })
        //             .start()
        //     })
        //     .start()
    }

    onDestroy(){
        Observer.off("mts");
        Observer.off("txtShow");
        Observer.off("scoreTxt");
        Observer.off("sxShow");
    }

    private selectCell(pos:any){
        return this.gameModel.selectCell(pos);
    }

    private getImgShow(){
        let url = ccMessage.MCADDRESS;
        // console.log(url)
        let that = this;
        var img = new Image();
        // console.log("路径：" + ccMessage.MCADDRESS);

        img.src = url;
        // img.src = MassageConfig.erWeiMa;

        img.onload = function () {

            var texture = new cc.Texture2D();

            // texture.generateMipmaps = false;

            texture.initWithElement(img);

            texture.handleLoadedTexture();

            that.ggMc.getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);

        }
    }

    //刷新游戏
    private updateGame(){
        if(this.gqNode.childrenCount>0){
            this.gqNode.destroyAllChildren()
        }
        this.gameModel = new GameM();
        // this.gameModel.node.removeAllChildren();
        this.gameModel.init(5);
        var gridScript = this.gqNode.getComponent("GridView");
        gridScript.node.removeAllChildren();
        gridScript.node.x = -344.5;
        gridScript.node.y = -647;
        gridScript.setController(this);
        gridScript.initWithCellModels(this.gameModel.getCells());

    }

    private cleanCmd(){
        this.gameModel.cleanCmd();
    }

    /**玩家信息显示 ,cc.macro.REPEAT_FOREVER)*/
    private txtShow(){
        GameDataMgr.setDataByType(E_GameData_Type.appScoreNum,0);
        let curpp = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum)
        
        this.gqTxt.string = "第 " + curpp + " 关";
        // this.tipNode.x = 750;
        this.apBool = false;
        this.allBool = false;
        // this.niuNum = 0;
        // this.liNum = 0;
        // this.xhsNum = 0;
        // this.nmNum = 0;
        this.dfTxt.string = "得分 0";
        this.dtNode.active = false;

        // this.niuTxt.string = this.niuNum + "/100";
        // this.liTxt.string = this.liNum +  "/100";
        // this.xhsTxt.string = this.xhsNum +  "/100";
        // this.nmTxt.string = this.nmNum +  "/100";

        
        

        // var titTxt = this.tishiNode.getChildByName("titleTxt").getComponent(cc.Label);
        // var mbtit = this.tishiNode.getChildByName("ggTxt").getComponent(cc.Label);
        // titTxt.string = "第"+curpp+"关";

        let aNum = Math.floor(curpp / 10);
        // this.timerNum = 30 + 30 *aNum;
        // console.log("AAAAAA" + ccMessage.LEVTIME);
        // this.timerNum = ccMessage.LEVTIME;
        // console.log("BBBBB" + this.timerNum);

        this.tiaoNode.width = 0;
        let curLevel = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum);
        if(curLevel<1){
            curLevel = 1;
        }
        let mbscore;
        if(!CurPlatform.GamePlatform){
            mbscore = curLevel*this.minScore;
        }else{
            // console.log(curLevel);
            // console.log(levelList);
            mbscore = levelList[curLevel-1].score;
            this.timerNum = levelList[curLevel-1].time;
            // console.log(levelList[curLevel]);
        }
        

        this.mbTxtNum = mbscore;
        this.mbTxt.string = mbscore+"";

        this.tlTxt.string = this.timerNum + "S";
        this.updateGame();
        // mbtit.string = "目标分数："+mbscore;
        this.curtimerNum = TimeTool.getCurTimeSeconnd();
        this.schedule(this.timerFunc, 1);
    }

     /**更新积分 */
     private apBool:boolean = false;
     public updataScoreShow(){
        if(!this.apBool){
            let score = GameDataMgr.getDataByType(E_GameData_Type.appScoreNum);
            // console.log(score);
            // this.dfTxt.string = score + "";
            this.dfTxt.string = "得分 " + score;
            let scNum = Math.floor((score/this.mbTxtNum)*455);
            if(scNum>=455){
                scNum = 455;
            }
            if(score != 0){
                this.dtNode.active = true;
            }
            this.tiaoNode.width = scNum;
            if(score >= this.mbTxtNum){
                this.zzNode.active = true;
                this.apBool = true;
                this.unschedule(this.timerFunc);
                let levNum = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum)
                NetWork.setLevelMesssage(levNum,(res)=>{
                    if(res){
                        // GameDataMgr.addDataByType(E_GameData_Type.curMaxLevelNum,1,100)
                        // let aa = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum)
                        // console.log(aa);
                        Observer.emit("levelShow");
                        setTimeout(() => {
                            UIManager.openUI("UI_Win");
                            this.zzNode.active = false;
                        }, 1000);
                    }
                });
            }
        }
    }

    /**玩家信息更新 */
    public massageTxtShow(){
        // if(CELL_TYPENUM.NIUYOUGUO>=100){
        //     CELL_TYPENUM.NIUYOUGUO = 100;
        // }
        // if(CELL_TYPENUM.LI>=100){
        //     CELL_TYPENUM.LI = 100;
        // }
        // if(CELL_TYPENUM.XIHONGSHI>=100){
        //     CELL_TYPENUM.XIHONGSHI = 100;
        // }
        // if(CELL_TYPENUM.NINGMENG>=100){
        //     CELL_TYPENUM.NINGMENG = 100;
        // }
        // if(!this.allBool){
        //     if(CELL_TYPENUM.NIUYOUGUO>=100 && CELL_TYPENUM.LI>=100 && CELL_TYPENUM.XIHONGSHI>=100 && CELL_TYPENUM.NINGMENG>=100){
        //         this.allBool = true;
        //     }
        // }
        
        // this.niuTxt.string = CELL_TYPENUM.NIUYOUGUO + "/100";
        // this.liTxt.string = CELL_TYPENUM.LI +  "/100";
        // this.xhsTxt.string = CELL_TYPENUM.XIHONGSHI +  "/100";
        // this.nmTxt.string = CELL_TYPENUM.NINGMENG +  "/100";
    }


    //返回按钮点击
    backBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.C_Click);
        console.log("返回按钮点击");
        UIManager.closeUI(this.node.name);
        UIManager.openUI("UI_Main");
        
    }

    /**计时开始 */
    private timerFunc(){

        let timeStar =   this.timerNum -(TimeTool.getCurTimeSeconnd() - this.curtimerNum);
        // this.timerNum -=1;
        // let shi =Math.floor(this.timerNum / 3600);
        // let tShi =this.timerNum % 3600;
        // let fen =Math.floor(tShi / 60);
        // let miao = tShi % 60;
        // let aFen;
        // let aMiao;
        // if(fen<10){
        //     aFen = "0"+fen;
        // }else{
        //     aFen = fen;
        // }
        // if(miao<10){
        //     aMiao = "0"+miao;
        // }else{
        //     aMiao = miao;
        // }
        // this.tlTxt.string = "倒计时：00 : " + aFen + " : " + aMiao;
        this.tlTxt.string = timeStar + "S";
        if(timeStar<=0){
            this.unschedule(this.timerFunc);
            this.tlTxt.string = 0 + "S";
            console.log("游戏结束");
            let dqscore = GameDataMgr.getDataByType(E_GameData_Type.appScoreNum)
            let levNum = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum)
            let mbNum = this.dfTxt.string;
            if(dqscore >= mbNum){
                NetWork.setLevelMesssage(levNum,(res)=>{
                    if(res){
                        // GameDataMgr.addDataByType(E_GameData_Type.curMaxLevelNum,1,100)
                        // let aa = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum)
                        // console.log(aa);
                        Observer.emit("levelShow");
                        UIManager.openUI("UI_Win");
                    }
                });
                return
            }else{
                UIManager.openUI("UI_Lose");
            }
            // UIManager.closeUI(this.node.name);
        }
    }

    /**计时初始化 */
    private timerShow(num:number){
        // let shi =Math.floor(num / 3600);
        // let tShi =num % 3600;
        // let fen =Math.floor(tShi / 60);
        // let miao = tShi % 60;
        // let aFen;
        // let aMiao;
        // if(fen<10){
        //     aFen = "0"+fen;
        // }else{
        //     aFen = fen;
        // }
        // if(miao<10){
        //     aMiao = "0"+miao;
        // }else{
        //     aMiao = miao;
        // }
        // this.tlTxt.string = "倒计时：00 : " + aFen + " : " + aMiao;
        this.tlTxt.string = this.timerNum + "S";
    }

    private initCmd(){
        // this.txtShow();
        // this.gameModel = new GameModel();
        // // this.gameModel.node.removeAllChildren();
        // this.gameModel.init(5);
        // var gridScript = this.gqNode.getComponent("GridView");
        // gridScript.node.removeAllChildren();
        // gridScript.node.x = -344.5;
        // gridScript.node.y = -646.5
        // gridScript.setController(this);
        // gridScript.initWithCellModels(this.gameModel.getCells());
        // cc.tween(this.tipNode)
        //     .to(0.4, {x : 0}, {easing: 'backOut'})
        //     .to(1.5, {x : 0}, {easing: 'backOut'})
        //     .call(() => {
        //         cc.tween(this.tipNode)
        //             .to(0.4, {x : -750}, {easing: 'backOut'})
        //             .call(() => {
        //                 this.tipNode.x = 750;
        //                 this.schedule(this.timerFunc, 1);
        //             })
        //             .start()
        //     })
        //     .start()
    }

}
