import './globals.css'
import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import Sidebar from "@/components/Sidebar";
import SupabaseProvider from "@/providers/SupabaseProvider";
import ModalProvider from "@/providers/ModalProvider";
import UserProvider from "@/providers/UserProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import getSongsByUserId from "@/actions/getSongsByUserId";
import Player from "@/components/Player";

const font = Figtree({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spotify Clone',
  description: 'spotify clone music vitek',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const userSongs = await getSongsByUserId()

  return (
    <html lang="en">
      <body className={font.className}>
        {/*либа с уведомлениями */}
        <ToasterProvider/>
        {/* записывания данных в куки */}
        <SupabaseProvider>
          <UserProvider>
            {/*модалка  с авторизацией*/}
            <ModalProvider/>
            {/*сайдбар такой сайдбар*/}
            <Sidebar songs={userSongs}>
                {children}
            </Sidebar>
            <Player/>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  )
}
