google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(onLoadGraph);

var db;

function onLoadGraph() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const strDati = urlParams.get('dati');
    db = JSON.parse(window.atob(strDati));


    var graphData = [
        ['Data', 'Valore']
    ];

    db.forEach(function (e) {
        date_time = e.time.toString().split(".");
        date_time = date_time[0].substr(5,)
        console.log(date_time);
        graphData.push([date_time, e.valore]);
    });

    drawChart(db[0].sensore, graphData);
}

function drawChart(sensore, graphData) {
    var data = google.visualization.arrayToDataTable(graphData);

    var options = {
        title: 'Andamento sensore ' + sensore,
        curveType: 'function',
        legend: { position: 'none' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}
