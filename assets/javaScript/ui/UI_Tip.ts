
const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Tip extends cc.Component {
    /**UI_Tip 静态单例 */
    public static Instance: UI_Tip = null;

    /**持续时间 */
    private resTime: number = 1;
    /**当前时间 */
    private curTime: number = 0;
    onLoad(){
        UI_Tip.Instance = this;
        this.node.zIndex = 10;
        this.showTip(null);
    }

    onEnable(){
        this.curTime = 0;
    }

    public showTip(str: string){
        if(!str || str.length <= 0){
            this.node.active = false;
            return;
        }
        let txt = this.node.getChildByName("txt").getComponent(cc.Label);
        let bg = this.node.getChildByName("bg");
        txt.string = str;
        bg.width = 30 * str.length + 60;
        this.node.active = true;
    }

    update(dt){
        this.curTime += dt;
        if(this.curTime >= this.resTime){
            this.node.active = false;
        }
    }
}
