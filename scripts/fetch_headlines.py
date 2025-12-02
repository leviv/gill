import requests
import json
import re
from urllib.parse import urlparse

CDX_URL = (
    "https://web.archive.org/cdx/search/cdx"
    "?url=dcenquirer.com/*"
    "&output=json"
    "&fl=original"
    "&filter=statuscode:200"
    "&collapse=urlkey"
)

def fetch_all_urls():
    print("Querying Wayback Machine CDX API…")
    r = requests.get(CDX_URL, timeout=30)
    r.raise_for_status()
    data = r.json()
    urls = [row[0] for row in data[1:]]  # First row is header
    print(f"Fetched {len(urls)} URLs from archive.")
    return urls

def is_article_url(url):
    # Reject obvious non-articles
    bad_patterns = [
        r"/tag/", r"/category/", r"/wp-", r"\.jpg$", r"\.png$",
        r"\.css$", r"\.js$", r"/feed$", r"/page/", r"/author/"
    ]
    for pat in bad_patterns:
        if re.search(pat, url):
            return False
    return True

def extract_headline_from_url(url):
    path = urlparse(url).path
    # example: "/daniel-penny-speaks-publicly-for-the-first-time-since-the-incident-this-has-nothing-to-do-with-race/"
    slug = path.strip("/")

    # remove file extensions
    slug = re.sub(r"\.html?$", "", slug)

    # split on hyphens
    words = slug.split("-")

    # Capitalize words cleanly (keep acronyms upper)
    headline = " ".join(w.capitalize() if len(w) > 1 else w.upper() for w in words)

    return headline

def main():
    urls = fetch_all_urls()
    articles = [u for u in urls if is_article_url(u)]
    print(f"{len(articles)} URLs look like real articles.")
    
    headlines = []

    for url in articles:
        headline = extract_headline_from_url(url)
        if headline and headline.strip():
            headlines.append(headline)

    headlines = sorted(list(set(headlines)))  # dedupe + sort

    with open("dcenquirer_headlines.json", "w") as f:
        json.dump(headlines, f, indent=2)

    print(f"Saved {len(headlines)} headlines → dcenquirer_headlines.json")

if __name__ == "__main__":
    main()
