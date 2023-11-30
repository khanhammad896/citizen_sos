import type { FC, PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useReducer } from "react";

import { storage } from "App";
import { AUTH_KEY, ON_BOARDED_KEY } from "@utils/constants";
import { ProfileInputType, User } from "@utils/types";
import { AuthContext, initialState } from "./auth-context";
import type { State } from "./auth-context";

enum ActionType {
  INITIALIZE = "INITIALIZE",
  LOGIN = "LOGIN",
  SIGN_OUT = "SIGN_OUT",
  ON_BOARD = "ON_BOARD",
  UPDATE_USER = "UPDATE_USER",
  CHECK_ON_BOARD = "CHECK_ON_BOARD",
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    isAuthenticated: boolean;
    user: User | null;
  };
};

type LoginAction = {
  type: ActionType.LOGIN;
  payload: {
    user: User;
  };
};

type SignOutAction = {
  type: ActionType.SIGN_OUT;
};

type OnBoardAction = {
  type: ActionType.ON_BOARD;
};

type CheckOnBoardAction = {
  type: ActionType.CHECK_ON_BOARD;
  payload: {
    isOnBoarded: boolean;
  };
};

type UpdateUserAction = {
  type: ActionType.UPDATE_USER;
  payload: {
    user: User;
  };
};

type Action =
  | InitializeAction
  | LoginAction
  | SignOutAction
  | OnBoardAction
  | CheckOnBoardAction
  | UpdateUserAction;

type Handler = (state: State, action: any) => State;

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      user,
    };
  },
  LOGIN: (state: State, action: LoginAction): State => {
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },

  SIGN_OUT: (state: State): State => {
    return {
      ...state,
      isAuthenticated: false,
      user: null,
    };
  },
  ON_BOARD: (state: State): State => {
    return {
      ...state,
      isOnBoarded: true,
    };
  },
  UPDATE_USER: (state: State, action: UpdateUserAction) => {
    const { user } = action.payload;
    return {
      ...state,
      user,
    };
  },
  CHECK_ON_BOARD: (state: State, action: CheckOnBoardAction): State => {
    const { isOnBoarded } = action.payload;
    return {
      ...state,
      isOnBoarded,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(() => {
    try {
      const user = storage.getString(AUTH_KEY);
      if (user !== undefined && user !== null) {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: true,
            user: JSON.parse(user),
          },
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          isAuthenticated: false,
          user: null,
        },
      });
    }
    try {
      const isOnBoarded = storage.getString(ON_BOARDED_KEY);
      if (isOnBoarded) {
        dispatch({
          type: ActionType.CHECK_ON_BOARD,
          payload: {
            isOnBoarded: true,
          },
        });
      } else {
        dispatch({
          type: ActionType.CHECK_ON_BOARD,
          payload: {
            isOnBoarded: false,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.CHECK_ON_BOARD,
        payload: {
          isOnBoarded: false,
        },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    initialize();
  }, []);

  const login = useCallback(
    (user: User) => {
      storage.set(AUTH_KEY, JSON.stringify(user));

      dispatch({
        type: ActionType.LOGIN,
        payload: {
          user,
        },
      });
    },
    [dispatch],
  );

  const signOut = useCallback(() => {
    storage.delete(AUTH_KEY);
    dispatch({ type: ActionType.SIGN_OUT });
  }, [dispatch]);

  const onBoard = useCallback(() => {
    storage.set(ON_BOARDED_KEY, "onBoarded");
    dispatch({ type: ActionType.ON_BOARD });
  }, [dispatch]);

  const update = useCallback(
    (updatedUser: ProfileInputType) => {
      const prevUser = JSON.parse(storage.getString(AUTH_KEY)!) as User;
      const user: User = {
        ...prevUser,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        email: updatedUser.email,
        cnic: updatedUser.cnic,
      };
      storage.set(AUTH_KEY, JSON.stringify(user));
      dispatch({
        type: ActionType.UPDATE_USER,
        payload: {
          user,
        },
      });
    },
    [dispatch],
  );
  const value = useMemo(
    () => ({
      ...state,
      login,
      signOut,
      onBoard,
      update,
    }),
    [state],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
