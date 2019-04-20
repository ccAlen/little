import Chart from '../../utils/canvas/chart'
export default function(canvasConfig,labels,data){
    var chartColors = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 192, 0)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(231,233,237)',
        none: 'rgba(255,255,255,0)'
    };

    // var randomScalingFactor = function () {
    //     return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 100);
    // }
    // var randomScalingFactor = function() {
    //     return Math.round(Math.random() * 100);
    // };

    var color = Chart.helpers.color;
    var chartConfig = {
        type: 'radar',
        data: {
            labels: ["C 传统型", "R 现实型", "I 研究型", "E 管理型", "S 社会型", "A 艺术型"],
            datasets: [
              {
                label: "",
                borderColor: chartColors.none,
                backgroundColor: color(chartColors.yellow).alpha(0.2).rgbString(),
                pointBackgroundColor: chartColors.yellow,
                data: [
                    // NaN,
                    // randomScalingFactor(),
                    // randomScalingFactor(),
                    // randomScalingFactor(),
                    // randomScalingFactor(),
                    // randomScalingFactor(),
                    // randomScalingFactor()
                    60,35,65,70,65,50,
                ]
            }]
        },
        options: {
            title:{
                display:false,
                text:"Chart.js Radar Chart - Skip Points"
            },
            elements: {
                line: {
                    tension: 0.0,
                }
            },
            scale: {
                beginAtZero: true,
            }
        }
    };
    return {
        chartConfig:chartConfig,
        canvasConfig:canvasConfig
    }
}