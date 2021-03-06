import {FETCHED_CATEGORIES} from './CategoryActionCreators';

export const initialState = {
  categories: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case FETCHED_CATEGORIES:
      return {
        ...state,
        categories: [...action.data],
      };
    default:
      return state;
  }
}
