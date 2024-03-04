/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  AppBar,
  Box,
  Toolbar,
  Grid,
  Container,
  OutlinedInput
} from '@mui/material';

//Notifications
import 'react-toastify/dist/ReactToastify.css';

//Firebase Events
import { getDocuments } from 'config/firebaseEvents';
import MessageDark from 'components/message/MessageDark';

function searchingData(search) {
  return function (x) {
    return x.details.toLowerCase().includes(search) || x.details.toUpperCase().includes(search) || !search;
  };
}

export default function Logs() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [search, setSearch] = React.useState('');
  const [logList, setLogList] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      const list = [];
      const querySnapshot = await getDocuments('Logs');
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      setLogList(list);
    }
    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div>
      <AppBar position="static" style={{ borderRadius: 15, height: 80, backgroundColor: '#53338a' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <h2 style={{ marginRight: 20, fontSize: 16 }}>Logs Generales</h2>
            <Box sx={{ flexGrow: 0 }}>
              {logList.length > 0 ? (
                <OutlinedInput
                  id="searchField"
                  type="text"
                  name="searchField"
                  inputProps={{}}
                  onChange={(ev) => setSearch(ev.target.value)}
                  placeholder="Buscar por detalle"
                  style={{ width: 280 }}
                />
              ) : (
                <></>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {logList.length > 0 ? (
        <Paper sx={{ width: '100%', overflow: 'hidden', marginTop: 2 }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-log-details" align="left" style={{ minWidth: 220, fontWeight: 'bold' }}>
                    Proceso
                  </TableCell>
                  <TableCell key="id-log-date" align="left" style={{ minWidth: 200, fontWeight: 'bold' }}>
                    Fecha Proceso
                  </TableCell>
                  <TableCell key="id-log-obj" align="left" style={{ minWidth: 220, fontWeight: 'bold' }}>
                    Objeto
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logList
                  .filter(searchingData(search))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((r, id) => (
                    <TableRow hover key={id}>
                      <TableCell align="left">{r.details}</TableCell>
                      <TableCell align="left">{r.createAt}</TableCell>
                      <TableCell align="left">{JSON.stringify(r.object)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage={'Registros máximos'}
            component="div"
            count={logList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Grid container style={{ marginTop: 20 }}>
          <Grid item xs={12}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
              <MessageDark message={'No existen registros aún!'} submessage="" />
            </Grid>
          </Grid>
        </Grid>
      )}
    </div>
  );
}
