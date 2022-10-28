import { E_GameData_Type, GameDataMgr } from "./GameDataMgr";

export const AudioMgr = new class{

    /**音效缓存 */
    private m_mapAudio: Map<string, cc.AudioClip> = new Map();
    /**正在播放的背景音乐 */
    private isPlayingName: string = null;
    /**音量 */
    private curVolume: number = 0;

    /**设置音量 */
    public setVolume(volume: number){
        this.curVolume = volume;
        cc.audioEngine.setMusicVolume(this.curVolume);
    }
    /**播放背景音乐 */
    public playBGMusic(path: string){
        if(path == this.isPlayingName){
            this.resumeBGMusic();
            return;
        }
        console.log("bbbbbbbbbbbb");
        this.isPlayingName = path;
        cc.audioEngine.stopMusic();
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playMusic(this.m_mapAudio.get(path), true);
            cc.audioEngine.setMusicVolume(this.curVolume);
            let isAudio = GameDataMgr.getDataByType(E_GameData_Type.IsHadAudio_BG);
            if(!isAudio){
                this.pauseBGMusic();
            }
            return;
        }
        else{
            cc.assetManager.loadAny
            cc.loader.loadRes(path, cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playMusic(audio,true);
                    cc.audioEngine.setMusicVolume(this.curVolume);
                    let isAudio = GameDataMgr.getDataByType(E_GameData_Type.IsHadAudio_BG);
                    if(!isAudio){
                        this.pauseBGMusic();
                    }
                }
                else{
                    console.error("加载背景音乐失败：" + err + " path:" + path);
                }
            })
        }
    }
    /**停止播放背景音乐 */
    stopBgMusic(){
        cc.audioEngine.stopMusic();
        this.isPlayingName = null;
    }
    /**暂停播放背景音乐 */
    public pauseBGMusic(){
        cc.audioEngine.pauseMusic();
    }
    /**恢复播放背景音乐 */
    public resumeBGMusic(){
        let isAudio = GameDataMgr.getDataByType(E_GameData_Type.IsHadAudio_BG);
        if(!isAudio){
            return;
        }
        cc.audioEngine.resumeMusic();
    }

    /**播放音效 */
    public playAudioEffect(path: string){
        let isAudio = GameDataMgr.getDataByType(E_GameData_Type.IsHadAudio_Eff);
        if(!isAudio){
            return;
        }
        if(this.m_mapAudio.has(path)){
            cc.audioEngine.playEffect(this.m_mapAudio.get(path), false);
            cc.audioEngine.setEffectsVolume(this.curVolume);
            return;
        }
        else{
            cc.loader.loadRes(path,cc.AudioClip,(err,audio) => {
                if(!err && audio){
                    this.m_mapAudio.set(path,audio);
                    cc.audioEngine.playEffect(audio,false);
                    cc.audioEngine.setEffectsVolume(this.curVolume);
                }
                else{
                    console.error("加载音效失败：" + err + " path:" + path);
                }
            })
        }
    }
}