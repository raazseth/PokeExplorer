import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IPokemon, IPokemonQuizQuestion} from '@typed/index';
import {
  removeUserFromLocal,
  saveTabToLocal,
  saveUserToLocal,
  saveWishlistToLocal,
} from './helper';
import {BottomSheetViewTypes} from '@typed/enum';
import {InitialState} from '@react-navigation/native';

export interface User {
  displayName: string | null;
  email: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  multiFactor: any;
  phoneNumber: string | null;
  photoURL: string | null;
  providerData: any[];
  providerId: string;
  tenantId: string | null;
  uid: string;
}

export interface IActiveQuizes {
  id: string | number;
  quiz: IPokemonQuizQuestion[];
}
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  fcmToken: string | null;
  search: IPokemon[] | [];
  wishlist: number[];
  bottomSheet: BottomSheetViewTypes; // 0-Close, 1-Profile,2-Pokemon Quiz
  displayType: 'single' | 'list';
  tab: InitialState | undefined;
  activeQuizes: IActiveQuizes | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  fcmToken: null,
  search: [],
  wishlist: [],
  bottomSheet: 0,
  displayType: 'single',
  tab: undefined,
  activeQuizes: null,
};

const updateLocalStorage = (state: any) => {
  const {user, isAuthenticated} = state;
  if (isAuthenticated && user) {
    saveUserToLocal(state);
  } else {
    removeUserFromLocal();
  }
};

export interface ILoginPayload {
  user: User;
  token: string;
  fcmToken?: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<ILoginPayload>) => {
      const payload: any = action.payload;
      state.user = payload.user as User;
      state.isAuthenticated = true;
      state.token = payload.token;
      state.fcmToken = payload.fcmToken;
      saveUserToLocal(state);
    },
    setIsAuthenticated: (state: any, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      updateLocalStorage(state);
    },
    setSearch: (state, action: PayloadAction<IPokemon[]>) => {
      state.search = action.payload;
    },
    setAcitveQuizes: (state, action: PayloadAction<IActiveQuizes>) => {
      state.activeQuizes = action.payload;
    },
    setWishlist: (state, action: PayloadAction<number[]>) => {
      state.wishlist = action.payload;
      saveWishlistToLocal(action.payload);
    },
    handleSheetView: (state, action: PayloadAction<BottomSheetViewTypes>) => {
      state.bottomSheet = action.payload;
    },
    setTab: (state, action: PayloadAction<InitialState | undefined>) => {
      state.tab = action.payload;
      saveTabToLocal(action.payload);
    },
    setDisplayType: (state, action: PayloadAction<'single' | 'list'>) => {
      state.displayType = action.payload;
    },
    logout: (state: any) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.wishlist = [];
      removeUserFromLocal();
    },
  },
});

export const {
  login,
  logout,
  setSearch,
  setWishlist,
  setDisplayType,
  setIsAuthenticated,
  setTab,
  handleSheetView,
  setAcitveQuizes,
} = authSlice.actions;

export default authSlice.reducer;
