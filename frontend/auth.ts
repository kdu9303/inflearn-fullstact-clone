import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "./lib/password-utils";

const authConfig = {
  adapter: PrismaAdapter(prisma),
  useSecureCookies: process.env.NODE_ENV === "production",
  secret: process.env.BETTER_AUTH_SECRET,
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {},
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "이메일",
          type: "email",
          placeholder: "이메일 입력",
        },
        password: {
          label: "비밀번호",
          type: "password",
        },
      },
      async authorize(credentials) {
        // 모든 값들이 정상으로 들어왔는가?
        if (
          typeof credentials?.email !== "string" ||
          typeof credentials?.password !== "string"
        ) {
          throw new Error("이메일과 비밀번호를 입력해주세요.");
        }

        // DB에서 유저 찾기
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("존재하지 않는 이메일입니다.");
        }

        if (!user.hashedPassword) {
          throw new Error("비밀번호가 설정되지 않은 계정입니다.");
        }

        // 비밀번호 일치 여부 확인
        const passwordMatch = comparePassword(
          credentials.password,
          user.hashedPassword,
        );

        if (!passwordMatch) {
          throw new Error("비밀번호가 일치하지 않습니다.");
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
