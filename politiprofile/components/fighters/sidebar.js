export default function Sidebar() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 lg:top-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-primary uppercase tracking-wide">
          Fighter Criteria
        </h3>
        <ul className="text-sm text-secondary space-y-1 list-disc list-inside">
          <li>Justice-centered platform</li>
          <li>No corporate money</li>
          <li>Bold systemic change</li>
          <li>Opposes authoritarianism</li>
        </ul>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <h4 className="text-base font-semibold text-primary uppercase tracking-wide">
          Bonus Traits
        </h4>
        <ul className="text-sm text-secondary space-y-1 list-disc list-inside">
          <li>Endorsed by progressive org</li>
          <li>Challenging an incumbent</li>
        </ul>
      </div>
    </div>
  );
}
