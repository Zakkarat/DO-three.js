
type callbackFunction = (data?:any) => any;

interface IEventsCallbacks {
    [key:string]:callbackFunction[];
}

export class EventEmitter {
    static listeners:IEventsCallbacks = {};

    static addListener(event:string, fn: callbackFunction) {
        this.listeners[event] = this.listeners[event] || [];
        this.listeners[event].push(fn);
        return this;
    }

    static on(event:string, fn:callbackFunction) {
        return this.addListener(event, fn);
    }

    static removeListener (event:string, fn:callbackFunction) {
        let lis = this.listeners[event];
        if (!lis) return this;
        for(let i = lis.length; i > 0; i--) {
            if (lis[i] === fn) {
                lis.splice(i,1);
                break;
            }
        }
        return this;
    }

    static off(event:string, fn:callbackFunction) {
        return this.removeListener(event, fn);
    }

    static once(event:string, fn:callbackFunction) {
        this.listeners[event] = this.listeners[event] || [];
        const onceWrapper = () => {
            fn();
            this.off(event, onceWrapper);
        }
        this.listeners[event].push(onceWrapper);
        return this;
    }

    static emit(eventName:string, ...args: any) {
        let fns = this.listeners[eventName];
        console.log(this.listeners);
        if (!fns) return false;
        fns.forEach((f) => {
            f(...args);
        });
        return true;
    }
}