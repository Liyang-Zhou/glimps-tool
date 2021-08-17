import { Diff, Line, ScoreOverride } from '@ceres/types';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import React, { useState } from 'react';
import styled from 'styled-components';
import Root from './root';
import ScorePopover from './ScorePopper';
import EditIcon from '@material-ui/icons/Edit';
import ScoreOverrideForm from '../CommitList/ScoreOverrideForm';
import { useScoreOverrideQueue } from '../contexts/ScoreOverrideQueue';
import { makeStyles } from '@material-ui/core/styles';
import OverridePopper from '../OverridePopper';
import DiffTable from './DiffTable';
import { fileMapping } from './utils/fileMapping';
import { newOrDeletedFile } from './utils/utils';

const StyledAccordionSummary = styled(AccordionSummary)`
  &.MuiAccordionSummary-root.Mui-focused {
    background: none;
  }
`;

const DiffFactWrapper: React.FC<{
  name: React.ReactNode;
  value: React.ReactNode;
}> = ({ name, value }) => {
  return (
    <Grid container justify='space-between' alignItems='center' spacing={2}>
      <Grid item>
        <Typography variant='body2'>
          <strong>{name}:</strong>
        </Typography>
      </Grid>
      <Grid item>{value}</Grid>
    </Grid>
  );
};

interface DiffViewProps {
  diffId?: string;
  fileName: string;
  lines: Line[];
  expanded?: boolean;
  extensions?: Diff['extensions'];
  summary?: Diff['summary'];
  onSummaryClick?: () => void;
  allowEdit?: boolean;
}

const DiffView: React.FC<DiffViewProps> = ({
  fileName,
  lines,
  expanded,
  extensions,
  summary,
  onSummaryClick,
  allowEdit,
  diffId,
}) => {
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const { add } = useScoreOverrideQueue();
  const onScoreEdit = (e: MouseEvent) => {
    // prevent the accordion from toggling
    e.stopPropagation();
    setOpen(!open);
    setAnchor(anchor ? null : e.currentTarget);
  };

  const onPopperClickAway = () => {
    setOpen(false);
    setAnchor(null);
  };

  const onSubmitPopper = (values: ScoreOverride) => {
    add({
      id: `Diff/${diffId}`,
      display: fileName,
      previousScore: score,
      defaultScore: extensions?.score,
      override: {
        ...values,
        score: values.score ? +values.score : undefined,
      },
    });
    onPopperClickAway();
  };
  const score = ScoreOverride.computeScore(
    extensions?.override,
    extensions?.score,
  );
  const useStyles = makeStyles(() => ({
    accordionStyle: {
      backgroundColor: '#f8f8f8',
    },
  }));

  const fileType = fileMapping(fileName);
  const fileOperation = newOrDeletedFile(lines);
  const isExcluded = extensions?.override?.exclude;
  const hasOverride = ScoreOverride.hasOverride(extensions?.override);
  const fileNameTextDecoration = isExcluded ? 'line-through' : '';
  const classes = useStyles();
  return (
    <>
      <Accordion
        expanded={expanded || false}
        TransitionProps={{ timeout: 0, unmountOnExit: true }}
        className={classes.accordionStyle}
      >
        <StyledAccordionSummary onClick={onSummaryClick}>
          <Box width='100%'>
            <Grid container alignItems='center' justify='space-between'>
              <Grid item>
                <Grid container alignItems='center' spacing={2}>
                  {hasOverride && (
                    <Grid item>
                      <OverridePopper override={extensions.override} />
                    </Grid>
                  )}
                  <Grid item>
                    <Typography
                      style={{
                        fontFamily: 'monospace',
                        textDecoration: fileNameTextDecoration,
                      }}
                    >
                      {fileName}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              {allowEdit && (
                <Grid item>
                  <IconButton onClick={onScoreEdit as any}>
                    <EditIcon />
                  </IconButton>
                </Grid>
              )}
            </Grid>
            <Grid container alignItems='center' spacing={2}>
              <Grid item xs={2}>
                <DiffFactWrapper
                  name='Score'
                  value={
                    <ScorePopover
                      hasOverride={hasOverride}
                      score={score.toFixed(1)}
                      scoreSummary={summary}
                    />
                  }
                />
              </Grid>
              {hasOverride && (
                <Grid item xs={3}>
                  <DiffFactWrapper
                    name='Original Score'
                    value={
                      <ScorePopover
                        hasOverride={false}
                        score={extensions.score.toFixed(1)}
                        scoreSummary={summary}
                      />
                    }
                  />
                </Grid>
              )}
              <Grid item xs={2}>
                <DiffFactWrapper
                  name='Weight'
                  value={extensions?.weight || 0}
                />
              </Grid>
              <Grid item>
                <DiffFactWrapper name='Filetype' value={extensions?.glob} />
              </Grid>
              <Grid item>
                {fileOperation == 0 ? (
                  <DiffFactWrapper name='Operation' value='File Created' />
                ) : fileOperation == 1 ? (
                  <DiffFactWrapper name='Operation' value='File Deleted' />
                ) : (
                  <DiffFactWrapper name='Operation' value='File Edited' />
                )}
              </Grid>
            </Grid>
          </Box>
        </StyledAccordionSummary>
        <AccordionDetails>
          <Root>
            <DiffTable
              lines={lines}
              fileType={fileType}
              weight={extensions?.weight || 0}
              operation={fileOperation}
            />
          </Root>
        </AccordionDetails>
      </Accordion>
      {open && (
        <ScoreOverrideForm
          open={open}
          anchor={anchor}
          onClickAway={onPopperClickAway}
          onSubmit={onSubmitPopper}
          defaultValues={extensions?.override}
        />
      )}
    </>
  );
};

export default DiffView;
