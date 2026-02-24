import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
}

export default function GlobalNotFound() {
    return (
        <html lang="en" className={inter.className}>
            <body>
                <h1 style={{ color: 'red', textAlign: 'center' }}>404 - Page Not Found</h1>
                <p style={{ color: 'red', textAlign: 'center' }}>This page does not exist.</p>
            </body>
        </html>
    )
}