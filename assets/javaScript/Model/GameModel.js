import CellModel from "./CellModel";
import {mergePointArray, exclusivePoint} from "../Utils/ModelUtils"
import { CELL_TYPE, CELL_BASENUM, CELL_STATUS, GRID_WIDTH, GRID_HEIGHT, ANITIME } from "./ConstValue";
import {CELL_TYPENUM} from "../config/Config";
import UI_Fight from "../ui/UI_Fight";
import UI_Tip from "../ui/UI_Tip";
import { Observer } from "../framework/Observer";
import { E_GameData_Type, GameDataMgr } from "../framework/GameDataMgr";

export default class GameModel{
    constructor() {
        this.cells = null;
        this.cellBgs = null;
        this.lastPos = cc.v2(-1, -1);
        this.cellTypeNum = 6;
        this.cellCreateType = []; // 升成种类只在这个数组里面查找
        this.aNum = 3;
        this.bNum = 12;
        this.cNum = 15;
        this.dNum = 20;
    }

    init(cellTypeNum) {
        this.cells = [];
        this.setCellTypeNum(cellTypeNum || this.cellTypeNum);
        for (var i = 1; i <= 7; i++) {
            this.cells[i] = [];
            for (var j = 1; j <= 6; j++) {
                this.cells[i][j] = new CellModel();
            }
        }

        // this.mock();

        for (var i = 1; i <= 7; i++) {
            for (var j = 1; j <= 6; j++) {
                //已经被mock数据生成了
                if(this.cells[i][j].type != null){
                    continue;
                }
                let flag = true;
                while (flag) {
                    flag = false;

                    this.cells[i][j].init(this.getRandomCellType());
                    let result = this.checkPoint(j, i)[0];
                    if (result.length > 2) {
                        flag = true;
                    }
                    this.cells[i][j].setXY(j, i);
                    this.cells[i][j].setStartXY(j, i);
                }
            }
        }

    }

    mock(){
        this.mockInit(5, 1, CELL_TYPE.A);
        this.mockInit(5, 3, CELL_TYPE.A);
        this.mockInit(4, 2, CELL_TYPE.A);
        this.mockInit(3, 2, CELL_TYPE.A);
        this.mockInit(5, 2, CELL_TYPE.B);
        this.mockInit(6, 2, CELL_TYPE.B);
        this.mockInit(7, 3, CELL_TYPE.B);
        this.mockInit(8, 2, CELL_TYPE.A);
    }
    mockInit(x, y, type){
        this.cells[x][y].init(type)
        this.cells[x][y].setXY(y, x);
        this.cells[x][y].setStartXY(y, x);
    }


    initWithData(data) {
        // to do
    }

    /**
     *
     * @param x
     * @param y
     * @param recursive 是否递归查找
     * @returns {([]|string|*)[]}
     */
    checkPoint(x, y, recursive) {
        let rowResult = this.checkWithDirection( x, y, [cc.v2(1, 0), cc.v2(-1, 0)]);
        let colResult = this.checkWithDirection( x, y, [cc.v2(0, -1), cc.v2(0, 1)]);
        let samePoints = [];
        let newCellStatus = "";
        if (rowResult.length >= 5 || colResult.length >= 5) {
            newCellStatus = CELL_STATUS.BIRD;
        }
        else if (rowResult.length >= 3 && colResult.length >= 3) {
            newCellStatus = CELL_STATUS.BOOM;
        }
        else if (rowResult.length >= 4 || colResult.length >= 4) {
            newCellStatus = CELL_STATUS.LINE;
        }
        // else if (colResult.length >= 4) {
        //     newCellStatus = CELL_STATUS.LINE;
        // }
        if (rowResult.length >= 3) {
            samePoints = rowResult;
        }
        if (colResult.length >= 3) {
            samePoints = mergePointArray(samePoints, colResult);
        }
        let result = [samePoints, newCellStatus, this.cells[y][x].type, cc.v2(x, y)];
        // 检查一下消除的其他节点， 能不能生成更大范围的消除
        if(recursive && result.length >= 3){
            let subCheckPoints = exclusivePoint(samePoints, cc.v2(x,y));
            for(let point of subCheckPoints){
                let subResult = this.checkPoint(point.x, point.y, false);
                if(subResult[1] > result[1] || (subResult[1] === result[1] && subResult[0].length > result[0].length)){
                    result = subResult;
                }
            }
        }
        return result;
    }

    checkWithDirection(x, y, direction){
        let queue = [];
        let vis = [];
        vis[x + y * 7] = true;
        queue.push(cc.v2(x, y));
        let front = 0;
        while (front < queue.length) {
            //let direction = [cc.v2(0, -1), cc.v2(0, 1), cc.v2(1, 0), cc.v2(-1, 0)];
            let point = queue[front];
            let cellModel = this.cells[point.y][point.x];
            front++;
            if (!cellModel) {
                continue;
            }
            for (let i = 0; i < direction.length; i++) {
                let tmpX = point.x + direction[i].x;
                let tmpY = point.y + direction[i].y;
                
                if (tmpX < 1 || tmpX > 6
                    || tmpY < 1 || tmpY > 7
                    || vis[tmpX + tmpY * 7]
                    || !this.cells[tmpY][tmpX]) {
                    continue;
                }
                if (cellModel.type === this.cells[tmpY][tmpX].type) {
                    vis[tmpX + tmpY * 7] = true;
                    queue.push(cc.v2(tmpX, tmpY));
                }
            }
        }
        return queue;
    }

    printInfo() {
        for (var i = 1; i <= 7; i++) {
            var printStr = "";
            for (var j = 1; j <= 6; j++) {
                printStr += this.cells[i][j].type + " ";
            }
        }
    }

    getCells() {
        return this.cells;
    }
    // controller调用的主要入口
    // 点击某个格子
    selectCell(pos) {
        this.changeModels = [];// 发生改变的model，将作为返回值，给view播动作
        this.effectsQueue = []; // 动物消失，爆炸等特效
        var lastPos = this.lastPos;
        let curClickCellA= this.cells[pos.y][pos.x]; //当前点击的格子
        // console.log(curClickCellA);
        // // if(curClickCellA.status == CELL_STATUS.BIRD || curClickCellA.status == CELL_STATUS.LINE || curClickCellA.status == CELL_STATUS.BOOM){
        if(curClickCellA.status == CELL_STATUS.LINE || curClickCellA.status == CELL_STATUS.BOOM){
            // if(curClickCellA.status == CELL_STATUS.BIRD){
            //     GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.dNum);
            //     Observer.emit("scoreTxt");
            // }
            if(curClickCellA.status == CELL_STATUS.LINE){
                GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.cNum);
                // Observer.emit("scoreTxt");
            }
            if(curClickCellA.status == CELL_STATUS.BOOM){
                GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.bNum);
                // Observer.emit("scoreTxt");
            }
            var checkPoint = [pos,pos];
            this.curTime += ANITIME.TOUCH_MOVE;
            this.processCrush(checkPoint);
            // this.subPowerNum();
            return [this.changeModels, this.effectsQueue];
        }

        var delta = Math.abs(pos.x - lastPos.x) + Math.abs(pos.y - lastPos.y);
        if (delta != 1) { //非相邻格子， 直接返回
            this.lastPos = pos;
            return [[], []];
        }
        let curClickCell = this.cells[pos.y][pos.x]; //当前点击的格子
        let lastClickCell = this.cells[lastPos.y][lastPos.x]; // 上一次点击的格式
        this.exchangeCell(lastPos, pos);
        var result1 = this.checkPoint(pos.x, pos.y)[0];
        var result2 = this.checkPoint(lastPos.x, lastPos.y)[0];
        this.curTime = 0; // 动画播放的当前时间
        this.pushToChangeModels(curClickCell);
        this.pushToChangeModels(lastClickCell);
        let isCanBomb = (curClickCell.status != CELL_STATUS.COMMON && // 判断两个是否是特殊的动物
            lastClickCell.status != CELL_STATUS.COMMON) ||
            curClickCell.status == CELL_STATUS.BIRD ||
            lastClickCell.status == CELL_STATUS.BIRD;
        if (result1.length < 3 && result2.length < 3 && !isCanBomb) {//不会发生消除的情况
            this.exchangeCell(lastPos, pos);
            curClickCell.moveToAndBack(lastPos);
            lastClickCell.moveToAndBack(pos);
            this.lastPos = cc.v2(-1, -1);
            return [this.changeModels];
        }
        else {
            this.lastPos = cc.v2(-1, -1);
            curClickCell.moveTo(lastPos, this.curTime);
            lastClickCell.moveTo(pos, this.curTime);
            var checkPoint = [pos, lastPos];
            this.curTime += ANITIME.TOUCH_MOVE;
            this.processCrush(checkPoint);
            // this.subPowerNum();
            // GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.aNum);
            // Observer.emit("scoreTxt");
            return [this.changeModels, this.effectsQueue];
        }
        
    }

    // 消除1
    // processCrush1(checkPoint) {
    //     let bombModels = [];
    //     let cycleCount = 0;
    //     let pos1 = checkPoint[0];
    //     let model1 = this.cells[pos1.y][pos1.x];
    //     if (model1.status == CELL_STATUS.BIRD || model1.status == CELL_STATUS.LINE) {
    //         let bombModel = null;
    //         if (model1.status == CELL_STATUS.BIRD) {
    //             // model1.type = model2.type;
    //             bombModels.push(model1);
    //             this.processBomb(bombModels, cycleCount);
    //             this.curTime += ANITIME.DIE;
    //             checkPoint = this.down();
    //             return;

    //         }else if(model1.status == CELL_STATUS.LINE){
    //             bombModels.push(model1);
    //             this.processBomb(bombModels, cycleCount);
    //             this.curTime += ANITIME.DIE;
    //             checkPoint = this.down();
    //             return;
    //         }
    //     }
    // }

    // 消除
    processCrush(checkPoint) {
        let cycleCount = 0;
        while (checkPoint.length > 0) {
            let bombModels = [];
            if (cycleCount == 0 && checkPoint.length == 2) { //特殊消除
                let pos1 = checkPoint[0];
                let pos2 = checkPoint[1];
                let model1 = this.cells[pos1.y][pos1.x];
                let model2 = this.cells[pos2.y][pos2.x];
                if (model1.status == CELL_STATUS.BIRD || model2.status == CELL_STATUS.BIRD) {
                    let bombModel = null;
                    if (model1.status == CELL_STATUS.BIRD) {
                        model1.type = model2.type;
                        // console.log(model1);
                        // console.log(model2);
                        bombModels.push(model1);
                    }
                    else if(model2.status == CELL_STATUS.BIRD){
                        // console.log(model1);
                        // console.log(model2);
                        model2.type = model1.type;
                        bombModels.push(model2);
                    }
                    GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.dNum);
                }
                if (model1.status == CELL_STATUS.LINE || model1.status == CELL_STATUS.BOOM) {
                    let bombModel = null;
                    if(model1.status == CELL_STATUS.LINE){
                        bombModels.push(model1);
                        // this.processBomb(bombModels);
                        // this.curTime += ANITIME.DIE;
                        // checkPoint = this.down();
                        // return;
                        // GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.bNum);
                    }else if(model1.status == CELL_STATUS.BOOM){
                        bombModels.push(model1);
                        // GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.cNum);
                        // this.processBomb(bombModels);
                        // this.curTime += ANITIME.DIE;
                        // checkPoint = this.down();
                        // return;
                    }
                    // console.log(model1.type)
                    // console.log(model2.type)
                }
            }
            for (var i in checkPoint) {
                var pos = checkPoint[i];
                if (!this.cells[pos.y][pos.x]) {
                    continue;
                }
                var [result, newCellStatus, newCellType, crushPoint] = this.checkPoint(pos.x, pos.y, true);

                if (result.length < 3) {
                    continue;
                }
                for (var j in result) {
                    var model = this.cells[result[j].y][result[j].x];
                    this.crushCell(result[j].x, result[j].y, false, cycleCount);
                    if (model.status != CELL_STATUS.COMMON) {
                        bombModels.push(model);
                    }
                }
                this.createNewCell(crushPoint, newCellStatus, newCellType);
            }
            this.processBomb(bombModels, cycleCount);
            
            this.curTime += ANITIME.DIE;
            checkPoint = this.down();
            cycleCount++;
            // Observer.emit("scoreTxt");
        }
    }

    //生成新cell
    createNewCell(pos, status, type) {
        if (status == "") {
            GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.aNum);
            return;
        }
        if (status == CELL_STATUS.LINE) {
            GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.cNum);
            type = CELL_TYPE.LINE
        }
        if (status == CELL_STATUS.BOOM) {
            GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.bNum);
            type = CELL_TYPE.BOOM
        }
        if (status == CELL_STATUS.BIRD) {
            GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.dNum);
            type = CELL_TYPE.BIRD
        }
        let model = new CellModel();
        this.cells[pos.y][pos.x] = model
        model.init(type);
        model.setStartXY(pos.x, pos.y);
        model.setXY(pos.x, pos.y);
        model.setStatus(status);
        model.setVisible(0, false);
        model.setVisible(this.curTime, true);
        this.changeModels.push(model);
        // Observer.emit("scoreTxt");
    }
    // 下落
    down() {
        let newCheckPoint = [];
        for (var i = 1; i <= 7; i++) {
            for (var j = 1; j <= 6; j++) {
                if (this.cells[i][j] == null) {
                    var curRow = i;
                    for (var k = curRow; k <= 7; k++) {
                        if (this.cells[k][j]) {
                            this.pushToChangeModels(this.cells[k][j]);
                            newCheckPoint.push(this.cells[k][j]);
                            this.cells[curRow][j] = this.cells[k][j];
                            this.cells[k][j] = null;
                            this.cells[curRow][j].setXY(j, curRow);
                            this.cells[curRow][j].moveTo(cc.v2(j, curRow), this.curTime);
                            curRow++;
                        }
                    }
                    var count = 1;
                    for (var k = curRow; k <= 7; k++) {
                        this.cells[k][j] = new CellModel();
                        this.cells[k][j].init(this.getRandomCellType());
                        this.cells[k][j].setStartXY(j, count + 7);
                        this.cells[k][j].setXY(j, count + 7);
                        this.cells[k][j].moveTo(cc.v2(j, k), this.curTime);
                        count++;
                        this.changeModels.push(this.cells[k][j]);
                        newCheckPoint.push(this.cells[k][j]);
                    }

                }
            }
        }
        this.curTime += ANITIME.TOUCH_MOVE + 0.3
        // Observer.emit("scoreTxt");
        // GameDataMgr.getDataByType(E_GameData_Type.appScoreNum);
        //     Observer.emit("scoreTxt");
        return newCheckPoint;
    }

    pushToChangeModels(model) {
        if (this.changeModels.indexOf(model) != -1) {
            return;
        }
        this.changeModels.push(model);
    }

    cleanCmd() {
        for (var i = 1; i <= 7; i++) {
            for (var j = 1; j <= 6; j++) {
                if (this.cells[i][j]) {
                    this.cells[i][j].cmd = [];
                }
            }
        }
    }

    exchangeCell(pos1, pos2) {
        var tmpModel = this.cells[pos1.y][pos1.x];
        this.cells[pos1.y][pos1.x] = this.cells[pos2.y][pos2.x];
        this.cells[pos1.y][pos1.x].x = pos1.x;
        this.cells[pos1.y][pos1.x].y = pos1.y;
        this.cells[pos2.y][pos2.x] = tmpModel;
        this.cells[pos2.y][pos2.x].x = pos2.x;
        this.cells[pos2.y][pos2.x].y = pos2.y;
    }
    // 设置种类
    // Todo 改成乱序算法
    setCellTypeNum(num) {
        //console.log("num = ", num);
        this.cellTypeNum = num;
        this.cellCreateType = [];
        let createTypeList = this.cellCreateType;
        for (let i = 1; i <= CELL_BASENUM; i++) {
            createTypeList.push(i);
        }
        for (let i = 0; i < createTypeList.length; i++) {
            let index = Math.floor(Math.random() * (CELL_BASENUM - i)) + i;
            createTypeList[i], createTypeList[index] = createTypeList[index], createTypeList[i]
        }
    }
    // 随要生成一个类型
    getRandomCellType() {
        var index = Math.floor(Math.random() * this.cellTypeNum);
        return this.cellCreateType[index];
    }
    // TODO bombModels去重
    processBomb(bombModels, cycleCount) {
        while (bombModels.length > 0) {
            this.curTime = 0.3;
            let newBombModel = [];
            let bombTime = ANITIME.BOMB_DELAY;
            bombModels.forEach(function (model) {
                if (model.status == CELL_STATUS.LINE) {
                    for (let i = 1; i <= 7; i++) {
                        if (this.cells[model.y][i]) {
                            if (this.cells[model.y][i].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[model.y][i]);
                            }
                            this.crushCell2(i, model.y, false, cycleCount);
                        }
                        if (this.cells[i][model.x]) {
                            if (this.cells[i][model.x].status != CELL_STATUS.COMMON) {
                                newBombModel.push(this.cells[i][model.x]);
                            }
                            this.crushCell2(model.x, i, false, cycleCount);
                        }
                    }
                    // this.addRowBomb(this.curTime, cc.v2(model.x, model.y));
                    this.addColBomb(this.curTime, cc.v2(model.x, model.y));
                }
                // else if (model.status == CELL_STATUS.COLUMN) {
                //     for (let i = 1; i <= 7; i++) {
                //         if (this.cells[i][model.x]) {
                //             if (this.cells[i][model.x].status != CELL_STATUS.COMMON) {
                //                 newBombModel.push(this.cells[i][model.x]);
                //             }
                //             this.crushCell(model.x, i, false, cycleCount);
                //         }
                //     }
                //     this.addColBomb(this.curTime, cc.v2(model.x, model.y));
                // }
                else if (model.status == CELL_STATUS.BOOM) {
                    let x = model.x;
                    let y = model.y;
                    for (let i = 1; i <= GRID_HEIGHT; i++) {
                        for (let j = 1; j <= GRID_WIDTH; j++) {
                            let delta = Math.abs(x - j) + Math.abs(y - i);
                            if (this.cells[i][j] && delta <= 2) {
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, false, cycleCount);
                            }
                        }
                    }
                    // GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.cNum);
                    // Observer.emit("scoreTxt");
                }
                // else if (model.status == CELL_STATUS.BIRD) {
                //     let x = model.x;
                //     let y = model.y;
                //     for (let i = 1; i <= 7; i++) {
                //         for (let j = 1; j <= 6; j++) {
                //             let delta = Math.abs(x - j) + Math.abs(y - i);
                //             if (this.cells[i][j] && delta <= 2) {
                //                 if (this.cells[i][j].status != CELL_STATUS.COMMON){
                //                     newBombModel.push(this.cells[i][j]);
                //                     // newBombModel.push(this.cells[i-1][j]);
                //                     // newBombModel.push(this.cells[i+1][j]);
                //                 }
                //                 this.crushCell(j, i, false, cycleCount);
                //             }
                //         }
                //     }
                // }
                else if (model.status == CELL_STATUS.BIRD) {
                    let crushType = model.type
                    if (bombTime < ANITIME.BOMB_BIRD_DELAY) {
                        bombTime = ANITIME.BOMB_BIRD_DELAY;
                    }
                    if (crushType == CELL_TYPE.BIRD) {
                        crushType = this.getRandomCellType();
                    }
                    for (let i = 1; i <= 7; i++) {
                        for (let j = 1; j <= 6; j++) {
                            if (this.cells[i][j] && this.cells[i][j].type == crushType) {
                                if (this.cells[i][j].status != CELL_STATUS.COMMON) {
                                    newBombModel.push(this.cells[i][j]);
                                }
                                this.crushCell(j, i, true, cycleCount);
                            }
                        }
                    }
                    // this.crushCell(model.x, model.y);
                    // GameDataMgr.addDataByType(E_GameData_Type.appScoreNum,this.dNum);
                }
            }, this);
            if (bombModels.length > 0) {
                this.curTime += bombTime;
            }
            bombModels = newBombModel;
            
        }
    }
    /**
     * 
     * @param {开始播放的时间} playTime 
     * @param {*cell位置} pos 
     * @param {*第几次消除，用于播放音效} step 
     */
    addCrushEffect(playTime, pos, step) {
        // console.log("QQQQQQQQQQQQQ"+ step);
        this.effectsQueue.push({
            playTime,
            pos,
            action: "crush",
            step
        });
    }

    addRowBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "rowBomb"
        });
    }

    addColBomb(playTime, pos) {
        this.effectsQueue.push({
            playTime,
            pos,
            action: "colBomb"
        });
    }

    addWrapBomb(playTime, pos) {
        // TODO
    }
    // cell消除逻辑
    crushCell(x, y, needShake, step) {
        let model = this.cells[y][x];
        this.crushTypeNum(model);
        this.pushToChangeModels(model);
        if (needShake) {
            model.toShake(this.curTime)
        }
        let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
        model.toDie(this.curTime + shakeTime);
        this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y), step);
        this.cells[y][x] = null;
        // Observer.emit("scoreTxt");
    }

    // cell2消除逻辑
    crushCell2(x, y, needShake, step) {
        let model = this.cells[y][x];
        // console.log(model);
        this.crushTypeNum(model);
        this.pushToChangeModels(model);
        if (needShake) {
            model.toShake(this.curTime)
        }
        let shakeTime = needShake ? ANITIME.DIE_SHAKE : 0;
        model.toDie(this.curTime + shakeTime);
        this.addCrushEffect(this.curTime + shakeTime, cc.v2(model.x, model.y), step);
        this.cells[y][x] = null;
        // Observer.emit("scoreTxt");
    }

    // 消除数量累计
    crushTypeNum(model) {
        // if(model!=null){
        //     let aaaaaNum = model.type
        //     switch (aaaaaNum) {
        //         case 1:
        //             CELL_TYPENUM.LI += 1;
        //             break;
        //         case 2:
        //             CELL_TYPENUM.NINGMENG += 1;
        //             break;
        //         case 3:
        //             CELL_TYPENUM.NIUYOUGUO += 1;
        //             break;
        //         case 4:
        //             CELL_TYPENUM.XIHONGSHI += 1;
        //             break;
        //         case 5:
        //             CELL_TYPENUM.BINGKUAI += 1;
        //             break;
        //         default:
        //             break;
        //     }
        // }
        
    }

    // 体力扣消除
    // subPowerNum() {
    //     Observer.emit("mts");
    //     GameDataMgr.subDataByType(E_GameData_Type.appPower,1,0)
    //     let powerNum = GameDataMgr.getDataByType(E_GameData_Type.appPower);
    //     NetWork.setListMesssage(powerNum,"Power",(res)=>{
    //         if(res){
    //             Observer.emit("gpTxt");
    //         }
    //     })
    // }
}

