// Отрисовка сцены
function Graph(c = {}) {
    const canvas = c.game.canvas, // холст
        ctx = canvas.getContext('2d'),
        SIZE = c.size, // размеры
        sprites = c.sprites; // Координаты в спрайте

    ctx.fillStyle = "#577ddb";

    // Отрисовываем карту
    this.draw = (data = {}) => {
        c.game.block.attr({width: (SIZE.width * SIZE.sizeSnake) + 'px', height: (SIZE.height * SIZE.sizeSnake) + 'px'});

        this.clear();

        this.drawMap();
        this.drawSnakes(data.snakes);
        this.drawFoods(data.foods);
    };


    // Отрисовываем карту
    this.drawMap = () => {
        let sprite = new Image();
        sprite.src = c.path.images + 'bg2.png';

        sprite.addEventListener('load', () => {
            ctx.drawImage(sprite, 0, 0, (SIZE.width * SIZE.sizeSnake), (SIZE.height * SIZE.sizeSnake))
        }, false);
    };

    this.drawSnakes = (snakes = {}) => {
        // Отрисовываем всех змей
        for (let i = 0; i < snakes.length; i++) {
            this.drawSnake(snakes[i]);
        }
    };

    // Рисование змеи
    this.drawSnake = (snake = {}) => {
        let body = snake.body, // Тело
            direction = snake.direction, // Направление
            lastPosition = {}, // Последняя позиция
            countItems = 0; // Количество тел в змейке

        if (!body) return;
        countItems = body.length;

        let bodyPart = null;

        // Loop over every snake segment
        for (var i = 0; i < snake.body.length; i++) {
            var segment = snake.body[i];
            var segx = segment.x;
            var segy = segment.y;
            var tilex = segx * SIZE.sizeSnake;
            var tiley = segy * SIZE.sizeSnake;

            // Sprite column and row that gets calculated
            var tx = 0;
            var ty = 0;

            if (i == 0) {
                // Head; Determine the correct image
                var nseg = snake.body[i + 1]; // Next segment
                if (segy < nseg.y) {
                    // Up
                    bodyPart = "head_up";
                } else if (segx > nseg.x) {
                    // Right
                    bodyPart = "head_right";
                } else if (segy > nseg.y) {
                    // Down
                    bodyPart = "head_down";
                } else if (segx < nseg.x) {
                    // Left
                    bodyPart = "head_left";
                }
            } else {

                bodyPart = "body";
            }

            this.drawSprite(bodyPart, tilex, tiley);
        }
    };

    // Рисование еды
    this.drawFoods = (foods = {}) => {
        // Отрисовываем всех змей
        for (let i = 0; i < foods.length; i++) {
            this.drawFood(foods[i]);
        }
    };

    this.drawFood = (food = {}) => {
        this.drawSprite("food", food.x * SIZE.sizeSnake, food.y * SIZE.sizeSnake);
    };


    // Рисование спрайта
    this.drawSprite = (bodyPartName, x, y) => {

        let imageName = null;

        if (bodyPartName === "head_up") {

            imageName = "Head_Up.png";

        } else if (bodyPartName === "head_down") {

            imageName = "Head_Down.png";

        } else if (bodyPartName === "head_right") {

            imageName = "Head_Right.png";

        } else if (bodyPartName === "head_left") {

            imageName = "Head_Left.png";

        } else if (bodyPartName === "body") {

            imageName = "Body.png";

        } else if (bodyPartName === "food") {

            imageName = "Food.png";

        }

        if (imageName != null) {
            let sprite = new Image();
            sprite.src = c.path.images + imageName;
            sprite.addEventListener("load", function () {
                ctx.drawImage(sprite, 0, 0, 64, 64, x, y, SIZE.sizeSnake, SIZE.sizeSnake);
            }, false);

        }
    };


    // Подготовка сцены
    this.init = () => {
        // путь до спрайтов
        let link = location.href;
        link = link.split('?')[0];
        link = link.split('/').slice(0, -1).join('/');
        c.path.sprites = link + c.path.sprites;
        c.path.images = link + c.path.images;
    };
    // Очистка сцены
    this.clear = () => {
        ctx.clearRect(0, 0, (SIZE.width * SIZE.sizeSnake), (SIZE.height * SIZE.sizeSnake));
    };

}

