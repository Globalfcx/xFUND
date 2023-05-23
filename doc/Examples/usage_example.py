import requests

# Create the request object
url = "https://api.xumm.io/v1/campaigns"
headers = {
    "Authorization": "Bearer YOUR_API_KEY"
}
data = {
    "name": "My Campaign",
    "description": "This is my campaign description",
    "goal": 1000,
    "duration": 30
}

# Make the request
response = requests.post(url, headers=headers, data=json.dumps(data))

# Check the response status code
if response.status_code == 200:
    # The request was successful
    campaign = response.json()
    print(campaign)
else:
    # The request failed
    print(response.status_code)
    print(response.reason)

