// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };
    };

    init() {
        this.startInput();
        this.timer = new Timer();

        initProfiles();
    };

    startInput() {
        document.getElementById("restart_sim").addEventListener("click", () => { params.SIM_CURR_TRIAL = 0; this.population.resetSim(); });

        //Pausing listener
        document.getElementById("pause_sim").addEventListener("click", () => {
            params.SIM_PAUSE = params.SIM_PAUSE ? false : true;
            var elem = document.getElementById("pause_sim");
            if (params.SIM_PAUSE) {
                elem.innerHTML = "Resume Simulation";
                elem.setAttribute('style', "background-color: red; color:white;");
            }
            else {
                elem.innerHTML = "Pause Simulation";
                elem.setAttribute('style', "background-color: green; color:white;");
            }
        });

        document.getElementById("loadProfile").addEventListener("click", () => {
            let profile = profileList[document.getElementById("profileOption").value];
            loadProfile(profile);
        });

        document.getElementById("db_download_data").addEventListener("click", () => {
            let downloadButton = document.getElementById("db_download_data");
            downloadButton.innerHTML = "Download Data";
            downloadButton.setAttribute('style', "background-color: red; color:white;");
            downloadData();
        });
    };

    start() {
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, document.body.children[0]);
        };
        gameLoop();
    };

    draw() {
        if (!params.PAUSE_DRAWING) {
            this.population.worlds.forEach(members => {
                if (params.WORLD_UPDATE_ASYNC) {
                    execAsync(members.draw());
                }
                else {
                    members.draw();
                }
            });
        }
    };

    update() {
        //Pausing update
        if (params.SIM_PAUSE) {
            return;
        }

        this.population.worlds.forEach((world) => {
            world.update();
        });

        let isNewGeneration = this.population.update();

        if (isNewGeneration) {
            this.population.redistributeFoodAndPoison();

            if (params.FOOD_PERIODIC_REPOP) {
                this.population.checkFoodLevels(false);
            }

            if (params.POISON_PERIODIC_REPOP) {
                this.population.checkFoodLevels(true);
            }
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    };

};

// KV Le was here :)
// and Artem Potafiy
// and Gabe Bryan
// and Toan Nguyen