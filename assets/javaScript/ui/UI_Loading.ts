
import { AudioMgr } from "../framework/AudioMgr";
import GameClient from "../framework/GameClient";
import { UIManager } from "../framework/UIManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Loading extends cc.Component {
    @property({
        type: cc.Sprite,
        tooltip: "进度条",
    })
    loadSlider: cc.Sprite = null
    /**加载速度 */
    private speed:number = 0.05;
    /**当前进度 */
    private curRange: number = 0;

    onLoad(){
        this.node.zIndex = 9;
    }

    onEnable(){
        this.loadSlider.fillRange = 0;
        this.curRange = 0;
    }

    update(dt){
        this.curRange += this.speed;
        if(GameClient.isReady){
            if(this.curRange > 1){
                this.curRange = 1;
            }
        }
        else{
            if(this.curRange > 0.8){
                this.curRange = 0.8;
                GameClient.isReady = true;
            }
        }
        this.loadSlider.fillRange = this.curRange;
        if(this.curRange == 1){
            // UIManager.closeUI("UI_Game");
            UIManager.closeUI("UI_Loading");
            AudioMgr.setVolume(1);
            this.curRange = 0;
            GameClient.isReady = false;
            // if(IsAldState){
            //     wx.aldSendEvent("1002加载完成");
            // }
        }
    }
}
