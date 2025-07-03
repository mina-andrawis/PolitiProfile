import Layout from '../../components/layout';
import formatSummary from '../../helpers/formatSummary';
import { MongoClient } from 'mongodb';


const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    await client.connect();
    const database = client.db("default");
    const collection = database.collection("bills");

    const bill = await collection.findOne({ billId: id });

    if (!bill) {
      return { notFound: true };
    }

    return {
      props: {
        billDetails: JSON.parse(JSON.stringify(bill)),
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return { notFound: true };
  } finally {
    await client.close();
  }
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
            <span className="font-semibold">Sponsor:</span> {sponsor.fullName} ({sponsor.party} - {sponsor.state})
          </p>
          {cosponsors.length > 0 ? (
            <ul className="list-disc ml-6 text-dark">
              {cosponsors.map((cosponsor, index) => (
                <li className="text-darkText" key={index}>
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
            <p key={index} className="text-dark mb-2">
                {formatSummary(summary[0])}
              </p>
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
