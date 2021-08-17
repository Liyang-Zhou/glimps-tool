import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';
import { useSearchScoringConfigs } from '../../../api/scoringConfig';
import SmartDate from '../../../components/SmartDate';
import ScoringLayout from './ScoringLayout';

const BrowseScoringConfigsPage: React.FC = () => {
  const { data } = useSearchScoringConfigs();
  return (
    <ScoringLayout showCreateButton showBackButton>
      <Box mx={2}>
        <Grid container>
          <Grid item xs={6}>
            <Typography variant='h3'>Name</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant='h3'>Last Updated</Typography>
          </Grid>
        </Grid>
      </Box>
      <List>
        {data?.results?.map((scoringConfig) => (
          <ListItem
            key={scoringConfig.meta.id}
            button
            component={Link}
            to={`/settings/scoring/edit?id=${scoringConfig.meta.id}`}
          >
            <Grid item xs={6}>
              <Typography>{scoringConfig.name}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography>
                <SmartDate>{scoringConfig.meta.updatedAt}</SmartDate>
              </Typography>
            </Grid>
          </ListItem>
        ))}
      </List>
    </ScoringLayout>
  );
};

export default BrowseScoringConfigsPage;
