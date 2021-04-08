import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button/Button';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
// import LuxonUtils from '@date-io/luxon';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { GlobWeight, GroupConfig } from '@ceres/types';
// import {
//   MuiPickersUtilsProvider,
//   KeyboardDateTimePicker,
// } from '@material-ui/pickers';
import { DateTime } from 'luxon';

interface FormProps {
  onSubmit: (values: GroupConfig) => void;
  defaultValues?: Partial<GroupConfig>;
}

const Form: React.FC<FormProps> = ({ defaultValues, onSubmit }) => {
  const { control, handleSubmit, register, errors } = useForm<GroupConfig>({
    defaultValues: {
      name: defaultValues?.name || '',
      iteration: defaultValues?.iteration || [
        {
          name: '',
          start: DateTime.now().minus({ days: 7 }).toISO(),
          end: DateTime.now().toISO(),
        },
      ],
      repositories: defaultValues?.repositories || [{ id: '', display: '' }],
    },
  });
  const { fields, append, remove, swap, insert } = useFieldArray<GlobWeight>({
    control,
    name: 'weights',
  });

  // const handleStartDateChange = (date: DateTime) => {
  //   date.startOf('second').toISO();
  // };

  // const handleEndDateChange = (date: DateTime) => {
  //   date.startOf('second').toISO();
  // };

  return (
    <form
      autoComplete='off'
      spellCheck={false}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box my={2}>
        <TextField
          fullWidth
          name='name'
          label='Name'
          inputRef={register}
          variant='outlined'
          error={!!errors?.name}
          helperText={errors?.name?.message}
        />
      </Box>

      <Typography variant='h2'>Repository Selection</Typography>
      {fields.map((field, index) => (
        <div key={field.id}>
          <Box my={1} p={1}>
            <Grid container spacing={1}>
              <Grid item xs={3}>
                <Grid justify='flex-end' alignItems='center' container>
                  {index !== 0 && (
                    <IconButton onClick={() => swap(index - 1, index)}>
                      <ArrowUpwardIcon />
                    </IconButton>
                  )}
                  {index !== fields.length - 1 && (
                    <IconButton onClick={() => swap(index, index + 1)}>
                      <ArrowDownwardIcon />
                    </IconButton>
                  )}
                  <IconButton onClick={() => remove(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          {index !== fields.length - 1 && (
            <Box position='relative' py={2}>
              <Divider variant='middle' />
              <Box position='absolute' top={-5} left='50%'>
                <IconButton onClick={() => insert(index + 1, {})}>
                  <AddCircleIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </div>
      ))}
      <Grid container justify='center' alignItems='center'>
        <Box mr={2}>
          <Button
            type='button'
            variant='contained'
            color='secondary'
            onClick={() => {
              append({});
            }}
          >
            Add
          </Button>
        </Box>
        <Button type='submit' variant='contained' color='primary'>
          Submit
        </Button>
      </Grid>
    </form>
  );
};

export default Form;
