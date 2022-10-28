
export const CELL_TYPE = {
    EMPTY : 0,
    A : 1,
    B : 2,
    C : 3,
    D : 4,
    E : 5,
    BIRD : 6,
    BOOM : 7,
    LINE : 8,
}
export const CELL_BASENUM = 5;
export const CELL_STATUS = {
    COMMON: 0 ,
    CLICK: "click",
    LINE: "line",
    COLUMN: "column",
    BOOM: "boom",
    BIRD: "bird",
    FOUR: "four",
    ROMC: "romc",
    ZHU: "aabbcc",
} 

export const GRID_WIDTH = 6;
export const GRID_HEIGHT = 7;

export const CELL_WIDTH = 115;
export const CELL_HEIGHT = 115;

export const GRID_PIXEL_WIDTH = GRID_WIDTH * CELL_WIDTH;
export const GRID_PIXEL_HEIGHT = GRID_HEIGHT * CELL_HEIGHT;


// ********************   时间表  animation time **************************
export const ANITIME = {
    TOUCH_MOVE: 0.3,
    DIE: 0.2,
    DOWN: 0.5,
    BOMB_DELAY: 0.3,
    BOMB_BIRD_DELAY: 0.7,
    DIE_SHAKE: 0.4 // 死前抖动
}
// //种类计数
// export let CELL_TYPENUM = {
//     KONG: 0,
//     LI: 0,
//     NINGMENG: 0,
//     NIUYOUGUO: 0,
//     XIHONGSHI: 0,
//     BINGKUAI: 0,
// } 


