<?php

require_once 'Map.php';
require_once 'Snake.php';
require_once 'Food.php';
require_once 'SnakeBody.php';

class Struct {
    public $maps;
    public $snakes;
    public $foods;
    public $snakesBody;

    public function __construct()
    {

    }

    public function addSnakes($snakes) {
        if (isset($snakes)) {
            $this->snakes = [];
            foreach ($snakes as $key => $snake) {
                $this->snakes[] = new Snake($snake);
                unset($this->snakes[$key]->deleted_at);
            }
        }
    }
    public function addSnakeBody($snakeBody) {
        if (isset($snakeBody)) {
            foreach ($this->snakes as $key => $snake) {
                foreach ($snakeBody as $key2 => $body) {
                    if ($snake->id == $body->snake_id) {
                        $snake->body[] = new SnakeBody($body);
                        unset($this->snakes[$key]->body[$key2]->deleted_at);
                    }
                }
            }
        }
    }
    public function addFoods($foods) {
        if (isset($foods)) {
            $this->foods = [];
            foreach ($foods as $food) {
                $this->foods[] = new Food($food);
            }
        }
    }
    public function addMaps($maps) {
        if(isset($maps)) {
            $this->maps = [];
            foreach ($maps as $item) {
                $this->maps[] = new Map($item);
            }
        }
    }
}
