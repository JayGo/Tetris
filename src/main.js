//TIP With Search Everywhere, you can find any action, file, or symbol in your project. Press <shortcut actionId="Shift"/> <shortcut actionId="Shift"/>, type in <b>terminal</b>, and press <shortcut actionId="EditorEnter"/>. Then run <shortcut raw="npm run dev"/> in the terminal and click the link in its output to open the app in the browser.
import { CanvasDelegate } from './model/canvas.js';

export function setupCounter(element) {
    //TIP Try <shortcut actionId="GotoDeclaration"/> on <shortcut raw="counter"/> to see its usages. You can also use this shortcut to jump to a declaration – try it on <shortcut raw="counter"/> on line 13.
    let counter = 0;

    const adjustCounterValue = value => {
        if (value >= 100) return value - 100;
        if (value <= -100) return value + 100;
        return value;
    };

    const setCounter = value => {
        counter = adjustCounterValue(value);
        //TIP WebStorm has lots of inspections to help you catch issues in your project. It also has quick fixes to help you resolve them. Press <shortcut actionId="ShowIntentionActions"/> on <shortcut raw="text"/> and choose <b>Inline variable</b> to clean up the redundant code.
        const text = `${counter}`;
        element.innerHTML = text;
    };

    document.getElementById('increaseByOne').addEventListener('click', () => setCounter(counter + 1));
    document.getElementById('decreaseByOne').addEventListener('click', () => setCounter(counter - 1));
    document.getElementById('increaseByTwo').addEventListener('click', () => setCounter(counter + 2));
    //TIP In the app running in the browser, you’ll find that clicking <b>-2</b> doesn't work. To fix that, rewrite it using the code from lines 19 - 21 as examples of the logic.
    document.getElementById('decreaseByTwo')

    //TIP Let’s see how to review and commit your changes. Press <shortcut actionId="GotoAction"/> and look for <b>commit</b>. Try checking the diff for a file – double-click main.js to do that.
    setCounter(0);
}

import {TetrisFactory} from "./model/tetris.js";
import {Constant} from "./model/constant.js";
import {Controller} from "./control/controller.js";

function setUpController() {
    let controller = Controller.getInstance()

    window.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp':
                controller.rotateR();break;
            case 'ArrowLeft':
                controller.translateL();break;
            case 'ArrowRight':
                controller.translateR();break;
            case 'ArrowDown':
                controller.translateD();break;
            case ' ':
                controller.toggleState();break;
            default:break;
        }

        canvasDelegate.draw()
    });

    return controller
}

let canvasDelegate;

export function setupGame(canvas) {
    CanvasDelegate.init(canvas)
    canvasDelegate = CanvasDelegate.getInstance()

    let tetrisFactory = TetrisFactory.getInstance()
    let tetris = tetrisFactory.makeTetris(Constant.TETRIS_TYPE_T)
    canvasDelegate.registerDrawable(tetris)
    canvasDelegate.draw()

    let controller = setUpController()
    controller.setControllable(tetris)

    controller.setIntervalCallback(() => {
        controller.translateD();
        canvasDelegate.draw();
    })

    controller.start()
}

//TIP To find text strings in your project, you can use the <shortcut actionId="FindInPath"/> shortcut. Press it and type in <b>counter</b> – you’ll get all matches in one place.
// setupCounter(document.getElementById('counter-value'));

setupGame(document.getElementById('tetris-canvas'))

//TIP There's much more in WebStorm to help you be more productive. Press <shortcut actionId="Shift"/> <shortcut actionId="Shift"/> and search for <b>Learn WebStorm</b> to open our learning hub with more things for you to try.
