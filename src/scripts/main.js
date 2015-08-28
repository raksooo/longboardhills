import './formHandler';
import {HillLoader} from './hillLoader';
import {MapHandler} from './mapHandler';

var hillLoader;

$(() => {
    new Main();
});

class Main {
    constructor() {
        MapHandler.getMapHandler();
        hillLoader = new HillLoader();
        hillLoader.loadHills();
    }
}

