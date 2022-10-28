import { ruleList } from "../config/Config";
import { NetWork } from "../framework/NetWork";
import { UIManager } from "../framework/UIManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Rule extends cc.Component {

    @property({
        type: cc.Node,
        tooltip: "背景"
    })
    private ruleNode: cc.Node = null;

    @property({
        type: cc.AudioClip,
        tooltip: "音乐"
    })
    private clxc: cc.AudioClip = null;

    private ruLen:number = 0;

    onLoad () {

    }

    onEnable(){
        for (let a = 1; a <= 8 ; a++) {
            let st = "rankItem" + a;
            this.ruleNode.getChildByName(st).active = false;
        }
        NetWork.getRuleMesssage((res)=>{
            if(res){
                this.ruLen = ruleList.length;
                // console.log(this.ruLen);
                for (let a = 1; a <= this.ruLen ; a++) {
                    let str = "rankItem" + a;
                    this.ruleNode.getChildByName(str).active = true;
                    this.ruleNode.getChildByName(str).getComponent(cc.Label).string = ruleList[a-1].context;
                }
            }
        })
    }

    

    /**关闭点击 */
    private backBtnClick(){
        // console.log("关闭点击");
        cc.audioEngine.play(this.clxc, false, 1);
        UIManager.closeUI(this.node.name);
    }

    // update (dt) {}
}
