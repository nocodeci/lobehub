import requests

urls = [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Wave_Logo_2022.svg/1024px-Wave_Logo_2022.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Momo_Wave.png/600px-Momo_Wave.png",
    "https://logolib.com/wp-content/uploads/2023/04/wave-mobile-money-logo.png",
    "https://techcrunch.com/wp-content/uploads/2021/09/Wave-Senegal.png?w=400",
    "https://play-lh.googleusercontent.com/L7Xk8Tqj8ZqQ9qXq8ZqQ9qXq8ZqQ9qXq8ZqQ9qXq8ZqQ9qXq8ZqQ9qXq8ZqQ9qXq8Zq=w240-h480-rw"
]

for url in urls:
    try:
        r = requests.head(url, timeout=3, allow_redirects=True)
        if r.status_code == 200:
            print(f"FOUND: {url}")
            break
    except:
        continue
