
import { ccMessage } from "../config/Config";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { TimeTool } from "../framework/TimeTool";
import { UIManager } from "../framework/UIManager";
import UI_Base from "../framework/UI_Base";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Win extends UI_Base {


    @property({
        type: cc.Label,
        tooltip: "报名人数"
    })
    private rsNode: cc.Label = null;

    private curScore:number = 5;//当前人数
    private allScore:number = 30;//总人数

    private timeBool:boolean = false;

    onLoad () {

    }

    onEnable(){
        this.timeBool = true;
        NetWork.getCurFieldMesssage((res)=>{
            this.curScore= GameDataMgr.getDataByType(E_GameData_Type.curPeoperNum);
            // console.log(this.curScore)
            this.allScore = GameDataMgr.getDataByType(E_GameData_Type.maxPeoperNum);
            // console.log(this.allScore)
            this.rsNode.string = "报名人数：" + this.curScore + "/" + this.allScore;
            // console.log("走了没")
            this.timeOutShow();
        })
    }

    private timeOutShow(){
        setTimeout(() => {
            NetWork.getCurFieldMesssage((res)=>{
                if(res){
                    this.curScore= GameDataMgr.getDataByType(E_GameData_Type.curPeoperNum);
                    // console.log(this.curScore)
                    this.allScore = GameDataMgr.getDataByType(E_GameData_Type.maxPeoperNum);
                    // console.log(this.allScore)
                    this.rsNode.string = "报名人数：" + this.curScore + "/" + this.allScore;

                    if(this.curScore == this.allScore){
                        this.timeBool = false;
                        return;
                    }
                    this.timeOutShow();
                }
                
            })
        }, 3000);
    }

    private aFight(){
        // setTimeout(() => {
            UIManager.openUI("UI_MultiplayerFight");
            // }, 1000);
    }

    //返回按钮点击
    backBtnClick(){
        // cc.audioEngine.play(this.clxc, false, 1);
        // UIManager.closeUI("UI_Lose");
        // UIManager.closeUI("UI_Fight");
        // UIManager.openUI("UI_Main");
    }

    update(dt: number){
        if(!this.timeBool){
            let timNum = TimeTool.getCurDataBySeconnd();
            if(ccMessage.TIMELABLE == timNum){
                this.aFight();  
                this.timeBool = true;
            }
        }
        
    }
}
