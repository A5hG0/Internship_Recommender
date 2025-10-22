import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

base_url = "https://internshala.com/internships/machine-learning-internship"

titles, companies, locations, skills = [], [], [], []

# fetch first few pages
for page in range(1, 4):
    url = f"{base_url}/page-{page}"
    print("Scraping:", url)
    res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(res.text, 'html.parser')

    # find all internship cards
    internships = soup.find_all('div', class_='individual_internship')

    for intern in internships:
        # extract data
        title = intern.find('h3', class_='job-internship-name')
        company = intern.find('p', class_='company-name')
        location = intern.find('div', class_='row-1-item locations')
        skill_div = intern.find('div', class_='job_skills')

        titles.append(title.text.strip() if title else "")
        companies.append(company.text.strip() if company else "")
        locations.append(location.text.strip() if location else "")
        skills.append(skill_div.text.strip() if skill_div else "")

    time.sleep(1)  # be polite — delay between requests
    
base_url = "https://internshala.com/internships/data-science-internship"

for page in range(1, 9):
    url = f"{base_url}/page-{page}"
    print("Scraping:", url)
    res = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(res.text, 'html.parser')

    # find all internship cards
    internships = soup.find_all('div', class_='individual_internship')

    for intern in internships:
        # extract data
        title = intern.find('h3', class_='job-internship-name')
        company = intern.find('p', class_='company-name')
        location = intern.find('div', class_='row-1-item locations')
        skill_div = intern.find('div', class_='job_skills')

        titles.append(title.text.strip() if title else "")
        companies.append(company.text.strip() if company else "")
        locations.append(location.text.strip() if location else "")
        skills.append(skill_div.text.strip() if skill_div else " ")
        # print(skills)

    time.sleep(1)  # be polite — delay between requests
# print(title)
# save to DataFrame
df = pd.DataFrame({
    'Title': titles,
    'Company': companies,
    'Location': locations,
    'Skills': skills
})

df.to_csv("internships.csv", index=False)
print("✅ Scraping complete! Data saved to internships.csv")