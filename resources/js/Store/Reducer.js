import Helper from '../Helper';

const Reducer = (state, payload) => {
    let userObj = window._.isEmpty(Helper.getStorageData('user')) ? {} : Helper.getStorageData('user');
    switch (payload.type) {
        case 'SET_STATE':
            return {
                ...state,
                data: typeof payload.response == "undefined" ? [] : payload.response,
                flash_message_show: typeof payload.flash_message_show == "undefined" ? false : payload.flash_message_show,
                user: typeof payload.user == "undefined" ? userObj : payload.user,
                lang: typeof payload.lang == "undefined" ? state.lang : payload.lang,
            }
        default:
            return state;
    }
};
export default Reducer;
