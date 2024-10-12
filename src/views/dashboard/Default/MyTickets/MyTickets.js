import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Toolbar,
  Typography
} from '@mui/material';
import { IconCalendar, IconCheck, IconTicket } from '@tabler/icons';
import { uiStyles } from './MyTickets.styles';
import { getCardsByEventUsers, getGamesList } from 'config/firebaseEvents';
import { genConst } from 'store/constant';
import { onAuthStateChanged } from 'firebase/auth';
import { authentication } from 'config/firebase';

function MyTickets() {
  const [eventList, setEventList] = useState([]);
  const [cardList, setCardList] = useState([]);
  const [userId, setUserId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [pageC, setPageC] = useState(0);
  const [rowsPerPageC, setRowsPerPageC] = useState(10);
  const [isTicketShow, setIsTicketShow] = useState(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleChangePageC = (event, newPage) => {
    setPageC(newPage);
  };

  const handleChangeRowsPerPageC = (event) => {
    setRowsPerPageC(+event.target.value);
    setPageC(0);
  };

  useEffect(() => {
    onAuthStateChanged(authentication, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log('No user');
      }
    });

    const getData = async () => {
      await getGamesList().then((data) => {
        setEventList(data);
      });
    };
    getData();
  }, []);

  return (
    <div>
      <AppBar position="static" style={uiStyles.appbar}>
        <Toolbar>
          <IconButton color="inherit">
            <IconTicket color="#FFF" />
          </IconButton>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, color: '#FFF' }} align="center">
            Mis Cartillas
          </Typography>
          <IconButton color="inherit">
            <IconCalendar color="#FFF" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Paper style={{ marginTop: 10 }}>
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell key="id-name" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Evento
                </TableCell>
                <TableCell key="id-date" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Fecha
                </TableCell>
                <TableCell key="id-state" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Estado
                </TableCell>
                <TableCell key="id-actions" align="center" style={{ minWidth: 100, fontWeight: 'bold' }}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {eventList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((r) => (
                <TableRow hover key={r.ide}>
                  <TableCell align="left">{r.name}</TableCell>
                  <TableCell align="left">{r.startDate}</TableCell>
                  <TableCell align="left">{r.state === 0 ? 'PENDIENTE' : 'FINALIZADO'}</TableCell>
                  <TableCell align="center">
                    <ButtonGroup variant="contained">
                      <Button
                        style={{ backgroundColor: genConst.CONST_CREATE_COLOR }}
                        onClick={() => {
                          alert(userId, r.id);
                          getCardsByEventUsers(r.ide, userId).then((data) => {
                            setCardList(data);
                          });
                          setIsTicketShow(true);
                        }}
                      >
                        <IconCheck color="#FFF" />
                      </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          labelRowsPerPage={'Registros máximos'}
          component="div"
          count={eventList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      {isTicketShow ? (
        <Paper style={{ marginTop: 10 }}>
          <TableContainer sx={{ maxHeight: '100%' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell key="id-name" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    # Cartilla
                  </TableCell>
                  <TableCell key="id-date" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Fecha
                  </TableCell>
                  <TableCell key="id-state" align="left" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Estado
                  </TableCell>
                  <TableCell key="id-actions" align="center" style={{ minWidth: 100, fontWeight: 'bold' }}>
                    Acciones
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cardList.slice(pageC * rowsPerPageC, pageC * rowsPerPageC + rowsPerPageC).map((r) => (
                  <TableRow hover key={r.id}>
                    <TableCell align="left">{r.idCard}</TableCell>
                    <TableCell align="left">{r.createAt}</TableCell>
                    <TableCell align="left">{r.state === 0 ? 'PENDIENTE' : 'FINALIZADO'}</TableCell>
                    <TableCell align="center">
                      <ButtonGroup variant="contained">
                        <Button style={{ backgroundColor: genConst.CONST_CREATE_COLOR }} onClick={() => alert(r.ide)}>
                          <IconCheck color="#FFF" />
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            labelRowsPerPage={'Registros máximos'}
            component="div"
            count={cardList.length}
            rowsPerPage={rowsPerPageC}
            page={pageC}
            onPageChange={handleChangePageC}
            onRowsPerPageChange={handleChangeRowsPerPageC}
          />
        </Paper>
      ) : (
        <></>
      )}
    </div>
  );
}

export default MyTickets;
