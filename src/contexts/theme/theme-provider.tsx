import type { FC, PropsWithChildren } from "react";
import { useCallback, useMemo, useReducer } from "react";

import { Direction, ThemeConfig } from "@theme/index";
import { Languages } from "@utils/types";
import { ThemeContext, initialState } from "./theme-context";

enum ActionType {
  CHANGE_DIRECTION = "CHANGE_DIRECTION",
}

type ChangeDirectionAction = {
  type: ActionType.CHANGE_DIRECTION;
  payload: Direction;
};

type Action = ChangeDirectionAction;

type Handler = (state: ThemeConfig, action: Action) => ThemeConfig;

const handlers: Record<ActionType, Handler> = {
  CHANGE_DIRECTION: (
    state: ThemeConfig,
    action: ChangeDirectionAction,
  ): ThemeConfig => {
    return {
      ...state,
      direction: action.payload,
    };
  },
};

const reducer = (state: ThemeConfig, action: Action): ThemeConfig =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const ThemeProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  const changeDirection = useCallback(
    (language: Languages) => {
      dispatch({
        type: ActionType.CHANGE_DIRECTION,
        payload: language === Languages.ENGLISH ? "ltr" : "rtl",
      });
    },
    [dispatch],
  );

  const values = useMemo(
    () => ({
      ...state,
      changeDirection,
    }),
    [state],
  );

  return (
    <ThemeContext.Provider value={values}>{children}</ThemeContext.Provider>
  );
};
