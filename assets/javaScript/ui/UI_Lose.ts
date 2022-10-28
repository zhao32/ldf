
import { audioConfig } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";
import UI_Base from "../framework/UI_Base";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Lose extends UI_Base {


    @property({
        type: cc.Label,
        tooltip: "名字框"
    })
    private titleNode: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "名字框"
    })
    private reachNode: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "目标分数"
    })
    private mbNode: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "名字框"
    })
    private dfNode: cc.Label = null;

    @property({
        type: cc.AudioClip,
        tooltip: "音乐"
    })
    private clxc: cc.AudioClip = null;


    // LIFE-CYCLE CALLBACKS:
    private minScore:number = 10;

    onLoad () {
        super.onLoad();
    }

    onEnable(){
        super.onEnable();
        let curLevel = GameDataMgr.getDataByType(E_GameData_Type.curMaxLevelNum);
        let mbscore = curLevel*this.minScore;
        this.mbNode.string = "目标分数："+mbscore;
        let score = GameDataMgr.getDataByType(E_GameData_Type.appScoreNum);
        this.dfNode.string = "玩家得分："+score;
        this.titleNode.string = "第"+curLevel+"关";
    }

    //返回按钮点击
    backBtnClick(){
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.closeUI("UI_Lose");
        UIManager.closeUI("UI_Fight");
        UIManager.openUI("UI_Main");
    }

    //重玩本关按钮点击
    againBtnClick(){
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.closeUI("UI_Lose");
        Observer.emit("obs");
        // UIManager.openUI("UI_Fight");
        Observer.emit("sxShow");
    }

    // update (dt) {},
}
