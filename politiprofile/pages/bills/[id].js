import Layout from '../../components/layout';
import formatSummary from '../../helpers/formatSummary';

export async function getServerSideProps(context) {
  const { id } = context.params;
  console.log('Fetching bill with id:', id);

  // Construct the base URL properly
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://${context.req.headers.host}`);

  let billDetails = null;

  try {
    // Use the complete URL
    const res = await fetch(`${baseUrl}/api/bills/getBills?billId=${id}`);
    
    if (!res.ok) {
      console.error('API response error:', res.statusText);
      throw new Error(`Failed to fetch bill details for id: ${id}`);
    }

    const billResponse = await res.json();
    billDetails = billResponse.bill;

    if (!billDetails) {
      throw new Error(`Bill details not found for id: ${id}`);
    }
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true }; // Render a 404 page if there's an error
  }

  return { props: { billDetails } };
}


const BillDetails = ({ billDetails }) => {
  const {
    title,
    policyArea,
    congress,
    billNumber,
    originChamber,
    introducedDate,
    sponsor,
    cosponsors,
    summaries,
    committees,
    actions,
    relatedBills,
  } = billDetails;

  return (
    <Layout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">{title || 'Untitled Bill'}</h1>
          <p className="text-primary">
            <span className="font-semibold">Policy Area:</span>  {policyArea || 'N/A'}
            </p>
          <p className="text-primary">
            <span className="font-semibold">Congress:</span> {congress}, {originChamber} - Bill Number: {billNumber}
          </p>
          <p className="text-primary">
            <span className="font-semibold">Introduced Date:</span> {new Date(introducedDate).toLocaleDateString()}
          </p>
        </div>

        {/* Sponsor and Cosponsors Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl text-primary font-bold mb-4">Sponsor and Cosponsors</h2>
          <p className="mb-4 text-primary">
            <span className="font-semibold text-primary">Sponsor:</span> {sponsor.fullName} ({sponsor.party} - {sponsor.state})
          </p>
          {cosponsors.length > 0 ? (
            <ul className="list-disc ml-6">
              {cosponsors.map((cosponsor, index) => (
                <li key={index} className="text-secondaryTextColor">
                  {cosponsor.fullName} ({cosponsor.party} - {cosponsor.state})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondaryTextColor">No cosponsors listed.</p>
          )}
        </div>

        {/* Summary Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl text-primary font-bold mb-4">Summary</h2>
          {summaries.length > 0 ? (
            summaries.map((summary, index) => (
              <p key={index} className="text-gray-700 mb-2">
                {formatSummary(summary)}
              </p>
            ))
          ) : (
            <p className="text-secondaryTextColor">No summaries available.</p>
          )}
        </div>

        {/* Committees Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl text-primary font-bold mb-4">Committees</h2>
          {committees.length > 0 ? (
            <ul className="list-disc ml-6">
              {committees.map((committee, index) => (
                <li key={index} className="text-secondaryTextColor">
                  {committee.name} ({committee.chamber})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondaryTextColor">No committees listed.</p>
          )}
        </div>

        {/* Actions Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl text-primary font-bold mb-4">Actions</h2>
          {actions.length > 0 ? (
            <ul className="list-disc ml-6">
              {actions.map((action, index) => (
                <li key={index} className="text-secondaryTextColor">
                  <span className="font-semibold">{new Date(action.actionDate).toLocaleDateString()}:</span> {action.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondaryTextColor">No actions listed.</p>
          )}
        </div>

        {/* Related Bills Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl  text-primary font-bold mb-4">Related Bills</h2>
          {relatedBills.length > 0 ? (
            <ul className="list-disc ml-6">
              {relatedBills.map((relatedBill, index) => (
                <li key={index} className="text-secondaryTextColor">
                  {relatedBill.title} ({relatedBill.type} {relatedBill.number})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-secondaryTextColor">No related bills listed.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BillDetails;
