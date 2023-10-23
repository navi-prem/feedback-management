'use client'
import { signOut, signIn, useSession } from 'next-auth/react'

const Home = () => {
    const { data: session } = useSession()
    console.log(session)

    if (session) return <>
            {JSON.stringify(session)}
            <button onClick={() => signOut()}>Sign Out</button>
        </>
    return <button onClick={() => signIn('google')}>Sign In with Google</button>
}

export default Home
