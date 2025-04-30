'use client'

import gql from 'graphql-tag'
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react/hooks'
import GroupIcon from '@mui/icons-material/Group';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Box, Button, FormLabel, TextField, Card, CardContent, Typography } from '@mui/material';
import type { CustomNodeElementProps } from 'react-d3-tree';

import { Section } from './components/layout/Section'
import { adaptToTree } from './adapters/treeAdapter';

const Tree = dynamic(() => import('react-d3-tree').then((mod) => mod.Tree), {
  ssr: false,
});


const queryPolicyHolderDetail = gql`
  query policyholder($code: String!) {
    policyholder(code: $code) {
      ...PolicyholderDetails
      l {
        ...PolicyholderWithChildren
      }
      r {
        ...PolicyholderWithChildren
      }
    }
  }

  fragment PolicyholderDetails on Policyholder {
    code
    name
    registration_date
    introducer_code
  }

  fragment PolicyholderWithChildren on Policyholder {
      ...PolicyholderDetails
      l {
        ...PolicyholderDetails
        l {
          ...PolicyholderDetails
          l {
            ...PolicyholderDetails
          }
          r {
            ...PolicyholderDetails
          }
        }
        r {
          ...PolicyholderDetails
          l {
            ...PolicyholderDetails
          }
          r {
            ...PolicyholderDetails
          }
        }
      }
      r {
        ...PolicyholderDetails
        l {
          ...PolicyholderDetails
          l {
            ...PolicyholderDetails
          }
          r {
            ...PolicyholderDetails
          }
        }
        r {
          ...PolicyholderDetails
          l {
            ...PolicyholderDetails
          }
          r {
            ...PolicyholderDetails
          }
        }
      }
    }
`;

export default function Home() {
  const [inputValue, setInputValue] = useState('')
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const treeContainerRef = useRef<HTMLDivElement>(null);
  const [fetchPolicyHolder, { loading, error, data }] = useLazyQuery(queryPolicyHolderDetail);

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

  const handleOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [setInputValue])

  const handleOnClick = useCallback(() => {
    fetchPolicyHolder({ variables: { code: inputValue } });
  }, [fetchPolicyHolder, inputValue]);

  return (
    <div className='items-center justify-items-center w-full'>
      <div className='w-5/6'>
        <Section icon={<GroupIcon />} title='保戶關係查詢'>
          <hr />
          <Box display='flex' alignItems='center' gap={2} mb={4} mt={2}>
            <FormLabel>保戶編號</FormLabel>
            <TextField hiddenLabel variant='outlined' size='small' value={inputValue} onChange={handleOnChange} />
            <Button variant='contained' onClick={handleOnClick}>查詢</Button>
          </Box>
        </Section>
        <Section icon={<MenuOpenIcon />} title='關係圖'>
          {loading && <p>Loading...</p>}
          {error && <p>Error: {error.message}</p>}
          <div ref={treeContainerRef} style={{ width: '100%', height: '100vh' }}>
            <Tree
              data={adaptToTree(data?.policyholder)}
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
