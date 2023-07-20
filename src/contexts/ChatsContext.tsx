import { useMediaQuery, useTheme } from "@mui/material";
import { useInfiniteList } from "@refinedev/core";
import React, { useCallback, useContext, useEffect, useReducer } from "react";
import { Chat, Profile } from "src/types";
import type { Theme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { ColorModeContext } from ".";
import { readAllMessages, sendMessage } from "src/services/messages";
import { getChatWithUser } from "src/services/chats";

type ChatsContextProps = {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (_chat: Chat) => void;
  setChats: (_chats: Chat[]) => void;
  isMobile: boolean;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (_isDrawerOpen: boolean) => void;
  theme?: Theme;
  addMessage: (_message: string) => Promise<Boolean>;
  handleNewChat: (_user_id: Profile["id"]) => Promise<void>;
};

export const ChatsContext = React.createContext<ChatsContextProps>({
  isMobile: false,
  chats: [],
  currentChat: null,
  isDrawerOpen: false,
  setCurrentChat: (_chat: Chat) => {},
  setChats: (_chats: Chat[]) => {},
  setIsDrawerOpen: (_isDrawerOpen: boolean) => {},
  addMessage: (_message: string) => Promise.resolve(false),
  handleNewChat: (_user_id: Profile["id"]) => Promise.resolve(),
});

type ChatsState = {
  chats: Chat[];
  currentChat: Chat | null;
  isMobile: boolean;
  isDrawerOpen: boolean;
  theme: Theme | {};
};

const initialState: ChatsState = {
  chats: [],
  currentChat: null,
  isMobile: false,
  isDrawerOpen: false,
  theme: {},
};

interface Props {
  children: React.ReactNode;
}

type SetChatAction = {
  type: "SET_CURRENT_CHAT";
  payload: {
    chat: Chat;
  };
};

type SetChatsAction = {
  type: "SET_CHATS";
  payload: {
    chats: Chat[];
  };
};

type SetIsDrawerOpenAction = {
  type: "SET_IS_DRAWER_OPEN";
  payload: {
    isDrawerOpen: boolean;
  };
};

type SetCurrentChatById = {
  type: "SET_CURRENT_CHAT_BY_ID";
  payload: {
    id: Chat["id"];
  };
};

type ChatsAction =
  | SetChatAction
  | SetChatsAction
  | SetIsDrawerOpenAction
  | SetCurrentChatById;

const reducer = (state: ChatsState, action: ChatsAction): ChatsState => {
  switch (action.type) {
    case "SET_CURRENT_CHAT":
      return {
        ...state,
        currentChat: action.payload.chat,
      };

    case "SET_CURRENT_CHAT_BY_ID":
      const chat = state.chats.find((chat) => chat.id === action.payload.id);
      console.log(chat, action.payload.id);
      if (!chat) return state;
      return {
        ...state,
        currentChat: chat,
      };

    case "SET_CHATS":
      return {
        ...state,
        chats: action.payload.chats,
      };

    case "SET_IS_DRAWER_OPEN":
      return {
        ...state,
        isDrawerOpen: action.payload.isDrawerOpen,
      };

    default:
      return state;
  }
};

export const ChatsContextProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { profile } = useContext(ColorModeContext);
  const router = useRouter();
  const query = router.query as { channel: string };
  const isMobile = useMediaQuery("(max-width: 600px)");
  const theme = useTheme();
  const { refetch, ...chatInfiniteList } = useInfiniteList({
    resource: "chatParticipants",
    meta: {
      select:
        "*, chat:chats(*, participants:chatParticipants(*, profile:profiles(*)), messages(*, sender:profiles(*)))",
    },
    pagination: {
      pageSize: 10,
    },
    filters: [
      {
        field: "user_id",
        operator: "eq",
        value: profile?.id,
      },
    ],
    sorters: [
      {
        field: "updated_at",
        order: "desc",
      },
    ],
  });

  const setCurrentChat = useCallback(
    async (_chat: Chat) => {
      dispatch({ type: "SET_CURRENT_CHAT", payload: { chat: _chat } });
      router.push({
        pathname: router.pathname,
        query: { ...router.query, channel: _chat.id },
      });
      if (profile) {
        await readAllMessages(_chat.id, profile?.id);
      }
    },
    [profile, router]
  );

  const setCurrentChatById = useCallback(
    async (id: Chat["id"]) => {
      dispatch({ type: "SET_CURRENT_CHAT_BY_ID", payload: { id } });
      if (profile) {
        await readAllMessages(id, profile?.id);
      }
    },
    [profile]
  );

  const setChats = (_chats: Chat[]) =>
    dispatch({ type: "SET_CHATS", payload: { chats: _chats } });

  const setIsDrawerOpen = (_isDrawerOpen: boolean) =>
    dispatch({
      type: "SET_IS_DRAWER_OPEN",
      payload: { isDrawerOpen: _isDrawerOpen },
    });

  const pages = chatInfiniteList.data?.pages;

  useEffect(() => {
    const chats: Chat[] = [];
    if (!pages) return;
    pages.forEach((page) => {
      page.data.forEach((chatParticipant: any) => {
        chats.push(chatParticipant.chat);
      });
    });
    setChats(chats);

    if (!query.channel) return;
    setCurrentChatById(query.channel as Chat["id"]);
  }, [pages, query.channel, setCurrentChatById]);

  const addMessage = async (message: string): Promise<Boolean> => {
    if (!state.currentChat) return false;
    const resp = await sendMessage({
      message,
      chat_id: state.currentChat.id,
    });
    if (resp) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await refetch();
    }

    return resp;
  };

  const handleNewChat = async (user_id: Profile["id"]) => {
    const resp = await getChatWithUser(user_id);
    if (resp) {
      await refetch();
      await new Promise((resolve) => setTimeout(resolve, 10));
      setCurrentChatById(resp);
    }
  };

  return (
    <ChatsContext.Provider
      value={{
        ...state,
        isMobile,
        setCurrentChat,
        setChats,
        setIsDrawerOpen,
        theme,
        addMessage,
        handleNewChat,
      }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
