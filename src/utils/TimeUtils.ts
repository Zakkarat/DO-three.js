
export class TimeUtils {

    public static async checkTime(cb: () => Promise<number>) {
        const t1 = performance.now();
        await cb();
        const t2 = performance.now();
        return t2 - t1;
    }
}