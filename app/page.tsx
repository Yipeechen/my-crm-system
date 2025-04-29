'use client'

import gql from 'graphql-tag'
import { useQuery } from '@apollo/client/react/hooks'
import GroupIcon from '@mui/icons-material/Group';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Box, Button, FormLabel, TextField } from '@mui/material';

import { Section } from './components/layout/Section'


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
    <div className="items-center justify-items-center w-full">
      <div className="w-5/6">
        <Section icon={<GroupIcon />} title='保戶關係查詢'>
          <hr />
          <Box display="flex" alignItems="center" gap={2} mb={4} mt={2}>
            <FormLabel>保戶編號</FormLabel>
            <TextField hiddenLabel variant="outlined" size="small" />
            <Button variant="contained">查詢</Button>
          </Box>
        </Section>
        <Section icon={<MenuOpenIcon />} title='關係圖'>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          {data?.policyholder.map((each: Policyholder) => (
            <div key={each.code}>
              <h2>{each.name}</h2>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}
