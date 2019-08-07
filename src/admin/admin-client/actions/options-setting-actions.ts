import { UPDATE_RCUSAGE } from './types';

export const updateRCUsageState = (onoff: number) => dispatch => {
  dispatch({
    type: UPDATE_RCUSAGE,
    payload: onoff
  });
}