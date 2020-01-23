import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers/reducers';
import middlewares from './middlewares/middlewares';
import sagas from './sagas/sagas';

import { updateTheme } from './middlewares/themes.middleware.js';

import { persistedState, saveState } from './persisted.store.js';

import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore() {

    const sagaMiddleware = createSagaMiddleware();

    const store = createStore(
        reducers,
        persistedState, // second argument overrides the initial state
        composeWithDevTools(
            applyMiddleware(
                ...middlewares,
                sagaMiddleware
            )
        )
    );

    sagaMiddleware.run(sagas);

    // add a listener that will be invoked on any state change
    store.subscribe(() => {
        saveState(store.getState());
    });

    // Update the initial theme
    updateTheme(store.getState())

    return store;

}