import { audioConfig, rankList } from "../config/Config";
import { ResourcesMgr } from "../framework/ResourcesMgr";

const {ccclass, property} = cc._decorator;

/**
 * 好友Item
 * fjm
 */
@ccclass
export default class rankItem extends cc.Component {
    @property({
        type: cc.Label,
        tooltip: "排行"
    })
    private rankMcTxt: cc.Label = null;

    @property({
        type: cc.Label,
        tooltip: "昵称"
    })
    private rankNcTxt: cc.Label = null;

    onLoad () {
        // this.init();
    }


    // init(){

    // }

    /**好友显示 */
    private itemShow(ai:number){
        let name1 = rankList[ai].names1;
        let name2 = rankList[ai].names2;
        this.rankMcTxt.string = name1+ "";
        this.rankNcTxt.string = name2 + "";
    }

    // update (dt) {}
}
