'use client'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/client/react/hooks'

const queryPolicyHolderDetail = gql`
  query policyholder($code: String) {
    policyholder(code: $code) {
      code
      name
      registration_date
      introducer_code
    }
  }
`;

interface Policyholder {
  code: string
  name: string
  registration_date: string
  introducer_code: string | null
  l: Policyholder | null
  r: Policyholder | null
}

export default function Home() {
  const { loading, error, data } = useQuery(queryPolicyHolderDetail, { variables: { code: "1" }});

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div>
    {loading && <p>Loading...</p>}
    {error && <p>Error: {error.message}</p>}
    {data?.policyholder.map((each: Policyholder) => (
      <div key={each.code}>
        <h2>{each.name}</h2>
      </div>
    ))}
  </div>
    </div>
  );
}
