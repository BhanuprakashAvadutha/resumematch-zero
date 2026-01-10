import { signOut } from '@/app/auth/actions'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-xl font-bold">ResuMatch Zero</Link>
                <div className="flex gap-4">
                    <Link href="/" className="hover:text-gray-300">Home</Link>
                    {user ? (
                        <>
                            <Link href="/history" className="hover:text-gray-300">History</Link>
                            <form action={signOut}>
                                <button type="submit" className="hover:text-gray-300">Sign Out</button>
                            </form>
                            <span className="text-sm text-gray-400 my-auto">({user.email})</span>
                        </>
                    ) : (
                        <Link href="/login" className="hover:text-gray-300">Sign In</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
