import React from 'react';
import DefaultPageLayout from '../../shared/DefaultPageLayout';
import MergeRequestCommitList from '../../components/MergeRequestCommitList';

const ListMergeRequestPage = () => {
  return (
    <>
      <DefaultPageLayout>
        <div>
          <MergeRequestCommitList />
        </div>
      </DefaultPageLayout>
    </>
  );
};

export default ListMergeRequestPage;
