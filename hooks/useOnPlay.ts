import {Song} from "@/types";
import usePlayer from "@/hooks/usePlayer";
import {useUser} from "@/hooks/useUser";
import useAuthModal from "@/hooks/useAuthModule";

// создаем плейлист только из тех треков на которые кликнули
const useOnPlay = (songs: Song[]) => {
    const player = usePlayer()
    const authModal = useAuthModal()
    const {user} = useUser()

    const onPlay = (id: string) => {
        if (!user) {
            return authModal.onOpen()
        }

        player.setId(id)
        player.setIds(songs.map((song) => song.id))
    }

    return onPlay
}

export default useOnPlay