const tick = 1000;

var interval;
var dataInizio;
var sensori = {
    circles: [
        { id: "M021", x: 55, y: 80, radius: 10, acceso: false },
        { id: "M020", x: 83, y: 160, radius: 10, acceso: false },
        { id: "M019", x: 320, y: 200, radius: 10, acceso: false },
        { id: "M018", x: 245, y: 370, radius: 10, acceso: false },
        { id: "M017", x: 325, y: 370, radius: 10, acceso: false },
        { id: "M013", x: 260, y: 240, radius: 10, acceso: false },
        { id: "M007", x: 280, y: 80, radius: 10, acceso: false },
        { id: "M006", x: 460, y: 50, radius: 10, acceso: false },
        { id: "M005", x: 550, y: 20, radius: 10, acceso: false },
        { id: "M008", x: 427, y: 135, radius: 10, acceso: false },
        { id: "M004", x: 490, y: 135, radius: 10, acceso: false },
        { id: "M009", x: 370, y: 260, radius: 10, acceso: false },
        { id: "M012", x: 410, y: 520, radius: 10, acceso: false },
        { id: "M011", x: 350, y: 440, radius: 10, acceso: false },
        { id: "M010", x: 410, y: 430, radius: 10, acceso: false },
        { id: "M016", x: 280, y: 460, radius: 10, acceso: false },
        { id: "M015", x: 270, y: 510, radius: 10, acceso: false },
        { id: "M014", x: 280, y: 565, radius: 10, acceso: false },
        { id: "M022", x: 360, y: 550, radius: 10, acceso: false },
        { id: "M002", x: 620, y: 470, radius: 10, acceso: false },
        { id: "M001", x: 620, y: 560, radius: 10, acceso: false },
        { id: "M003", x: 480, y: 520, radius: 10, acceso: false },
        { id: "M023", x: 330, y: 520, radius: 10, acceso: false },
        { id: "M024", x: 100, y: 480, radius: 10, acceso: false },
        { id: "M025", x: 120, y: 270, radius: 10, acceso: false },
        { id: "M027", x: 540, y: 300, radius: 10, acceso: false },
        { id: "M028", x: 120, y: 110, radius: 10, acceso: false },
        { id: "M026", x: 340, y: 80, radius: 10, acceso: false }
    ],
    rects: [
        { id: "T002", x: 315, y: 398, w: 30, h: 18, acceso: false },
        { id: "T001", x: 395, y: 530, w: 30, h: 18, acceso: false },
        { id: "D001", x: 595, y: 590, w: 50, h: 10, acceso: false },
        { id: "D002", x: 580, y: 490, w: 10, h: 55, acceso: false },
        { id: "D003", x: 250, y: 580, w: 45, h: 15, acceso: false }
    ]
}
var colori = {
    on: "#84db2e",
    off: "#db2e2e"
};

function onLoadApp() {
    var tmp = new Date(Date.parse(db[400].time));
    dataInizio = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate(), tmp.getHours(), tmp.getMinutes(), tmp.getSeconds());
    //var tmp = new Date(Date.parse(db[0].time));
    //dataInizio = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
    /**
     il codice sopra commentato permette di far partire la simulazione facendo riferimento alla data del primo record, a mezzanotte.
     Visto che di notte ci sono poche rilevazioni, si è provato a far partire la simulazione intorno alle 8:40 di mattina per vedere
     più movimenti (altrimenti per lungo tempo, all'inizio, non si vedrebbero molti sensori colorare).
     In questo modo, però, risulta meno efficace il controllo all'interno della funzione VisualizzaAndamento() di riga 146
     alert("Nessun evento da visualizzare") in quanto seppure un sensore sulla mappa sia bianco (cioè teoricamente mai acceso/spento)
     in realtà per esso potrebbero essersi verificati eventi in precedenza non visibili con la colorazione.
     Per una corretta visualizzazione del codice sarebbe bene far partire la simulazione dal primo tempo disponibile, cioè il codice
     commentato.
     **/
    log(dataInizio.toString());
    for (var i = 0; i < sensori.circles.length; i++) {
        var s = sensori.circles[i];
        drawCircle(s.x, s.y, s.radius);
    }

    for (var i = 0; i < sensori.rects.length; i++) {
        var s = sensori.rects[i];
        drawRect(s.x, s.y, s.w, s.h);
    }
}

function drawCircle(x, y, radius, color) {
    var c = document.getElementById("mapCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();

    if (color != undefined)
        ctx.fillStyle = color;
    else 
        ctx.fillStyle = "#FFFFFF";
    ctx.fill();
}

function drawRect(x, y, w, h, color) {
    var c = document.getElementById("mapCanvas");
    var ctx = c.getContext("2d");

    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.stroke();

    if (color != undefined)
        ctx.fillStyle = color;
    else 
        ctx.fillStyle = "#FFFFFF";
    ctx.fill();
}

function canvasClickHandler(event) {
    var clickX = event.layerX;
    var clickY = event.layerY;

    var sensore = sensori.circles.find(function (p) {
        var ctrlX = p.x - p.radius <= clickX && clickX <= p.x + p.radius;
        var ctrlY = p.y - p.radius <= clickY && clickY <= p.y + p.radius;

        return ctrlX && ctrlY;
    });

    if (sensore != undefined)
        visualizzaAndamento(sensore);
    else
        cercaRettangolo(event);
}

function cercaRettangolo(event) {
    var clickX = event.layerX;
    var clickY = event.layerY;

    var sensore = sensori.rects.find(function (p) {
        var ctrlX = p.x <= clickX && clickX <= p.x + p.w;
        var ctrlY = p.y <= clickY && clickY <= p.y + p.h;

        return ctrlX && ctrlY;
    });

    if (sensore != undefined)
        visualizzaAndamento(sensore);
}

function visualizzaAndamento(sensore) {
    var params = "scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=600,left=500,top=-1000";
    var events = db.filter(function (e) {
        var dt = new Date(Date.parse(e.time));
        return dt <= dataInizio && e.sensore == sensore.id;
    });

    if (events.length <= 0)
        alert("Nessun evento da visualizzare"); //allerta nel caso quel dato sensore finora non si è mai acceso/spento
    else {
        var b = window.btoa(JSON.stringify(events));
        //window.open(graphUrl + "?dati=" + b, "Andamento", params);
        window.open("/static/graph.html" + "?dati=" + b, "Andamento", params);
    }
}


function coloraSensore(sensore) {
    sensore.acceso = !sensore.acceso;
    var colore = sensore.acceso ? colori.on : colori.off;
    if (sensore.hasOwnProperty("w"))
        drawRect(sensore.x, sensore.y, sensore.w, sensore.h, colore);
    else
        drawCircle(sensore.x, sensore.y, sensore.radius, colore);
}

function startInterval() {
    if (interval != undefined)
        return;
    
    log("Avvio il timer");

    interval = setInterval(timerTick, tick);
}

function timerTick() {
    var newDate = new Date(dataInizio.getTime() + 1000);
    var events = db.filter(function (e) {
        var dt = new Date(Date.parse(e.time));
        return dt >= dataInizio && dt <= newDate;
    });

    if (events.length > 0) {
        log(newDate.toString() + ": ho trovato " + events.length.toString() + " eventi");

        events.forEach(function (e) {
            var sensore = sensori.circles.find(function (s) {
                return s.id == e.sensore;
            });

            if (sensore == null) {
                sensore = sensori.rects.find(function (s) {
                    return s.id == e.sensore;
                });
                if (sensore == null) {

                    alert("Non trovo il sensore");
                } else
                    coloraSensore(sensore);
            }
            else
                coloraSensore(sensore);
        });
    }

    //console.log(newDate);
    dataInizio = newDate;
}

function stopInterval() {
    log("Fermo il timer");
    clearInterval(interval);
    interval = undefined;
}

function log(msg) {
    var table = document.getElementById("tbLog");
    var row = table.insertRow(-1);
    var col = row.insertCell(0);
    col.innerHTML = msg;
}