from requests import get, post
import time
from secret import secret
base_url = 'https://esame2-378411.oa.r.appspot.com'

with open('data_tot') as f:
    for r in f:
        r = r.strip()
        r =r.split()
        d = r[0] + ' ' + r[1]
        s = r[2]
        v = r[3]
        r = post(f'{base_url}/sensors/sensorTest', data={'time': d, 'sensore': s, 'valore':v})
        print('sending: ', d, s, v)
        #time.sleep(1)

