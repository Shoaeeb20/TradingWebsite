interface User {
  name: string
  email: string
  balance: number
  holdingsValue: number
  totalValue: number
}

export default function LeaderboardTable({ users }: { users: User[] }) {
  return (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3">Rank</th>
            <th className="text-left py-3">Name</th>
            <th className="text-right py-3">Cash</th>
            <th className="text-right py-3">Holdings</th>
            <th className="text-right py-3">Total Value</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.email} className="border-b hover:bg-gray-50">
              <td className="py-3">
                <span className="font-bold text-lg">#{idx + 1}</span>
              </td>
              <td className="py-3">
                <div className="font-semibold">{user.name}</div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </td>
              <td className="text-right">₹{user.balance.toLocaleString('en-IN')}</td>
              <td className="text-right">₹{user.holdingsValue.toLocaleString('en-IN')}</td>
              <td className="text-right font-bold text-primary">
                ₹{user.totalValue.toLocaleString('en-IN')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
