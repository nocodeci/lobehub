import re
import requests
import os

html_content = open('moneroo_coverage.html', 'r').read()

# Dictionary to map requested names to their likely file names in the source
# The source seems to use snake_case like 'orange_money.svg', 'momo.svg', etc.
target_logos = {
    'wave': 'https://assets.cdn.moneroo.io/icons/circle/wave_money.svg', # Guessing based on pattern
    'orange': 'https://assets.cdn.moneroo.io/icons/circle/orange_money.svg',
    'mtn': 'https://assets.cdn.moneroo.io/icons/circle/momo.svg',
    'airtel': 'https://assets.cdn.moneroo.io/icons/circle/airtel.svg',
    'm-pesa': 'https://assets.cdn.moneroo.io/icons/circle/m_pesa.svg',
    'moov': 'https://assets.cdn.moneroo.io/icons/circle/moov_money.svg',
    'free': 'https://assets.cdn.moneroo.io/icons/circle/free.svg', # Guessing
    'expresso': 'https://assets.cdn.moneroo.io/icons/circle/expresso.svg', # Guessing
    'celtiis': 'https://assets.cdn.moneroo.io/icons/circle/celtiis.svg', # Guessing
    'djamo': 'https://assets.cdn.moneroo.io/icons/circle/djamo.svg'
}

# Regex to find all icon_urls to match the correct ones if guesses are wrong
found_urls = re.findall(r'https://assets\.cdn\.moneroo\.io/icons/circle/[a-zA-Z0-9_]+\.svg', html_content)
print(f"Found {len(found_urls)} potential logo URLs.")

# Create mapping from found URLs
url_map = {}
for url in found_urls:
    filename = url.split('/')[-1].replace('.svg', '')
    url_map[filename] = url
    print(f"Found logo: {filename}")

# Refine targets based on actual findings
final_targets = {}

# Wave
if 'wave' in url_map: final_targets['wave'] = url_map['wave']
elif 'wave_money' in url_map: final_targets['wave'] = url_map['wave_money']

# Orange
if 'orange_money' in url_map: final_targets['orange-money'] = url_map['orange_money']

# MTN
if 'momo' in url_map: final_targets['mtn-momo'] = url_map['momo']
elif 'mtn' in url_map: final_targets['mtn-momo'] = url_map['mtn']

# Airtel
if 'airtel' in url_map: final_targets['airtel-money'] = url_map['airtel']

# M-Pesa
if 'm_pesa' in url_map: final_targets['m-pesa'] = url_map['m_pesa']
elif 'mpesa' in url_map: final_targets['m-pesa'] = url_map['mpesa']
elif 'vodacom' in url_map: final_targets['m-pesa'] = url_map['vodacom'] # M-Pesa often Vodacom related

# Moov
if 'moov_money' in url_map: final_targets['moov-money'] = url_map['moov_money']
elif 'moov' in url_map: final_targets['moov-money'] = url_map['moov']

# Free
if 'free' in url_map: final_targets['free-senegal'] = url_map['free']
elif 'free_money' in url_map: final_targets['free-senegal'] = url_map['free_money']

# Expresso
if 'expresso' in url_map: final_targets['expresso'] = url_map['expresso']

# Celtiis
if 'celtiis' in url_map: final_targets['celtiis'] = url_map['celtiis']

# Djamo
if 'djamo' in url_map: final_targets['djamo'] = url_map['djamo']

print("\nDownloading matched logos...")
os.makedirs('public/logos', exist_ok=True)

for name, url in final_targets.items():
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

