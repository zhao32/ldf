import { audioConfig, jjcList } from "../config/Config";
import { AudioMgr } from "../framework/AudioMgr";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";
import { NetWork } from "../framework/NetWork";
import { Observer } from "../framework/Observer";
import { UIManager } from "../framework/UIManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class UI_Athletics extends cc.Component {

    @property({
        type: cc.Prefab,
        tooltip: "竞技item"
    })
    private jjItem: cc.Prefab = null;

    @property({
        type: cc.Node,
        tooltip: "content"
    })
    private content: cc.Node = null;


    @property({
        type: cc.Node,
        tooltip: "mask"
    })
    private maskNode: cc.Node = null;

    private raLen:number = 0;

    onLoad () {
        Observer.on("sxItem",this.sxItemShow,this);
        Observer.on("timeOS",this.timeOS,this);
        Observer.on("maskShow",this.mskSHow,this);
        Observer.on("maskClear",this.mskClear,this);
    }

    onEnable(){
        NetWork.getAthleticsMesssage((res)=>{
            if(res){
                this.raLen = jjcList.length;
                // console.log(this.raLen);
                this.itemViewShow();
            }
        })
        this.timeOutShow();
    }
    onDestroy(){
        Observer.off("sxItem");
        Observer.off("timeOS");
        Observer.off("maskShow");
        Observer.off("maskClear");
    }

    /**刷新接口 */
    sxItemShow(){
        NetWork.getAthleticsMesssage((res)=>{
            if(res){
                this.raLen = jjcList.length;
                // if(this.raLen >0){
                //     GameDataMgr.setDataByType(E_GameData_Type.playdzsj,jjcList[0].time)
                // }
                this.itemViewShow();
            }
        })
    }

    /**好友Item加载 */
    private itemViewShow(){
        let content = this.content;
        content.removeAllChildren();
        for(let i = 0;i < this.raLen ;i++){
            let item = cc.instantiate(this.jjItem);
            content.addChild(item)
            item.getChildByName("getBtn").name = "jjc" + i;
            let view = item.getComponent("jjItem");
            view.itemShow(i);
        }
    }
    private aabb:any;
    private timeOutShow(){
        this.aabb = setInterval(() => {
            this.sxItemShow();
        }, 30000);
    }

    private timeOS(){
        clearInterval(this.aabb);
    }

     /**返回接口 */
    private backBtnClick(){
        AudioMgr.playAudioEffect(audioConfig.C_Click);
        UIManager.closeUI("UI_Athletics");
        UIManager.openUI("UI_Main");
    }

    private mskSHow(){
        // this.maskNode.x = 0;
        this.maskNode.active = true
    }

    private mskClear(){
        // this.maskNode.x = -710;
        this.maskNode.active = false

    }

    // update (dt) {}
}
