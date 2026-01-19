import requests
import os

# Specific logos requested including previously missed ones
targets = {
    'free-money': 'https://assets.cdn.moneroo.io/icons/circle/freemoney_sn.svg',
    'expresso': 'https://assets.cdn.moneroo.io/icons/circle/e_money_sn.svg', # Often matches E-Money/Expresso
    'celtiis': 'https://assets.cdn.moneroo.io/icons/circle/celtiis_bj.svg',
    't-money': 'https://assets.cdn.moneroo.io/icons/circle/togocel.svg', # T-Money is Togocel
    'express-union': 'https://assets.cdn.moneroo.io/icons/circle/eu_mobile_cm.svg',
    'wizall': 'https://assets.cdn.moneroo.io/icons/circle/wizall_sn.svg'
}

print("Downloading missing logos...")
os.makedirs('public/logos', exist_ok=True)

for name, url in targets.items():
    print(f"Downloading {name} from {url}...")
    try:
        r = requests.get(url)
        if r.status_code == 200:
            with open(f'public/logos/{name}.svg', 'wb') as f:
                f.write(r.content)
            print(f"Saved {name}.svg")
        else:
            print(f"Failed to download {url}: Status {r.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")
