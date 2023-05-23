This API provides a way to interact with the Xumm and Global ID APIs.

Endpoints
   /campaigns
      Create a new fundraising campaign.
      Parameters:
         name: The name of the campaign.
         description: The description of the campaign.
         goal: The goal amount of the campaign.
         duration: The duration of the campaign in days.
Response:
id: The ID of the campaign.
name: The name of the campaign.
description: The description of the campaign.
goal: The goal amount of the campaign.
duration: The duration of the campaign.
status: The status of the campaign.
created_at: The date and time the campaign was created.
updated_at: The date and time the campaign was last updated.
/campaigns/:id/balance
Get the current balance of the fundraising campaign.
Parameters:
id: The ID of the campaign.
Response:
amount: The amount of money raised for the campaign.
/campaigns/:id/donate
Donate to the fundraising campaign.
Parameters:
id: The ID of the campaign.
amount: The amount of money to donate.
Response:
id: The ID of the donation.
amount: The amount of money donated.
created_at: The date and time the donation was made.
/campaigns/:id/donors
Get the list of donors to the fundraising campaign.
Parameters:
id: The ID of the campaign.
Response:
donors: A list of donors. Each donor object has the following properties:
name: The name of the donor.
email: The email address of the donor.
amount: The amount of money donated by the donor.
created_at: The date and time the donation was made.
/verify/:donor_id
Verify the ID of a donor.
Parameters:
donor_id: The ID of the donor.
Response:
verified: Whether or not the donor ID is verified.
/users
Create a new user.
Parameters:
name: The name of the user.
email: The email address of the user.
password: The password of the user.
Response:
id: The ID of the user.
name: The name of the user.
email: The email address of the user.
created_at: The date and time the user was created.


Sure, here is the API documentation for the code you provided:

API Documentation
This API provides a way to interact with the Xumm and Global ID APIs.

Endpoints
/campaigns
Create a new fundraising campaign.
Parameters:
name: The name of the campaign.
description: The description of the campaign.
goal: The goal amount of the campaign.
duration: The duration of the campaign in days.
Response:
id: The ID of the campaign.
name: The name of the campaign.
description: The description of the campaign.
goal: The goal amount of the campaign.
duration: The duration of the campaign.
status: The status of the campaign.
created_at: The date and time the campaign was created.
updated_at: The date and time the campaign was last updated.
/campaigns/:id/balance
Get the current balance of the fundraising campaign.
Parameters:
id: The ID of the campaign.
Response:
amount: The amount of money raised for the campaign.
/campaigns/:id/donate
Donate to the fundraising campaign.
Parameters:
id: The ID of the campaign.
amount: The amount of money to donate.
Response:
id: The ID of the donation.
amount: The amount of money donated.
created_at: The date and time the donation was made.
/campaigns/:id/donors
Get the list of donors to the fundraising campaign.
Parameters:
id: The ID of the campaign.
Response:
donors: A list of donors. Each donor object has the following properties:
name: The name of the donor.
email: The email address of the donor.
amount: The amount of money donated by the donor.
created_at: The date and time the donation was made.
/verify/:donor_id
Verify the ID of a donor.
Parameters:
donor_id: The ID of the donor.
Response:
verified: Whether or not the donor ID is verified.
/users
Create a new user.
Parameters:
name: The name of the user.
email: The email address of the user.
password: The password of the user.
Response:
id: The ID of the user.
name: The name of the user.
email: The email address of the user.
created_at: The date and time the user was created.
Authentication
All requests to the API require authentication. The authentication header must be set to Bearer YOUR_API_KEY.

Error Handling
If an error occurs, the response will have a status code of 400 or higher. The response body will contain an error message.
