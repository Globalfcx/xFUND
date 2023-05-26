import requests
import json

# Xumm wallet api
XUM_WALLET_API_URL = "https://api.xumm.io/v1"

# Global ID api
GLOBAL_ID_API_URL = "https://api.globalid.com/v1"

# Create a new fundraising campaign
def create_campaign(name, description, goal, duration):
    url = XUM_WALLET_API_URL + "/campaigns"
    headers = {
        "Authorization": "Bearer 40101See-7edc-4469-bdfd-3af11d229885"
    }
    data = {
        "name": name,
        "description": description,
        "goal": goal,
        "duration": duration
    }
    response = requests.post(url, headers=headers, data=json.dumps(data))
    if response.status_code == 200:
        campaign = response.json()
        return campaign
    else:
        raise Exception("Could not create campaign")

# Get the current balance of the fundraising campaign
def get_balance(campaign_id):
    url = XUM_WALLET_API_URL + "/campaigns/" + campaign_id + "/balance"
    headers = {
        "Authorization": "Bearer 40101See-7edc-4469-bdfd-3af11d229885"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        balance = response.json()
        return balance
    else:
        raise Exception("Could not get balance")

# Donate to the fundraising campaign
def donate(campaign_id, amount):
    url = XUM_WALLET_API_URL + "/campaigns/" + campaign_id + "/donate"
    headers = {
        "Authorization": "Bearer 40101See-7edc-4469-bdfd-3af11d229885",
        "X-Amount": amount
    }
    response = requests.post(url, headers=headers)
    if response.status_code == 200:
        donation = response.json()
        return donation
    else:
        raise Exception("Could not donate")

# Get the list of donors to the fundraising campaign
def get_donors(campaign_id):
    url = XUM_WALLET_API_URL + "/campaigns/" + campaign_id + "/donors"
    headers = {
        "Authorization": "Bearer 40101See-7edc-4469-bdfd-3af11d229885"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        donors = response.json()
        return donors
    else:
        raise Exception("Could not get donors")

# Verify the ID of a donor
def verify_donor_id(donor_id):
    url = GLOBAL_ID_API_URL + "/verify/" + donor_id
    headers = {
        "Authorization": "Bearer clpltev3dlrslfil5xd7vvd819dgd4"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        verified_donor = response.json()
        return verified_donor
    else:
        raise Exception("Could not verify donor ID")

# Create a new user
def create_user(name, email, password):
    url = XUM_WALLET_API_URL + "/users"
    headers = {
        "Authorization": "Bearer 40101See-7edc-4469-bdfd-3af11d229885"
    }
    data = {
        "name": name,
