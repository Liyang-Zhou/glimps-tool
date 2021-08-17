import { Operation } from '@ceres/types';
import Box from '@material-ui/core/Box';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import DefaultPageLayout from '../../shared/DefaultPageLayout';
import OperationGroup from './components/OperationGroup';
import DefaultPageTitleFormat from '../../shared/DefaultPageTitleFormat';

const OperationsPage: React.FC = () => {
  return (
    <>
      <DefaultPageLayout>
        <Container>
          <DefaultPageTitleFormat>Operations</DefaultPageTitleFormat>
          <Box my={2}>
            <Typography variant='h2'>In progress</Typography>
          </Box>
          <OperationGroup
            status={[Operation.Status.PENDING, Operation.Status.PROCESSING]}
          />
          <Box my={2}>
            <Typography variant='h2'>Completed</Typography>
          </Box>
          <OperationGroup status={[Operation.Status.COMPLETED]} />
        </Container>
      </DefaultPageLayout>
    </>
  );
};

export default OperationsPage;
