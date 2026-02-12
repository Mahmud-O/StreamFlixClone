import MyListContext from './MyListContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/supabaseClient'
import { getMovieDetails, getTvDetails } from '@/services/tmdbService.js'
import useAuth from '@/CustomHooks/useAuth.jsx'
import { toast } from 'sonner'
import { showToast } from '@/Components/common/showToast.jsx'
export function MyListProvider({ children }) {
    const { user } = useAuth()
    const [myList, setMyList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let alive = true

        const run = async () => {
            if (user) {
                await fetchMyList(alive)
            } else {
                setMyList([])
                setLoading(false)
            }
        }

        run()

        return () => {
            alive = false
        }
    }, [user])

    const fetchMyList = async (alive = true) => {
        if (!user) return
        setLoading(true)

        const { data, error } = await supabase
            .from('my_list')
            .select('id, tmdb_id, type')
            .eq('user_id', user.id)

        if (error) {
            console.error('Error fetching list:', error)
            setLoading(false)
            return
        }

        const detailedList = await Promise.all(
            data.map(async (item) => {
                try {
                    if (item.type === 'movie') {
                        const movie = await getMovieDetails(item.tmdb_id)
                        return { ...item, details: movie }
                    } else {
                        const tv = await getTvDetails(item.tmdb_id)
                        return { ...item, details: tv }
                    }
                } catch (err) {
                    console.error('TMDB fetch error:', err)
                    return item
                }
            })
        )

        if (!alive) return
        setMyList(detailedList)
        setLoading(false)
    }

    const addToList = async (title, tmdbId, type) => {
        if (!user || !tmdbId) return

        toast.promise(
            (async () => {
                const exists = myList.some(
                    (item) => item.tmdb_id === tmdbId && item.type === type
                )
                if (exists) throw new Error('Already in list')

                const { error } = await supabase
                    .from('my_list')
                    .insert([{ user_id: user.id, tmdb_id: tmdbId, type }])

                if (error) throw new Error('Failed to add')

                const details =
                    type === 'movie'
                        ? await getMovieDetails(tmdbId)
                        : await getTvDetails(tmdbId)

                setMyList((prev) => [
                    ...prev,
                    { user_id: user.id, tmdb_id: tmdbId, type, details },
                ])
                return true
            })(),
            {
                loading: showToast('Please wait...', 'Adding to your list...'),
                success: showToast(title, 'has been added to your list!'),
                error: (err) =>
                    err.message === 'Already in list'
                        ? showToast(title, 'is already in your list.')
                        : showToast(title, 'failed to add to your list!'),
            }
        )
    }

    const removeFromList = async (title, tmdbId, type) => {
        if (!user || !tmdbId) return

        toast.promise(
            (async () => {
                const { error } = await supabase
                    .from('my_list')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('tmdb_id', tmdbId)
                    .eq('type', type)

                if (error) throw new Error('Failed to remove')

                setMyList((prev) =>
                    prev.filter(
                        (item) =>
                            !(item.tmdb_id === tmdbId && item.type === type)
                    )
                )
                return true
            })(),
            {
                loading: showToast(
                    'Please wait...',
                    'Removing from your list...'
                ),
                success: showToast(title, 'has been removed from your list!'),
                error: showToast(title, 'failed to remove from your list!'),
            }
        )
    }

    const handleMyListToggle = (title, tmdbId, type) => {
        const inList = myList.some(
            (item) => item.tmdb_id === tmdbId && item.type === type
        )
        if (inList) {
            removeFromList(title, tmdbId, type)
        } else {
            addToList(title, tmdbId, type)
        }
    }

    const isInMyList = (tmdbId, type) =>
        myList.some((item) => item.tmdb_id === tmdbId && item.type === type)

    return (
        <MyListContext.Provider
            value={{
                myList,
                loading,
                addToList,
                removeFromList,
                fetchMyList,
                handleMyListToggle,
                isInMyList,
            }}
        >
            {children}
        </MyListContext.Provider>
    )
}
export default MyListProvider
