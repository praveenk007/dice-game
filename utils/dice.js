class Dice {

    static roll() {
        return Math.floor(Math.random() * Math.floor(5)) + 1;
    }
}

module.exports = Dice;