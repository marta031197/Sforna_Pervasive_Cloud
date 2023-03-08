from flask import Flask, request, render_template, redirect, url_for
from flask_login import LoginManager, current_user, login_user, logout_user, login_required, UserMixin
from google.cloud import firestore
import json
from secret import secret
app = Flask(__name__)


@app.route('/',methods=['GET'])
def main():
    return 'ok'


@app.route('/sensors/sensorTest',methods=['GET'])
def read_all():
    db = firestore.Client.from_service_account_json('credentials.json')
    #db = firestore.Client()
    data = [];
    for doc in db.collection('sensorTest').stream():
        x = doc.to_dict()
        if x['sensore'][0] == 'T':
            data.append({
                "time": x['time'],
                "sensore": x['sensore'],
                "valore": float(x['value'])
            })
            #data.append([x['time'], x['sensore'],float(x['value']),"<br>"])
        else:
            if x['sensore'][0]=='D':
                data.append({
                    "time": x['time'],
                    "sensore": x['sensore'],
                    "valore": 1 if (x['value'] == "OPEN") else 0
                })
            else:
                data.append({
                    "time": x['time'],
                    "sensore": x['sensore'],
                    "valore": 1 if (x['value'] == "ON") else 0
                })
            #data.append([x['time'], x['sensore'], x['value'],"<br>"])
    return json.dumps(data)


@app.route('/map',methods=['GET'])
def graph():
    #data = json.loads(read_all())
    data = read_all()
    return render_template('home.html', data = data)


@app.route('/sensors/sensorTest',methods=['POST'])
def save_data():
    s = request.values['secret']
    if s == secret:
        #db = firestore.Client()
        db = firestore.Client.from_service_account_json('credentials.json')
        time = request.values['time']
        sensore = request.values['sensore']
        valore = request.values['valore']
        db.collection('sensorTest').document(time).set({'time':time,'sensore':sensore ,'value':valore})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
