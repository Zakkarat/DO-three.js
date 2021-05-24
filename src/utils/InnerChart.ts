import {Chart, ChartDataset, registerables} from 'chart.js';
Chart.register(...registerables);



export class InnerChart {
    constructor(results:AlgosResults) {
        const ctx = this.manageWebPage();
        const colors = ['#ff6384', '#36a2eb', '#cc65fe']
        console.log(Object.keys(results).map((elem, i) => ({
            label: elem,
            borderColor: colors[i],
            data: results[elem]
        })) as ChartDataset[]);
        new Chart(ctx, {
                type: 'line',
                data: {
                    labels: results.greedy.map((_, i) => i + 1),
                    datasets: Object.keys(results).map((elem, i) => ({
                        label: elem,
                        borderColor: colors[i],
                        data: results[elem]
                    })) as ChartDataset[],
                },
            options: {}
        })
    }

    private manageWebPage() {
        const div = document.getElementsByTagName('div')[0];
        div.lastChild?.remove();
        const canvas:HTMLCanvasElement = document.createElement('canvas');
        div.append(canvas);
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        return ctx;
    }
}