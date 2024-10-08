# To activate this script, follow these steps:

1. Open the Google Sheet you wish to use.
2. Go to the **Tools** menu and select **Script Editor**.
3. Paste this script into the editor and click **Save**.

## Next, click:

1. **Publish** and choose **Deploy as web app...**

## For the settings, select:

- **Execute the app as:** Me (`youremail@gmail.com`)
- **Who has access:** Anyone, including anonymous users  
  > *Depending on your Google Apps configuration, this option might not be available. If so, contact your Google Apps admin, or use a personal Gmail account.*

2. Click **Deploy**.  
   > *You may need to grant permissions at this point. You might see a warning; click "Advanced" in the bottom left and proceed.*

3. The URL generated will serve as the webhook for your Elementor form.  
   > *To test, paste the URL into your browser. You should see the message: "Yepp this is the webhook URL, request received."*

## Email Notifications:

- By default, email notifications are disabled.
- To enable them:
  1. On line 37, change `false` to `true`.
  2. On line 40, replace `"Change_to_your_Email"` with your email address (keeping the quotes).
  3. Save the script again.

Now you're set to collect those leads!
