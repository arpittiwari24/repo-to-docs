import authOptions from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

async function AdminPage() {
    const session = await getServerSession(authOptions)
    
    // Check if user is authorized
    if (!session?.user?.email || session.user.email !== 'atofficial2410@gmail.com') {
        redirect('/')
    }

    const users = await prisma.user.findMany({
        select: {
            email: true,
            id: true,
            name: true,
            Readme : true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            email: 'asc',
        },
    })

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-4">Admin Page : Total Users {users.length}</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300 text-black">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Email</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Readme Generated</th>
                            <th className="border p-2">Signed Up</th>
                        </tr>
                    </thead>
                    <tbody className='text-white'>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="border p-2 border-gray-100">{user.id}</td>
                                <td className="border p-2 border-gray-100">{user.email}</td>
                                <td className="border p-2 border-gray-100">{user.name || 'N/A'}</td>
                                <td className="border p-2 border-gray-100">{user.Readme.length}</td>
                                <td className="border p-2 border-gray-100">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default AdminPage