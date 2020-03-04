import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from './reducers/reducers';
import middlewares from './middlewares/middlewares';
import sagas from './sagas/sagas';

import { persistedState, saveState } from './persisted.store.js';

import { composeWithDevTools } from 'redux-devtools-extension';

export default function configureStore() {

    const sagaMiddleware = createSagaMiddleware();

    const composeEnhancers = composeWithDevTools({
        trace: true
    })

    const store = createStore(
        reducers,
        persistedState, // second argument overrides the initial state
        composeEnhancers(
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

    return store;

}