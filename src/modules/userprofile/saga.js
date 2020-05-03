import _ from 'lodash';
import { takeLatest, put, takeEvery } from 'redux-tale/es/effects';
import * as actionTypes from './actionTypes';
import * as actions from './actions';
import { showToast } from 'utils/ui';
import api from 'utils/client';
import API_CONFIG from 'constants/apiconfig';
import { isPaidMemberFromStore } from './selectors';

function parseAccountDetails(userDetails) {
    return [
        { label: 'Name', value: userDetails.name },
        { label: 'Email', value: userDetails.username },
        { label: 'Timezone', value: userDetails.timezone },
    ];
}

function getMembershipDetails(userDetails) {
    return userDetails.membership;
}

function prepareFeatureFlags(isPaidMember) {
    return {

    };
}

function* onGetAccountDetails() {
    const { message = {}, type } = API_CONFIG.USER_DETAILS;
    try {
        const userDetails = yield api[type]({ 
            ...API_CONFIG.USER_DETAILS,
        });
        yield put(actions.getAccountDetailsSuccess(parseAccountDetails(userDetails)));
        yield put(actions.getAccountMembershipSuccess(getMembershipDetails(userDetails)));
        const isPaidmember = isPaidMemberFromStore();
        yield put(actions.setFeatureFlags(prepareFeatureFlags(isPaidmember)));
    } catch (error) {
        console.error(error);
        const errorMessage = message.error[error.status];
        showToast(errorMessage, 'error');
    }
}

function* onSaveAccountDetails({ accountDetails: { name, password, timezone } }) {
    const { message = {}, type } = API_CONFIG.USER_UPDATE;
    try {
        yield api[type]({ 
            ...API_CONFIG.USER_UPDATE,
            body: { name, password, timezone }, 
        });
        yield put(actions.toggleEdit());
        yield onGetAccountDetails();
    } catch (error) {
        const errorMessage = message.error[error.status];
        showToast(errorMessage, 'error');
    }
}

function* onUpgradeMembership({ payment }) {
    try {
        console.log(payment);
        yield onGetAccountDetails();
    } catch (error) {
        console.error(error);
    }
}

export default [
    takeLatest(actionTypes.GET_ACCOUNT_DETAILS, onGetAccountDetails),
    takeLatest(actionTypes.SAVE_ACCOUNT_DETAILS, onSaveAccountDetails),
    takeEvery(actionTypes.UPDATE_MEMBERSHIP_SUCCESS, onUpgradeMembership),
];