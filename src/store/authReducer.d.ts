import { Reducer } from 'redux';

export interface AuthState {
  user: any | null;
  loading: boolean;
}

declare const authReducer: Reducer<AuthState>;
export default authReducer;
