import {v4 as uuidv4} from 'uuid';


export const getSessionId = () => {
    let sessionId = localStorage.getItem('cartSessionId');
    if (!sessionId) {
        sessionId = uuidv4();
        localStorage.setItem('cartSessionId', sessionId);
    }
    return sessionId;
}