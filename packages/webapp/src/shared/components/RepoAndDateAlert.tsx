import React from 'react';
import Alert from '@material-ui/lab/Alert';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useGetRepository } from '../../api/repository';
import { useFilterContext } from '../../contexts/FilterContext';

const RepoAndDateAlert: React.FC = () => {
  const { repositoryId } = useRepositoryContext();
  const { data } = useGetRepository(repositoryId);
  const { startDate, endDate, iteration } = useFilterContext();

  return (
    <>
      <div>
        <Alert severity='info'>
          {data?.name}
          {' | '}
          {startDate?.split('T')[0]} to {endDate?.split('T')[0]}
          {' | '}
          {iteration == 'none' ? '' : iteration}
        </Alert>
      </div>
    </>
  );
};

export default RepoAndDateAlert;
