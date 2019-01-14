<?php

error_reporting(-1);

require_once '../application/router/Router.php';

$router = new Router(); // router contains regular php methods

header('Content-type: application/json'); // we will be communicating using json
// echo 'hello'; // echo means send back to client
echo json_encode($router->answer((object) $_GET)); // json encode transforms object to json
