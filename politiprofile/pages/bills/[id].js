import { useRouter } from 'next/router';

export async function getServerSideProps(context) {
  const { id } = context.params;
  console.log('getServerSideProps is running');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `http://${context.req.headers.host}`;
  const res = await fetch(`${baseUrl}/api/bills/getBills?billId=${id}`);

  console.log('Response status:', res.status);

  // Fetch the bill details using the id
  const bill = await res.json();

  return { props: { bill } };
}

const BillDetails = ({ bill }) => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">{bill.title}</h1>
      <p className="text-gray-600 mb-2">Policy Area: {bill.policyArea}</p>
      <p className="text-gray-800">{bill.summary}</p>
    </div>
  );
};

export default BillDetails;
