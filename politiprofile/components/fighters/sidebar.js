export default function Sidebar() {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 lg:sticky lg:top-6">
      <h3 className="text-lg font-bold mb-2">🧭 Fighter Criteria</h3>
      <ul className="text-sm text-gray-700 space-y-1 mb-3">
        <li>✔️ Justice-centered platform</li>
        <li>✔️ No corporate money</li>
        <li>✔️ Bold systemic change</li>
        <li>✔️ Opposes Trumpism/fascism</li>
      </ul>
      <h4 className="text-md font-bold mt-4 mb-2">✨ Bonus</h4>
      <ul className="text-sm text-gray-700 space-y-1">
        <li>🌟 Endorsed by progressive org</li>
        <li>🌟 Challenging incumbent</li>
      </ul>
    </div>
  )
}
