import { ccMessage, rankList } from "../config/Config";
import { NetWork } from "../framework/NetWork";
import { UIManager } from "../framework/UIManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Rank extends cc.Component {

    @property({
        type: cc.AudioClip,
        tooltip: "音乐"
    })
    private clxc: cc.AudioClip = null;

    @property({
        type: cc.Prefab,
        tooltip: "排名item"
    })
    private rankItem: cc.Prefab = null;

    @property({
        type: cc.Node,
        tooltip: "content"
    })
    private content: cc.Node = null;

    @property({
        type: cc.Label,
        tooltip: "场次信息"
    })
    private ccxxTxt: cc.Label = null;

    private raLen = rankList.length;

    onLoad () {
    }
    
    onEnable(){
        NetWork.getRankMesssage((res)=>{
            if(res){
                this.raLen = rankList.length;
                this.ccxxTxt.string = ccMessage.PANKTS +  "";
                // console.log(this.raLen);
                this.itemViewShow();
            }
        })
    }

    /**好友Item加载 */
    private itemViewShow(){
        let content = this.content;
        content.removeAllChildren();

        for(let i = 0;i < this.raLen ;i++){
            let item = cc.instantiate(this.rankItem);
            content.addChild(item)
            item.name = "ran" + i;
            let view = item.getComponent("rankItem");
            view.itemShow(i);
        }
    }

    //返回点击
    private backBtnClick(){
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.closeUI("UI_Rank");
        // console.log("返回点击");
    }

    // update (dt) {},
}
