// Игра
function Game(server, switchPage) {
    var c, ui, graph;
    let isChangingDirection = false; // is the user currently waiting for change direction signal?
    let isUpdatingScene = false;
    let directionToMove = null;
    let refresh_rate = 100; // every 1/2 of second update scene

    this.init = () => {
        ui = new UI(handlerUI);
        graph = new Graph(c);
    };

    this.start = (options) => {
        graph.init();
        graph.draw(options);
        ui.init();
        this.gameLoop();
    };

    // Отлавливаем колбеки UI
    const handlerUI = {
        onChangeDirection: async (direction = 'right') => {

            if (isUpdatingScene === false) {

                directionToMove = direction;
            }
        },
    };

    this.gameLoop = async () => {

        while (true) {

            // handle direction moves
            if (directionToMove != null) {

                const answer = await server.changeDirection(directionToMove);
                if (answer.result) {
                    // Отрисовываем игру
                } else {
                    error(answer.error);
                }

                directionToMove = null;
            }

            // update scene
            const game_finished = await this.updateScene();

            // end game loop if game is finished
            if (game_finished) break;

            // wait for refresh_rate miliseconds
            await sleep(refresh_rate)

        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // обновление сцены
    this.updateScene = async () => {

        let isFinish = false; // игра закончена

        const answer = await server.getScene();

        if (answer.result) {
            // положительный результат сервера
            if (answer.data.finish) {
                isFinish = true;
                c.text.user_score.text(answer.data.score);
                c.modal.finish.modal(); // выдаем окно с завершением игры
                c.modal.finish.on('hidden.bs.modal', function (e) {
                    // do something...
                    switchPage('ProfilePage');
                })
            } else {
                // Отрисовываем игру
                graph.draw(answer.data);
            }
        } else {
            error(answer.error);
        }

        return isFinish;
    };


    // Константы
    c = {
        modal: {
            finish: $('#modalFinishGame'),
            closeFinish: $('#closeFinishGame'),
        },
        text: {
            user_score: $('.user_score'),
        },
        btn: {
            startGame: $('.startGameBtn'),
            stopGame: $('.stopGameBtn'),
            logout: $('.logoutBtn'),
        },
        form: {
            login: $('#loginForm'),
            register: $('#registerForm'),
        },
        game: {
            canvas: document.getElementById('game'),
            block: $('#game'),
            wrapper: $('#game_wrapper'),
        },
        blocks: {
            maps: $('.mapsBlock'),
        },
        size: {
            width: 28,
            height: 14,
            sizeSnake: 32,
            px: 'px',
        },
        path: {
            sprites: '/public/img/sprite/',
            images: '/public/img/',
        },
        sprites: {
            head: {
                up: [192, 0],
                down: [256, 64],
                left: [192, 64],
                right: [256, 0],
            },
            body: {
                lineHoriz: [64, 0],
                lineVert: [128, 64],
                leftDown: [0, 64],
                leftUp: [0, 0],
                rightUp: [128, 0],
                rightDown: [128, 128],
            },
            footer: {
                up: [192, 128],
                down: [256, 192],
                left: [192, 192],
                right: [256, 128],
            },
            // Еда
            eat: [0, 192],
        },
    };
}