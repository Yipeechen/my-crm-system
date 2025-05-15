'use client'

import gql from 'graphql-tag'
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react/hooks'
import GroupIcon from '@mui/icons-material/Group';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { Box, Button, FormLabel, TextField, Card, CardContent, Typography, Link } from '@mui/material';
import type { CustomNodeElementProps } from 'react-d3-tree';

import { Section } from '../components/layout/Section'
import { adaptToTree } from '../adapters/treeAdapter';

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
  const [searchingCode, setSearchingCode] = useState('')
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
    const isSearchingNode = nodeDatum.attributes?.code === searchingCode;
    return (
      <foreignObject width={cardWidth} height={cardHeight} x={`-${cardWidth/2-20}`} y={`-${cardHeight/2}`} style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Card
            sx={{
              backgroundColor: isSearchingNode 
                ? '#ffe082'
                : nodeDatum.attributes?.introducer_code === searchingCode
                  ? '#a5d6a7' : '#ededed',
              borderRadius: 2,
              textAlign: 'center',
            }}
            variant='outlined'
          >
            <CardContent sx={{ padding: '8px' }}>
              <Link
                component='button'
                variant='body2'
                onClick={() => handlePolicyholderCodeOnClick(nodeDatum.attributes?.code as string)}
              >
                {nodeDatum.attributes?.code}
              </Link>
              <Typography variant='subtitle2'>{nodeDatum.name}</Typography>
            </CardContent>
          </Card>
          {isSearchingNode && nodeDatum.attributes?.introducer_code && (
            <Link
              component="button"
              variant="body2"
              onClick={handlePreNodeSearchOnClick}
              style={{ marginLeft: 8, width: '30px' }}
            >
              上一階
            </Link>
          )}
        </div>
      </foreignObject>
    )
  };

  const handleSearchInputOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSearchOnClick = useCallback(() => {
    setSearchingCode(inputValue)
    fetchPolicyHolder({ variables: { code: inputValue } });
  }, [fetchPolicyHolder, inputValue]);

  const handlePolicyholderCodeOnClick = useCallback((code: string) => {
    setSearchingCode(code)
    fetchPolicyHolder({ variables: { code } });
  }, [fetchPolicyHolder]);

  const handlePreNodeSearchOnClick = useCallback(() => {
    setSearchingCode(data?.policyholder?.introducer_code)
    fetchPolicyHolder({ variables: { code: data?.policyholder?.introducer_code } });
  }, [fetchPolicyHolder, data]);

  return (
    <div className='items-center justify-items-center w-full'>
      <div className='w-5/6'>
        <Section icon={<GroupIcon />} title='保戶關係查詢'>
          <hr />
          <Box display='flex' alignItems='center' gap={2} mb={4} mt={2}>
            <FormLabel>保戶編號</FormLabel>
            <TextField hiddenLabel variant='outlined' size='small' value={inputValue} onChange={handleSearchInputOnChange} />
            <Button variant='contained' onClick={handleSearchOnClick}>查詢</Button>
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
