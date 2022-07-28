<?PHP
######################################################
#                                                    #
#                Forms To Go 4.5.4                   #
#             http://www.bebosoft.com/               #
#                                                    #
######################################################




define('kOptional', true);
define('kMandatory', false);

define('kStringRangeFrom', 1);
define('kStringRangeTo', 2);
define('kStringRangeBetween', 3);

define('kYes', 'yes');
define('kNo', 'no');




error_reporting(E_ERROR | E_WARNING | E_PARSE);
ini_set('track_errors', true);

function DoStripSlashes($fieldValue)  {
// temporary fix for PHP6 compatibility - magic quotes deprecated in PHP6
 if ( function_exists( 'get_magic_quotes_gpc' ) && get_magic_quotes_gpc() ) {
  if (is_array($fieldValue) ) {
   return array_map('DoStripSlashes', $fieldValue);
  } else {
   return trim(stripslashes($fieldValue));
  }
 } else {
  return $fieldValue;
 }
}

function FilterCChars($theString) {
 return preg_replace('/[\x00-\x1F]/', '', $theString);
}

function CheckString($value, $low, $high, $mode, $limitAlpha, $limitNumbers, $limitEmptySpaces, $limitExtraChars, $optional) {

 $regEx = '';

 if ($limitAlpha == kYes) {
  $regExp = 'A-Za-z';
 }

 if ($limitNumbers == kYes) {
  $regExp .= '0-9';
 }

 if ($limitEmptySpaces == kYes) {
  $regExp .= ' ';
 }

 if (strlen($limitExtraChars) > 0) {

  $search = array('\\', '[', ']', '-', '$', '.', '*', '(', ')', '?', '+', '^', '{', '}', '|', '/');
  $replace = array('\\\\', '\[', '\]', '\-', '\$', '\.', '\*', '\(', '\)', '\?', '\+', '\^', '\{', '\}', '\|', '\/');

  $regExp .= str_replace($search, $replace, $limitExtraChars);

 }

 if ( (strlen($regExp) > 0) && (strlen($value) > 0) ){
  if (preg_match('/[^' . $regExp . ']/', $value)) {
   return false;
  }
 }

 if ( (strlen($value) == 0) && ($optional === kOptional) ) {
  return true;
 } elseif ( (strlen($value) >= $low) && ($mode == kStringRangeFrom) ) {
  return true;
 } elseif ( (strlen($value) <= $high) && ($mode == kStringRangeTo) ) {
  return true;
 } elseif ( (strlen($value) >= $low) && (strlen($value) <= $high) && ($mode == kStringRangeBetween) ) {
  return true;
 } else {
  return false;
 }

}


function CheckEmail($email, $optional) {
 if ( (strlen($email) == 0) && ($optional === kOptional) ) {
  return true;
  } elseif ( preg_match("/^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i", $email) == 1 ) {
  return true;
 } else {
  return false;
 }
}




if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
 $clientIP = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
 $clientIP = $_SERVER['REMOTE_ADDR'];
}

$FTGcontact_reason_group = DoStripSlashes( $_POST['contact_reason_group'] );
$FTGevent_date = DoStripSlashes( $_POST['event_date'] );
$FTGfirst_name = DoStripSlashes( $_POST['first_name'] );
$FTGlast_name = DoStripSlashes( $_POST['last_name'] );
$FTGcontact_email = DoStripSlashes( $_POST['contact_email'] );
$FTGcontact_phone = DoStripSlashes( $_POST['contact_phone'] );
$FTGcontact_url = DoStripSlashes( $_POST['contact_url'] );
$FTGmessage = DoStripSlashes( $_POST['message'] );



$validationFailed = false;

# Fields Validations


if (!CheckString($FTGcontact_reason_group, 1, 0, kStringRangeFrom, kNo, kNo, kNo, '', kMandatory)) {
 $FTGErrorMessage['contact_reason_group'] = 'Please select why you\'re contacting us.';
 $validationFailed = true;
}

if (!CheckString($FTGfirst_name, 1, 0, kStringRangeFrom, kNo, kNo, kNo, '', kMandatory)) {
 $FTGErrorMessage['first_name'] = 'Please fill in your first name.';
 $validationFailed = true;
}

if (!CheckString($FTGlast_name, 1, 0, kStringRangeFrom, kNo, kNo, kNo, '', kMandatory)) {
 $FTGErrorMessage['last_name'] = 'Please fill in your last name.';
 $validationFailed = true;
}

if (!CheckEmail($FTGcontact_email, kMandatory)) {
 $FTGErrorMessage['contact_email'] = 'Please fill in a valid email address.';
 $validationFailed = true;
}

if (!CheckString($FTGcontact_phone, 1, 0, kStringRangeFrom, kNo, kNo, kNo, '', kMandatory)) {
 $FTGErrorMessage['contact_phone'] = 'Please provide your phone number.';
 $validationFailed = true;
}

if (!CheckString($FTGcontact_url, 0, 0, kStringRangeBetween, kNo, kNo, kNo, '', kMandatory)) {
 $FTGErrorMessage['contact_url'] = 'Sorry, you\'re a bot.';
 $validationFailed = true;
}

if (!CheckString($FTGmessage, 1, 0, kStringRangeFrom, kNo, kNo, kNo, '', kMandatory)) {
 $FTGErrorMessage['message'] = 'Please fill in your message.';
 $validationFailed = true;
}



# Include message in error page and dump it to the browser

if ($validationFailed === true) {

 $errorPage = '<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /><title>Error</title></head><body>Errors found: <!--VALIDATIONERROR--></body></html>';

 $errorPage = str_replace('<!--FIELDVALUE:contact_reason_group-->', $FTGcontact_reason_group, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:first_name-->', $FTGfirst_name, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:last_name-->', $FTGlast_name, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:contact_email-->', $FTGcontact_email, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:contact_phone-->', $FTGcontact_phone, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:contact_url-->', $FTGcontact_url, $errorPage);
 $errorPage = str_replace('<!--FIELDVALUE:message-->', $FTGmessage, $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:contact_reason_group-->', $FTGErrorMessage['contact_reason_group'], $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:first_name-->', $FTGErrorMessage['first_name'], $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:last_name-->', $FTGErrorMessage['last_name'], $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:contact_email-->', $FTGErrorMessage['contact_email'], $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:contact_phone-->', $FTGErrorMessage['contact_phone'], $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:contact_url-->', $FTGErrorMessage['contact_url'], $errorPage);
 $errorPage = str_replace('<!--ERRORMSG:message-->', $FTGErrorMessage['message'], $errorPage);


 $errorList = @implode("<br />\n", $FTGErrorMessage);
 $errorPage = str_replace('<!--VALIDATIONERROR-->', $errorList, $errorPage);



 echo $errorPage;
  header("HTTP/1.0 500 Internal Server Error");
  // header('HTTP/1.1 500 Internal Server Booboo');
  header('Content-Type: application/json; charset=UTF-8');
  die(json_encode(array('message' => 'ERROR', 'code' => 1337)));
}

if ( $validationFailed === false ) {

 # Email to Form Owner

 $emailSubject = FilterCChars("New inquiry about The Lodge...");

 $emailBody = "You have received a new website inquiry; details are below.\n"
  . "\n"
  . "-----\n"
  . "From: $FTGfirst_name $FTGlast_name\n"
  . "Reason: $FTGcontact_reason_group\n"
  . "Event Date: $FTGevent_date\n"
  . "Email: $FTGcontact_email\n"
  . "Phone: $FTGcontact_phone\n"
  . "Message:\n"
  . "$FTGmessage\n"
  . "-----";
  $emailTo = 'The Zimmee <thezimmee+list@gmail.com>, The Lodge <info@thelodgeattraverse.com>';

  $emailFrom = FilterCChars("$FTGcontact_email");

  $emailHeader = "From: $emailFrom\n"
   . "MIME-Version: 1.0\n"
   . "Content-type: text/plain; charset=\"UTF-8\"\n"
   . "Content-transfer-encoding: 8bit\n";

  mail($emailTo, $emailSubject, $emailBody, $emailHeader);


 # Confirmation Email to User

 $confEmailTo = FilterCChars($FTGcontact_email);

 $confEmailSubject = FilterCChars("Thank you for contacting The Lodge at Traverse Mountain...");

 $confEmailBody = "We wanted to let you know we received your message. Our Event Director will be in touch soon. Thank you!\n"
  . "\n"
  . "The Lodge at Traverse Mountain.";

 $confEmailHeader = "From: info@thelodgeattraverse.com\n"
  . "MIME-Version: 1.0\n"
  . "Content-type: text/plain; charset=\"UTF-8\"\n"
  . "Content-transfer-encoding: 8bit\n";

 mail($confEmailTo, $confEmailSubject, $confEmailBody, $confEmailHeader);



# Include message in the success page and dump it to the browser

$successPage = '<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /><title>Success</title></head><body>Thank you for contacting us, your form was submitted successfully.</body></html>';

$successPage = str_replace('<!--FIELDVALUE:contact_reason_group-->', $FTGcontact_reason_group, $successPage);
$successPage = str_replace('<!--FIELDVALUE:first_name-->', $FTGfirst_name, $successPage);
$successPage = str_replace('<!--FIELDVALUE:last_name-->', $FTGlast_name, $successPage);
$successPage = str_replace('<!--FIELDVALUE:contact_email-->', $FTGcontact_email, $successPage);
$successPage = str_replace('<!--FIELDVALUE:contact_phone-->', $FTGcontact_phone, $successPage);
$successPage = str_replace('<!--FIELDVALUE:contact_url-->', $FTGcontact_url, $successPage);
$successPage = str_replace('<!--FIELDVALUE:message-->', $FTGmessage, $successPage);

echo $successPage;

}

?>