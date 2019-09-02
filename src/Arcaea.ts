import xs from 'xs-io';
import { IArcAppregateResponse, IArcAddResponse, IArcRankResponse, IArcSelfRankResponse } from './Arcaea.interface';
import { TokenNotFoundException } from './Arcaea.Exception';

const addUrl="https://arcapi.lowiro.com/7/friend/me/add",
      delUrl="https://arcapi.lowiro.com/7/friend/me/delete",
      friendInfo="https://arcapi.lowiro.com/7/compose/aggregate?calls=%5B%7B%20%22endpoint%22%3A%20%22user%2Fme%22%2C%20%22id%22%3A%200%20%7D%2C%20%7B%20%22endpoint%22%3A%20%22purchase%2Fbundle%2Fpack%22%2C%20%22id%22%3A%201%20%7D%5D",
      friendRankUrl="https://arcapi.lowiro.com/7/score/song/friend?start=0&limit=10",
      worldRankUrl="https://arcapi.lowiro.com/7/score/song?start=0&limit=20",
      selfRankUrl="https://arcapi.lowiro.com/7/score/song/me?start=4&limit=18";

const header: Object = {
    "Accept-Encoding":"gzip, deflate",
    "AppVersion":"2.3.0",
    "Content-Type":"application/x-www-form-urlencoded; charset=utf-8",
    "Accept-Language":"zh-cn",
    "Accept":"*/*",
    "Connection":"keep-alive",
    "Proxy-Connection":"keep-alive",
    "User-Agent": "Arc-mobile/2.3.0.1 CFNetwork/811.5.4 Darwin/16.7.0"
};

export default class Arcaea{
    private token: string;
    private opt: any;
    constructor(token?: string){
        this.token = token || '';
        let headers = Object.assign(header,{
            Authorization: "Bearer "+this.token
        });
        this.opt = {
            headers: headers,
            gzip: true
        };
    }
    private checkToken(): void{
        if(this.token){
            return;
        }
        throw new TokenNotFoundException();
    }
    public async appregate(): Promise<IArcAppregateResponse>{
        this.checkToken();
        let res: Buffer = await xs.read(friendInfo, this.opt),
            data: IArcAppregateResponse = JSON.parse(res.toString());
        return data;
    }
    public async addFriend(friend_code: string): Promise<IArcAddResponse>{
        this.checkToken();
        let res: string = await xs.post(addUrl, `friend_code=${friend_code}`, this.opt),
            data: IArcAddResponse = JSON.parse(res);
        return data;
    }
    public async delFriend(user_id:number): Promise<boolean>{
        this.checkToken();
        let res: string = await xs.post(delUrl, `friend_id=${user_id}`, this.opt),
            data: {success: boolean,friends: any[]} = JSON.parse(res);
        return data.success;
    }
    public async getFriendsRank(song_id: string, difficulty: number): Promise<IArcRankResponse>{
        this.checkToken();
        let targetUrl: string = friendRankUrl + `&song_id=${song_id}&difficulty=${difficulty}`,
            res: Buffer = await xs.read(targetUrl, this.opt),
            data: IArcRankResponse = JSON.parse(res.toString());
        return data;
    }
    public async getWorldRank(song_id: string, difficulty: number): Promise<IArcRankResponse>{
        this.checkToken();
        let targetUrl: string = worldRankUrl + `&song_id=${song_id}&difficulty=${difficulty}`,
            res: Buffer = await xs.read(targetUrl, this.opt),
            data: IArcRankResponse = JSON.parse(res.toString());
        return data;
    }
    public async getSelfRank(song_id: string, difficulty: number): Promise<IArcSelfRankResponse>{
        this.checkToken();
        let targetUrl: string = selfRankUrl + `&song_id=${song_id}&difficulty=${difficulty}`,
            res: Buffer = await xs.read(targetUrl, this.opt),
            data: IArcSelfRankResponse = JSON.parse(res.toString());
        return data;
    }
}