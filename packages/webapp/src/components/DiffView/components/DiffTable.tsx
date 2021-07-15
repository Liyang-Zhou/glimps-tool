import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import { Line } from '@ceres/types';
import Color from 'color';

// import highlight from 'highlight.js';

const LINE_COLOR_MAP = {
  [Line.Type.add]: '#ccffd8',
  [Line.Type.delete]: '#ffdce0',
  [Line.Type.noChange]: '#ffffff',
  [Line.Type.syntaxChange]: '#c3ddff',
  [Line.Type.spaceChange]: '#c3ddff',
  [Line.Type.comment]: '#e8d9fe',
  [Line.Type.syntaxLine]: '#c3ddff',
  [Line.Type.blank]: '#fff',
};

const getColors = (line: { left: string; right: string; type: string }) => {
  const lineColor = {
    left: LINE_COLOR_MAP[Line.Type.blank],
    right: LINE_COLOR_MAP[Line.Type.blank],
  };
  if (line.type === Line.Type.add) {
    lineColor.left = line.left
      ? LINE_COLOR_MAP[Line.Type.delete]
      : LINE_COLOR_MAP[Line.Type.blank];
    lineColor.right = LINE_COLOR_MAP[Line.Type.add];
  } else if (line.type === Line.Type.delete) {
    lineColor.left = LINE_COLOR_MAP[Line.Type.delete];
    lineColor.right = LINE_COLOR_MAP[Line.Type.blank];
  } else if (
    line.type === Line.Type.spaceChange ||
    line.type === Line.Type.syntaxChange ||
    line.type === Line.Type.syntaxLine ||
    line.type === Line.Type.comment
  ) {
    lineColor.left = LINE_COLOR_MAP[Line.Type.syntaxChange];
    lineColor.right = LINE_COLOR_MAP[Line.Type.syntaxChange];
  }
  return lineColor;
};

const DiffTable = ({ lines, weight }) => {
  const classes = useStyles();
  console.log(weight);

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label='diff view table'>
        <TableBody>
          {lines.map((line, index) => {
            console.log(line);
            const color = getColors(line);
            return (
              <TableRow key={index} style={{ width: '100%' }}>
                {line.left ? (
                  <>
                    <TableCell
                      style={{
                        backgroundColor: color.left,
                      }}
                      className={classes.number}
                    >
                      {line.left.lineNumber}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: Color(color.left).alpha(0.6),
                      }}
                      className={classes.tableCell}
                    >
                      <pre className={classes.pre}>{line.left.lineContent}</pre>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell className={classes.empty} />
                    <TableCell className={classes.empty} />
                  </>
                )}
                {line.right ? (
                  <>
                    <TableCell
                      className={classes.number}
                      style={{
                        borderLeft: '1px solid #ddd',
                        backgroundColor: color.right,
                      }}
                    >
                      {line.right.lineNumber}
                    </TableCell>
                    <TableCell
                      style={{
                        backgroundColor: Color(color.right).alpha(0.6),
                      }}
                      className={classes.tableCell}
                    >
                      <pre className={classes.pre}>
                        {line.right.lineContent}
                      </pre>
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell
                      className={classes.empty}
                      style={{ borderLeft: '1px solid #ddd' }}
                    />
                    <TableCell className={classes.empty} />
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  tableCell: {
    borderBottom: 'none',
    paddingTop: 4,
    paddingBottom: 4,
  },
  pre: {
    margin: 0,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  number: {
    color: '#888',
    borderBottom: 'none',
    paddingTop: 4,
    paddingBottom: 4,
    fontFamily: 'monospace',
  },
  empty: {
    backgroundColor: '#fff',
    borderBottom: 'none',
    paddingTop: 4,
    paddingBottom: 4,
  },
});

export default DiffTable;
