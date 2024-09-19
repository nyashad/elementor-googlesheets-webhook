/*
 * To activate this script, follow these steps:
 
   ***   Open the Google Sheet you wish to use,
    **   Go to the "Tools" menu and select "Script Editor"
     *   Paste this script into the editor and click "Save".
     *   
   ***   Next, click: 
    **     "Publish" and choose "Deploy as web app..."
   ***   For the settings, select: 
    **      Execute the app as: Me (youremail@gmail.com)
    **      Who has access: Anyone, including anonymous users
   *                           - Depending on your Google Apps configuration, this option might not be available. If so, contact your Google Apps admin, or use a personal Gmail account.
   *
   ***    Click "Deploy". You may need to grant permissions at this point.
   *                           - You might see a warning; click "Advanced" in the bottom left and proceed.
   *      
   ***    The URL generated will serve as the webhook for your Elementor form.
   *                            - To test, paste the URL into your browser. You should see the message: "Yepp this is the webhook URL, request received."
   *         
   ***    EMAIL NOTIFICATIONS: 
            *  By default, email notifications are disabled.
            *  To enable them:
              *  On line 37, change "false" to "true"
              *  On line 40, replace "Change_to_your_Email" with your email address (keeping the quotes)
              *  Save the script again. Now you're set to collect those leads!
 */
function doGet(e) {}
function doPost(e) {
  var o = e.parameter;
  SpreadsheetApp.getActiveSheet().appendRow([ o.name, o.email, o.message, e ]);
}

// Change to true to enable email notifications
var emailNotification = false;

// Enter your email address below (keep the quotation marks!) 
var emailAddress = "youremail@gmail.com";

/**
 * Google app-script to utilize Elementor Pro Forms webhook
 * For Usage see: https://github.com/pojome/elementor/issues/5894
 * Originally found: https://gist.github.com/bainternet/4b539b00a4bd7490ac3809d7ff86bd14
 * by bainternet
 * Minor tweaks to the directions by AvlSEONinja
 * Script updated and maintained by Nyashadzashe Ndhlovu
 */
 
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DO NOT EDIT THESE NEXT PARAMS
var isNewSheet = false;
var receivedData = [];

/**
 * This function fires when the web app receives a GET request.
 * Not used but required.
 */
function doGet( e ) {
  return HtmlService.createHtmlOutput( "Yepp this is the webhook URL, request received" );
}

// Webhook Receiver - triggered with form webhook to published App URL.
function doPost( e ) {
  var params = JSON.stringify(e.parameter);
  params = JSON.parse(params);
  insertToSheet(params);

  // HTTP Response
  return HtmlService.createHtmlOutput( "post request received" );
}

// Flattens a nested object for easier use with a spreadsheet
function flattenObject( ob ) {
  var toReturn = {};
  for ( var i in ob ) {
    if ( ! ob.hasOwnProperty( i ) ) continue;
    if ( ( typeof ob[ i ] ) == 'object' ) {
      var flatObject = flattenObject( ob[ i ] );
      for ( var x in flatObject ) {
        if ( ! flatObject.hasOwnProperty( x ) ) continue;
        toReturn[ i + '.' + x ] = flatObject[ x ];
      }
    } else {
      toReturn[ i ] = ob[ i ];
    }
  }
  return toReturn;
}

// Normalize headers
function getHeaders( formSheet, keys ) {
  var headers = [];
  
  // Retrieve existing headers
  if ( ! isNewSheet ) {
    headers = formSheet.getRange( 1, 1, 1, formSheet.getLastColumn() ).getValues()[0];
  }

  // Add any additional headers
  var newHeaders = [];
  newHeaders = keys.filter( function( k ) {
    return headers.indexOf( k ) > -1 ? false : k;
  } );

  newHeaders.forEach( function( h ) {
    headers.push( h );
  } );
  return headers;
}

// Normalize values
function getValues( headers, flat ) {
  var values = [];
  // Push values based on headers
  headers.forEach( function( h ){
    values.push( flat[ h ] );
  });
  return values;
}

// Insert headers
function setHeaders( sheet, values ) {
  var headerRow = sheet.getRange( 1, 1, 1, values.length );
  headerRow.setValues( [ values ] );
  headerRow.setFontWeight( "bold" ).setHorizontalAlignment( "center" );
}

// Insert Data into Sheet
function setValues( sheet, values ) {
  var lastRow = Math.max( sheet.getLastRow(), 1 );
  sheet.insertRowAfter( lastRow );
  sheet.getRange( lastRow + 1, 1, 1, values.length ).setValues( [ values ] ).setFontWeight( "normal" ).setHorizontalAlignment( "center" );
}

// Find or create sheet for form
function getFormSheet( formName ) {
  var formSheet;
  var activeSheet = SpreadsheetApp.getActiveSpreadsheet();

  // Create sheet if needed
  if ( activeSheet.getSheetByName( formName ) == null ) {
    formSheet = activeSheet.insertSheet();
    formSheet.setName( formName );
    isNewSheet = true;
  }
  return activeSheet.getSheetByName( formName );
}

// Main function where it all happens
function insertToSheet( data ) {
  var flat = flattenObject( data );
  var keys = Object.keys( flat );
  var formName = data["form_name"];
  var formSheet = getFormSheet( formName );
  var headers = getHeaders( formSheet, keys );
  var values = getValues( headers, flat );
  setHeaders( formSheet, headers );
  setValues( formSheet, values );
	
  if ( emailNotification ) {
    sendNotification( data, getSheetURL() );
  }
}

function getSheetURL() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  return spreadsheet.getUrl();
}

function sendNotification( data, url ) {
  var subject = "A new Elementor Pro Forms submission has been inserted into your sheet";
  var message = "A new submission has been received via " + data['form_name'] + " form and inserted into your Google sheet at: " + url;
  MailApp.sendEmail( emailAddress, subject, message, {
    name: 'Automatic Emailer Script'
  } );
}
