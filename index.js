const Bot = require('bot-sdk');
const privateKey = require("./rsaKeys.js").privateKey;



class DuerOSBot extends Bot {
    constructor(postData) {
        super(postData);
        this.storage=[];
        
        this.reqStorage=[];
        let reqData= this.request.getData();
        this.hasval=0;

        let context=reqData.context;
        this.c=context;
        if(context.hasOwnProperty('PersistentStorages')){
            this.reqStorage=context.PersistentStorages;
        }
        
        
        this.addLaunchHandler(() => {
            this.waitAnswer();
            let card = new Bot.Card.TextCard('欢迎使用任务计时器');
            return {
                card: card,
                outputSpeech: '欢迎使用任务计时器，对我说开始，开始计时，对我说停止，结束计时'
            };
        });
        
        this.addIntentHandler('task_timer_start', ()=>{
            this.waitAnswer();
            this.addStorageKV("starttime",Date.now(),5*60*60)
            let card = new Bot.Card.TextCard('计时进行中......');
            return {
                card: card,
                outputSpeech: '计时开始',
                shouldEndSession:false
            };
        });
        this.addIntentHandler('task_timer_stop', ()=>{
            
            let starttime=this.getStorageValue("starttime",0);
            let now=Date.now();
            this.addStorageKV("now",now);
            let diff=now-starttime;
            let second=Math.floor(diff/1000);
            let minute=0;
            let hour=0;
            
            if(second>60){
                minute=Math.floor(second/60);
                second=second % 60;
            }

            if(minute>60){
                hour=Math.floor(minute/60);
                minute=minute% 60;
            }

            let resultTxt=''
            if(hour>0){
                resultTxt=hour+'小时';
            }
            if(minute>0){
                resultTxt=resultTxt+minute+'分';
            }
            resultTxt=resultTxt+second+ '秒';
            let isnew=this.session.isNew;
            let card = new Bot.Card.TextCard('当前任务时间为'+resultTxt);
            this.endSession();
            return {
                card: card,
                outputSpeech: '计时结束,当前任务时间为'+resultTxt,
                shouldEndSession:true
            };
        });
        this.addSessionEndedHandler(() => {
            //this.endSession();
            return {
                outputSpeech: '感谢您的使用任务计时器'
            };
        });

    }

    getStorageValue(key,def=null){
       let val=def;
       
       for(let index in this.reqStorage){
           
           if(this.reqStorage[index].key==key){
                val=this.reqStorage[index].value;
                break;   
           }
       }
       return val;
    }

    addStorageKV(key,value,timeout=10*60){
        if(key==null){
            return this.storage;
        }
        this.storage.push({'key':key,'value':value,'timeout':timeout});
    }

    setStorageUpdates(result){
        if(this.storage.length==0){
            return result;
        }
        
        let ret=JSON.parse(result);
        let context=ret.context;
        if(context.hasOwnProperty('storage')){
            if(!context.storage.hasOwnProperty('updates')){
                context.storage.updates=[];
            }
        }
        else{
            context.storage={'behavior':'MERGE','updates':[]};
        }
        let updates=context.storage.updates;
        
        this.storage.forEach((item)=>{
                updates.push(item);
        });

        return JSON.stringify(ret);
    }
}

exports.handler = function(event, context, callback) {
    try {
        let b = new DuerOSBot(event);
        // 0: debug  1: online
        
        b.botMonitor.setEnvironmentInfo(privateKey, 0);
        b.run().then(function(result) {
            let newRet=b.setStorageUpdates(result);
            callback(null, newRet);
        }).catch(callback);
    } catch (e) {
        callback(e);
    }
}
