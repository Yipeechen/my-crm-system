'use client'

import gql from 'graphql-tag'
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@apollo/client/react/hooks'
import GroupIcon from '@mui/icons-material/Group';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Box, Button, FormLabel, TextField, Card, CardContent, Typography } from '@mui/material';
import type { CustomNodeElementProps } from 'react-d3-tree';

import { Section } from './components/layout/Section'

const Tree = dynamic(() => import('react-d3-tree').then((mod) => mod.Tree), {
  ssr: false,
});


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
  const { loading, error, data } = useQuery(queryPolicyHolderDetail, { variables: { code: '1' }});
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (treeContainerRef.current) {
        const { width, height } = treeContainerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const treeData = [
    {
      name: '保戶1',
      attributes: { code: '0000000001' },
      children: [
        {
          name: '保戶2',
          attributes: { code: '0000000002' },
          children: [
            {
              name: '保戶4',
              attributes: { code: '0000000004' },
              children: [
                { name: '保戶8', attributes: { code: '0000000008' }, children: [] },
                { name: '保戶9', attributes: { code: '0000000009' }, children: [] },
              ],
            },
            {
              name: '保戶5',
              attributes: { code: '0000000005' },
              children: [
                { name: '保戶10', attributes: { code: '0000000010' }, children: [] },
                { name: '保戶11', attributes: { code: '0000000011' }, children: [] },
              ],
            },
          ],
        },
        {
          name: '保戶3',
          attributes: { code: '0000000003' },
          children: [
            {
              name: '保戶6',
              attributes: { code: '0000000006' },
              children: [
                {
                  name: '保戶12',
                  attributes: { code: '0000000012' },
                  children: [],
                },
                {
                  name: '保戶14',
                  attributes: { code: '0000000014' },
                  children: [],
                },
              ],
            },
            {
              name: '保戶7',
              attributes: { code: '0000000007' },
              children: [
                {
                  name: '保戶12',
                  attributes: { code: '0000000012' },
                  children: [],
                },
                {
                  name: '保戶14',
                  attributes: { code: '0000000014' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
  


  const renderCustomNode = ({ nodeDatum }: CustomNodeElementProps) => {
    const cardWidth = dimensions.width * 0.08;
    const cardHeight = dimensions.height * 0.1;
    return (
      <foreignObject width={cardWidth} height={cardHeight} x={`-${cardWidth/2}`} y={`-${cardHeight/2}`}>
        <Card
          sx={{
            backgroundColor: nodeDatum.__rd3t.depth === 0 ? '#FFE082' : '#A5D6A7',
            borderRadius: 2,
            textAlign: 'center',
          }}
          variant='outlined'
        >
          <CardContent sx={{ padding: '8px' }}>
            <Typography variant='caption'>{nodeDatum.attributes?.code}</Typography>
            <Typography variant='subtitle2'>{nodeDatum.name}</Typography>
          </CardContent>
        </Card>
      </foreignObject>
    )
  };

  return (
    <div className='items-center justify-items-center w-full'>
      <div className='w-5/6'>
        <Section icon={<GroupIcon />} title='保戶關係查詢'>
          <hr />
          <Box display='flex' alignItems='center' gap={2} mb={4} mt={2}>
            <FormLabel>保戶編號</FormLabel>
            <TextField hiddenLabel variant='outlined' size='small' />
            <Button variant='contained'>查詢</Button>
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
          <div ref={treeContainerRef} style={{ width: '100%', height: '100vh' }}>
            <Tree
              data={treeData}
              orientation='vertical'
              translate={{ x: dimensions.width/ 2, y: dimensions.height/ 8 }}
              renderCustomNodeElement={renderCustomNode}
              pathFunc='step'
              collapsible={false}
              zoomable
              scaleExtent={{ min: 0.1, max: 1 }}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}
