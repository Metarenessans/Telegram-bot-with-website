<?php

ini_set('display_errors','On');
error_reporting(E_ALL);

// Информация из формы

$name = $_GET['name'];
$tel  = $_GET['tel'];

// Google Sheets API

require_once __DIR__ . "/google-api-php-client/vendor/autoload.php";

print(__DIR__ . "/google-api-php-client/vendor/autoload.php");

$client = new Google_Client();
$client->setApplicationName('Google Sheets PHP');
$client->setScopes(Google_Service_Sheets::SPREADSHEETS);
$client->setAccessType('offline');
$client->setAuthConfig(__DIR__ . '/credentials.json');

$service = new Google_Service_Sheets($client);
$spreadsheetId = "1yiDYQh_r95PJxFWWQUGFwv0Urc1fK8ZS7GpJOu5cSd8";

// Отправляем данные

$range = "Заявки";
$values = [
  [$name, $tel]
];
$query_body = new Google_Service_Sheets_ValueRange([
  'values' => $values
]);
$params = [
  'valueInputOption' => 'RAW'
];
$insert = [
  'insertDataOption' => 'INSERT_ROWS'
];
$result = $service->spreadsheets_values->append(
  $spreadsheetId,
  $range,
  $query_body,
  $params,
  $insert
);

?>