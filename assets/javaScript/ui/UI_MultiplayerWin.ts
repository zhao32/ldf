
import { audioConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Base from "../framework/UI_Base";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Win extends UI_Base {

    @property({
        type: cc.Label,
        tooltip: "名字框"
    })
    private titleNode: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "目标分数"
    })
    private dfNode: cc.Label = null;
    
    @property({
        type: cc.AudioClip,
        tooltip: "音乐"
    })
    private clxc: cc.AudioClip = null;

    private minScore:number = 10;

    onLoad () {
    }

    onEnable(){
        let curLevel = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum);
        if(curLevel>1){
            let a = curLevel - 1;
            this.titleNode.string = "第"+a+"关";
            let mbscore = a*this.minScore;
            // this.mbNode.string = "目标分数："+mbscore;
            let score = GameDataMgr.getDataByType(E_GameData_Type.appScoreNum);
            this.dfNode.string = "玩家得分："+score;
        }
    }

    //返回按钮点击
    backBtnClick(){
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.closeUI("UI_Lose");
        UIManager.closeUI("UI_Fight");
        UIManager.openUI("UI_Main");
    }

    //下一关按钮点击
    nextBtnClick(){
        cc.audioEngine.play(this.clxc, false, 1);
        AudioMgr.playAudioEffect(audioConfig.C_Click);
        // let curpp = GameDataMgr.getDataByType(E_GameData_Type.curLevelNum);
        // console.log("关数" +curpp);
        UIManager.closeUI("UI_Win");
        Observer.emit("txtShow")
        Observer.emit("sxShow");
    }

    // update (dt) {},
}
