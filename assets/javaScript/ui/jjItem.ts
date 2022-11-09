import { audioConfig, ccMessage, gameData, jjcList, rankList } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { ResourcesMgr } from "../framework/ResourcesMgr";
import { UIManager } from "../framework/UIManager";
import UI_Tip from "./UI_Tip";

const {ccclass, property} = cc._decorator;

/**
 * 好友Item
 * fjm
 */
@ccclass
export default class rankItem extends cc.Component {
    @property({
        type: cc.Label,
        tooltip: "时间"
    })
    private timeTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "人数"
    })
    private peoTxt: cc.Label = null;

    @property({
        type: cc.Sprite,
        tooltip: "按钮Mc"
    })
    private getBtnSpr: cc.Sprite = null;

    @property({
        type: cc.Label,
        tooltip: "金币"
    })
    private goldTxt: cc.Label = null;

    @property({
        type: cc.SpriteFrame,
        tooltip: "按钮状态"
    })
    private getBtnTypeSpr: cc.SpriteFrame[] = [];

    onLoad () {
        // this.init();
    }


    // init(){

    // }

    /**好友显示 3结束  2进行中  1进入游戏   0未报名*/
    private itemShow(ai:number){
        this.timeTxt.string = jjcList[ai].time2+"";
        this.peoTxt.string = jjcList[ai].bnum + "/"+ jjcList[ai].pnum + "人";
        this.goldTxt.string = jjcList[ai].score;
        if(jjcList[ai].gstate == 0){
            this.getBtnSpr.spriteFrame = this.getBtnTypeSpr[0];
        }else if(jjcList[ai].gstate == 1){
            this.getBtnSpr.spriteFrame = this.getBtnTypeSpr[1];
        }else if(jjcList[ai].gstate == 2){
            this.getBtnSpr.spriteFrame = this.getBtnTypeSpr[2];
        }else if(jjcList[ai].gstate == 3){
            this.getBtnSpr.spriteFrame = this.getBtnTypeSpr[3];
        }
    }

    /**卡片点击 */
    private carClick(event){
        AudioMgr.playAudioEffect(audioConfig.C_Click)
        let carName =  event.target.name;
        // console.log("名字是：" + carName);
        let id = carName.substr(3);
        // console.log("名字是：" + id);
        let CarId = Number(id);
        // console.log("ID：" + CarId);
        // console.log("列表：" + jjcList[CarId].id);
        GameDataMgr.setDataByType(E_GameData_Type.ccIdNum, CarId);

        let canClick = true
        if(jjcList[CarId].gstate == 0){
            NetWork.setFieldMesssage(jjcList[CarId].id,(res,msg,num,resp)=>{
                let amsg = msg+"";
                if(res){
                    Observer.emit("sxItem");
                    UI_Tip.Instance.showTip(amsg);
                    this.getBtnSpr.spriteFrame = this.getBtnTypeSpr[1];
                }else{
                    UI_Tip.Instance.showTip(amsg);
                }
            })
        }else if(jjcList[CarId].gstate == 1){
           
            // Observer.emit("maskShow");
            gameData.UI_Ath.mskSHow()
            UI_Tip.Instance.showTip("等待进入游戏")
            console.log("进入游戏");
            ccMessage.CCID = jjcList[CarId].id;
            NetWork.getGoChangMesssage(jjcList[CarId].id,(res,msg,resp)=>{
                let a = msg+"";
                let ret = resp;
                if(res){
                    Observer.emit("timeOS");
                    let resps = ret.info.time;
                    GameDataMgr.setDataByType(E_GameData_Type.playdzsj,resps)
                    GameDataMgr.setDataByType(E_GameData_Type.appScoreNum,ret.info.score)

                    // Observer.emit("maskClear");
                    UIManager.openUI("UI_MultiplayerFight");
                }else{
                    UI_Tip.Instance.showTip(a);
                    // Observer.emit("maskClear");
                }
                this.scheduleOnce(()=>{
                    gameData.UI_Ath.mskClear() 
                },1)

            })
            this.scheduleOnce(()=>{
                gameData.UI_Ath.mskClear() 
            },2)
        }else if(jjcList[CarId].gstate == 2){
            UI_Tip.Instance.showTip("该场次正在进行中,无法进入");
        }else if(jjcList[CarId].gstate == 3){
            UI_Tip.Instance.showTip("该场次已经结束");
        }
    }

    // update (dt) {}
}
