import { AuthBindings as AuthBindingsRefine } from "@refinedev/core";
import nookies from "nookies";

import { supabaseClient } from "./utility";
import { WithRequired } from "./types";

type AuthBindings = WithRequired<AuthBindingsRefine, "getIdentity">;

export const authProvider: AuthBindings = {
  login: async ({ email, password }) => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error,
      };
    }

    if (data?.session) {
      nookies.set(null, "token", data.session.access_token, {
        maxAge: 60 * 65,
        path: "/",
      });
      nookies.set(null, "refresh_token", data.session.refresh_token, {
        maxAge: 60 * 65,
        path: "/",
      });

      return {
        success: true,
        redirectTo: "/",
      };
    }

    // for third-party login
    return {
      success: false,
      error: {
        name: "LoginError",
        message: "Invalid username or password",
      },
    };
  },
  logout: async () => {
    nookies.destroy(null, "token", {
      path: "/",
    });
    nookies.destroy(null, "refresh_token", {
      path: "/",
    });

    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  register: async ({ email, password }) => {
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          success: false,
          error,
        };
      }

      if (data?.session) {
        const profile = await supabaseClient.from("profiles").insert({
          id: data.user?.id,
          status: "created",
        });

        const team = await supabaseClient.from("teams").insert({
          title: "Personal",
          description: "Personal team for user",
          status: "active",
        });

        if (profile.error || team.error) {
          return {
            success: false,
            error: profile.error,
          };
        }

        nookies.set(null, "token", data.session.access_token, {
          maxAge: 60 * 65,
          path: "/",
        });

        nookies.set(null, "refresh_token", data.session.refresh_token, {
          maxAge: 60 * 65,
          path: "/",
        });

        return {
          success: true,
          redirectTo: "/",
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error,
      };
    }

    return {
      success: false,
      error: {
        message: "Register failed",
        name: "Invalid email or password",
      },
    };
  },
  check: async (ctx) => {
    const { token, refresh_token } = nookies.get(ctx);
    const { data } = await supabaseClient.auth.getUser(token);
    const { user } = data;

    if (user) {
      return {
        authenticated: true,
      };
    }

    const { data: refreshTokenData } = await supabaseClient.auth.refreshSession(
      { refresh_token }
    );

    if (refreshTokenData.session) {
      nookies.set(ctx, "token", refreshTokenData.session.access_token, {
        maxAge: 60 * 65,
        path: "/",
      });
      nookies.set(
        ctx,
        "refresh_token",
        refreshTokenData.session.refresh_token,
        {
          maxAge: 60 * 65,
          path: "/",
        }
      );
      return {
        authenticated: true,
      };
    }

    nookies.destroy(null, "token", {
      path: "/",
    });
    nookies.destroy(null, "refresh_token", {
      path: "/",
    });

    await supabaseClient.auth.signOut();

    return {
      authenticated: false,
      redirectTo: "/login",
    };
  },
  getPermissions: async () => {
    const user = await supabaseClient.auth.getUser();

    if (user) {
      return user.data.user?.role;
    }

    return null;
  },
  getIdentity: async () => {
    const { data } = await supabaseClient.auth.getUser();

    if (data?.user) {
      return {
        ...data.user,
        name: data.user.email,
      };
    }

    return null;
  },
  onError: async (error) => {
    console.error(error);
    return { error };
  },
};
