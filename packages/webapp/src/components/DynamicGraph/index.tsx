import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DefaultPageTitleFormat from '../DefaultPageTitleFormat';
import { useFilterContext } from '../../contexts/FilterContext';
import DynamicBarChart from './BarChartComponent';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { useRepositoryContext } from '../../contexts/RepositoryContext';
import { useGetCountMergeRequests } from '../../api/mergeRequests';
import { useGetCountCommits } from '../../api/commit';
import { Commit, MergeRequest, Note, RepositoryMember } from '@ceres/types';
import { uniq } from 'lodash';
import { DateTime } from 'luxon';
import { isSameDay } from 'date-fns';
import { useGetWordCount } from '../../api/note';
import { useRepositoryMembers } from '../../api/repo_members';
import { ApiResource } from '../../api/base';
import StudentDropdown from '../../components/StudentDropdown';

const TIMEZONE = {
  '0': 'GMT',
  '1': 'CET',
  '2': 'EET',
  '3': 'MSK',
  '4': 'AMT',
  '5': 'PKT',
  '6': 'OMSK',
  '7': 'KRAT',
  '8': 'CST',
  '9': 'JST',
  '10': 'AEST',
  '11': 'SAKT',
  '12': 'NZST',
  '-1': 'AT',
  '-2': 'ART',
  '-3': 'AST',
  '-4': 'EST',
  '-5': 'CST',
  '-6': 'MDT',
  '-7': 'PST',
  '-8': 'AKST',
  '-9': 'HST',
  '-10': 'NT',
  '-11': 'IDLW',
  '-12': 'BIT',
};

function combineData(
  startDate: string,
  endDate: string,
  commitCounts: Commit.DailyCount[] = [],
  mergeRequestCounts: MergeRequest.DailyCount[] = [],
  issueWordCounts: Note.DailyCount[] = [],
  mergeRequestWordCounts: Note.DailyCount[] = [],
) {
  const allDates = uniq([
    ...commitCounts.map((count) => count.date),
    ...mergeRequestCounts.map((count) => count.date),
    ...issueWordCounts.map((count) => count.date),
    ...mergeRequestWordCounts.map((count) => count.date),
  ]).sort((a, b) => a.localeCompare(b));
  const startDateRounded = DateTime.fromISO(startDate)
    .startOf('day')
    .toJSDate();
  const earliestDateDatset = new Date(allDates[0]);
  const endDateRounded = DateTime.fromISO(endDate).startOf('day').toJSDate();
  let date =
    startDateRounded < earliestDateDatset
      ? startDateRounded
      : earliestDateDatset;
  const dates: Date[] = [];
  while (date <= endDateRounded) {
    dates.push(date);
    date = DateTime.fromISO(date.toISOString()).plus({ days: 1 }).toJSDate();
  }
  return dates.map((date) => ({
    date: date.toISOString(),
    commitCount:
      commitCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.count || 0,
    commitScore:
      commitCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.score || 0,
    mergeRequestCount:
      -mergeRequestCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.count || 0,
    mergeRequestScore:
      -mergeRequestCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.score || 0,
    issueWordCount:
      -issueWordCounts.find((count) => isSameDay(date, new Date(count.date)))
        ?.wordCount || 0,
    mergeRequestWordCount:
      mergeRequestWordCounts.find((count) =>
        isSameDay(date, new Date(count.date)),
      )?.wordCount || 0,
  }));
}

export enum GraphTab {
  code = 'code',
  scores = 'scores',
  comments = 'comments',
}

function findRepoMemberId(
  filtered_id: string,
  members: ApiResource<RepositoryMember>[],
) {
  const filtered = (members || []).filter(
    (member) => member.meta.id === filtered_id,
  );
  return filtered.map((member) => member.id);
}

const DynamicGraph: React.FC = () => {
  const timezoneOffset = new Date().getTimezoneOffset();
  const timezone = TIMEZONE[String((timezoneOffset / 60) * -1)];
  console.log(timezoneOffset);
  console.log(timezone);
  const { startDate, endDate, author } = useFilterContext();
  const { repositoryId } = useRepositoryContext();
  const { data: members } = useRepositoryMembers(repositoryId);
  const authorIds = findRepoMemberId(author, members);
  const [emails, setEmails] = useState<string[]>([]);
  const { data: commitCounts } = useGetCountCommits({
    repository: repositoryId,
    author_email: emails,
    start_date: startDate,
    end_date: endDate,
    timezone: timezone,
    sort: '+authored_date',
  });
  const { data: mergeRequestCounts } = useGetCountMergeRequests({
    repository: repositoryId,
    author_email: emails,
    merged_start_date: startDate,
    merged_end_date: endDate,
    timezone: timezone,
  });
  const { data: issueWordCounts } = useGetWordCount({
    repository_id: repositoryId,
    created_start_date: startDate,
    created_end_date: endDate,
    author_id: authorIds,
    type: Note.Type.issueComment,
    timezone: timezone,
  });
  const { data: mergeRequestWordCounts } = useGetWordCount({
    repository_id: repositoryId,
    created_start_date: startDate,
    created_end_date: endDate,
    author_id: authorIds,
    type: Note.Type.mergeRequestComment,
    timezone: timezone,
  });

  const [graphTab, setGraphTab] = useState(GraphTab.code);
  const graphData = combineData(
    startDate,
    endDate,
    commitCounts || [],
    mergeRequestCounts || [],
    issueWordCounts || [],
    mergeRequestWordCounts || [],
  );

  const handleTabs = (event: React.ChangeEvent<unknown>, newTab: GraphTab) => {
    setGraphTab(newTab);
  };

  return (
    <>
      <Container>
        <DefaultPageTitleFormat>Contribution Graph</DefaultPageTitleFormat>
        <Container maxWidth='md'>
          <Grid container justify='flex-end' spacing={1}>
            <Grid item xs={4}>
              <Box mb={1}>
                <StudentDropdown
                  repositoryId={repositoryId}
                  onChange={(newEmails) => {
                    setEmails(newEmails);
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
        <Box my={2}>
          <Tabs
            value={graphTab}
            onChange={handleTabs}
            indicatorColor='primary'
            textColor='primary'
            centered
          >
            <Tab label='Codes' value={GraphTab.code} />
            <Tab label='Scores' value={GraphTab.scores} />
            <Tab label='Comments' value={GraphTab.comments} />
          </Tabs>
        </Box>
        <Grid justify='center' container>
          <DynamicBarChart graphData={graphData} graphTab={graphTab} />
        </Grid>
      </Container>
    </>
  );
};

export default DynamicGraph;
