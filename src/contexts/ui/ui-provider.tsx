import type { FC, PropsWithChildren } from "react";
import { useCallback, useEffect, useMemo, useReducer } from "react";

import { Languages } from "@utils/types";
import { useTranslation } from "react-i18next";
import { useTheme } from "@hooks/use-theme";
import { storage } from "App";
import { LANGUAGE_KEY } from "@utils/constants";
import { initialState, UiContext, type State } from "./ui-context";

enum ActionType {
  INITIALIZE = "INITIALIZE",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
}

type InitializeAction = {
  type: ActionType.INITIALIZE;
  payload: {
    language: Languages;
  };
};

type ChangeLanguageAction = {
  type: ActionType.CHANGE_LANGUAGE;
  payload: Languages;
};

type Action = ChangeLanguageAction | InitializeAction;

type Handler = (state: State, action: any) => State;

const handlers: Record<ActionType, Handler> = {
  INITIALIZE: (state: State, action: InitializeAction): State => {
    const { language } = action.payload;
    return {
      ...state,
      language,
    };
  },

  CHANGE_LANGUAGE: (state: State, action: ChangeLanguageAction): State => {
    return {
      ...state,
      language: action.payload,
    };
  },
};

const reducer = (state: State, action: Action): State =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

export const UiProvider: FC<PropsWithChildren> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { i18n } = useTranslation();
  const { changeDirection } = useTheme();

  const initialize = useCallback(() => {
    try {
      const language = storage.getString(LANGUAGE_KEY) as Languages;
      if (language !== undefined && language !== null) {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            language,
          },
        });
      } else {
        dispatch({
          type: ActionType.INITIALIZE,
          payload: {
            language: Languages.ENGLISH,
          },
        });
      }
    } catch (err) {
      console.error(err);
      dispatch({
        type: ActionType.INITIALIZE,
        payload: {
          language: Languages.ENGLISH,
        },
      });
    }
  }, [dispatch]);

  useEffect(() => {
    initialize();
  }, []);

  const changeLanguage = useCallback(
    async (language: Languages) => {
      storage.set(LANGUAGE_KEY, language);
      try {
        await i18n.changeLanguage(language);
        dispatch({
          type: ActionType.CHANGE_LANGUAGE,
          payload: language,
        });
        changeDirection(language);
      } catch (err) {
        throw new Error(err as string);
      }
    },
    [dispatch],
  );

  const values = useMemo(
    () => ({
      ...state,
      changeLanguage,
    }),
    [state],
  );

  return (
    <UiContext.Provider value={values} {...props}>
      {children}
    </UiContext.Provider>
  );
};
