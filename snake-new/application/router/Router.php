<?php

require_once dirname(__DIR__) . '/game/Game.php';
require_once dirname(__DIR__) . '/modules/db/db.php';
require_once dirname(__DIR__) . '/modules/user/User.php';

class Router {

    private $db;
    private $user;
	private $game;

	public function __construct() {
        $this->db = new DB();
        $this->game = new Game($this->db);
        $this->user = new User($this->db);
	}

	// Хороший ответ, возвращаем данные
	private function good($text) {
	    return ['result' => true, 'data' => $text];
    }

    // Плохой ответ, возвращаем ошибку
    private function bad($text) {
	    return ['result' => false, 'error' => $text];
    }
    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! шаг 2
    //вызываем свое имя функции
    //с параметрами
    private function login($login, $password) {
        $token = $this->user->login($login, $password);
        return ($token) ?
            $this->good($token) :
            $this->bad('authorization fail');
    }

    private function logout($token) {
        return ($this->user->logout($token)) ?
            $this->good(true) :
            $this->bad('logout fail');
    }

   //без параметров
    private function getLeaderBoard(){
	    return $this->db->getLeaderboard();
    }

    private function getLength() {
        return $this->db->getSnakeSumLengthOfOnlineUsers();
    }

    // общий ответ на ВСЕ входящие запросы
	public function answer($options) {
	    if ($options && isset($options->method)) {
	        $method = $options->method;
	        // выполнить неигровые команды (сопутствующие)
            if ($method) {
                switch ($method) {
                    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! шаг 3
                    //пишем свой case по премеру
                    //с параметрами
                    case 'login'  : return $this->login($options->login, $options->password); break;
                    case 'logout' : return $this->logout($options->token); break;
                    //без параметров
                    case 'getSnakeSumLengthOfOnlineUsers' : return $this->getLength(); break;
                }
                $userId = $this->user->checkToken($options->token); // проверить валидность токена пользователя
                if ($userId) {
                    $options->user_id = $userId;
                    // выполнить любые команды ДЛЯ игры
                    $COMMAND = $this->game->getCommand();
                    foreach ($COMMAND as $command) {
                        if ($command === $method) {
                            unset($options->method);
                            $result = $this->game->executeCommand($method, $options);
                            if ($result) {
                                if (isset($options->map_id)) {
                                    if ($this->game->updateData($options->map_id)) { // записать измененные данные в БД
                                        // проверить что игра закончена
                                        $isFinishGame = $this->game->finishGame($options->map_id, $options->user_id);
                                        if($isFinishGame) {
                                            return $this->good($isFinishGame);
                                        }
                                        return $this->good($this->game->getData($options->map_id));
                                    }
                                    return $this->bad('no update');
                                }
                                return $this->good($result);
                            }
                            return $this->bad('game method return false');
                        }
                    }
                }
                return $this->bad('Invalid token');
            } else {
                return $this->bad('The method ' . $method . ' has no exist');
            }
        }
		return $this->bad('You must set method param');
	}
}